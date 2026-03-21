# Handoff Cowork → Claude Code — Fase I, Etapa I-2 (Tabela Mestra de Municípios)

> Preparado em: Cowork (📋), 2026-03-20
> Destino: Claude Code (🔧), repositório `plano-governo-interativo`
> Protocolo: ADR-010 (Governança de Ambientes)

---

## 1. O que você vai fazer

Executar a **Etapa I-2** da Fase I (Dados Fundacionais): criar a tabela mestra dos 139 municípios do Tocantins, que será a base de dados de referência do aplicativo.

- **Input:** CSVs do repo irmão `../doutorado/06-dados/` + GeoJSON + `regioes.ts` deste repo
- **Output:** `src/data/municipios_referencia.json`
- **Script auxiliar:** `scripts/gerar_municipios_referencia.py`

**Contexto:** A Etapa I-1 (inventário de CSVs) foi/será executada no repositório `doutorado`. Este repositório (`plano-governo-interativo`) é o aplicativo web que consumirá os dados. A tabela mestra é infraestrutura do app, por isso é gerada aqui.

---

## 2. Pré-requisito

A Etapa I-1 deve ter sido executada no repo `doutorado` antes desta. Verifique:

```bash
ls ../doutorado/06-dados/inventario-csvs-pipeline.json
```

Se o arquivo existir, use-o como referência auxiliar (lista de CSVs por eixo, encoding encontrado, etc.). Se não existir, prossiga sem ele — as fontes de entrada abaixo são suficientes.

---

## 3. Fontes de entrada

### Dados no repo irmão (`../doutorado/06-dados/`)

| Fonte | Caminho | O que extrair |
|-------|---------|---------------|
| Censo 2022 | `../doutorado/06-dados/basedosdados/csv/demografia/censo_2022_populacao.csv` | cod_ibge, nome, populacao_2022 |
| PIB Municipal | `../doutorado/06-dados/basedosdados/csv/economia/pib_municipal_ibge.csv` | pib_percapita (ano mais recente) |
| GeoJSON | `../doutorado/06-dados/geojson/tocantins-municipios.geojson` | codarea (validação dos 139), centroide |

### Dados neste repo

| Fonte | Caminho | O que extrair |
|-------|---------|---------------|
| Regiões MVP | `src/data/regioes.ts` | Mapeamento município→região de planejamento |

**Sobre `regioes.ts`:** Este arquivo define 6 regiões de planejamento, cada uma com `municipiosPrincipais` (lista de nomes como strings). Use como fonte para atribuir `regiao` a cada município. Os municípios que não aparecem em nenhuma `municipiosPrincipais` podem ser inferidos pela proximidade geográfica do centroide ao centroide médio de cada região.

### Informações sobre os CSVs

- **Encoding:** UTF-8 BOM (utf-8-sig) — padrão dos CSVs do pipeline
- **Separador:** vírgula (,) para ambas as camadas (confirmado pela Etapa I-1 — nenhum ponto-e-vírgula encontrado)
- **Coluna de município:** `cod_ibge` (7 dígitos, todos começam com 17)
  - **Exceção:** 3 CSVs do geoportal usam `cod_ibge_1` em vez de `cod_ibge` (achado da Etapa I-1)
  - CSVs de mineração (CFEM): usam `nome_ente` / `codigo_ente` — não são fonte primária para I-2

### Achados da Etapa I-1 (relevantes para I-2)

A Etapa I-1 (inventário) já foi concluída no repo `doutorado`. Principais achados:
- **91 CSVs municipais** (não 89 como estimado), 6 estaduais, 1 metadados
- **86 CSVs** com exatamente 139 municípios únicos
- O inventário completo está em `../doutorado/06-dados/inventario-csvs-pipeline.json` — use como referência

---

## 4. Saída esperada

### Arquivo: `src/data/municipios_referencia.json`

```json
{
  "gerado_em": "2026-03-20T...",
  "total": 139,
  "fonte_principal": "Censo 2022 (IBGE)",
  "municipios": [
    {
      "cod_ibge": 1700251,
      "nome": "Abreulândia",
      "regiao": "central",
      "macrorregional": "centro",
      "populacao_2022": 2540,
      "pib_percapita": 25430.50,
      "centroide": [-49.309, -9.481]
    }
  ]
}
```

**Campos obrigatórios por município:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `cod_ibge` | number | Código IBGE de 7 dígitos (17XXXXX) |
| `nome` | string | Nome oficial com acentos |
| `regiao` | string | Slug da regional de planejamento SEPLAN (uma das 8: bico-do-papagaio, norte, meio-norte, vale-do-araguaia, central, jalapao, sul, sudeste) |
| `macrorregional` | string | Macrorregional SEPLAN (norte, centro, sul) |
| `populacao_2022` | number | População do Censo 2022 |
| `pib_percapita` | number | PIB per capita mais recente (R$) |
| `centroide` | [number, number] | [longitude, latitude] do GeoJSON |

### Script auxiliar: `scripts/gerar_municipios_referencia.py`

Criar na raiz `scripts/` deste repo (criar a pasta se não existir). O script deve:
- Ler as 3 fontes de dados do repo irmão (Censo, PIB, GeoJSON)
- Ler o JSON oficial de regiões SEPLAN: `../doutorado/06-dados/regioes_planejamento_seplan_2024.json`
- **NÃO usar `regioes.ts`** para mapeamento — usar a fonte SEPLAN (ADR-011)
- Cruzar por nome de município (normalizar acentos/casing para match)
- Gerar o JSON de saída com campo `regiao` (regional SEPLAN) e `macrorregional`
- Ser idempotente (rodar N vezes, mesmo resultado)
- Normalizar grafias: "Pau d'Arco" (não "Pau D'Arco"), "São Valério da Natividade" (não "São Valério"), "Couto de Magalhães" (não "Couto Magalhães")

---

## 5. Mapeamento de regiões de planejamento (ADR-011)

**FONTE OFICIAL:** O mapeamento dos 139 municípios está no arquivo JSON:
```
../doutorado/06-dados/regioes_planejamento_seplan_2024.json
```

Este arquivo foi extraído do documento oficial "Regiões de Planejamento do Estado do Tocantins" (SEPLAN/SPG, 2024). Contém 8 regionais agrupadas em 3 macrorregionais:

| Macrorregional | Regional (slug) | Regional (nome) | Municípios |
|---|---|---|---|
| norte | `bico-do-papagaio` | Bico do Papagaio | 25 |
| norte | `norte` | Norte | 15 |
| norte | `meio-norte` | Meio Norte | 25 |
| centro | `vale-do-araguaia` | Vale do Araguaia | 15 |
| centro | `central` | Central | 14 |
| centro | `jalapao` | Jalapão | 9 |
| sul | `sul` | Sul | 17 |
| sul | `sudeste` | Sudeste | 19 |

**IMPORTANTE:** NÃO usar `regioes.ts` para mapeamento. O `regioes.ts` atual tem 6 regiões arbitrárias (incluindo "oeste" que não existe oficialmente) e será reescrito em etapa posterior.

**Estratégia de mapeamento:**
1. Ler `regioes_planejamento_seplan_2024.json` do repo irmão
2. Fazer match por nome de município (normalizar acentos e casing)
3. Atribuir `regiao` (slug da regional) e `macrorregional` (norte/centro/sul)
4. Todos os 139 municípios devem ter match direto — sem inferência por centroide
5. Documentar os 3 casos de divergência de grafia (Pau d'Arco, São Valério da Natividade, Couto de Magalhães)

**Se o JSON SEPLAN não estiver acessível** (arquivo não encontrado em `../doutorado/`), baixe de:
```
https://raw.githubusercontent.com/henrique-m-ribeiro/doutorado/main/06-dados/regioes_planejamento_seplan_2024.json
```

---

## 6. Regras de execução

### 6.1. Qualidade de código
- Comentários em **português** (conforme CLAUDE.md do projeto)
- Tratamento de erros robusto
- Script **idempotente**
- Usar `utf-8-sig` como encoding de leitura
- Print de progresso no terminal

### 6.2. Verificação obrigatória
Após gerar o JSON, executar automaticamente:
- Contar municípios, verificar = 139
- Verificar sem duplicatas de cod_ibge
- Verificar que todos os cod_ibge são 17XXXXX (7 dígitos)
- Verificar que todos os campos obrigatórios são não-nulos
- Cruzar cod_ibge com GeoJSON: deve dar 139 matches
- Reportar resultado no terminal E no briefing de saída

---

## 7. Permissão para propor melhorias

Mesmas regras do handoff I-1. Salvar propostas em:
```
.claude/memory/propostas-melhorias-fase-i.md
```

Formato:
```markdown
## Proposta: [título curto]
**Contexto:** O que você observou durante a execução
**Sugestão:** O que poderia ser melhorado
**Impacto:** Benefício esperado
**Esforço:** Baixo / Médio / Alto
**Prioridade sugerida:** Agora / Próxima sessão / Futuro
```

**IMPORTANTE:** As propostas serão avaliadas no Cowork antes de implementação.

---

## 8. Briefing de saída (obrigatório)

Ao concluir, criar/atualizar `.claude/memory/today.md` com:

1. **O que foi feito:** Etapa I-2 executada, com resultado
2. **Decisões técnicas:** Como mapeou regiões, quantos por método, encoding encontrado
3. **Problemas encontrados:** Municípios sem match, dados faltantes
4. **Arquivos criados/modificados:** Lista completa com caminhos
5. **Resultado da verificação:** Checklist preenchido (✅ ou ❌)
6. **Propostas de melhoria:** Referência ao arquivo de propostas

---

## 9. O que NÃO fazer

- ❌ Não alterar arquivos no repositório `doutorado` (apenas ler)
- ❌ Não fazer git push (o usuário fará via GitHub Desktop)
- ❌ Não modificar `src/data/municipios.ts` ou `src/data/regioes.ts` (isso será feito em etapa posterior)
- ❌ Não implementar etapas I-3 a I-6 (ainda não foram briefadas)
- ❌ Não criar branches — trabalhar na branch atual

---

## 10. Checklist de entrega

### Arquivos criados
- [ ] `scripts/gerar_municipios_referencia.py` — criado e funcional
- [ ] `src/data/municipios_referencia.json` — gerado
- [ ] `.claude/memory/propostas-melhorias-fase-i.md` — criado (mesmo se vazio)
- [ ] `.claude/memory/today.md` — criado com briefing de saída

### Validação de dados
- [ ] Exatamente 139 registros no array `municipios`
- [ ] Todos com `cod_ibge` de 7 dígitos (17XXXXX)
- [ ] Todos com `nome` não-vazio
- [ ] Todos com `regiao` não-vazia (uma das 8 regionais SEPLAN)
- [ ] Todos com `macrorregional` não-vazia (norte, centro ou sul)
- [ ] Todos com `populacao_2022` > 0
- [ ] Todos com `pib_percapita` > 0
- [ ] Todos com `centroide` [lon, lat] válido
- [ ] Sem duplicatas de `cod_ibge`
- [ ] `cod_ibge` cruzado com GeoJSON: 139 matches
- [ ] Terminal limpo, sem erros pendentes

---

## 11. Contexto adicional

| Item | Valor |
|------|-------|
| Municípios TO | 139 (todos cod_ibge 17XXXXX) |
| Regionais SEPLAN | 8 (bico-do-papagaio, norte, meio-norte, vale-do-araguaia, central, jalapao, sul, sudeste) |
| Macrorregionais | 3 (norte=65 mun, centro=38 mun, sul=36 mun) |
| Ref. regiões | `../doutorado/06-dados/regioes_planejamento_seplan_2024.json` (ADR-011) |
| Repo de dados | `../doutorado/06-dados/` (repo irmão) |
| GeoJSON | `../doutorado/06-dados/geojson/tocantins-municipios.geojson` (139 features, prop `codarea`) |
| Encoding padrão | UTF-8 BOM (utf-8-sig) |
| Chave primária | cod_ibge (7 dígitos) |
| App Stack | Next.js 16 + TypeScript + Tailwind CSS 4 |

---

*Este documento foi preparado pelo ambiente Cowork (📋) seguindo o protocolo ADR-010.*
