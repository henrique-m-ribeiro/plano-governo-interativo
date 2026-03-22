# Handoff Cowork → Claude Code — Etapa I-3c: Complemento de Indicadores + Operacional

> Data: 2026-03-22
> Precedência: I-3b (branch `claude/generate-timeseries-jsons-lJeTm`, 5 commits, 54 indicadores)

## Escopo

Esta sessão tem 3 objetivos, em ordem de prioridade:

1. **Merge do branch I-3b** — `claude/generate-timeseries-jsons-lJeTm` → `main`
2. **Complementar indicadores nos JSONs** — adicionar ~6 indicadores que estão disponíveis nos CSVs mas não foram extraídos na I-3b (prioridade ALTA da reconciliação)
3. **Copiar GeoJSON** para o local correto no repo

### O que NÃO fazer

- Não alterar a estrutura dos JSONs existentes (o schema está validado)
- Não tocar em `municipios.ts` nem `regioes.ts` (serão tratados na I-4)
- Não instalar dependências novas
- Não alterar o build/deploy

## Repositório e Branch

- **Repo:** `plano-governo-interativo`
- **Branch base:** `main` (após merge do I-3b)
- **Nova branch:** criar `claude/i3c-complemento-indicadores` a partir de main pós-merge

## Tarefas Detalhadas

### Tarefa 1: Merge do branch I-3b (FAZER PRIMEIRO)

```bash
git checkout main
git pull origin main
git merge origin/claude/generate-timeseries-jsons-lJeTm --no-ff -m "Merge I-3b: 10 JSONs por eixo com séries temporais (54 indicadores)"
git push origin main
```

**Verificação:** `src/data/indicadores/eixo-01.json` até `eixo-10.json` presentes em main.

### Tarefa 2: Complementar indicadores no Eixo 2 (Educação)

O CSV `data/pipeline/basedosdados/csv/educacao/ideb_municipio_bd.csv` contém dados que não foram extraídos na I-3b:

| Indicador a adicionar | Coluna no CSV | Filtro | Descrição |
|---|---|---|---|
| `ideb_anos_finais` | `ideb` | `ensino == "fundamental"` AND `rede == "municipal"` AND filtrar por anos_finais* | IDEB dos anos finais do ensino fundamental |
| `nota_saeb_matematica` | `nota_saeb_matematica` | mesmo filtro do ideb_anos_iniciais | Nota SAEB em matemática |
| `nota_saeb_lingua_portuguesa` | `nota_saeb_lingua_portuguesa` | mesmo filtro do ideb_anos_iniciais | Nota SAEB em língua portuguesa |

**Atenção sobre anos iniciais vs finais:** O CSV tem `ensino=fundamental` para ambos. A distinção entre anos iniciais e finais é dada pelo próprio dado — o IDEB é calculado separadamente para 5º ano (anos iniciais) e 9º ano (anos finais). Verificar a coluna `ensino` e/ou os padrões de dados para fazer a separação correta. Se não for possível separar com certeza, gerar apenas `nota_saeb_matematica` e `nota_saeb_lingua_portuguesa` (que são colunas diretas no CSV).

**Formato:** Seguir o mesmo schema dos indicadores existentes no `eixo-02.json`. Adicionar ao array `indicadores[]` sem remover os existentes. Atualizar `metadados.total_indicadores`.

### Tarefa 3: Complementar indicadores de Saúde (Eixo 3)

Adicionar até 3 indicadores de CSVs não processados na I-3b:

| Indicador | CSV fonte | Observação |
|---|---|---|
| `acidentes_animais_peconhentos` | `data/pipeline/geoportal-seplan/csv/saude/acidentes_com_animais_peconhentos.csv` | Formato largo. Indicador relevante para saúde ambiental no Tocantins |
| `casos_leishmaniose` | `data/pipeline/geoportal-seplan/csv/saude/leishmaniose_visceral.csv` | Formato largo. Endemia relevante |
| `obitos_por_causa` | `data/pipeline/geoportal-seplan/csv/saude/obitos_por_causa_morte_2009_2010_2013_2014_2015.csv` | Formato largo. Desagregação útil |

**Regra:** Se algum CSV tiver problemas de encoding ou formato que impeçam a extração, pular esse indicador e documentar o motivo. Não bloquear a sessão.

### Tarefa 4: Copiar GeoJSON

```bash
# Criar diretório alvo
mkdir -p data/pipeline/geoportal-seplan/geojson/

# Baixar do GitHub (doutorado não está acessível localmente)
curl -L "https://raw.githubusercontent.com/henrique-m-ribeiro/doutorado/main/06-dados/geojson/tocantins-municipios.geojson" \
  -o data/pipeline/geoportal-seplan/geojson/municipios_tocantins.geojson
```

**Verificação:**
- Arquivo presente em `data/pipeline/geoportal-seplan/geojson/municipios_tocantins.geojson`
- 139 features no GeoJSON
- Propriedade `codarea` com strings de 7 dígitos

Se o curl falhar (repo privado), criar um placeholder `municipios_tocantins.geojson` com uma nota explicando que o arquivo deve ser copiado manualmente, e documentar no briefing de saída.

## Decisões de Design Já Tomadas

- Schema dos JSONs: OBRIGATÓRIO conforme `src/data/indicadores/README.md` (ADR-013)
- Chaves de `serie_temporal`: strings de cod_ibge de 7 dígitos
- Sem nulls em `serie_temporal` (esparso, não denso)
- 3 grafias já corrigidas em `municipios.ts` (Couto de Magalhães, Pau d'Arco, São Valério da Natividade)

## Checklist de Entrega

- [ ] Branch I-3b mergeada em main
- [ ] 10 JSONs presentes em main (pós-merge)
- [ ] Novos indicadores adicionados ao(s) JSON(s) relevante(s)
- [ ] `metadados.total_indicadores` atualizado em cada JSON modificado
- [ ] GeoJSON copiado para `data/pipeline/geoportal-seplan/geojson/`
- [ ] Commit(s) com mensagens descritivas
- [ ] Push para origin

## Permissões

- Pode propor melhorias além do escopo? **Sim**, mas registrar em `propostas-melhoria-i3c.md`
- Pode reorganizar indicadores existentes? **Não** — apenas adicionar
- Pode criar novos indicadores não listados acima? **Sim**, se encontrar dados relevantes nos CSVs durante a execução. Documentar no briefing de saída.

## Briefing de Saída Obrigatório

Ao concluir, produzir resumo com:
1. O que foi feito (itens numerados)
2. Arquivos criados/modificados (caminhos)
3. Contagem final de indicadores por eixo modificado
4. Status do GeoJSON
5. Problemas encontrados (se houver)
