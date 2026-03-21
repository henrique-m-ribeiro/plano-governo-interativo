# Handoff Cowork → Claude Code — Etapa I-3: Consolidação CSV → JSON por Eixo

## Escopo

**O que fazer:**
1. Copiar os 98 CSVs + 1 GeoJSON + inventário do repo `doutorado` para `data/pipeline/` neste repo (plano-governo-interativo)
2. Criar script Python que lê os 91 CSVs municipais e produz 10 arquivos JSON, um por eixo temático
3. Cada JSON contém séries temporais municipais organizadas por indicador
4. Script deve lidar automaticamente com: formato largo (Geoportal) vs longo (basedosdados), nomes de coluna variáveis para cod_ibge, encoding UTF-8 BOM vs UTF-8
5. Gerar os 10 JSONs em `src/data/indicadores/`

**O que NÃO fazer:**
- Não modificar os CSVs originais no repo doutorado
- Não alterar `municipios_referencia.json`, `eixos.ts`, `municipios.ts` ou `regioes.ts` — isso é etapa futura (I-4)
- Não criar/modificar componentes React ou páginas
- Não fazer deploy

## Repositório e Branch

- **Repo:** `plano-governo-interativo`
- **Branch:** main (ou criar branch se preferir — registrar no briefing de saída)
- **Diretório de trabalho:** raiz do repo plano-governo-interativo

## Passo 0 — Copiar dados do repo doutorado

Os CSVs do pipeline estão no repo irmão `doutorado`. Copiar para este repo preservando a estrutura:

```
# Estrutura de origem (doutorado):
../doutorado/06-dados/basedosdados/csv/     → 30 CSVs
../doutorado/06-dados/geoportal-seplan/csv/  → 68 CSVs
../doutorado/06-dados/geoportal-seplan/geojson/ → 1 GeoJSON
../doutorado/06-dados/inventario-csvs-pipeline.json
../doutorado/06-dados/regioes_planejamento_seplan_2024.json

# Estrutura de destino (plano-governo-interativo):
data/pipeline/basedosdados/csv/        ← copiar de ../doutorado/06-dados/basedosdados/csv/
data/pipeline/geoportal-seplan/csv/    ← copiar de ../doutorado/06-dados/geoportal-seplan/csv/
data/pipeline/geoportal-seplan/geojson/ ← copiar de ../doutorado/06-dados/geoportal-seplan/geojson/
data/pipeline/inventario-csvs-pipeline.json
data/pipeline/regioes_planejamento_seplan_2024.json
```

**Fallback se `../doutorado/` não estiver acessível:** Clonar via `git clone https://github.com/henrique-m-ribeiro/doutorado.git /tmp/doutorado` e copiar de lá.

**Importante:** Adicionar `data/pipeline/` ao `.gitignore` se os CSVs forem muito grandes para o GitHub. Caso contrário, commitar normalmente. Usar bom senso — se o total for < 50MB, pode commitar. Registrar a decisão no briefing de saída.

## Arquivos de Entrada

### Referência obrigatória (após cópia)
- `data/pipeline/inventario-csvs-pipeline.json` — inventário completo dos 98 CSVs (I-1)
- `data/pipeline/regioes_planejamento_seplan_2024.json` — 8 regionais oficiais
- `src/data/municipios_referencia.json` — tabela mestra de 139 municípios (I-2)

### CSVs por eixo
- 91 CSVs municipais distribuídos em 10 eixos (ver briefing para mapeamento completo)
- 7 CSVs estaduais/metadados (excluir da consolidação, mas usar como contexto para Eixo 6)

## Arquivos de Saída Esperados

10 arquivos JSON em `src/data/indicadores/`:

| Arquivo | Eixo |
|---------|------|
| `eixo-01-desenvolvimento-regional.json` | Desenvolvimento Regional e Redução de Desigualdades |
| `eixo-02-educacao-capital-humano.json` | Educação e Capital Humano |
| `eixo-03-saude-qualidade-vida.json` | Saúde e Qualidade de Vida |
| `eixo-04-infraestrutura-conectividade.json` | Infraestrutura e Conectividade |
| `eixo-05-meio-ambiente-sustentabilidade.json` | Meio Ambiente e Sustentabilidade |
| `eixo-06-seguranca-publica.json` | Segurança Pública e Cidadania |
| `eixo-07-gestao-publica-inovacao.json` | Gestão Pública e Inovação |
| `eixo-08-agropecuaria.json` | Agropecuária e Desenvolvimento Rural |
| `eixo-09-economia-emprego.json` | Economia e Emprego |
| `eixo-10-cultura-esporte-juventude.json` | Cultura, Esporte e Juventude |

Mais:
- `src/data/indicadores/README.md` — documentação do schema e mapeamento
- Script salvo em `scripts/consolidar_csvs_para_json.py`

## Decisões de Design Já Tomadas

1. **Agropecuária: indicadores agregados** (decisão Cowork 2026-03-21) — Os 34 CSVs de agropecuária devem ser agregados em ~8 indicadores-chave: soja, milho, arroz, bovinos, produção de leite, aquicultura, área total plantada, diversidade produtiva. Não criar um indicador para cada cultura menor.

2. **Segurança: incluir contexto estadual** (decisão Cowork 2026-03-21) — Usar SIM/homicídios (139 mun.) como indicador principal municipal. Incluir seção `contexto_estadual` no JSON com séries TO do FBSP/SINESP. Municípios sem dados recebem null.

3. **Normalização no script I-3** (decisão Cowork 2026-03-21) — O script deve detectar automaticamente formato (largo/longo) e nome da coluna de município (cod_ibge, id_municipio, codigo_municipio, cod_ibge_1), normalizando antes de gerar os JSONs.

4. **8 regionais SEPLAN** (ADR-011) — usar classificação oficial de `regioes_planejamento_seplan_2024.json`

5. **cod_ibge como chave primária** — todos os dados devem ser indexados por cod_ibge (inteiro de 7 dígitos, prefixo 17)

6. **Dados no plano-governo-interativo** (decisão Cowork 2026-03-21) — CSVs e JSONs ficam neste repo. O doutorado mantém os originais como artefato de pesquisa, mas este repo é a fonte canônica para o app.

## Checklist de Entrega

- [ ] Diretório `data/pipeline/` criado com CSVs copiados do doutorado (98 CSVs + GeoJSON + referências)
- [ ] Script `scripts/consolidar_csvs_para_json.py` criado e funcional
- [ ] 10 arquivos JSON gerados em `src/data/indicadores/`
- [ ] Cada JSON segue o schema definido no briefing
- [ ] Total de indicadores ≥ 100 (soma dos 10 eixos)
- [ ] Todos os 139 municípios presentes em `cobertura_municipios` de cada JSON (com exceção justificada para eixos com dados parciais)
- [ ] Nenhum cod_ibge órfão (todos com prefixo 17, 7 dígitos)
- [ ] Nenhum JSON vazio
- [ ] README.md gerado com documentação do schema
- [ ] Commit + push realizados

## Permissões

- **Pode propor melhorias além do escopo?** Sim, registrar em `scripts/propostas-melhorias-i3.md`
- **Pode decidir detalhes de implementação?** Sim (nome de variáveis, organização interna do script, bibliotecas Python)
- **Pode decidir sobre .gitignore dos CSVs?** Sim (registrar decisão no briefing de saída)
- **Deve escolher quais colunas são indicadores em CSVs ambíguos?** Sim, com registro da decisão no README.md

## Briefing de Saída Obrigatório

Ao concluir, produzir resumo com:
1. O que foi feito (itens numerados)
2. Arquivos criados/modificados (caminhos)
3. Contagem: total de indicadores por eixo, total de municípios cobertos por eixo
4. Decisão sobre .gitignore dos CSVs (commitou ou não? por quê?)
5. Decisões tomadas durante execução (ex: quais colunas usou para cada indicador)
6. Problemas encontrados (se houver)
