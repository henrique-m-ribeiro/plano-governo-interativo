# Indicadores por Eixo — Séries Temporais

10 JSONs com séries temporais completas, gerados automaticamente a partir dos CSVs do pipeline.

## Resumo

| Eixo | Arquivo | Indicadores | Municípios | Anos | Datapoints |
|------|---------|-------------|------------|------|------------|
| 01 | eixo-01.json | 4 | 139 | 1991-2025 | 1.409 |
| 02 | eixo-02.json | 8 | 139 | 2009-2023 | 4.569 |
| 03 | eixo-03.json | 8 | 139 | 2006-2024 | 10.703 |
| 04 | eixo-04.json | 4 | 139 | 2015-2024 | 2.186 |
| 05 | eixo-05.json | 4 | 139 | 2000-2023 | 12.793 |
| 06 | eixo-06.json | 4 | 139 | 2000-2022 | 5.349 |
| 07 | eixo-07.json | 6 | 139 | 2018-2023 | 3.636 |
| 08 | eixo-08.json | 8 | 139 | 1989-2024 | 25.521 |
| 09 | eixo-09.json | 6 | 139 | 2010-2026 | 7.757 |
| 10 | eixo-10.json | 2 | 139 | 2000-2010 | 556 |
| **Total** | | **54** | **139** | | **74.479** |

## Schema

Cada JSON segue a estrutura definida em ADR-013:

```json
{
  "eixo": "Nome do eixo",
  "slug": "slug-do-eixo",
  "numero": 1,
  "indicadores": [{
    "id": "nome_snake_case",
    "nome": "Nome legível",
    "unidade": "% | R$ | hab | ...",
    "fonte": "Fonte",
    "descricao": "Descrição",
    "ano_inicio": 2009,
    "ano_fim": 2023,
    "cobertura_municipios": 139,
    "serie_temporal": {
      "1700251": { "2009": 3.8, "2023": 4.7 }
    }
  }],
  "contexto_estadual": null,
  "metadados": { ... }
}
```

## Gerado por

`scripts/gerar_jsons_por_eixo.py` — Etapa I-3b do plano de incorporação.

Fontes: CSVs em `data/pipeline/basedosdados/csv/` e `data/pipeline/geoportal-seplan/csv/`.
