# Briefing de Saída — 2026-03-21

> Etapa I-2 v2: Tabela Mestra dos Municípios — Regionais SEPLAN 2024
> Ambiente: Claude Code (🔧)

---

## 1. O que foi feito

Etapa I-2 **recriada** para substituir as 6 regiões arbitrárias (v1, baseada em `regioes.ts` + inferência por centroide) pelas **8 regionais oficiais da SEPLAN 2024** (ADR-011).

- Script Python reescrito do zero com mapeamento 100% determinístico
- JSON regenerado com novos campos: `regiao` (8 regionais), `macrorregional` (3), `polo_regional`
- Todas as 13 validações passaram (139/139 municípios)

## 2. Decisões técnicas

### Fonte de regiões
- **v1 (invalidada):** `regioes.ts` (6 regiões, 21 nomes, 118 inferidos por centroide)
- **v2 (atual):** `regioes_planejamento_seplan_2024.json` (8 regionais, 139 nomes, zero inferência)
- Referência: ADR-011

### Mapeamento nome SEPLAN → cod_ibge Censo
- **136 municípios:** match direto por nome
- **3 municípios:** divergência de grafia resolvida por mapeamento manual:
  - SEPLAN "Couto de Magalhães" → Censo "Couto Magalhães"
  - SEPLAN "Pau d'Arco" → Censo "Pau D'Arco"
  - SEPLAN "São Valério da Natividade" → Censo "São Valério"
- **0 municípios:** fuzzy/inferência (script tem fallback, mas não foi necessário)

### Schema de saída
- Campo `regiao`: slug da regional SEPLAN (8 valores)
- Campo `macrorregional`: slug da macrorregional (3 valores: norte, centro, sul)
- Campo `polo_regional`: polo de referência (proposta adotada pré-execução)
- PIB: `pib_percapita_2021` (2022/2023 indisponíveis — `...` no IBGE)

### Distribuição por regional
| Regional | Municípios |
|---|---|
| bico-do-papagaio | 25 |
| norte | 15 |
| meio-norte | 25 |
| vale-do-araguaia | 15 |
| central | 14 |
| jalapao | 9 |
| sul | 17 |
| sudeste | 19 |
| **Total** | **139** |

### Distribuição por macrorregional
| Macrorregional | Municípios |
|---|---|
| norte | 65 |
| centro | 38 |
| sul | 36 |
| **Total** | **139** |

## 3. Problemas encontrados

- **3 divergências de grafia** entre SEPLAN e Censo — resolvidas com mapeamento manual
- **PIB 2022/2023 indisponível** — mantido fallback para 2021 (mesmo da v1)
- **Nenhum município sem match** após resolução de divergências

## 4. Arquivos criados/modificados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `scripts/gerar_municipios_referencia.py` | Reescrito | Script v2 com SEPLAN 2024 (era v1 com regioes.ts) |
| `src/data/municipios_referencia.json` | Regenerado | 139 municípios com 8 regionais SEPLAN |
| `.claude/memory/propostas-melhorias-fase-i.md` | Atualizado | Propostas v1 superadas + novas propostas |
| `.claude/memory/today.md` | Reescrito | Este briefing |

## 5. Resultado da verificação

- ✅ Total de municípios: 139
- ✅ cod_ibge 17XXXXX: 0 inválidos
- ✅ Nomes não-vazios: 0 vazios
- ✅ Regiões válidas (8 SEPLAN): 0 inválidas
- ✅ Macrorregionais válidas (3 SEPLAN): 0 inválidas
- ✅ Polo regional não-vazio: 0 vazios
- ✅ População > 0: 0 inválidos
- ✅ PIB per capita > 0: 0 inválidos
- ✅ Centroides válidos: 0 inválidos
- ✅ Sem duplicatas cod_ibge: 0 duplicatas
- ✅ Cruzamento GeoJSON: 139 matches
- ✅ Distribuição por regional confere com SEPLAN
- ✅ Distribuição por macrorregional: norte=65, centro=38, sul=36

## 6. Propostas de melhoria

Ver `.claude/memory/propostas-melhorias-fase-i.md`:
- ✅ **[ADOTADA]** Campo `polo_regional` na tabela mestra
- ⚠️ **[SUPERADA]** Expandir `municipiosPrincipais` (resolvido pela SEPLAN)
- ⚠️ **[SUPERADA]** Validar classificação regional (mapeamento agora é oficial)
- 🔜 Atualizar `regioes.ts` para 8 regionais (próxima sessão)
- 🔜 Atualizar PIB quando 2022/2023 disponíveis (futuro)
- 📝 Documentar divergências de grafia SEPLAN vs Censo (futuro)
