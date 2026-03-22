# Handoff Cowork → Claude Code — Etapa I-3d: Realinhamento dos Eixos 9 e 10

> Data: 2026-03-22
> Precedência: I-3c (branch `claude/i3c-complemento-indicadores`, 60 indicadores, tudo mergeado em main)

## Contexto

Os 10 eixos temáticos do plano de governo foram definidos no memo-v4 apresentado à Senadora. O frontend (`eixos.ts`) segue corretamente o memo. Porém, os JSONs de indicadores (`eixo-09.json` e `eixo-10.json`) foram gerados com categorização diferente, herdada do inventário I-1:

| Eixo | Memo v4 (REFERÊNCIA) | JSON atual (DIVERGENTE) |
|------|---------------------|------------------------|
| 9 | **Mineração Sustentável** | "Economia e Emprego" |
| 10 | **Industrialização e Atração de Investimentos** | "Cultura, Esporte e Juventude" |

**Decisão:** O memo v4 é a referência autoritativa. Os JSONs devem ser realinhados.

## Escopo

Esta sessão tem 1 objetivo principal: **reorganizar os indicadores dos eixos 9 e 10 para alinhar com o memo v4**, redistribuindo indicadores que não pertencem a esses eixos para eixos mais adequados.

### O que NÃO fazer

- Não alterar indicadores dos eixos 1 a 8 que já estão corretamente mapeados (exceto receber indicadores redistribuídos)
- Não alterar `eixos.ts` (já está correto)
- Não alterar `municipios.ts` nem `regioes.ts`
- Não instalar dependências novas
- Não alterar o build/deploy
- Não remover nenhum indicador — TODOS devem ser preservados, apenas redistribuídos

## Repositório e Branch

- **Repo:** `plano-governo-interativo`
- **Branch base:** `main`
- **Nova branch:** criar `claude/i3d-realinhamento-eixos` a partir de main

## Plano de Redistribuição

### Eixo 9 atual → desmembrar

O eixo 9 atual ("Economia e Emprego") tem 6 indicadores que devem ser redistribuídos:

| Indicador | ID | Destino | Justificativa |
|---|---|---|---|
| Arrecadação CFEM | `cfem_arrecadacao` | **Eixo 9 — Mineração Sustentável** | Indicador central de atividade mineral |
| Valor adicionado — Indústria | `va_industria` | **Eixo 10 — Industrialização** | Indicador direto de atividade industrial |
| Emprego formal total | `emprego_formal_total` | **Eixo 10 — Industrialização** | Proxy de dinamismo industrial e atração de investimentos |
| PIB municipal | `pib_total` | **Eixo 1 — Desenvolvimento Regional** | Indicador transversal de desenvolvimento |
| Valor adicionado — Agropecuária | `va_agropecuaria` | **Eixo 8 — Agropecuária** | Pertence ao eixo agropecuário |
| Valor adicionado — Serviços | `va_servicos` | **Eixo 1 — Desenvolvimento Regional** | Diversificação econômica regional |

### Eixo 10 atual → desmembrar

O eixo 10 atual ("Cultura, Esporte e Juventude") tem 2 indicadores:

| Indicador | ID | Destino | Justificativa |
|---|---|---|---|
| População censitária | `populacao_censitaria` | **Eixo 1 — Desenvolvimento Regional** | Indicador demográfico fundamental |
| Taxa de urbanização (censos) | `taxa_urbanizacao_censo` | **Eixo 1 — Desenvolvimento Regional** | Substituir `taxa_urbanizacao` existente (versão censos tem 2000+2010, mais completa que a versão só-2010) |

### Novo Eixo 9 — Mineração Sustentável

Após redistribuição, o eixo 9 terá:

| ID | Nome | Origem |
|---|---|---|
| `cfem_arrecadacao` | Arrecadação CFEM | Vem do antigo eixo 9 |
| `cfem_distribuicao` | **NOVO** — Distribuição CFEM por município | Extrair de `data/pipeline/basedosdados/csv/mineracao/cfem_distribuicao_to.csv` |

**Metadados do novo eixo 9:**
```json
{
  "eixo": "Mineração Sustentável",
  "slug": "mineracao",
  "numero": 9,
  "contexto_estadual": "O Tocantins possui potencial mineral significativo, com destaque para calcário, areia, argila e ouro. A CFEM (Compensação Financeira pela Exploração Mineral) é um indicador-chave da atividade mineral e sua distribuição nos municípios.",
  "metadados": {
    "total_indicadores": 2,
    "fontes_utilizadas": ["basedosdados/csv/mineracao/cfem_arrecadacao_to.csv", "basedosdados/csv/mineracao/cfem_distribuicao_to.csv"]
  }
}
```

### Novo Eixo 10 — Industrialização e Atração de Investimentos

Após redistribuição, o eixo 10 terá:

| ID | Nome | Origem |
|---|---|---|
| `va_industria` | Valor adicionado — Indústria | Vem do antigo eixo 9 |
| `emprego_formal_total` | Emprego formal total | Vem do antigo eixo 9 |

**Metadados do novo eixo 10:**
```json
{
  "eixo": "Industrialização e Atração de Investimentos",
  "slug": "industrializacao",
  "numero": 10,
  "contexto_estadual": "O Tocantins busca diversificar sua base econômica para além da agropecuária, atraindo indústrias e gerando empregos formais que fixem a população no estado.",
  "metadados": {
    "total_indicadores": 2,
    "fontes_utilizadas": ["basedosdados/csv/economia/pib_municipal_setorial_bd.csv", "basedosdados/csv/emprego/rais_emprego_setor_bd.csv"]
  }
}
```

### Eixo 1 — Recebe 4 indicadores

O eixo 1 (Desenvolvimento Regional) passará de 4 para 7 indicadores (ou 6, se `taxa_urbanizacao` for substituída):

| Indicador | Ação |
|---|---|
| `pib_total` | Adicionar (vem do antigo eixo 9) |
| `va_servicos` | Adicionar (vem do antigo eixo 9) |
| `populacao_censitaria` | Adicionar (vem do antigo eixo 10) |
| `taxa_urbanizacao` | **SUBSTITUIR** pela versão mais completa `taxa_urbanizacao_censo` (que tem 2000+2010 vs só 2010) |

**Resultado eixo 1:** `populacao`, `pib_percapita`, `taxa_urbanizacao` (atualizado com série 2000-2010), `crescimento_demografico`, `pib_total`, `va_servicos`, `populacao_censitaria` → **7 indicadores**

### Eixo 8 — Recebe 1 indicador

| Indicador | Ação |
|---|---|
| `va_agropecuaria` | Adicionar (vem do antigo eixo 9) |

**Resultado eixo 8:** 8 existentes + `va_agropecuaria` → **9 indicadores**

## Novo indicador: CFEM Distribuição

### Fonte
`data/pipeline/basedosdados/csv/mineracao/cfem_distribuicao_to.csv`

### Estrutura do CSV
```
numero_distribuicao,ano,mes,ente,sigla_estado,codigo_ente,nome_ente,tipo_distribuicao,substancia,tipo_afetamento,valor,data_criacao
```

### Tratamento
```python
# Pseudocódigo
df = pd.read_csv(csv_path, encoding="utf-8-sig")
# Filtrar: tipo_distribuicao == "Produtor" (distribuição ao município produtor)
# Agregar: somar valor por codigo_ente e ano
# codigo_ente: normalizar para string de 7 dígitos (cod_ibge)
# Atenção: codigo_ente pode ter .0 (float) — converter para int primeiro
```

### Schema do indicador
```json
{
  "id": "cfem_distribuicao",
  "nome": "Distribuição CFEM por município",
  "unidade": "R$",
  "fonte": "ANM/CFEM",
  "descricao": "Valor total da CFEM distribuída ao município como ente produtor, agregado anualmente",
  "ano_inicio": 2007,
  "ano_fim": 2026,
  "cobertura_municipios": "<calcular>",
  "serie_temporal": { ... }
}
```

## Sequência de Execução

1. Criar nova branch `claude/i3d-realinhamento-eixos`
2. Ler os 4 JSONs que serão modificados: `eixo-01.json`, `eixo-08.json`, `eixo-09.json`, `eixo-10.json`
3. Extrair `cfem_distribuicao` do CSV de distribuição
4. Redistribuir indicadores conforme o plano acima
5. Reescrever os 4 JSONs com metadados atualizados
6. Verificar: total de indicadores deve ser 60 + 1 (novo cfem_distribuicao) = **61** (nenhum indicador perdido)
7. Commit e push

## Checklist de Verificação

- [ ] Nenhum indicador perdido (soma dos indicadores de todos os 10 eixos = 61)
- [ ] Slugs e nomes dos eixos 9 e 10 alinhados com `eixos.ts`
- [ ] `metadados.total_indicadores` atualizado em cada JSON modificado
- [ ] Novo indicador `cfem_distribuicao` segue o schema (sem nulls, chaves de 7 dígitos)
- [ ] `taxa_urbanizacao` no eixo 1 atualizada com série 2000-2010
- [ ] Eixos 2-7 intocados (0 modificações)
- [ ] Commit com mensagem descritiva
- [ ] Push para origin

## Contagem esperada pós-realinhamento

| Eixo | Indicadores antes | Indicadores depois |
|------|------------------|--------------------|
| 1 Desenvolvimento Regional | 4 | **7** (+3 recebidos, taxa_urbanizacao substituída) |
| 2 Educação | 11 | 11 (sem alteração) |
| 3 Saúde | 11 | 11 (sem alteração) |
| 4 Infraestrutura | 4 | 4 (sem alteração) |
| 5 Meio Ambiente | 4 | 4 (sem alteração) |
| 6 Segurança | 4 | 4 (sem alteração) |
| 7 Gestão Pública | 6 | 6 (sem alteração) |
| 8 Agropecuária | 8 | **9** (+1 va_agropecuaria) |
| 9 Mineração Sustentável | 6 (Economia) | **2** (cfem_arrecadacao + cfem_distribuicao) |
| 10 Industrialização | 2 (Cultura) | **2** (va_industria + emprego_formal_total) |
| **TOTAL** | **60** | **61** (+1 novo cfem_distribuicao, -1 duplicata taxa_urbanizacao absorvida) |

**Nota sobre a contagem:** Dos 8 indicadores redistribuídos (6 do eixo 9 + 2 do eixo 10), todos são preservados. O `taxa_urbanizacao_censo` substitui o `taxa_urbanizacao` existente no eixo 1 (mesmo dado, versão mais completa), resultando em net +1 por duplicata absorvida. Mais 1 novo indicador (`cfem_distribuicao`). Total: 60 - 1 (duplicata) + 1 (novo) + 1 (cfem_distribuicao novo) = 61.

Ah, vou refazer a contagem com cuidado:
- Eixos 1-8 antes: 4+11+11+4+4+4+6+8 = 52
- Eixos 9-10 antes: 6+2 = 8
- Total antes: 60

Após redistribuição:
- Eixo 1: 4 existentes + pib_total + va_servicos + populacao_censitaria + (taxa_urbanizacao_censo substitui taxa_urbanizacao) = 7
- Eixo 8: 8 + va_agropecuaria = 9
- Eixo 9 novo: cfem_arrecadacao + cfem_distribuicao (NOVO) = 2
- Eixo 10 novo: va_industria + emprego_formal_total = 2
- Eixos 2-7: 11+11+4+4+4+6 = 40

Total: 7 + 40 + 9 + 2 + 2 = 60 + 1 (novo cfem_distribuicao) = **61** ✓

## Permissões

- Pode propor melhorias além do escopo? **Sim**, mas registrar em `propostas-melhoria-i3d.md`
- Pode reorganizar indicadores existentes? **Somente conforme o plano acima**
- Pode criar novos indicadores não listados? **Não** — apenas `cfem_distribuicao`
- Pode modificar eixos 2-7? **Não**

## Briefing de Saída Obrigatório

Ao concluir, produzir resumo com:
1. O que foi feito (itens numerados)
2. Arquivos modificados (caminhos)
3. Contagem final de indicadores por eixo (todos os 10)
4. Verificação: nenhum indicador perdido
5. Problemas encontrados (se houver)
