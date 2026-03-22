# Prompt para Claude Code — Etapa I-3c

Colar este texto no Claude Code para iniciar a sessão.

---

## Prompt

Preciso que você execute a Etapa I-3c do plano de incorporação do MVP. Esta é uma sessão de complemento e operacional, com 3 tarefas.

**Antes de executar qualquer coisa**, leia estes dois arquivos:

1. `.claude/memory/handoff-cowork-para-claude-code-i3c.md` — instruções de execução, escopo e checklist
2. `.claude/memory/briefing-i3c.md` — detalhes técnicos dos CSVs, schemas e formatos

**Contexto:** Na I-3b, geramos 10 JSONs por eixo com 54 indicadores e 74.479 datapoints. Uma reconciliação feita no Cowork identificou que 3 indicadores de prioridade ALTA (notas SAEB + IDEB ensino médio) e 3 de prioridade MÉDIA (saúde) podem ser adicionados usando CSVs já disponíveis no pipeline. Além disso, o GeoJSON precisa ser copiado e o branch I-3b precisa ser mergeado.

**Sequência obrigatória:**
1. Merge do branch `claude/generate-timeseries-jsons-lJeTm` em main
2. Criar nova branch, adicionar indicadores nos JSONs existentes
3. Copiar GeoJSON
4. Commit e push

Confirme o plano antes de executar. Pode fazer commits incrementais.
