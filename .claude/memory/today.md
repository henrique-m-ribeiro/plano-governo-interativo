# Briefing de Saída — 2026-03-21

> Etapa I-2: Tabela Mestra dos Municípios do Tocantins
> Ambiente: Claude Code (🔧)

---

## 1. O que foi feito

Etapa I-2 da Fase I (Dados Fundacionais) **executada com sucesso**.
- Script Python criado para gerar a tabela mestra dos 139 municípios
- JSON de referência gerado com todos os campos obrigatórios
- Todas as 10 validações passaram

## 2. Decisões técnicas

### PIB per capita
- Colunas `pib_percapita_2023` e `pib_percapita_2022` contêm `...` (dados indisponíveis do IBGE) para todos os 139 municípios
- **Decisão:** Usar `pib_percapita_2021` — último ano com dados válidos (139/139)
- O script detecta automaticamente o ano mais recente com >50% de dados válidos

### Mapeamento de regiões
- `regioes.ts` lista apenas 21 municípios (3-4 por região)
- **21 municípios** atribuídos diretamente por nome via `regioes.ts`
- **118 municípios** inferidos por proximidade de centroide ao centroide médio de cada região
- Distribuição final: central=36, norte=36, bico-do-papagaio=23, sul=21, oeste=13, sudeste=10

### Encoding
- CSVs lidos com `utf-8-sig` conforme especificado
- GeoJSON lido com `utf-8`
- Nenhum problema de encoding encontrado

### Dados de entrada
- Repo `doutorado` não estava presente no ambiente; dados baixados via HTTPS do GitHub público
- Script suporta ambos os caminhos (`../doutorado/06-dados/` e `/tmp/doutorado-dados/`) + argumento `--dados-dir`

## 3. Problemas encontrados

- **PIB 2022/2023 indisponível:** Todos os 139 municípios com `...` — resolvido usando 2021
- **Poucos municípios em regioes.ts:** Apenas 21 de 139 listados — 118 inferidos por centroide (ver propostas de melhoria)
- **Nenhum erro de dados:** Todos os 139 municípios têm cod_ibge, nome, população, PIB e centroide válidos

## 4. Arquivos criados/modificados

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `scripts/gerar_municipios_referencia.py` | Criado | Script Python idempotente para gerar tabela mestra |
| `src/data/municipios_referencia.json` | Criado | Tabela mestra com 139 municípios |
| `.claude/memory/propostas-melhorias-fase-i.md` | Criado | 4 propostas de melhoria |
| `.claude/memory/today.md` | Criado | Este briefing |

## 5. Resultado da verificação

- ✅ Total de municípios: 139
- ✅ cod_ibge 17XXXXX: 0 inválidos
- ✅ Nomes não-vazios: 0 vazios
- ✅ Regiões válidas: 0 inválidas
- ✅ População > 0: 0 inválidos
- ✅ PIB per capita > 0: 0 inválidos
- ✅ Centroides válidos: 0 inválidos
- ✅ Sem duplicatas cod_ibge: 0 duplicatas
- ✅ Cruzamento GeoJSON: 139 matches
- ✅ Distribuição por região: bico-do-papagaio=23, central=36, norte=36, oeste=13, sudeste=10, sul=21

## 6. Propostas de melhoria

Ver `.claude/memory/propostas-melhorias-fase-i.md` — 4 propostas:
1. Expandir `municipiosPrincipais` em `regioes.ts` (prioridade: próxima sessão)
2. Atualizar PIB per capita quando 2022/2023 disponíveis (prioridade: futuro)
3. Adicionar campo de microrregião (prioridade: futuro)
4. Validar classificação regional com especialista (prioridade: próxima sessão)
