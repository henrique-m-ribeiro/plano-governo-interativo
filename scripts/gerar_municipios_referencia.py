#!/usr/bin/env python3
"""
Gera a tabela mestra dos 139 municípios do Tocantins.

Etapa I-2 da Fase I (Dados Fundacionais) — v2 (SEPLAN 2024).
Fontes: Censo 2022, PIB Municipal IBGE, GeoJSON, regioes_planejamento_seplan_2024.json
Saída: src/data/municipios_referencia.json

Uso:
    python scripts/gerar_municipios_referencia.py [--dados-dir CAMINHO]

    --dados-dir: caminho para a pasta de dados (padrão: ../doutorado/06-dados/)
                 Aceita também /tmp/doutorado-dados/ se os dados foram baixados separadamente.

Mudança v1→v2: Substituição das 6 regiões arbitrárias de regioes.ts pelas 8 regionais
oficiais da SEPLAN 2024 (ADR-011). Mapeamento 100% determinístico, zero inferência.
"""

import csv
import json
import sys
import unicodedata
from datetime import datetime, timezone
from pathlib import Path

# --- Configuração de caminhos ---
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_DIR = SCRIPT_DIR.parent
SAIDA_JSON = REPO_DIR / "src" / "data" / "municipios_referencia.json"

# Caminho padrão para dados — aceita override via argumento
DADOS_DIR_PADRAO = REPO_DIR.parent / "doutorado" / "06-dados"
DADOS_DIR_ALT = Path("/tmp/doutorado-dados")

# 8 regionais oficiais SEPLAN 2024
REGIOES_VALIDAS = {
    "bico-do-papagaio", "norte", "meio-norte", "vale-do-araguaia",
    "central", "jalapao", "sul", "sudeste",
}

# 3 macrorregionais oficiais SEPLAN 2024
MACRORREGIONAIS_VALIDAS = {"norte", "centro", "sul"}


def resolver_dados_dir():
    """Resolve o diretório de dados: argumento > padrão > alternativo."""
    for i, arg in enumerate(sys.argv[1:], 1):
        if arg == "--dados-dir" and i < len(sys.argv) - 1:
            caminho = Path(sys.argv[i + 1])
            if caminho.exists():
                return caminho
            else:
                print(f"ERRO: Caminho informado não existe: {caminho}")
                sys.exit(1)

    if DADOS_DIR_PADRAO.exists():
        return DADOS_DIR_PADRAO
    if DADOS_DIR_ALT.exists():
        return DADOS_DIR_ALT

    print("ERRO: Nenhum diretório de dados encontrado.")
    print(f"  Tentou: {DADOS_DIR_PADRAO}")
    print(f"  Tentou: {DADOS_DIR_ALT}")
    print("  Use: python scripts/gerar_municipios_referencia.py --dados-dir /caminho/para/dados")
    sys.exit(1)


def ler_censo(dados_dir: Path) -> dict:
    """Lê o CSV do Censo 2022 e retorna {cod_ibge: {nome, populacao_2022}}."""
    caminho = dados_dir / "basedosdados" / "csv" / "demografia" / "censo_2022_populacao.csv"
    print(f"  Lendo Censo 2022: {caminho}")

    resultado = {}
    with open(caminho, encoding="utf-8-sig", newline="") as f:
        leitor = csv.DictReader(f)
        for linha in leitor:
            cod = int(linha["cod_ibge"])
            resultado[cod] = {
                "nome": linha["nome"].strip(),
                "populacao_2022": int(linha["populacao_2022"]),
            }
    print(f"    → {len(resultado)} municípios lidos")
    return resultado


def ler_pib(dados_dir: Path):
    """Lê o CSV de PIB Municipal e retorna ({cod_ibge: pib_percapita}, ano)."""
    caminho = dados_dir / "basedosdados" / "csv" / "economia" / "pib_municipal_ibge.csv"
    print(f"  Lendo PIB Municipal: {caminho}")

    resultado = {}
    with open(caminho, encoding="utf-8-sig", newline="") as f:
        leitor = csv.DictReader(f)
        colunas = leitor.fieldnames or []

        # Encontrar a coluna pib_percapita mais recente com dados válidos
        colunas_percapita = sorted(
            [c for c in colunas if c.startswith("pib_percapita_")],
            reverse=True,
        )
        if not colunas_percapita:
            print("ERRO: Nenhuma coluna pib_percapita_* encontrada no CSV de PIB")
            sys.exit(1)

        linhas = list(leitor)

        col_mais_recente = None
        for col in colunas_percapita:
            validos = sum(
                1 for l in linhas
                if l[col].strip() not in ("", "...", "-")
            )
            if validos > len(linhas) * 0.5:
                col_mais_recente = col
                break
            else:
                print(f"    Coluna {col}: apenas {validos}/{len(linhas)} válidos — pulando")

        if not col_mais_recente:
            print("ERRO: Nenhuma coluna pib_percapita_* com dados válidos")
            sys.exit(1)

        ano_pib = col_mais_recente.replace("pib_percapita_", "")
        print(f"    Coluna selecionada: {col_mais_recente} (ano {ano_pib})")

        for linha in linhas:
            cod = int(linha["cod_ibge"])
            valor_raw = linha[col_mais_recente].strip()
            if valor_raw and valor_raw not in ("...", "-"):
                resultado[cod] = round(float(valor_raw), 2)
            else:
                resultado[cod] = None
    print(f"    → {len(resultado)} municípios lidos")
    return resultado, ano_pib


def ler_geojson(dados_dir: Path) -> dict:
    """Lê o GeoJSON e retorna {cod_ibge: [lon, lat]} (centroide)."""
    caminho = dados_dir / "geojson" / "tocantins-municipios.geojson"
    print(f"  Lendo GeoJSON: {caminho}")

    with open(caminho, encoding="utf-8") as f:
        gj = json.load(f)

    resultado = {}
    for feature in gj["features"]:
        props = feature["properties"]
        cod = int(props["codarea"])
        centroide = props["centroide"]
        resultado[cod] = [round(centroide[0], 6), round(centroide[1], 6)]

    print(f"    → {len(resultado)} features lidas")
    return resultado


def ler_regioes_seplan(dados_dir: Path):
    """
    Lê o JSON oficial da SEPLAN 2024 e retorna:
    - mapa_nome_regiao: {nome_municipio: slug_regional}
    - mapa_nome_macro: {nome_municipio: slug_macrorregional}
    - mapa_nome_polo: {nome_municipio: polo_regional}
    - contagem_seplan: {slug_regional: total_esperado}
    """
    caminho = dados_dir / "regioes_planejamento_seplan_2024.json"
    print(f"  Lendo regionais SEPLAN 2024: {caminho}")

    with open(caminho, encoding="utf-8") as f:
        dados = json.load(f)

    mapa_nome_regiao = {}
    mapa_nome_macro = {}
    mapa_nome_polo = {}
    contagem_seplan = {}

    for slug, info in dados["regionais"].items():
        contagem_seplan[slug] = info["total_municipios"]
        polo = info.get("polo", "")
        macro = info["macrorregional"]
        print(f"    Regional '{slug}': {info['total_municipios']} municípios, polo={polo}, macro={macro}")

        for nome in info["municipios"]:
            mapa_nome_regiao[nome] = slug
            mapa_nome_macro[nome] = macro
            mapa_nome_polo[nome] = polo

    total = sum(contagem_seplan.values())
    print(f"    → {len(mapa_nome_regiao)} municípios mapeados (total esperado: {total})")

    return mapa_nome_regiao, mapa_nome_macro, mapa_nome_polo, contagem_seplan


def normalizar_nome(nome: str) -> str:
    """
    Normaliza nome de município para comparação fuzzy.
    Remove acentos, converte para minúsculas, remove preposições comuns.
    """
    # Remover acentos
    nfkd = unicodedata.normalize("NFKD", nome)
    sem_acento = "".join(c for c in nfkd if not unicodedata.combining(c))
    return sem_acento.lower().strip()


# Mapeamento manual para divergências conhecidas entre SEPLAN e Censo/IBGE
# Chave: nome na SEPLAN, Valor: nome no Censo
NOMES_DIVERGENTES = {
    "Couto de Magalhães": "Couto Magalhães",
    "Pau d'Arco": "Pau D'Arco",
    "São Valério da Natividade": "São Valério",
}


def atribuir_regioes(censo, mapa_nome_regiao, mapa_nome_macro, mapa_nome_polo):
    """
    Atribui regional, macrorregional e polo a cada município
    via cruzamento determinístico nome (SEPLAN) → cod_ibge (Censo).
    Usa mapeamento manual para divergências de grafia conhecidas,
    e fallback por normalização para divergências imprevistas.
    Retorna {cod_ibge: {regiao, macrorregional, polo_regional}} e estatísticas.
    """
    resultado = {}
    mapeados = 0
    mapeados_divergencia = 0
    mapeados_fuzzy = 0
    sem_match = []

    # Mapa nome→cod_ibge a partir do Censo
    nome_para_cod = {}
    cod_para_nome = {}
    for cod, dados in censo.items():
        nome_para_cod[dados["nome"]] = cod
        cod_para_nome[cod] = dados["nome"]

    # Mapa normalizado para fallback fuzzy
    normalizado_para_cod = {}
    for nome, cod in nome_para_cod.items():
        normalizado_para_cod[normalizar_nome(nome)] = cod

    # Cruzamento por nome
    for nome_seplan, slug in mapa_nome_regiao.items():
        cod = None
        metodo = "direto"

        # 1. Match direto
        if nome_seplan in nome_para_cod:
            cod = nome_para_cod[nome_seplan]
        # 2. Match por divergência conhecida
        elif nome_seplan in NOMES_DIVERGENTES:
            nome_censo = NOMES_DIVERGENTES[nome_seplan]
            if nome_censo in nome_para_cod:
                cod = nome_para_cod[nome_censo]
                metodo = "divergencia"
                print(f"    ⚠ Divergência resolvida: SEPLAN '{nome_seplan}' → Censo '{nome_censo}'")
        # 3. Fallback: normalização (sem acentos, lowercase)
        if cod is None:
            norm = normalizar_nome(nome_seplan)
            if norm in normalizado_para_cod:
                cod = normalizado_para_cod[norm]
                metodo = "fuzzy"
                print(f"    ⚠ Match fuzzy: SEPLAN '{nome_seplan}' → Censo '{cod_para_nome[cod]}'")

        if cod is not None:
            resultado[cod] = {
                "regiao": slug,
                "macrorregional": mapa_nome_macro[nome_seplan],
                "polo_regional": mapa_nome_polo[nome_seplan],
            }
            if metodo == "direto":
                mapeados += 1
            elif metodo == "divergencia":
                mapeados_divergencia += 1
            else:
                mapeados_fuzzy += 1
        else:
            sem_match.append(nome_seplan)

    # Municípios do censo sem correspondência na SEPLAN
    sem_regiao = [cod for cod in censo if cod not in resultado]

    print(f"\n  Atribuição de regiões (SEPLAN 2024):")
    print(f"    Mapeados por nome direto: {mapeados}")
    print(f"    Mapeados por divergência conhecida: {mapeados_divergencia}")
    print(f"    Mapeados por normalização fuzzy: {mapeados_fuzzy}")
    print(f"    Total mapeado: {len(resultado)}")
    if sem_match:
        print(f"    SEPLAN sem match no Censo ({len(sem_match)}): {sem_match}")
    if sem_regiao:
        nomes_sem = [cod_para_nome[c] for c in sem_regiao]
        print(f"    Censo sem match na SEPLAN ({len(sem_regiao)}): {nomes_sem}")

    return resultado, {
        "direto": mapeados,
        "divergencia": mapeados_divergencia,
        "fuzzy": mapeados_fuzzy,
        "sem_match_seplan": sem_match,
        "sem_match_censo": sem_regiao,
    }


def gerar_json(censo, pib, centroides, regioes_map, ano_pib):
    """Gera o JSON final e salva em src/data/municipios_referencia.json."""
    municipios = []

    for cod in sorted(censo.keys()):
        dados_censo = censo[cod]
        info_regiao = regioes_map.get(cod, {})
        municipio = {
            "cod_ibge": cod,
            "nome": dados_censo["nome"],
            "regiao": info_regiao.get("regiao", ""),
            "macrorregional": info_regiao.get("macrorregional", ""),
            "polo_regional": info_regiao.get("polo_regional", ""),
            "populacao_2022": dados_censo["populacao_2022"],
            "pib_percapita": pib.get(cod),
            "centroide": centroides.get(cod),
        }
        municipios.append(municipio)

    saida = {
        "gerado_em": datetime.now(timezone.utc).isoformat(),
        "total": len(municipios),
        "fonte_principal": "Censo 2022 (IBGE)",
        "fonte_pib": f"PIB Municipal IBGE ({ano_pib})",
        "fonte_regioes": "SEPLAN/SPG Tocantins, 2024 (ADR-011)",
        "regionais": 8,
        "macrorregionais": 3,
        "municipios": municipios,
    }

    SAIDA_JSON.parent.mkdir(parents=True, exist_ok=True)

    with open(SAIDA_JSON, "w", encoding="utf-8") as f:
        json.dump(saida, f, ensure_ascii=False, indent=2)

    print(f"\n  Arquivo gerado: {SAIDA_JSON}")
    print(f"  Total de municípios: {len(municipios)}")

    return saida


def validar(saida, centroides_geojson, contagem_seplan):
    """Executa validações obrigatórias. Retorna (ok, relatorio, contagem_regioes)."""
    print("\n" + "=" * 60)
    print("VALIDAÇÃO")
    print("=" * 60)

    municipios = saida["municipios"]
    erros = []
    relatorio = []

    # 1. Exatamente 139 registros
    total = len(municipios)
    ok = total == 139
    msg = f"{'✅' if ok else '❌'} Total de municípios: {total} (esperado: 139)"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 2. cod_ibge de 7 dígitos (17XXXXX)
    ibges_invalidos = [m for m in municipios if not (1700000 <= m["cod_ibge"] <= 1799999)]
    ok = len(ibges_invalidos) == 0
    msg = f"{'✅' if ok else '❌'} cod_ibge 17XXXXX: {len(ibges_invalidos)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 3. Nomes não-vazios
    sem_nome = [m for m in municipios if not m["nome"]]
    ok = len(sem_nome) == 0
    msg = f"{'✅' if ok else '❌'} Nomes não-vazios: {len(sem_nome)} vazios"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 4. Regiões válidas (8 regionais SEPLAN)
    sem_regiao = [m for m in municipios if m["regiao"] not in REGIOES_VALIDAS]
    ok = len(sem_regiao) == 0
    msg = f"{'✅' if ok else '❌'} Regiões válidas (8 SEPLAN): {len(sem_regiao)} inválidas"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)
        for m in sem_regiao[:5]:
            print(f"      → {m['nome']}: '{m['regiao']}'")

    # 5. Macrorregionais válidas
    sem_macro = [m for m in municipios if m["macrorregional"] not in MACRORREGIONAIS_VALIDAS]
    ok = len(sem_macro) == 0
    msg = f"{'✅' if ok else '❌'} Macrorregionais válidas (3 SEPLAN): {len(sem_macro)} inválidas"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 6. Polo regional não-vazio
    sem_polo = [m for m in municipios if not m["polo_regional"]]
    ok = len(sem_polo) == 0
    msg = f"{'✅' if ok else '❌'} Polo regional não-vazio: {len(sem_polo)} vazios"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 7. População > 0
    sem_pop = [m for m in municipios if not m["populacao_2022"] or m["populacao_2022"] <= 0]
    ok = len(sem_pop) == 0
    msg = f"{'✅' if ok else '❌'} População > 0: {len(sem_pop)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 8. PIB per capita > 0
    sem_pib = [m for m in municipios if not m["pib_percapita"] or m["pib_percapita"] <= 0]
    ok = len(sem_pib) == 0
    msg = f"{'✅' if ok else '❌'} PIB per capita > 0: {len(sem_pib)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)
        for m in sem_pib[:5]:
            print(f"      → {m['nome']}: {m['pib_percapita']}")

    # 9. Centroides válidos
    sem_centroide = [m for m in municipios if not m["centroide"] or len(m["centroide"]) != 2]
    ok = len(sem_centroide) == 0
    msg = f"{'✅' if ok else '❌'} Centroides válidos: {len(sem_centroide)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 10. Sem duplicatas de cod_ibge
    cod_ibges = [m["cod_ibge"] for m in municipios]
    duplicatas = len(cod_ibges) - len(set(cod_ibges))
    ok = duplicatas == 0
    msg = f"{'✅' if ok else '❌'} Sem duplicatas cod_ibge: {duplicatas} duplicatas"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 11. Cruzamento com GeoJSON: 139 matches
    cod_json = set(m["cod_ibge"] for m in municipios)
    cod_geo = set(centroides_geojson.keys())
    matches = cod_json & cod_geo
    ok = len(matches) == 139
    msg = f"{'✅' if ok else '❌'} Cruzamento GeoJSON: {len(matches)} matches (esperado: 139)"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)
        so_json = cod_json - cod_geo
        so_geo = cod_geo - cod_json
        if so_json:
            print(f"      Só no JSON: {so_json}")
        if so_geo:
            print(f"      Só no GeoJSON: {so_geo}")

    # 12. Distribuição por regional confere com SEPLAN
    contagem_regioes = {}
    for m in municipios:
        r = m["regiao"]
        contagem_regioes[r] = contagem_regioes.get(r, 0) + 1

    dist_ok = True
    for slug, esperado in contagem_seplan.items():
        obtido = contagem_regioes.get(slug, 0)
        if obtido != esperado:
            dist_ok = False
            print(f"      ❌ '{slug}': obtido={obtido}, esperado={esperado}")

    msg_dist = ", ".join(f"{k}={v}" for k, v in sorted(contagem_regioes.items()))
    msg = f"{'✅' if dist_ok else '❌'} Distribuição por regional: {msg_dist}"
    print(f"  {msg}")
    relatorio.append(msg)
    if not dist_ok:
        erros.append(msg)

    # 13. Distribuição por macrorregional
    contagem_macro = {}
    for m in municipios:
        mr = m["macrorregional"]
        contagem_macro[mr] = contagem_macro.get(mr, 0) + 1
    msg_macro = ", ".join(f"{k}={v}" for k, v in sorted(contagem_macro.items()))
    msg = f"✅ Distribuição por macrorregional: {msg_macro}"
    print(f"  {msg}")
    relatorio.append(msg)

    print("=" * 60)
    if erros:
        print(f"  ❌ {len(erros)} validação(ões) com problemas")
    else:
        print("  ✅ Todas as validações passaram!")
    print("=" * 60)

    return len(erros) == 0, relatorio, contagem_regioes


def main():
    print("=" * 60)
    print("ETAPA I-2 (v2): Tabela Mestra — Regionais SEPLAN 2024")
    print("=" * 60)

    # Resolver diretório de dados
    dados_dir = resolver_dados_dir()
    print(f"\nDiretório de dados: {dados_dir}\n")

    # 1. Ler fontes de dados
    print("1. Lendo fontes de dados...")
    censo = ler_censo(dados_dir)
    pib, ano_pib = ler_pib(dados_dir)
    centroides = ler_geojson(dados_dir)
    mapa_regiao, mapa_macro, mapa_polo, contagem_seplan = ler_regioes_seplan(dados_dir)

    # 2. Atribuir regiões (100% determinístico via SEPLAN)
    print("\n2. Atribuindo regiões (SEPLAN 2024)...")
    regioes_map, stats = atribuir_regioes(censo, mapa_regiao, mapa_macro, mapa_polo)

    # 3. Gerar JSON
    print("\n3. Gerando JSON de saída...")
    saida = gerar_json(censo, pib, centroides, regioes_map, ano_pib)

    # 4. Validar
    ok, relatorio, contagem_regioes = validar(saida, centroides, contagem_seplan)

    return {
        "ok": ok,
        "relatorio": relatorio,
        "stats": stats,
        "contagem_regioes": contagem_regioes,
        "ano_pib": ano_pib,
        "dados_dir": str(dados_dir),
    }


if __name__ == "__main__":
    resultado = main()
    sys.exit(0 if resultado["ok"] else 1)
