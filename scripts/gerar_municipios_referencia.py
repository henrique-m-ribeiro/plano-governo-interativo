#!/usr/bin/env python3
"""
Gera a tabela mestra dos 139 municípios do Tocantins.

Etapa I-2 da Fase I (Dados Fundacionais).
Fontes: Censo 2022, PIB Municipal IBGE, GeoJSON, regioes.ts
Saída: src/data/municipios_referencia.json

Uso:
    python scripts/gerar_municipios_referencia.py [--dados-dir CAMINHO]

    --dados-dir: caminho para a pasta de dados (padrão: ../doutorado/06-dados/)
                 Aceita também /tmp/doutorado-dados/ se os dados foram baixados separadamente.
"""

import csv
import json
import math
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

# --- Configuração de caminhos ---
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_DIR = SCRIPT_DIR.parent
SAIDA_JSON = REPO_DIR / "src" / "data" / "municipios_referencia.json"
REGIOES_TS = REPO_DIR / "src" / "data" / "regioes.ts"

# Caminho padrão para dados — aceita override via argumento
DADOS_DIR_PADRAO = REPO_DIR.parent / "doutorado" / "06-dados"
DADOS_DIR_ALT = Path("/tmp/doutorado-dados")

# Slugs válidos de região
REGIOES_VALIDAS = {"central", "norte", "sul", "sudeste", "bico-do-papagaio", "oeste"}


def resolver_dados_dir():
    """Resolve o diretório de dados: argumento > padrão > alternativo."""
    # Argumento de linha de comando
    for i, arg in enumerate(sys.argv[1:], 1):
        if arg == "--dados-dir" and i < len(sys.argv) - 1:
            caminho = Path(sys.argv[i + 1])
            if caminho.exists():
                return caminho
            else:
                print(f"ERRO: Caminho informado não existe: {caminho}")
                sys.exit(1)

    # Caminhos padrão
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


def ler_pib(dados_dir: Path) -> dict:
    """Lê o CSV de PIB Municipal e retorna {cod_ibge: pib_percapita} (ano mais recente)."""
    caminho = dados_dir / "basedosdados" / "csv" / "economia" / "pib_municipal_ibge.csv"
    print(f"  Lendo PIB Municipal: {caminho}")

    resultado = {}
    with open(caminho, encoding="utf-8-sig", newline="") as f:
        leitor = csv.DictReader(f)
        colunas = leitor.fieldnames or []

        # Encontrar a coluna pib_percapita mais recente
        colunas_percapita = sorted(
            [c for c in colunas if c.startswith("pib_percapita_")],
            reverse=True,
        )
        if not colunas_percapita:
            print("ERRO: Nenhuma coluna pib_percapita_* encontrada no CSV de PIB")
            sys.exit(1)

        # Ler todas as linhas para encontrar a coluna mais recente com dados válidos
        linhas = list(leitor)

        col_mais_recente = None
        for col in colunas_percapita:
            # Verificar se pelo menos 50% dos municípios têm valor numérico válido
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
        # Garante [lon, lat] com precisão razoável
        resultado[cod] = [round(centroide[0], 6), round(centroide[1], 6)]

    print(f"    → {len(resultado)} features lidas")
    return resultado


def parsear_regioes_ts() -> dict:
    """Parseia regioes.ts e retorna {nome_municipio: slug_regiao}."""
    print(f"  Lendo regiões: {REGIOES_TS}")

    with open(REGIOES_TS, encoding="utf-8") as f:
        conteudo = f.read()

    mapeamento = {}

    # Encontrar cada bloco de região com id e municipiosPrincipais
    blocos = re.findall(
        r'id:\s*"([^"]+)".*?municipiosPrincipais:\s*\[(.*?)\]',
        conteudo,
        re.DOTALL,
    )

    for slug, municipios_raw in blocos:
        nomes = re.findall(r'"([^"]+)"', municipios_raw)
        for nome in nomes:
            mapeamento[nome] = slug
        print(f"    Região '{slug}': {len(nomes)} municípios listados")

    print(f"    → {len(mapeamento)} municípios mapeados diretamente por regioes.ts")
    return mapeamento


def distancia_euclidiana(p1, p2):
    """Distância euclidiana simples entre dois pontos [lon, lat]."""
    return math.sqrt((p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2)


def inferir_regioes_por_centroide(municipios_sem_regiao, centroides, mapeamento_nome_regiao, centroides_todos):
    """
    Infere a região dos municípios não mapeados pela proximidade
    do centroide ao centroide médio de cada região.

    Retorna {cod_ibge: slug_regiao}.
    """
    # Calcular centroide médio de cada região
    centroides_por_regiao = {}
    for cod, centroide in centroides_todos.items():
        # Precisamos do nome deste município para encontrar sua região
        pass

    # Abordagem: usar os municípios já mapeados para calcular centroide médio
    # Precisamos de cod_ibge→nome para cruzar com mapeamento_nome_regiao
    return {}


def atribuir_regioes(censo, centroides, mapeamento_nome_regiao):
    """
    Atribui região a cada município:
    1. Por nome (via regioes.ts)
    2. Restantes por proximidade de centroide
    Retorna {cod_ibge: slug_regiao} e estatísticas.
    """
    resultado = {}
    por_nome = 0
    por_centroide = 0

    # Mapa nome→cod_ibge
    nome_para_cod = {}
    cod_para_nome = {}
    for cod, dados in censo.items():
        nome_para_cod[dados["nome"]] = cod
        cod_para_nome[cod] = dados["nome"]

    # Passo 1: atribuir por nome (regioes.ts)
    for nome, slug in mapeamento_nome_regiao.items():
        if nome in nome_para_cod:
            cod = nome_para_cod[nome]
            resultado[cod] = slug
            por_nome += 1

    print(f"\n  Atribuição de regiões:")
    print(f"    Por nome (regioes.ts): {por_nome}")

    # Passo 2: calcular centroide médio de cada região usando os já mapeados
    soma_regioes = {}  # {slug: ([lon_sum, lat_sum], count)}
    for cod, slug in resultado.items():
        if cod in centroides:
            if slug not in soma_regioes:
                soma_regioes[slug] = [[0.0, 0.0], 0]
            soma_regioes[slug][0][0] += centroides[cod][0]
            soma_regioes[slug][0][1] += centroides[cod][1]
            soma_regioes[slug][1] += 1

    centroide_medio = {}
    for slug, (soma, n) in soma_regioes.items():
        centroide_medio[slug] = [soma[0] / n, soma[1] / n]
        print(f"    Centroide médio '{slug}': [{centroide_medio[slug][0]:.3f}, {centroide_medio[slug][1]:.3f}] (n={n})")

    # Passo 3: municípios restantes → região mais próxima por centroide
    sem_regiao = [cod for cod in censo if cod not in resultado]
    for cod in sem_regiao:
        if cod not in centroides:
            print(f"    AVISO: {cod_para_nome.get(cod, cod)} sem centroide, atribuindo à região mais próxima por fallback")
            continue

        ponto = centroides[cod]
        menor_dist = float("inf")
        regiao_mais_proxima = None

        for slug, centro in centroide_medio.items():
            dist = distancia_euclidiana(ponto, centro)
            if dist < menor_dist:
                menor_dist = dist
                regiao_mais_proxima = slug

        resultado[cod] = regiao_mais_proxima
        por_centroide += 1

    print(f"    Por centroide (inferido): {por_centroide}")
    print(f"    Total mapeado: {len(resultado)}")

    return resultado, {"por_nome": por_nome, "por_centroide": por_centroide}


def gerar_json(censo, pib, centroides, regioes_map, ano_pib):
    """Gera o JSON final e salva em src/data/municipios_referencia.json."""
    municipios = []

    for cod in sorted(censo.keys()):
        dados_censo = censo[cod]
        municipio = {
            "cod_ibge": cod,
            "nome": dados_censo["nome"],
            "regiao": regioes_map.get(cod, ""),
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
        "municipios": municipios,
    }

    # Garantir que o diretório de saída existe
    SAIDA_JSON.parent.mkdir(parents=True, exist_ok=True)

    with open(SAIDA_JSON, "w", encoding="utf-8") as f:
        json.dump(saida, f, ensure_ascii=False, indent=2)

    print(f"\n  Arquivo gerado: {SAIDA_JSON}")
    print(f"  Total de municípios: {len(municipios)}")

    return saida


def validar(saida, centroides_geojson):
    """Executa as 10 validações obrigatórias. Retorna (ok, relatorio)."""
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

    # 2. Todos com cod_ibge de 7 dígitos (17XXXXX)
    ibges_invalidos = [m for m in municipios if not (1700000 <= m["cod_ibge"] <= 1799999)]
    ok = len(ibges_invalidos) == 0
    msg = f"{'✅' if ok else '❌'} cod_ibge 17XXXXX: {len(ibges_invalidos)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 3. Todos com nome não-vazio
    sem_nome = [m for m in municipios if not m["nome"]]
    ok = len(sem_nome) == 0
    msg = f"{'✅' if ok else '❌'} Nomes não-vazios: {len(sem_nome)} vazios"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 4. Todos com regiao válida
    sem_regiao = [m for m in municipios if m["regiao"] not in REGIOES_VALIDAS]
    ok = len(sem_regiao) == 0
    msg = f"{'✅' if ok else '❌'} Regiões válidas: {len(sem_regiao)} inválidas"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)
        for m in sem_regiao[:5]:
            print(f"      → {m['nome']}: '{m['regiao']}'")

    # 5. Todos com populacao_2022 > 0
    sem_pop = [m for m in municipios if not m["populacao_2022"] or m["populacao_2022"] <= 0]
    ok = len(sem_pop) == 0
    msg = f"{'✅' if ok else '❌'} População > 0: {len(sem_pop)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 6. Todos com pib_percapita > 0
    sem_pib = [m for m in municipios if not m["pib_percapita"] or m["pib_percapita"] <= 0]
    ok = len(sem_pib) == 0
    msg = f"{'✅' if ok else '❌'} PIB per capita > 0: {len(sem_pib)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)
        for m in sem_pib[:5]:
            print(f"      → {m['nome']}: {m['pib_percapita']}")

    # 7. Todos com centroide válido
    sem_centroide = [m for m in municipios if not m["centroide"] or len(m["centroide"]) != 2]
    ok = len(sem_centroide) == 0
    msg = f"{'✅' if ok else '❌'} Centroides válidos: {len(sem_centroide)} inválidos"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 8. Sem duplicatas de cod_ibge
    cod_ibges = [m["cod_ibge"] for m in municipios]
    duplicatas = len(cod_ibges) - len(set(cod_ibges))
    ok = duplicatas == 0
    msg = f"{'✅' if ok else '❌'} Sem duplicatas cod_ibge: {duplicatas} duplicatas"
    print(f"  {msg}")
    relatorio.append(msg)
    if not ok:
        erros.append(msg)

    # 9. Cruzamento com GeoJSON: 139 matches
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

    # 10. Distribuição por região
    contagem_regioes = {}
    for m in municipios:
        r = m["regiao"]
        contagem_regioes[r] = contagem_regioes.get(r, 0) + 1
    msg = "✅ Distribuição por região: " + ", ".join(
        f"{k}={v}" for k, v in sorted(contagem_regioes.items())
    )
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
    print("ETAPA I-2: Tabela Mestra dos Municípios do Tocantins")
    print("=" * 60)

    # Resolver diretório de dados
    dados_dir = resolver_dados_dir()
    print(f"\nDiretório de dados: {dados_dir}\n")

    # 1. Ler fontes de dados
    print("1. Lendo fontes de dados...")
    censo = ler_censo(dados_dir)
    pib, ano_pib = ler_pib(dados_dir)
    centroides = ler_geojson(dados_dir)
    mapeamento_regioes = parsear_regioes_ts()

    # 2. Atribuir regiões
    print("\n2. Atribuindo regiões...")
    regioes_map, stats_regioes = atribuir_regioes(censo, centroides, mapeamento_regioes)

    # 3. Gerar JSON
    print("\n3. Gerando JSON de saída...")
    saida = gerar_json(censo, pib, centroides, regioes_map, ano_pib)

    # 4. Validar
    ok, relatorio, contagem_regioes = validar(saida, centroides)

    # Retornar informações para o briefing
    return {
        "ok": ok,
        "relatorio": relatorio,
        "stats_regioes": stats_regioes,
        "contagem_regioes": contagem_regioes,
        "ano_pib": ano_pib,
        "dados_dir": str(dados_dir),
    }


if __name__ == "__main__":
    resultado = main()
    sys.exit(0 if resultado["ok"] else 1)
