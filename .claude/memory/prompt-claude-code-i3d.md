# Prompt para Claude Code — Etapa I-3d

Colar este texto no Claude Code para iniciar a sessão.

---

## Prompt

Preciso que você execute a Etapa I-3d do plano de incorporação do MVP. Esta é uma sessão de **realinhamento dos eixos temáticos 9 e 10**.

**Antes de executar qualquer coisa**, leia este arquivo:

1. `.claude/memory/handoff-cowork-para-claude-code-i3d.md` — plano completo de redistribuição, escopo e checklist

**Contexto resumido:** Os eixos 9 e 10 dos JSONs de indicadores foram gerados com nomes divergentes do memo oficial apresentado à Senadora. O memo define eixo 9 como "Mineração Sustentável" e eixo 10 como "Industrialização e Atração de Investimentos". Os JSONs usam "Economia e Emprego" e "Cultura, Esporte e Juventude". O frontend (`eixos.ts`) já está correto. Precisamos realinhar os JSONs, redistribuindo os indicadores existentes para os eixos corretos e adicionando 1 novo indicador (CFEM distribuição).

**O que fazer:**
1. Criar branch `claude/i3d-realinhamento-eixos`
2. Redistribuir os 8 indicadores existentes dos eixos 9/10 para eixos 1, 8, 9, 10 conforme o plano
3. Extrair novo indicador `cfem_distribuicao` do CSV de mineração
4. Substituir `taxa_urbanizacao` no eixo 1 pela versão mais completa `taxa_urbanizacao_censo`
5. Reescrever os 4 JSONs modificados (eixo-01, eixo-08, eixo-09, eixo-10)
6. Verificar que total = 61 indicadores (60 existentes + 1 novo, nenhum perdido)
7. Commit e push

**Contagem esperada:** Eixo 1→7, Eixo 2→11, Eixo 3→11, Eixo 4→4, Eixo 5→4, Eixo 6→4, Eixo 7→6, Eixo 8→9, Eixo 9→2, Eixo 10→2. Total=61.

Confirme o plano antes de executar.
