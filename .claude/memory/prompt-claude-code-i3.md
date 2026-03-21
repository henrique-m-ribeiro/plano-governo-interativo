# Prompt para Claude Code — Etapa I-3: Consolidação CSV → JSON por Eixo

Cole este texto ao abrir o Claude Code no repositório `plano-governo-interativo`:

---

Estou executando a Etapa I-3 do plano de incorporação do MVP (Plano de Governo Interativo).

**Antes de qualquer coisa, leia estes 3 arquivos na ordem:**

1. `.claude/memory/handoff-cowork-para-claude-code-i3.md` — escopo, checklist e decisões
2. `.claude/memory/briefing-fase-i-etapa-3.md` — mapeamento completo CSV→Eixo, schema JSON, problemas técnicos

**Resumo da tarefa (3 passos):**

**Passo 0 — Copiar dados:** Copiar os CSVs de `../doutorado/06-dados/` para `data/pipeline/` neste repo. Se `../doutorado/` não estiver acessível, clonar de `https://github.com/henrique-m-ribeiro/doutorado.git`.

**Passo 1 — Script de consolidação:** Criar `scripts/consolidar_csvs_para_json.py` que lê os 91 CSVs municipais de `data/pipeline/` e gera 10 JSONs em `src/data/indicadores/`.

**Passo 2 — Gerar e validar:** Executar o script, verificar output, gerar README.md, commit + push.

**Decisões já tomadas (Cowork):**
- Agropecuária: ~8 indicadores agregados (não 1 por cultura)
- Segurança: incluir `contexto_estadual` com séries TO do FBSP/SINESP
- Normalização: tudo no script I-3 (formato largo/longo, variações de cod_ibge)
- Dados ficam neste repo (não no doutorado) — decisão arquitetural

**Referências locais:**
- Tabela mestra: `src/data/municipios_referencia.json` (139 municípios com cod_ibge)
- Inventário: `data/pipeline/inventario-csvs-pipeline.json` (após cópia)

**Pós-execução:**
- Gerar `src/data/indicadores/README.md` com documentação do schema
- Imprimir resumo de validação (indicadores por eixo, municípios cobertos, alertas)
- Commit e push
- Produzir briefing de saída para retornar ao Cowork

Apresente seu plano de execução antes de começar. Não execute sem minha confirmação.
