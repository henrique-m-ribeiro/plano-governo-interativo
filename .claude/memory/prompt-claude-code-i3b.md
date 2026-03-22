# Prompt para Claude Code — Etapa I-3b: Gerar 10 JSONs por Eixo

Cole este texto ao abrir o Claude Code no repositório `plano-governo-interativo`:

---

Estou executando a Etapa I-3b — gerar os 10 JSONs por eixo com séries temporais que faltaram na I-3.

**Leia antes de fazer qualquer coisa:**
1. `.claude/memory/handoff-cowork-para-claude-code-i3b.md` — escopo, fases, schema, checklist
2. `.claude/memory/briefing-fase-i-etapa-3.md` — mapeamento CSV→Eixo detalhado

**O que aconteceu na I-3 (não repetir):**
Na sessão anterior, o escopo grande levou a uma simplificação: indicadores foram embutidos em `municipios.ts` com apenas o valor mais recente. Isso foi útil mas NÃO é o entregável principal. Agora preciso dos 10 JSONs com séries temporais completas.

**Como trabalhar:**
O handoff está dividido em **5 fases** (A→E) de complexidade crescente. Você pode e deve executar uma fase por vez, commitando após cada uma. Se o contexto ficar longo ou a sessão precisar terminar, entregue o que tiver pronto — o Cowork prepara continuação.

**As 5 fases:**
- **Fase A:** Infraestrutura (script esqueleto + correção grafias + GeoJSON)
- **Fase B:** 4 eixos simples (Infraestrutura, Meio Ambiente, Gestão Pública, Economia) — CSVs do basedosdados, formato longo
- **Fase C:** 3 eixos mistos (Desenv. Regional, Saúde, Segurança) — basedosdados + Geoportal
- **Fase D:** Educação (23 CSVs, divididos em 5 subgrupos)
- **Fase E:** Agropecuária (34 CSVs → 8 indicadores agregados) + Cultura (1 CSV)

**Referências locais:**
- CSVs: `data/pipeline/basedosdados/csv/` e `data/pipeline/geoportal-seplan/csv/`
- Tabela mestra: `src/data/municipios_referencia.json`
- Inventário: `data/pipeline/inventario-csvs-pipeline.json`

Comece pela Fase A. Apresente seu plano para cada fase antes de executar.
