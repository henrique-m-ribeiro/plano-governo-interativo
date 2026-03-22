# Briefing Técnico — Etapa I-3c: Complemento de Indicadores

> Data: 2026-03-22
> Referência: relatório `doutorado/02-pesquisa-acao/reconciliacao-indicadores-i3b.md`

## 1. IDEB e SAEB — Novos indicadores para Eixo 2

### Fonte

`data/pipeline/basedosdados/csv/educacao/ideb_municipio_bd.csv`

### Colunas

```
cod_ibge, ano, rede, ensino, ideb, taxa_aprovacao, indicador_rendimento, nota_saeb_matematica, nota_saeb_lingua_portuguesa
```

### Combinações disponíveis

| rede | ensino | registros | municípios | anos |
|------|--------|-----------|-----------|------|
| publica | fundamental | 1946 | 139 | 2009,2011,2013,2017,2019,2021,2023 |
| municipal | fundamental | 1749 | 138 | 2009,2011,2013,2015,2017,2019,2021,2023 |
| estadual | fundamental | 2056 | 135 | 2009,2011,2013,2015,2017,2019,2021,2023 |
| publica | medio | 548 | 137 | 2017,2019,2021,2023 |
| estadual | medio | 548 | 137 | 2017,2019,2021,2023 |

### Indicadores a extrair

**Prioridade 1 — usar `rede == "publica"` AND `ensino == "fundamental"` (139 mun, melhor cobertura):**

| id | coluna | nome | unidade |
|----|--------|------|---------|
| `nota_saeb_matematica` | `nota_saeb_matematica` | Nota SAEB — Matemática (rede pública, fundamental) | nota |
| `nota_saeb_lingua_portuguesa` | `nota_saeb_lingua_portuguesa` | Nota SAEB — Língua Portuguesa (rede pública, fundamental) | nota |

**Prioridade 2 — se possível, adicionar ensino médio:**

| id | coluna/filtro | nome | unidade |
|----|---------------|------|---------|
| `ideb_ensino_medio` | `ideb` WHERE `rede == "publica"` AND `ensino == "medio"` | IDEB — Ensino médio (rede pública) | índice |

**Nota sobre `ideb_anos_iniciais` existente:** O indicador já no JSON usa `rede == "municipal"` e `ensino == "fundamental"`. No CSV de basedosdados, o IDEB fundamental da rede pública inclui municipal + estadual, mas NÃO distingue anos iniciais vs anos finais. A separação anos iniciais/finais viria do IDEB original do INEP (5º ano vs 9º ano), mas esse nível de detalhe não está no CSV. Portanto:

- **Manter** `ideb_anos_iniciais` como está (historicamente é o IDEB fundamental municipal)
- **Adicionar** `ideb_ensino_medio` (rede pública, ensino médio) — isso SIM é um dado novo e distinto
- **Adicionar** notas SAEB — são colunas existentes no CSV que não foram extraídas

### Tratamento

```python
# Pseudocódigo para extrair nota_saeb_matematica
df = pd.read_csv(csv_path, encoding="utf-8-sig")
filtro = (df["rede"] == "publica") & (df["ensino"] == "fundamental")
df_filt = df[filtro][["cod_ibge", "ano", "nota_saeb_matematica"]].dropna()
# Pivotar para serie_temporal: {cod_ibge_str: {ano_str: valor}}
```

## 2. CSVs de Saúde — Formato largo do Geoportal

### acidentes_com_animais_peconhentos.csv

- **Encoding:** utf-8-sig
- **Formato:** largo (80 colunas, 139 linhas)
- **Padrão de colunas:** `{tipo}_{ano}` onde tipo = serp, aran, escor, lagar, abel, otros
- **Anos:** 2007 a ~2019 (variam por tipo)
- **Indicador sugerido:** `acidentes_peconhentos_total` — somar todos os tipos por município/ano

### leishmaniose_visceral.csv

- **Encoding:** utf-8-sig
- **Formato:** largo (26 colunas, 139 linhas)
- **Padrão de colunas:** `{tipo}_{ano}` onde tipo = visce, tegum
- **Anos:** 2007 a ~2018
- **Indicador sugerido:** `casos_leishmaniose_visceral` — extrair apenas `visce_YYYY`

### obitos_por_causa_morte_2009_2010_2013_2014_2015.csv

- **Encoding:** utf-8-sig
- **Formato:** largo (52 colunas, 139 linhas)
- **Padrão de colunas:** `{causa}_{ano}` onde causa = infec, neopl, endoc, circu, respi, diges, etc.
- **Anos:** 2009, 2010, 2013, 2014, 2015
- **Indicador sugerido:** `obitos_causas_externas` — extrair coluna de causas externas se existir, ou criar total

**Regra para formato largo:** Parsear as colunas para extrair (tipo, ano) do padrão `{tipo}_{ano}`. Agregar se necessário. Converter para serie_temporal esparsa.

## 3. GeoJSON

### Fonte

GitHub raw: `https://raw.githubusercontent.com/henrique-m-ribeiro/doutorado/main/06-dados/geojson/tocantins-municipios.geojson`

### Propriedades esperadas

```json
{
  "type": "FeatureCollection",
  "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:EPSG::4674"}},
  "features": [
    {
      "type": "Feature",
      "properties": {"codarea": "1700251", "centroide": [-49.31, -9.48]},
      "geometry": {"type": "Polygon", "coordinates": [...]}
    }
  ]
}
```

- 139 features
- `codarea`: string de 7 dígitos (IBGE)
- Geometria: Polygon (não MultiPolygon)
- CRS: EPSG:4674 (SIRGAS 2000)
- Tamanho: ~187 KB

### Destino

`data/pipeline/geoportal-seplan/geojson/municipios_tocantins.geojson`

## 4. Schema obrigatório para indicadores (referência)

Cada indicador adicionado DEVE seguir este formato:

```json
{
  "id": "nome_snake_case",
  "nome": "Nome legível em português",
  "unidade": "índice|nota|casos|óbitos|...",
  "fonte": "Instituição/Sistema",
  "descricao": "Breve descrição do que mede",
  "ano_inicio": 2009,
  "ano_fim": 2023,
  "cobertura_municipios": 139,
  "serie_temporal": {
    "1700251": {"2009": 3.8, "2011": 4.1},
    "1700350": {"2009": 4.2}
  }
}
```

**Regras inegociáveis:**
- Chaves de `serie_temporal`: strings de 7 dígitos (cod_ibge)
- Sem nulls — apenas incluir pares (ano, valor) onde o dado existe
- `ano_inicio` e `ano_fim`: inteiros (menor e maior ano presente nos dados)
- `cobertura_municipios`: inteiro (quantos municípios distintos têm pelo menos 1 datapoint)
