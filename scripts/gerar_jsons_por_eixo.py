#!/usr/bin/env python3
"""
Gera 10 JSONs por eixo temático com séries temporais completas.
Etapa I-3b do plano de incorporação.

Uso: python3 scripts/gerar_jsons_por_eixo.py [--eixo N] [--validar]

Sem argumentos: gera todos os 10 eixos.
--eixo N: gera apenas o eixo N (1-10).
--validar: imprime relatório de validação sem gerar arquivos.
"""

import csv
import json
import os
import re
import sys
from collections import defaultdict
from datetime import date

# Caminhos relativos ao root do projeto
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PIPELINE = os.path.join(ROOT, "data", "pipeline")
BD_CSV = os.path.join(DATA_PIPELINE, "basedosdados", "csv")
GEO_CSV = os.path.join(DATA_PIPELINE, "geoportal-seplan", "csv")
MUNICIPIOS_REF = os.path.join(ROOT, "src", "data", "municipios_referencia.json")
OUTPUT_DIR = os.path.join(ROOT, "src", "data", "indicadores")

# Data de geração
HOJE = date.today().isoformat()

# ============================================================
# TABELA MESTRA DE MUNICÍPIOS
# ============================================================

def carregar_municipios_referencia():
    """Carrega tabela mestra e cria dicionários de lookup."""
    with open(MUNICIPIOS_REF, "r", encoding="utf-8") as f:
        data = json.load(f)

    cod_por_nome = {}
    nome_por_cod = {}
    for m in data["municipios"]:
        cod = str(m["cod_ibge"])
        nome = m["nome"]
        cod_por_nome[nome.lower()] = cod
        nome_por_cod[cod] = nome

    # Aliases para grafias divergentes entre IBGE e SEPLAN
    ALIASES = {
        "couto magalhães": "1706001",
        "couto de magalhães": "1706001",
        "pau d'arco": "1716307",
        "pau d'arco": "1716307",
        "são valério": "1720499",
        "são valério da natividade": "1720499",
    }
    for alias, cod in ALIASES.items():
        cod_por_nome[alias.lower()] = cod

    return cod_por_nome, nome_por_cod, set(nome_por_cod.keys())


COD_POR_NOME, NOME_POR_COD, TODOS_CODIGOS = carregar_municipios_referencia()

# ============================================================
# LEITURA DE CSV COM DETECÇÃO DE ENCODING
# ============================================================

def ler_csv(caminho):
    """Lê CSV tentando utf-8-sig, utf-8, latin-1. Retorna lista de dicts."""
    encodings = ["utf-8-sig", "utf-8", "latin-1"]
    for enc in encodings:
        try:
            with open(caminho, "r", encoding=enc, newline="") as f:
                # Detectar delimitador
                sample = f.read(4096)
                f.seek(0)
                sniffer = csv.Sniffer()
                try:
                    dialect = sniffer.sniff(sample, delimiters=",;\t")
                except csv.Error:
                    dialect = csv.excel
                reader = csv.DictReader(f, dialect=dialect)
                rows = list(reader)
                if rows:
                    return rows
        except (UnicodeDecodeError, UnicodeError):
            continue
    raise ValueError(f"Não foi possível ler {caminho} com nenhum encoding")


# ============================================================
# DETECÇÃO DE COLUNA DE MUNICÍPIO
# ============================================================

COLUNAS_MUNICIPIO = [
    "cod_ibge", "cod_ibge_1", "id_municipio",
    "codigo_municipio", "codigo_ente"
]

def detectar_coluna_municipio(colunas):
    """Retorna o nome da coluna que contém o código do município."""
    colunas_lower = {c.lower().strip(): c for c in colunas}
    for candidato in COLUNAS_MUNICIPIO:
        if candidato in colunas_lower:
            return colunas_lower[candidato]
    return None


def resolver_cod_ibge(row, col_municipio):
    """Extrai cod_ibge de uma linha, padronizando para string de 7 dígitos."""
    valor = row.get(col_municipio, "").strip()
    if not valor:
        return None
    # Remover pontos e espaços
    valor = valor.replace(".", "").replace(" ", "")
    # Extrair apenas dígitos
    digits = re.sub(r"\D", "", valor)
    if len(digits) == 7 and digits.startswith("17"):
        return digits
    if len(digits) == 6:
        return "17" + digits[-5:]  # Possível id_municipio sem prefixo UF
    return digits if len(digits) == 7 else None


def resolver_por_nome(row, colunas):
    """Tenta resolver cod_ibge pelo nome do município."""
    for col_nome in ["nome", "municipio", "nome_municipio", "mun", "nome_mun"]:
        col_lower = {c.lower().strip(): c for c in colunas}
        if col_nome in col_lower:
            nome = row.get(col_lower[col_nome], "").strip()
            if nome:
                cod = COD_POR_NOME.get(nome.lower())
                if cod:
                    return cod
    return None


# ============================================================
# DETECÇÃO E PIVOTAGEM DE FORMATO LARGO
# ============================================================

def detectar_formato_largo(colunas, prefixos_ano=None):
    """
    Detecta colunas no formato largo (ex: pop_1991, m_inf_2008, 2019, etc.).
    Retorna dict {coluna_original: (prefixo, ano)} ou None se formato longo.
    """
    padrao_sufixo = re.compile(r"^(.+?)_?(\d{4})$")
    padrao_ano_puro = re.compile(r"^(\d{4})$")

    colunas_ano = {}
    for col in colunas:
        col_clean = col.strip()
        # Ignorar colunas conhecidas
        if col_clean.lower() in ("cod_ibge", "cod_ibge_1", "nome", "ano",
                                  "id_municipio", "municipio", "sigla_uf"):
            continue
        m = padrao_sufixo.match(col_clean)
        if m:
            prefixo, ano = m.group(1), m.group(2)
            ano_int = int(ano)
            if 1980 <= ano_int <= 2030:
                colunas_ano[col] = (prefixo, ano)
                continue
        m2 = padrao_ano_puro.match(col_clean)
        if m2:
            ano_int = int(m2.group(1))
            if 1980 <= ano_int <= 2030:
                colunas_ano[col] = ("valor", m2.group(1))

    # Considerar formato largo se >= 2 colunas com ano detectado
    if len(colunas_ano) >= 2:
        return colunas_ano
    return None


def pivotar_largo_para_longo(rows, colunas_ano, indicador_id, col_municipio=None):
    """
    Converte formato largo para lista de dicts {cod_ibge, ano, indicador, valor}.
    """
    resultado = []
    colunas = list(rows[0].keys()) if rows else []

    for row in rows:
        # Resolver código do município
        cod = None
        if col_municipio:
            cod = resolver_cod_ibge(row, col_municipio)
        if not cod:
            cod = resolver_por_nome(row, colunas)
        if not cod:
            continue

        for col_orig, (prefixo, ano) in colunas_ano.items():
            valor_str = row.get(col_orig, "").strip()
            if not valor_str or valor_str.lower() in ("", "-", "nan", "none", "null", "..."):
                continue
            try:
                valor = float(valor_str.replace(",", "."))
                resultado.append({
                    "cod_ibge": cod,
                    "ano": ano,
                    "indicador": indicador_id if indicador_id else prefixo,
                    "valor": valor
                })
            except ValueError:
                continue

    return resultado


# ============================================================
# PROCESSAMENTO GENÉRICO DE CSV
# ============================================================

def processar_csv_longo(caminho, coluna_valor, coluna_ano="ano",
                         filtro=None, transformar_valor=None):
    """
    Processa CSV em formato longo. Retorna dict {cod_ibge: {ano: valor}}.

    filtro: função(row) → bool para filtrar linhas
    transformar_valor: função(valor_float) → float
    """
    rows = ler_csv(caminho)
    if not rows:
        return {}

    colunas = list(rows[0].keys())
    col_mun = detectar_coluna_municipio(colunas)

    serie = defaultdict(dict)
    for row in rows:
        # Aplicar filtro se fornecido
        if filtro and not filtro(row):
            continue

        # Resolver município
        cod = None
        if col_mun:
            cod = resolver_cod_ibge(row, col_mun)
        if not cod:
            cod = resolver_por_nome(row, colunas)
        if not cod or cod not in TODOS_CODIGOS:
            continue

        # Extrair ano
        ano_str = row.get(coluna_ano, "").strip()
        if not ano_str:
            continue
        ano_digits = re.sub(r"\D", "", ano_str)[:4]
        if not ano_digits or len(ano_digits) != 4:
            continue

        # Extrair valor
        valor_str = row.get(coluna_valor, "").strip()
        if not valor_str or valor_str.lower() in ("", "-", "nan", "none", "null", "..."):
            continue
        try:
            valor = float(valor_str.replace(",", "."))
        except ValueError:
            continue

        if transformar_valor:
            valor = transformar_valor(valor)

        serie[cod][ano_digits] = round(valor, 2)

    return dict(serie)


def processar_csv_largo(caminho, indicador_id=None):
    """
    Processa CSV em formato largo. Retorna dict {cod_ibge: {ano: valor}}.
    """
    rows = ler_csv(caminho)
    if not rows:
        return {}

    colunas = list(rows[0].keys())
    col_mun = detectar_coluna_municipio(colunas)
    colunas_ano = detectar_formato_largo(colunas)

    if not colunas_ano:
        print(f"  [AVISO] {caminho}: formato largo não detectado")
        return {}

    registros = pivotar_largo_para_longo(rows, colunas_ano, indicador_id, col_mun)

    serie = defaultdict(dict)
    for r in registros:
        cod = r["cod_ibge"]
        if cod in TODOS_CODIGOS:
            serie[cod][r["ano"]] = round(r["valor"], 2)

    return dict(serie)


def processar_csv_largo_multi(caminho):
    """
    Processa CSV largo com múltiplos prefixos (ex: pop_1991, pop_2000, area_2010).
    Retorna dict {prefixo: {cod_ibge: {ano: valor}}}.
    """
    rows = ler_csv(caminho)
    if not rows:
        return {}

    colunas = list(rows[0].keys())
    col_mun = detectar_coluna_municipio(colunas)
    colunas_ano = detectar_formato_largo(colunas)

    if not colunas_ano:
        return {}

    registros = pivotar_largo_para_longo(rows, colunas_ano, None, col_mun)

    resultado = defaultdict(lambda: defaultdict(dict))
    for r in registros:
        cod = r["cod_ibge"]
        if cod in TODOS_CODIGOS:
            resultado[r["indicador"]][cod][r["ano"]] = round(r["valor"], 2)

    return {k: dict(v) for k, v in resultado.items()}


# ============================================================
# AGREGAÇÃO DE SÉRIES TEMPORAIS
# ============================================================

def merge_series(*series_list):
    """Mescla múltiplas séries temporais, priorizando a última (mais recente)."""
    resultado = defaultdict(dict)
    for serie in series_list:
        for cod, anos in serie.items():
            for ano, valor in anos.items():
                resultado[cod][ano] = valor
    return dict(resultado)


def somar_series(*series_list):
    """Soma valores de múltiplas séries por município/ano."""
    resultado = defaultdict(lambda: defaultdict(float))
    for serie in series_list:
        for cod, anos in serie.items():
            for ano, valor in anos.items():
                resultado[cod][ano] += valor

    return {cod: {ano: round(v, 2) for ano, v in anos.items()}
            for cod, anos in resultado.items()}


def contar_series_positivas(series_dict, ano_ref=None):
    """
    Conta quantas séries têm valor > 0 para cada município.
    Retorna {cod_ibge: {ano: contagem}}.
    """
    contagem = defaultdict(lambda: defaultdict(int))
    for serie in series_dict.values():
        for cod, anos in serie.items():
            for ano, valor in anos.items():
                if valor > 0:
                    contagem[cod][ano] += 1
    return {cod: {ano: v for ano, v in anos.items()}
            for cod, anos in contagem.items()}


# ============================================================
# CONSTRUÇÃO DE INDICADOR
# ============================================================

def construir_indicador(id_, nome, unidade, fonte, descricao, serie_temporal):
    """Monta dict de indicador conforme schema."""
    if not serie_temporal:
        return None

    # Calcular ano_inicio e ano_fim
    todos_anos = set()
    for anos in serie_temporal.values():
        todos_anos.update(int(a) for a in anos.keys())

    if not todos_anos:
        return None

    # Contar municípios com dados
    cobertura = len(serie_temporal)

    return {
        "id": id_,
        "nome": nome,
        "unidade": unidade,
        "fonte": fonte,
        "descricao": descricao,
        "ano_inicio": min(todos_anos),
        "ano_fim": max(todos_anos),
        "cobertura_municipios": cobertura,
        "serie_temporal": serie_temporal
    }


# ============================================================
# CONSTRUÇÃO DE JSON DO EIXO
# ============================================================

EIXOS_META = {
    1: ("Desenvolvimento Regional e Redução de Desigualdades", "desenvolvimento-regional"),
    2: ("Educação e Capital Humano", "educacao"),
    3: ("Saúde e Qualidade de Vida", "saude"),
    4: ("Infraestrutura e Conectividade", "infraestrutura"),
    5: ("Meio Ambiente e Sustentabilidade", "meio-ambiente"),
    6: ("Segurança Pública e Cidadania", "seguranca"),
    7: ("Gestão Pública e Inovação", "gestao-publica"),
    8: ("Agropecuária e Desenvolvimento Rural", "agropecuaria"),
    9: ("Economia e Emprego", "economia"),
    10: ("Cultura, Esporte e Juventude", "cultura"),
}


def construir_json_eixo(numero, indicadores, fontes_utilizadas,
                         contexto_estadual=None):
    """Monta JSON completo do eixo."""
    nome_eixo, slug = EIXOS_META[numero]

    # Filtrar indicadores válidos
    indicadores_validos = [i for i in indicadores if i is not None]

    # Calcular metadados
    todos_codigos = set()
    for ind in indicadores_validos:
        todos_codigos.update(ind["serie_temporal"].keys())

    municipios_sem_dados = sorted(TODOS_CODIGOS - todos_codigos)

    return {
        "eixo": nome_eixo,
        "slug": slug,
        "numero": numero,
        "indicadores": indicadores_validos,
        "contexto_estadual": contexto_estadual,
        "metadados": {
            "total_indicadores": len(indicadores_validos),
            "cobertura_municipios": len(todos_codigos),
            "municipios_sem_dados": municipios_sem_dados,
            "fontes_utilizadas": fontes_utilizadas,
            "ultima_atualizacao": HOJE,
            "gerado_por": "gerar_jsons_por_eixo.py"
        }
    }


def salvar_json_eixo(numero, data):
    """Salva JSON do eixo em src/data/indicadores/."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    filename = f"eixo-{numero:02d}.json"
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"  ✓ Salvo: {filepath}")
    return filepath


def imprimir_validacao(data):
    """Imprime relatório de validação do eixo."""
    num = data["numero"]
    n_ind = data["metadados"]["total_indicadores"]
    n_mun = data["metadados"]["cobertura_municipios"]
    sem_dados = data["metadados"]["municipios_sem_dados"]

    # Calcular range de anos
    anos = set()
    for ind in data["indicadores"]:
        anos.add(ind["ano_inicio"])
        anos.add(ind["ano_fim"])

    ano_min = min(anos) if anos else "?"
    ano_max = max(anos) if anos else "?"

    print(f"[Eixo {num:02d}] {n_ind} indicadores, {n_mun} municípios, "
          f"anos {ano_min}-{ano_max}")
    if sem_dados:
        nomes = [NOME_POR_COD.get(c, c) for c in sem_dados[:5]]
        extra = f" (+{len(sem_dados)-5})" if len(sem_dados) > 5 else ""
        print(f"  [ALERTA] {len(sem_dados)} municípios sem dados: "
              f"{', '.join(nomes)}{extra}")


# ============================================================
# FUNÇÕES POR EIXO (implementadas nas fases B-E)
# ============================================================

def gerar_eixo_01():
    """Eixo 1 — Desenvolvimento Regional e Redução de Desigualdades"""
    print("\n=== Eixo 01: Desenvolvimento Regional ===")

    csv_censo = os.path.join(BD_CSV, "demografia", "censo_2022_populacao.csv")
    csv_estim = os.path.join(BD_CSV, "demografia", "estimativa_populacao_ibge.csv")
    csv_pib = os.path.join(BD_CSV, "economia", "pib_municipal_ibge.csv")
    csv_pop_sit = os.path.join(GEO_CSV, "populacao",
                                "popul_resid_por_situacao_do_domicilio_e_sexo_2010.csv")
    csv_pop_cens = os.path.join(GEO_CSV, "populacao",
                                 "populacao_censitaria_municip_1991_2000_2010.csv")

    # --- População: série histórica ---
    # Censo 2022 (apenas 1 ano)
    rows_censo = ler_csv(csv_censo)
    pop_serie = defaultdict(dict)
    for row in rows_censo:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        val = row.get("populacao_2022", "").strip()
        if val:
            try:
                pop_serie[cod]["2022"] = round(float(val), 2)
            except ValueError:
                pass

    # Estimativa pop
    rows_estim = ler_csv(csv_estim)
    for row in rows_estim:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        val = row.get("pop_estimada", "").strip()
        if ano and val:
            try:
                pop_serie[cod][ano] = round(float(val), 2)
            except ValueError:
                pass

    # Pop censitária (Geoportal, formato largo: pop_1991, pop_2000_1, pop_2010_1)
    rows_cens = ler_csv(csv_pop_cens)
    for row in rows_cens:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        for col_name, ano in [("pop_1991", "1991"), ("pop_2000_1", "2000"),
                               ("pop_2010_1", "2010")]:
            val = row.get(col_name, "").strip().replace(",", ".")
            if val and val not in ("-", ""):
                try:
                    v = float(val)
                    if v > 0:
                        pop_serie[cod][ano] = round(v, 2)
                except ValueError:
                    pass

    # --- PIB per capita (formato largo) ---
    rows_pib = ler_csv(csv_pib)
    pib_pc = defaultdict(dict)
    for row in rows_pib:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        for col, val_str in row.items():
            m = re.match(r"pib_percapita_(\d{4})", col.strip())
            if m:
                ano = m.group(1)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("-", ""):
                    try:
                        pib_pc[cod][ano] = round(float(val_str), 2)
                    except ValueError:
                        pass

    # --- Taxa de urbanização (2010) ---
    rows_urb = ler_csv(csv_pop_sit)
    taxa_urb = defaultdict(dict)
    for row in rows_urb:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        tot = row.get("tot_p_res", "").strip().replace(",", ".")
        urb = row.get("tot_urb", "").strip().replace(",", ".")
        if tot and urb:
            try:
                total = float(tot)
                urbano = float(urb)
                if total > 0:
                    taxa_urb[cod]["2010"] = round((urbano / total) * 100, 2)
            except ValueError:
                pass

    # --- Crescimento demográfico (derivado) ---
    cresc = {}
    for cod, anos in pop_serie.items():
        anos_sorted = sorted(anos.keys())
        cresc[cod] = {}
        for i in range(1, len(anos_sorted)):
            a0 = anos_sorted[i - 1]
            a1 = anos_sorted[i]
            p0 = anos[a0]
            p1 = anos[a1]
            if p0 > 0:
                delta_anos = int(a1) - int(a0)
                if delta_anos > 0:
                    taxa = ((p1 / p0) ** (1 / delta_anos) - 1) * 100
                    cresc[cod][a1] = round(taxa, 2)
    cresc = {k: v for k, v in cresc.items() if v}

    indicadores = [
        construir_indicador(
            "populacao",
            "População",
            "hab",
            "IBGE (Censos e Estimativas)",
            "População do município (censos e estimativas anuais)",
            dict(pop_serie)
        ),
        construir_indicador(
            "pib_percapita",
            "PIB per capita",
            "R$",
            "IBGE",
            "Produto Interno Bruto per capita do município (R$)",
            dict(pib_pc)
        ),
        construir_indicador(
            "taxa_urbanizacao",
            "Taxa de urbanização",
            "%",
            "IBGE (Censo 2010)",
            "Percentual da população residente em área urbana",
            dict(taxa_urb)
        ),
        construir_indicador(
            "crescimento_demografico",
            "Taxa de crescimento demográfico",
            "% a.a.",
            "IBGE",
            "Taxa média anual de crescimento populacional entre períodos censitários",
            cresc
        ),
    ]

    fontes = [
        "basedosdados/csv/demografia/censo_2022_populacao.csv",
        "basedosdados/csv/demografia/estimativa_populacao_ibge.csv",
        "basedosdados/csv/economia/pib_municipal_ibge.csv",
        "geoportal-seplan/csv/populacao/popul_resid_por_situacao_do_domicilio_e_sexo_2010.csv",
        "geoportal-seplan/csv/populacao/populacao_censitaria_municip_1991_2000_2010.csv",
    ]

    return construir_json_eixo(1, indicadores, fontes)

def _somar_colunas_numericas(row, excluir=None):
    """Soma todas as colunas numéricas de uma linha, excluindo as especificadas."""
    if excluir is None:
        excluir = {"cod_ibge", "cod_ibge_1", "cod_ibge_1_1", "nome", "nome_1",
                   "color", "shape_area", "shape_leng", "last_modification",
                   "last_modification_1", "modified_by", "modified_by_1",
                   "number", "abe"}
    total = 0
    for col, val_str in row.items():
        if col.strip().lower() in excluir:
            continue
        val_str = val_str.strip().replace(",", ".")
        if val_str and val_str not in ("-", "", "0"):
            try:
                total += float(val_str)
            except ValueError:
                pass
    return total


def _media_colunas_taxa(row, prefixo_ef, prefixo_em=None, excluir=None):
    """Calcula média das taxas (ensino fundamental e médio) para uma linha."""
    if excluir is None:
        excluir = {"cod_ibge", "cod_ibge_1", "cod_ibge_1_1", "nome", "nome_1",
                   "color", "shape_area", "shape_leng", "abe"}
    vals = []
    for col, val_str in row.items():
        col_clean = col.strip().lower()
        if col_clean in excluir:
            continue
        if not col_clean.startswith(prefixo_ef):
            if prefixo_em and not col_clean.startswith(prefixo_em):
                continue
        val_str = val_str.strip().replace(",", ".")
        if val_str and val_str not in ("-", ""):
            try:
                v = float(val_str)
                if v > 0:
                    vals.append(v)
            except ValueError:
                pass
    return round(sum(vals) / len(vals), 2) if vals else None


def _processar_geoportal_total(caminho, ano):
    """Processa CSV do Geoportal somando colunas numéricas. Retorna {cod: {ano: total}}."""
    rows = ler_csv(caminho)
    result = {}
    for row in rows:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_cod_ibge(row, "cod_ibge_1")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        total = _somar_colunas_numericas(row)
        if total > 0:
            result[cod] = {ano: round(total, 2)}
    return result


def _processar_geoportal_taxa(caminho, ano, prefixo_ef, prefixo_em=None):
    """Processa CSV de taxa do Geoportal. Retorna {cod: {ano: media}}."""
    rows = ler_csv(caminho)
    result = {}
    for row in rows:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_cod_ibge(row, "cod_ibge_1")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        media = _media_colunas_taxa(row, prefixo_ef, prefixo_em)
        if media is not None:
            result[cod] = {ano: media}
    return result


def gerar_eixo_02():
    """Eixo 2 — Educação e Capital Humano"""
    print("\n=== Eixo 02: Educação ===")

    csv_ideb = os.path.join(BD_CSV, "educacao", "ideb_municipio_bd.csv")
    csv_matriculas_bd = os.path.join(BD_CSV, "educacao", "censo_escolar_matriculas_bd.csv")

    # --- IDEB (basedosdados, formato longo) ---
    # Anos iniciais (ensino fundamental)
    ideb_ai = processar_csv_longo(
        csv_ideb, "ideb",
        filtro=lambda r: "anos_iniciais" in r.get("ensino", "").lower()
                         or "fundamental" in r.get("ensino", "").lower()
    )

    # IDEB dos Geoportal (2009, 2011, 2013, 2015) — usar ideb_ai_p (público)
    for arquivo, ano in [
        ("inidce_2009.csv", "2009"), ("inidce_2011.csv", "2011"),
        ("indice_2013.csv", "2013"), ("indice_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if not os.path.exists(caminho):
            continue
        rows = ler_csv(caminho)
        for row in rows:
            cod = resolver_cod_ibge(row, "cod_ibge")
            if not cod or cod not in TODOS_CODIGOS:
                continue
            # ideb_ai_p = anos iniciais público (melhor proxy geral)
            val = row.get("ideb_ai_p", "").strip().replace(",", ".")
            if val and val not in ("-", "0", ""):
                try:
                    v = float(val)
                    if v > 0:
                        if cod not in ideb_ai:
                            ideb_ai[cod] = {}
                        if ano not in ideb_ai[cod]:
                            ideb_ai[cod][ano] = round(v, 2)
                except ValueError:
                    pass

    # Taxa de aprovação do IDEB
    taxa_aprov_ideb = processar_csv_longo(
        csv_ideb, "taxa_aprovacao",
        filtro=lambda r: "fundamental" in r.get("ensino", "").lower()
    )

    # --- Matrículas (basedosdados + Geoportal) ---
    # BD: somar por município/ano
    rows_mat = ler_csv(csv_matriculas_bd)
    matriculas_bd = defaultdict(dict)
    for row in rows_mat:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        val = row.get("matriculas", "").strip().replace(",", ".")
        if ano and val:
            try:
                if ano not in matriculas_bd[cod]:
                    matriculas_bd[cod][ano] = 0
                matriculas_bd[cod][ano] += float(val)
            except ValueError:
                pass
    matriculas_bd = {k: {a: round(v, 2) for a, v in anos.items()}
                     for k, anos in matriculas_bd.items()}

    # Geoportal matrículas (2012, 2014, 2015)
    mat_geo = {}
    for arquivo, ano in [
        ("matriculas_2012.csv", "2012"),
        ("matriculas_2014.csv", "2014"),
        ("matriculas_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if os.path.exists(caminho):
            mat_geo = merge_series(mat_geo, _processar_geoportal_total(caminho, ano))

    matriculas = merge_series(mat_geo, dict(matriculas_bd))

    # --- Docentes (Geoportal: 2012, 2014, 2015) ---
    docentes = {}
    for arquivo, ano in [
        ("docentes_separados_por_categoria_2012.csv", "2012"),
        ("docentes_separados_2014.csv", "2014"),
        ("docentes_separados_por_categoria_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if os.path.exists(caminho):
            docentes = merge_series(docentes, _processar_geoportal_total(caminho, ano))

    # --- Estabelecimentos (Geoportal: 2012, 2014, 2015) ---
    estab = {}
    for arquivo, ano in [
        ("estabelecimentos_2012.csv", "2012"),
        ("estabelecimentos_2014.csv", "2014"),
        ("estabelecimentos_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if os.path.exists(caminho):
            estab = merge_series(estab, _processar_geoportal_total(caminho, ano))

    # --- Taxas (Geoportal) ---
    # Abandono (ta_ef_ = ensino fundamental, ta_em_ = ensino médio)
    taxa_abandono = {}
    for arquivo, ano in [
        ("taxa_abandono_2013.csv", "2013"),
        ("taxa_abandono_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if os.path.exists(caminho):
            taxa_abandono = merge_series(
                taxa_abandono,
                _processar_geoportal_taxa(caminho, ano, "ta_ef_", "ta_em_")
            )

    # Aprovação
    taxa_aprovacao = {}
    for arquivo, ano in [
        ("taxa_aprovacao_2013.csv", "2013"),
        ("taxa_de_aprovacao_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if os.path.exists(caminho):
            taxa_aprovacao = merge_series(
                taxa_aprovacao,
                _processar_geoportal_taxa(caminho, ano, "ta_ef_", "ta_em_")
            )

    # Distorção idade-série
    taxa_distorcao = {}
    for arquivo, ano in [
        ("taxa_de_distorcao_2013.csv", "2013"),
        ("taxa_de_distorcao_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if os.path.exists(caminho):
            taxa_distorcao = merge_series(
                taxa_distorcao,
                _processar_geoportal_taxa(caminho, ano, "ti_s", "ti_s")
            )

    # Reprovação
    taxa_reprovacao = {}
    for arquivo, ano in [
        ("taxa_de_reprovacao_2013.csv", "2013"),
        ("taxa_de_reprovacao_2015.csv", "2015"),
    ]:
        caminho = os.path.join(GEO_CSV, "educacao", arquivo)
        if os.path.exists(caminho):
            taxa_reprovacao = merge_series(
                taxa_reprovacao,
                _processar_geoportal_taxa(caminho, ano, "tr_ef", "tr_em")
            )

    # Merge taxa_aprovacao com dados do IDEB (mais anos)
    taxa_aprovacao_merged = merge_series(taxa_aprovacao, taxa_aprov_ideb)

    indicadores = [
        construir_indicador(
            "ideb_anos_iniciais",
            "IDEB — Anos iniciais do ensino fundamental",
            "índice",
            "INEP/MEC",
            "Índice de Desenvolvimento da Educação Básica para anos iniciais (1ª a 5ª série)",
            ideb_ai
        ),
        construir_indicador(
            "taxa_aprovacao",
            "Taxa de aprovação",
            "%",
            "INEP/MEC",
            "Percentual de alunos aprovados no ensino fundamental",
            taxa_aprovacao_merged
        ),
        construir_indicador(
            "taxa_abandono",
            "Taxa de abandono escolar",
            "%",
            "INEP/Geoportal SEPLAN",
            "Percentual médio de abandono escolar (ensino fundamental e médio)",
            taxa_abandono
        ),
        construir_indicador(
            "taxa_distorcao_idade_serie",
            "Taxa de distorção idade-série",
            "%",
            "INEP/Geoportal SEPLAN",
            "Percentual médio de distorção idade-série",
            taxa_distorcao
        ),
        construir_indicador(
            "taxa_reprovacao",
            "Taxa de reprovação",
            "%",
            "INEP/Geoportal SEPLAN",
            "Percentual médio de reprovação escolar",
            taxa_reprovacao
        ),
        construir_indicador(
            "matriculas_total",
            "Total de matrículas",
            "und",
            "INEP/Censo Escolar",
            "Total de matrículas em todas as redes e etapas de ensino",
            matriculas
        ),
        construir_indicador(
            "docentes_total",
            "Total de docentes",
            "und",
            "INEP/Geoportal SEPLAN",
            "Total de docentes em exercício em todas as redes e etapas",
            docentes
        ),
        construir_indicador(
            "estabelecimentos_ensino",
            "Estabelecimentos de ensino",
            "und",
            "INEP/Geoportal SEPLAN",
            "Total de estabelecimentos de ensino (todas as redes e etapas)",
            estab
        ),
    ]

    fontes = [
        "basedosdados/csv/educacao/ideb_municipio_bd.csv",
        "basedosdados/csv/educacao/censo_escolar_matriculas_bd.csv",
        "geoportal-seplan/csv/educacao/inidce_2009.csv",
        "geoportal-seplan/csv/educacao/inidce_2011.csv",
        "geoportal-seplan/csv/educacao/indice_2013.csv",
        "geoportal-seplan/csv/educacao/indice_2015.csv",
        "geoportal-seplan/csv/educacao/matriculas_2012.csv",
        "geoportal-seplan/csv/educacao/matriculas_2014.csv",
        "geoportal-seplan/csv/educacao/matriculas_2015.csv",
        "geoportal-seplan/csv/educacao/docentes_separados_2014.csv",
        "geoportal-seplan/csv/educacao/docentes_separados_por_categoria_2012.csv",
        "geoportal-seplan/csv/educacao/docentes_separados_por_categoria_2015.csv",
        "geoportal-seplan/csv/educacao/estabelecimentos_2012.csv",
        "geoportal-seplan/csv/educacao/estabelecimentos_2014.csv",
        "geoportal-seplan/csv/educacao/estabelecimentos_2015.csv",
        "geoportal-seplan/csv/educacao/taxa_abandono_2013.csv",
        "geoportal-seplan/csv/educacao/taxa_abandono_2015.csv",
        "geoportal-seplan/csv/educacao/taxa_aprovacao_2013.csv",
        "geoportal-seplan/csv/educacao/taxa_de_aprovacao_2015.csv",
        "geoportal-seplan/csv/educacao/taxa_de_distorcao_2013.csv",
        "geoportal-seplan/csv/educacao/taxa_de_distorcao_2015.csv",
        "geoportal-seplan/csv/educacao/taxa_de_reprovacao_2013.csv",
        "geoportal-seplan/csv/educacao/taxa_de_reprovacao_2015.csv",
    ]

    return construir_json_eixo(2, indicadores, fontes)

def gerar_eixo_03():
    """Eixo 3 — Saúde e Qualidade de Vida"""
    print("\n=== Eixo 03: Saúde ===")

    csv_cnes = os.path.join(BD_CSV, "saude", "cnes_estabelecimentos_bd.csv")
    csv_sim = os.path.join(BD_CSV, "saude", "sim_obitos_causa_bd.csv")
    csv_tmi = os.path.join(GEO_CSV, "saude", "taxa_de_mortalidade_infantil_2008_a_2015.csv")
    csv_leitos = os.path.join(GEO_CSV, "saude", "numero_de_leitos_de_internacao_hospitalar.csv")
    csv_prof = os.path.join(GEO_CSV, "saude", "numero_de_profissionais_de_saude.csv")
    csv_estab = os.path.join(GEO_CSV, "saude", "numero_estabelecimentos_saude.csv")
    csv_dengue = os.path.join(GEO_CSV, "saude", "numero_casos_dengue.csv")
    csv_imun = os.path.join(GEO_CSV, "saude", "imunizacao_em_menores.csv")
    csv_nasc = os.path.join(GEO_CSV, "saude",
                             "numero_nascidos_vivos_por_sexo_faixa_etaria_de_mae_2009_a_2018.csv")
    csv_obitos_fe = os.path.join(GEO_CSV, "saude",
                                  "numero_obitos_por_faixa_etaria_2009_a_2018.csv")

    # --- Taxa de mortalidade infantil (Geoportal, largo) ---
    tmi = processar_csv_largo(csv_tmi, "m_inf")

    # --- Leitos (Geoportal, largo: sus_AAAA + priv_AAAA → total) ---
    rows_leitos = ler_csv(csv_leitos)
    leitos_serie = defaultdict(dict)
    for row in rows_leitos:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        for col, val_str in row.items():
            col_clean = col.strip()
            # sus_AAAA ou priv_AAAA
            m = re.match(r"(sus|priv)_(\d{4})", col_clean)
            if m:
                ano = m.group(2)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("-", ""):
                    try:
                        v = float(val_str)
                        if ano not in leitos_serie[cod]:
                            leitos_serie[cod][ano] = 0
                        leitos_serie[cod][ano] += v
                    except ValueError:
                        pass
    leitos_serie = {k: {a: round(v, 2) for a, v in anos.items()}
                    for k, anos in leitos_serie.items()}

    # --- Profissionais de saúde (Geoportal, largo: total por ano) ---
    # Colunas como anes_2008, cirur_2008... Somar todas as especialidades por ano
    rows_prof = ler_csv(csv_prof)
    prof_serie = defaultdict(dict)
    for row in rows_prof:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        # Agrupar por ano somando todas as especialidades
        totais_por_ano = defaultdict(float)
        for col, val_str in row.items():
            col_clean = col.strip()
            m = re.match(r"[a-z]+_(\d{4})", col_clean)
            if m and col_clean not in ("cod_ibge", "pop_1996", "pop_2000",
                                         "pop_2007", "pop_2008", "pop_2009",
                                         "pop_2010"):
                ano = m.group(1)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("-", ""):
                    try:
                        totais_por_ano[ano] += float(val_str)
                    except ValueError:
                        pass
        for ano, total in totais_por_ano.items():
            prof_serie[cod][ano] = round(total, 2)

    # --- Estabelecimentos de saúde (Geoportal, largo) ---
    rows_estab = ler_csv(csv_estab)
    estab_serie = defaultdict(dict)
    for row in rows_estab:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        totais_por_ano = defaultdict(float)
        for col, val_str in row.items():
            col_clean = col.strip()
            m = re.match(r"[a-z]+_(\d{4})", col_clean)
            if m and col_clean not in ("cod_ibge",):
                ano = m.group(1)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("-", ""):
                    try:
                        totais_por_ano[ano] += float(val_str)
                    except ValueError:
                        pass
        for ano, total in totais_por_ano.items():
            estab_serie[cod][ano] = round(total, 2)

    # --- CNES estabelecimentos (basedosdados, longo: usar dezembro) ---
    rows_cnes = ler_csv(csv_cnes)
    cnes_serie = defaultdict(dict)
    for row in rows_cnes:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        if row.get("mes", "").strip() != "12":
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        try:
            v = float(row.get("estabelecimentos", "0").strip().replace(",", "."))
        except ValueError:
            continue
        if ano not in cnes_serie[cod]:
            cnes_serie[cod][ano] = 0
        cnes_serie[cod][ano] += v
    cnes_serie = {k: {a: round(v, 2) for a, v in anos.items()}
                  for k, anos in cnes_serie.items()}

    # Merge estabelecimentos: Geoportal + CNES
    estab_merged = merge_series(dict(estab_serie), dict(cnes_serie))

    # --- Casos de dengue (Geoportal, largo com anos de 2 dígitos: dengue_07..16) ---
    rows_dengue = ler_csv(csv_dengue)
    dengue = defaultdict(dict)
    for row in rows_dengue:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        for col, val_str in row.items():
            m = re.match(r"dengue_(\d{2})", col.strip())
            if m:
                ano_2d = int(m.group(1))
                ano = str(2000 + ano_2d)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("-", ""):
                    try:
                        dengue[cod][ano] = round(float(val_str), 2)
                    except ValueError:
                        pass
    dengue = dict(dengue)

    # --- Nascidos vivos (Geoportal, largo: somar todas colunas por ano) ---
    rows_nasc = ler_csv(csv_nasc)
    nasc_serie = defaultdict(dict)
    for row in rows_nasc:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        totais_por_ano = defaultdict(float)
        for col, val_str in row.items():
            col_clean = col.strip()
            m = re.match(r"[hm]\w*_(\d{4})", col_clean)
            if m:
                ano = m.group(1)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("-", ""):
                    try:
                        totais_por_ano[ano] += float(val_str)
                    except ValueError:
                        pass
        for ano, total in totais_por_ano.items():
            nasc_serie[cod][ano] = round(total, 2)

    # --- Óbitos totais (basedosdados SIM, longo: somar por município/ano) ---
    obitos_bd = defaultdict(dict)
    rows_sim = ler_csv(csv_sim)
    for row in rows_sim:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        try:
            v = float(row.get("obitos", "0").strip().replace(",", "."))
        except ValueError:
            continue
        if ano not in obitos_bd[cod]:
            obitos_bd[cod][ano] = 0
        obitos_bd[cod][ano] += v
    obitos_bd = {k: {a: round(v, 2) for a, v in anos.items()}
                 for k, anos in obitos_bd.items()}

    # --- Cobertura vacinal (Geoportal: média das coberturas _c_ por ano) ---
    rows_imun = ler_csv(csv_imun)
    vac_serie = defaultdict(dict)
    for row in rows_imun:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod:
            cod = resolver_por_nome(row, list(row.keys()))
        if not cod or cod not in TODOS_CODIGOS:
            continue
        cobs_por_ano = defaultdict(list)
        for col, val_str in row.items():
            col_clean = col.strip()
            # Colunas de cobertura: bcg_c_2013, dtp_c_2014, etc.
            m = re.match(r"[a-z]+_c_(\d{4})", col_clean)
            if m:
                ano = m.group(1)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("-", ""):
                    try:
                        cobs_por_ano[ano].append(float(val_str))
                    except ValueError:
                        pass
        for ano, vals in cobs_por_ano.items():
            if vals:
                vac_serie[cod][ano] = round(sum(vals) / len(vals), 2)

    indicadores = [
        construir_indicador(
            "taxa_mortalidade_infantil",
            "Taxa de mortalidade infantil",
            "por mil nascidos vivos",
            "DATASUS/Geoportal SEPLAN",
            "Óbitos de menores de 1 ano por mil nascidos vivos",
            tmi
        ),
        construir_indicador(
            "leitos_internacao",
            "Leitos de internação hospitalar",
            "und",
            "DATASUS/Geoportal SEPLAN",
            "Total de leitos de internação (SUS + privados)",
            dict(leitos_serie)
        ),
        construir_indicador(
            "profissionais_saude",
            "Profissionais de saúde",
            "und",
            "DATASUS/Geoportal SEPLAN",
            "Total de profissionais de saúde registrados no município",
            dict(prof_serie)
        ),
        construir_indicador(
            "estabelecimentos_saude",
            "Estabelecimentos de saúde",
            "und",
            "CNES/DATASUS",
            "Total de estabelecimentos de saúde (todas as categorias)",
            estab_merged
        ),
        construir_indicador(
            "nascidos_vivos",
            "Nascidos vivos",
            "und",
            "DATASUS/Geoportal SEPLAN",
            "Total de nascidos vivos no município por ano",
            dict(nasc_serie)
        ),
        construir_indicador(
            "obitos_totais",
            "Óbitos totais",
            "und",
            "SIM/DATASUS",
            "Total de óbitos registrados por todas as causas (CID-10)",
            dict(obitos_bd)
        ),
        construir_indicador(
            "cobertura_vacinal",
            "Cobertura vacinal em menores",
            "%",
            "PNI/DATASUS/Geoportal SEPLAN",
            "Média da cobertura vacinal (BCG, DTP, Pólio, Febre Amarela) em menores",
            dict(vac_serie)
        ),
        construir_indicador(
            "casos_dengue",
            "Casos de dengue",
            "und",
            "DATASUS/Geoportal SEPLAN",
            "Número de casos notificados de dengue",
            dengue
        ),
    ]

    fontes = [
        "basedosdados/csv/saude/cnes_estabelecimentos_bd.csv",
        "basedosdados/csv/saude/sim_obitos_causa_bd.csv",
        "geoportal-seplan/csv/saude/taxa_de_mortalidade_infantil_2008_a_2015.csv",
        "geoportal-seplan/csv/saude/numero_de_leitos_de_internacao_hospitalar.csv",
        "geoportal-seplan/csv/saude/numero_de_profissionais_de_saude.csv",
        "geoportal-seplan/csv/saude/numero_estabelecimentos_saude.csv",
        "geoportal-seplan/csv/saude/numero_casos_dengue.csv",
        "geoportal-seplan/csv/saude/imunizacao_em_menores.csv",
        "geoportal-seplan/csv/saude/numero_nascidos_vivos_por_sexo_faixa_etaria_de_mae_2009_a_2018.csv",
        "geoportal-seplan/csv/saude/numero_obitos_por_faixa_etaria_2009_a_2018.csv",
    ]

    return construir_json_eixo(3, indicadores, fontes)

def gerar_eixo_04():
    """Eixo 4 — Infraestrutura e Conectividade"""
    print("\n=== Eixo 04: Infraestrutura ===")

    csv_anatel = os.path.join(BD_CSV, "infraestrutura", "anatel_banda_larga_bd.csv")
    csv_snis = os.path.join(BD_CSV, "infraestrutura", "snis_agua_esgoto_bd.csv")

    # Banda larga: usar apenas dezembro (mes=12) para densidade anual
    densidade_bl = processar_csv_longo(
        csv_anatel, "acessos_densidade",
        filtro=lambda r: r.get("mes", "").strip() == "12"
    )

    # SNIS: 3 indicadores
    agua = processar_csv_longo(csv_snis, "indice_atendimento_agua")
    esgoto = processar_csv_longo(csv_snis, "indice_atendimento_esgoto")
    trat_esgoto = processar_csv_longo(csv_snis, "indice_tratamento_esgoto")

    indicadores = [
        construir_indicador(
            "densidade_banda_larga",
            "Densidade de banda larga fixa",
            "acessos/100 hab",
            "Anatel",
            "Acessos de banda larga fixa por 100 habitantes (dezembro de cada ano)",
            densidade_bl
        ),
        construir_indicador(
            "indice_atendimento_agua",
            "Índice de atendimento de água",
            "%",
            "SNIS/MDR",
            "Percentual da população atendida com abastecimento de água",
            agua
        ),
        construir_indicador(
            "indice_atendimento_esgoto",
            "Índice de atendimento de esgoto",
            "%",
            "SNIS/MDR",
            "Percentual da população atendida com coleta de esgoto",
            esgoto
        ),
        construir_indicador(
            "indice_tratamento_esgoto",
            "Índice de tratamento de esgoto",
            "%",
            "SNIS/MDR",
            "Percentual do esgoto coletado que é tratado",
            trat_esgoto
        ),
    ]

    fontes = [
        "basedosdados/csv/infraestrutura/anatel_banda_larga_bd.csv",
        "basedosdados/csv/infraestrutura/snis_agua_esgoto_bd.csv",
    ]

    return construir_json_eixo(4, indicadores, fontes)

def gerar_eixo_05():
    """Eixo 5 — Meio Ambiente e Sustentabilidade"""
    print("\n=== Eixo 05: Meio Ambiente ===")

    csv_prodes = os.path.join(BD_CSV, "meio_ambiente", "prodes_desmatamento_bd.csv")
    csv_mapbiomas = os.path.join(BD_CSV, "meio_ambiente", "mapbiomas_cobertura_solo_bd.csv")

    # PRODES: desmatado e vegetação natural (km²)
    desmatado = processar_csv_longo(csv_prodes, "desmatado")
    veg_natural = processar_csv_longo(csv_prodes, "vegetacao_natural")

    # MapBiomas: cobertura florestal (classes de formação florestal)
    # Classes florestais no MapBiomas: id_classe 3 (Formação Florestal),
    # 4 (Formação Savânica), 5 (Mangue), 49 (Restinga Arborizada)
    # Para Cerrado/TO, as principais são 3 e 4
    rows_mapbiomas = ler_csv(csv_mapbiomas)
    cobertura_florestal = defaultdict(dict)
    area_total_por_mun_ano = defaultdict(lambda: defaultdict(float))

    for row in rows_mapbiomas:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        try:
            area = float(row.get("area", "0").strip().replace(",", "."))
        except ValueError:
            continue
        id_classe = row.get("id_classe", "").strip()
        area_total_por_mun_ano[cod][ano] += area
        # Classes florestais/savânicas: 3, 4, 5, 49, 11, 12
        # Simplificar: usar vegetação natural = tudo menos pastagem (15),
        # agricultura (18, 19, 20, 21, 39, 40, 41, 46, 47, 48),
        # e área não vegetada (22, 23, 24, 25, 29, 30, 31)
        # Mais simples: classes naturais = 3, 4, 5, 11, 12, 13, 49, 50
        if id_classe in ("3", "4", "5", "11", "12", "13", "49", "50"):
            if ano in cobertura_florestal.get(cod, {}):
                cobertura_florestal[cod][ano] += area
            else:
                cobertura_florestal[cod][ano] = area

    # Calcular percentual de cobertura florestal
    cobertura_pct = {}
    for cod in cobertura_florestal:
        cobertura_pct[cod] = {}
        for ano in cobertura_florestal[cod]:
            total = area_total_por_mun_ano[cod].get(ano, 0)
            if total > 0:
                pct = (cobertura_florestal[cod][ano] / total) * 100
                cobertura_pct[cod][ano] = round(pct, 2)

    # Arredondar áreas florestais
    for cod in cobertura_florestal:
        for ano in cobertura_florestal[cod]:
            cobertura_florestal[cod][ano] = round(cobertura_florestal[cod][ano], 2)

    # Taxa de desmatamento anual (diferença entre anos consecutivos)
    taxa_desmat = {}
    for cod, anos in desmatado.items():
        anos_sorted = sorted(anos.keys())
        taxa_desmat[cod] = {}
        for i in range(1, len(anos_sorted)):
            ano_ant = anos_sorted[i - 1]
            ano_cur = anos_sorted[i]
            diff = anos[ano_cur] - anos[ano_ant]
            if diff >= 0:
                taxa_desmat[cod][ano_cur] = round(diff, 2)
    # Remover municípios sem dados
    taxa_desmat = {k: v for k, v in taxa_desmat.items() if v}

    indicadores = [
        construir_indicador(
            "area_desmatada_km2",
            "Área desmatada acumulada",
            "km²",
            "INPE/PRODES",
            "Área total desmatada acumulada no município (km²)",
            desmatado
        ),
        construir_indicador(
            "vegetacao_natural_km2",
            "Vegetação natural remanescente",
            "km²",
            "INPE/PRODES",
            "Área de vegetação natural remanescente no município (km²)",
            veg_natural
        ),
        construir_indicador(
            "cobertura_natural_pct",
            "Cobertura natural",
            "%",
            "MapBiomas",
            "Percentual do território com cobertura vegetal natural (formações florestais, savânicas e campestres)",
            cobertura_pct
        ),
        construir_indicador(
            "taxa_desmatamento_anual",
            "Taxa de desmatamento anual",
            "km²/ano",
            "INPE/PRODES",
            "Incremento anual de área desmatada (km²)",
            taxa_desmat
        ),
    ]

    fontes = [
        "basedosdados/csv/meio_ambiente/prodes_desmatamento_bd.csv",
        "basedosdados/csv/meio_ambiente/mapbiomas_cobertura_solo_bd.csv",
    ]

    return construir_json_eixo(5, indicadores, fontes)

def gerar_eixo_06():
    """Eixo 6 — Segurança Pública e Cidadania"""
    print("\n=== Eixo 06: Segurança ===")

    csv_sim_hom = os.path.join(BD_CSV, "seguranca", "sim_homicidios_municipio_bd.csv")
    csv_fbsp_mun = os.path.join(BD_CSV, "seguranca", "fbsp_municipio_tocantins.csv")
    csv_fbsp_uf = os.path.join(BD_CSV, "seguranca", "fbsp_uf_tocantins.csv")
    csv_sinesp = os.path.join(BD_CSV, "seguranca", "sinesp_to_bd.csv")

    # --- Homicídios municipais (SIM, 139 municípios) ---
    homicidios = processar_csv_longo(csv_sim_hom, "homicidios")
    hom_masc = processar_csv_longo(csv_sim_hom, "homicidios_masculino")
    hom_fem = processar_csv_longo(csv_sim_hom, "homicidios_feminino")

    # --- FBSP municipal (só Palmas, muitas categorias) ---
    rows_fbsp_mun = ler_csv(csv_fbsp_mun)
    fbsp_hom_doloso = defaultdict(dict)
    for row in rows_fbsp_mun:
        cod = resolver_cod_ibge(row, "id_municipio")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        val = row.get("quantidade_homicidio_doloso", "").strip()
        if val and val not in ("-", ""):
            try:
                fbsp_hom_doloso[cod][ano] = round(float(val), 2)
            except ValueError:
                pass

    # --- Contexto estadual (FBSP UF + SINESP) ---
    contexto = {"fonte": "FBSP/SINESP", "series": {}}

    # FBSP UF
    rows_fbsp = ler_csv(csv_fbsp_uf)
    for indicador_col, indicador_id in [
        ("quantidade_cvli", "cvli_to"),
        ("quantidade_ocorrencia_homicidio_doloso", "homicidios_dolosos_to"),
        ("quantidade_morte_violenta_intencional", "mvi_to"),
        ("quantidade_feminicidio", "feminicidios_to"),
        ("quantidade_estupro", "estupros_to"),
        ("quantidade_roubo_de_veiculo", "roubos_veiculo_to"),
        ("quantidade_suicidio", "suicidios_to"),
    ]:
        serie = {}
        for row in rows_fbsp:
            ano = row.get("ano", "").strip()[:4]
            val = row.get(indicador_col, "").strip()
            if ano and val and val not in ("-", ""):
                try:
                    serie[ano] = round(float(val), 2)
                except ValueError:
                    pass
        if serie:
            contexto["series"][indicador_id] = serie

    # SINESP TO (mesmas colunas, complementar)
    if os.path.exists(csv_sinesp):
        rows_sin = ler_csv(csv_sinesp)
        for indicador_col, indicador_id in [
            ("quantidade_cvli", "cvli_to"),
            ("quantidade_ocorrencia_homicidio_doloso", "homicidios_dolosos_to"),
        ]:
            for row in rows_sin:
                ano = row.get("ano", "").strip()[:4]
                val = row.get(indicador_col, "").strip()
                if ano and val and val not in ("-", ""):
                    try:
                        # Só preencher se FBSP não tem o dado
                        if ano not in contexto["series"].get(indicador_id, {}):
                            if indicador_id not in contexto["series"]:
                                contexto["series"][indicador_id] = {}
                            contexto["series"][indicador_id][ano] = round(float(val), 2)
                    except ValueError:
                        pass

    indicadores = [
        construir_indicador(
            "homicidios",
            "Homicídios",
            "und",
            "SIM/DATASUS",
            "Total de óbitos por agressão (homicídios) registrados no município",
            homicidios
        ),
        construir_indicador(
            "homicidios_masculino",
            "Homicídios masculinos",
            "und",
            "SIM/DATASUS",
            "Homicídios de vítimas do sexo masculino",
            hom_masc
        ),
        construir_indicador(
            "homicidios_feminino",
            "Homicídios femininos",
            "und",
            "SIM/DATASUS",
            "Homicídios de vítimas do sexo feminino",
            hom_fem
        ),
        construir_indicador(
            "homicidio_doloso_fbsp",
            "Homicídio doloso (FBSP)",
            "und",
            "FBSP",
            "Homicídios dolosos registrados (dados FBSP, cobertura limitada)",
            dict(fbsp_hom_doloso)
        ),
    ]

    fontes = [
        "basedosdados/csv/seguranca/sim_homicidios_municipio_bd.csv",
        "basedosdados/csv/seguranca/fbsp_municipio_tocantins.csv",
        "basedosdados/csv/seguranca/fbsp_uf_tocantins.csv",
        "basedosdados/csv/seguranca/sinesp_to_bd.csv",
    ]

    return construir_json_eixo(6, indicadores, fontes, contexto_estadual=contexto)

def gerar_eixo_07():
    """Eixo 7 — Gestão Pública e Inovação"""
    print("\n=== Eixo 07: Gestão Pública ===")

    csv_capacidade = os.path.join(BD_CSV, "gestao_publica", "munic_capacidade_bd.csv")
    csv_vinculos = os.path.join(BD_CSV, "gestao_publica", "munic_vinculos_bd.csv")
    csv_receitas = os.path.join(BD_CSV, "gestao_publica", "siconfi_receitas_bd.csv")

    # --- Capacidade de gestão ---
    # Contar temas com "Secretaria exclusiva" por município/ano
    rows_cap = ler_csv(csv_capacidade)
    capacidade = defaultdict(dict)
    for row in rows_cap:
        cod_raw = row.get("id_municipio", "").strip()
        cod = resolver_cod_ibge(row, "id_municipio")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        orgao = row.get("caracterizacao_orgao_gestor", "").strip()
        # Contar se tem secretaria (exclusiva ou conjunta)
        tem_secretaria = 1 if "ecretaria" in orgao else 0
        if ano not in capacidade[cod]:
            capacidade[cod][ano] = 0
        capacidade[cod][ano] += tem_secretaria

    capacidade = {k: {a: round(v, 2) for a, v in anos.items()}
                  for k, anos in capacidade.items()}

    # --- Vínculos ---
    rows_vinc = ler_csv(csv_vinculos)
    estatutarios = defaultdict(dict)
    total_vinculos = defaultdict(dict)
    for row in rows_vinc:
        cod = resolver_cod_ibge(row, "id_municipio")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        escolaridade = row.get("escolaridade", "").strip()
        if escolaridade != "Total":
            continue
        tipo = row.get("tipo_vinculo", "").strip()
        try:
            qtd = float(row.get("quantidade_vinculo", "0").strip().replace(",", "."))
        except ValueError:
            continue

        if ano not in total_vinculos[cod]:
            total_vinculos[cod][ano] = 0.0
        total_vinculos[cod][ano] += qtd

        if tipo == "Estatutários":
            estatutarios[cod][ano] = round(qtd, 2)

    total_vinculos = {k: {a: round(v, 2) for a, v in anos.items()}
                      for k, anos in total_vinculos.items()}

    # --- Receitas (SICONFI) ---
    rows_rec = ler_csv(csv_receitas)
    receita_total = defaultdict(dict)
    receita_propria = defaultdict(dict)
    receita_transf = defaultdict(dict)

    for row in rows_rec:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        conta = row.get("conta", "").strip()
        estagio = row.get("estagio", "").strip()
        if "Brutas Realizadas" not in estagio:
            continue
        try:
            valor = float(row.get("valor", "0").strip().replace(",", "."))
        except ValueError:
            continue

        # Classificar receitas pelos nomes exatos do SICONFI
        if conta == "TOTAL DAS RECEITAS (III) = (I + II)":
            receita_total[cod][ano] = round(valor, 2)
        elif conta == "Transferências Correntes":
            receita_transf[cod][ano] = round(valor, 2)
        elif conta == "Impostos, Taxas e Contribuições de Melhoria":
            receita_propria[cod][ano] = round(valor, 2)

    indicadores = [
        construir_indicador(
            "receita_total",
            "Receita total",
            "R$",
            "STN/SICONFI",
            "Receita total bruta realizada pelo município (R$)",
            dict(receita_total)
        ),
        construir_indicador(
            "receita_tributaria",
            "Receita tributária própria",
            "R$",
            "STN/SICONFI",
            "Receita tributária arrecadada pelo município (R$)",
            dict(receita_propria)
        ),
        construir_indicador(
            "receita_transferencias",
            "Receitas de transferências correntes",
            "R$",
            "STN/SICONFI",
            "Receitas recebidas de transferências correntes (R$)",
            dict(receita_transf)
        ),
        construir_indicador(
            "servidores_estatutarios",
            "Servidores estatutários",
            "und",
            "IBGE/MUNIC",
            "Quantidade de servidores com vínculo estatutário na administração direta",
            dict(estatutarios)
        ),
        construir_indicador(
            "servidores_total",
            "Total de vínculos",
            "und",
            "IBGE/MUNIC",
            "Total de vínculos na administração municipal direta (todos os tipos)",
            dict(total_vinculos)
        ),
        construir_indicador(
            "capacidade_gestao",
            "Capacidade de gestão",
            "und",
            "IBGE/MUNIC",
            "Número de temas com órgão gestor estruturado (secretaria exclusiva ou conjunta)",
            dict(capacidade)
        ),
    ]

    fontes = [
        "basedosdados/csv/gestao_publica/munic_capacidade_bd.csv",
        "basedosdados/csv/gestao_publica/munic_vinculos_bd.csv",
        "basedosdados/csv/gestao_publica/siconfi_receitas_bd.csv",
    ]

    return construir_json_eixo(7, indicadores, fontes)

def gerar_eixo_08():
    """Eixo 8 — Agropecuária e Desenvolvimento Rural"""
    print("\n=== Eixo 08: Agropecuária ===")
    # Implementado na Fase E
    raise NotImplementedError("Fase E")

def gerar_eixo_09():
    """Eixo 9 — Economia e Emprego"""
    print("\n=== Eixo 09: Economia ===")

    csv_pib = os.path.join(BD_CSV, "economia", "pib_municipal_setorial_bd.csv")
    csv_rais = os.path.join(BD_CSV, "emprego", "rais_emprego_setor_bd.csv")
    csv_cfem_arr = os.path.join(BD_CSV, "mineracao", "cfem_arrecadacao_to.csv")
    csv_cfem_dist = os.path.join(BD_CSV, "mineracao", "cfem_distribuicao_to.csv")
    csv_pib_geo = os.path.join(GEO_CSV, "economia", "pib_e_pib_por_capita.csv")

    # --- PIB setorial (basedosdados, formato longo) ---
    pib_total = processar_csv_longo(csv_pib, "pib")
    va_agro = processar_csv_longo(csv_pib, "va_agropecuaria")
    va_industria = processar_csv_longo(csv_pib, "va_industria")
    va_servicos = processar_csv_longo(csv_pib, "va_servicos")

    # --- PIB Geoportal (formato largo) — complementar série ---
    rows_geo = ler_csv(csv_pib_geo)
    pib_geo = defaultdict(dict)
    for row in rows_geo:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        for col, val_str in row.items():
            col_clean = col.strip()
            # Colunas pib10_1000 ... pib16_1000
            m = re.match(r"pib(\d{2})_1000", col_clean)
            if m:
                ano_suffix = int(m.group(1))
                ano = str(2000 + ano_suffix)
                val_str = val_str.strip().replace(",", ".")
                if val_str and val_str not in ("", "-"):
                    try:
                        # Valor em R$ 1000 → converter para R$
                        valor = float(val_str) * 1000
                        pib_geo[cod][ano] = round(valor, 2)
                    except ValueError:
                        pass

    # Merge PIB: basedosdados tem prioridade
    pib_merged = merge_series(dict(pib_geo), pib_total)

    # --- RAIS emprego (formato longo, agrupar por município/ano) ---
    rows_rais = ler_csv(csv_rais)
    emprego = defaultdict(dict)
    for row in rows_rais:
        cod = resolver_cod_ibge(row, "cod_ibge")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        try:
            vinculos = float(row.get("vinculos", "0").strip().replace(",", "."))
        except ValueError:
            continue
        if ano not in emprego[cod]:
            emprego[cod][ano] = 0
        emprego[cod][ano] += vinculos

    emprego = {k: {a: round(v, 2) for a, v in anos.items()}
               for k, anos in emprego.items()}

    # --- CFEM arrecadação (agrupar por município/ano) ---
    rows_cfem = ler_csv(csv_cfem_arr)
    cfem = defaultdict(dict)
    for row in rows_cfem:
        cod = resolver_cod_ibge(row, "codigo_municipio")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        try:
            valor = float(row.get("valor_recolhido", "0").strip().replace(",", "."))
        except ValueError:
            continue
        if ano not in cfem[cod]:
            cfem[cod][ano] = 0
        cfem[cod][ano] += valor

    cfem = {k: {a: round(v, 2) for a, v in anos.items()}
            for k, anos in cfem.items()}

    # --- CFEM distribuição (complementar com dados mais antigos) ---
    rows_cfem_d = ler_csv(csv_cfem_dist)
    cfem_dist = defaultdict(dict)
    for row in rows_cfem_d:
        ente_tipo = row.get("ente", "").strip()
        if ente_tipo != "Município":
            continue
        cod = resolver_cod_ibge(row, "codigo_ente")
        if not cod or cod not in TODOS_CODIGOS:
            continue
        ano = row.get("ano", "").strip()[:4]
        if not ano:
            continue
        try:
            valor = float(row.get("valor", "0").strip().replace(",", "."))
        except ValueError:
            continue
        if ano not in cfem_dist[cod]:
            cfem_dist[cod][ano] = 0
        cfem_dist[cod][ano] += valor

    cfem_dist = {k: {a: round(v, 2) for a, v in anos.items()}
                 for k, anos in cfem_dist.items()}

    cfem_merged = merge_series(dict(cfem_dist), dict(cfem))

    indicadores = [
        construir_indicador(
            "pib_total",
            "PIB municipal",
            "R$",
            "IBGE",
            "Produto Interno Bruto do município (R$)",
            pib_merged
        ),
        construir_indicador(
            "va_agropecuaria",
            "Valor adicionado — Agropecuária",
            "R$",
            "IBGE",
            "Valor adicionado bruto do setor agropecuário (R$)",
            va_agro
        ),
        construir_indicador(
            "va_industria",
            "Valor adicionado — Indústria",
            "R$",
            "IBGE",
            "Valor adicionado bruto do setor industrial (R$)",
            va_industria
        ),
        construir_indicador(
            "va_servicos",
            "Valor adicionado — Serviços",
            "R$",
            "IBGE",
            "Valor adicionado bruto do setor de serviços (R$)",
            va_servicos
        ),
        construir_indicador(
            "emprego_formal_total",
            "Emprego formal total",
            "und",
            "MTE/RAIS",
            "Total de vínculos empregatícios formais ativos (todos os setores CNAE)",
            dict(emprego)
        ),
        construir_indicador(
            "cfem_arrecadacao",
            "Arrecadação CFEM",
            "R$",
            "ANM/CFEM",
            "Arrecadação da Compensação Financeira pela Exploração de Recursos Minerais (R$)",
            cfem_merged
        ),
    ]

    fontes = [
        "basedosdados/csv/economia/pib_municipal_setorial_bd.csv",
        "basedosdados/csv/emprego/rais_emprego_setor_bd.csv",
        "basedosdados/csv/mineracao/cfem_arrecadacao_to.csv",
        "basedosdados/csv/mineracao/cfem_distribuicao_to.csv",
        "geoportal-seplan/csv/economia/pib_e_pib_por_capita.csv",
    ]

    return construir_json_eixo(9, indicadores, fontes)

def gerar_eixo_10():
    """Eixo 10 — Cultura, Esporte e Juventude"""
    print("\n=== Eixo 10: Cultura ===")
    # Implementado na Fase E
    raise NotImplementedError("Fase E")


# Registro de funções geradoras
GERADORES = {
    1: gerar_eixo_01,
    2: gerar_eixo_02,
    3: gerar_eixo_03,
    4: gerar_eixo_04,
    5: gerar_eixo_05,
    6: gerar_eixo_06,
    7: gerar_eixo_07,
    8: gerar_eixo_08,
    9: gerar_eixo_09,
    10: gerar_eixo_10,
}


# ============================================================
# MAIN
# ============================================================

def main():
    args = sys.argv[1:]
    eixo_especifico = None
    validar = "--validar" in args

    for i, arg in enumerate(args):
        if arg == "--eixo" and i + 1 < len(args):
            eixo_especifico = int(args[i + 1])

    eixos = [eixo_especifico] if eixo_especifico else range(1, 11)
    total_indicadores = 0
    resultados = []

    for n in eixos:
        try:
            data = GERADORES[n]()
            salvar_json_eixo(n, data)
            imprimir_validacao(data)
            total_indicadores += data["metadados"]["total_indicadores"]
            resultados.append(data)
        except NotImplementedError as e:
            print(f"[Eixo {n:02d}] Ainda não implementado ({e})")
        except Exception as e:
            print(f"[Eixo {n:02d}] ERRO: {e}")
            import traceback
            traceback.print_exc()

    if resultados:
        print(f"\n[TOTAL] {total_indicadores} indicadores, "
              f"{len(resultados)} eixos gerados")


if __name__ == "__main__":
    main()
