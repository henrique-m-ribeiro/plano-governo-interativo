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
    # Implementado na Fase C
    raise NotImplementedError("Fase C")

def gerar_eixo_02():
    """Eixo 2 — Educação e Capital Humano"""
    print("\n=== Eixo 02: Educação ===")
    # Implementado na Fase D
    raise NotImplementedError("Fase D")

def gerar_eixo_03():
    """Eixo 3 — Saúde e Qualidade de Vida"""
    print("\n=== Eixo 03: Saúde ===")
    # Implementado na Fase C
    raise NotImplementedError("Fase C")

def gerar_eixo_04():
    """Eixo 4 — Infraestrutura e Conectividade"""
    print("\n=== Eixo 04: Infraestrutura ===")
    # Implementado na Fase B
    raise NotImplementedError("Fase B")

def gerar_eixo_05():
    """Eixo 5 — Meio Ambiente e Sustentabilidade"""
    print("\n=== Eixo 05: Meio Ambiente ===")
    # Implementado na Fase B
    raise NotImplementedError("Fase B")

def gerar_eixo_06():
    """Eixo 6 — Segurança Pública e Cidadania"""
    print("\n=== Eixo 06: Segurança ===")
    # Implementado na Fase C
    raise NotImplementedError("Fase C")

def gerar_eixo_07():
    """Eixo 7 — Gestão Pública e Inovação"""
    print("\n=== Eixo 07: Gestão Pública ===")
    # Implementado na Fase B
    raise NotImplementedError("Fase B")

def gerar_eixo_08():
    """Eixo 8 — Agropecuária e Desenvolvimento Rural"""
    print("\n=== Eixo 08: Agropecuária ===")
    # Implementado na Fase E
    raise NotImplementedError("Fase E")

def gerar_eixo_09():
    """Eixo 9 — Economia e Emprego"""
    print("\n=== Eixo 09: Economia ===")
    # Implementado na Fase B
    raise NotImplementedError("Fase B")

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
