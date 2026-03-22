# Prompt para Claude Code — Etapas I-4/I-5/I-6 (Fase I Final)

Colar este texto no Claude Code para iniciar a sessão.

---

## Prompt

Preciso que você execute as 3 etapas finais da Fase I do plano de incorporação do MVP. Estas etapas completam a substituição de dados placeholder por dados reais em toda a plataforma.

**Antes de executar qualquer coisa**, leia este arquivo:

1. `.claude/memory/handoff-cowork-para-claude-code-i456.md` — plano completo das 3 etapas

**Contexto resumido:**
- 10 JSONs com 60 indicadores reais já existem em `src/data/indicadores/`
- `municipios.ts` tem 139 municípios com indicadores inline redundantes
- `eixos.ts` tem `indicadoresChave` como strings genéricas, não conectados aos JSONs
- Mapa é um placeholder estático — Leaflet já está instalado, GeoJSON disponível
- `regioes.ts` já tem as 8 regionais SEPLAN corretas

**O que fazer (3 etapas, nesta ordem):**

1. **I-4 — Refinar municipios.ts:** Remover indicadores inline, simplificar interface, criar função `getIndicadoresMunicipio()` que lê dos JSONs
2. **I-5 — Conectar eixos.ts aos JSONs:** Atualizar `indicadoresChave` com IDs reais, criar `getIndicadoresEixo()`, atualizar páginas `/eixos/[slug]` e `/eixos` para mostrar dados reais
3. **I-6 — Mapa interativo:** Substituir `MapaPlaceholder` por `MapaTocantins` com Leaflet + GeoJSON, choropleth com 3 indicadores, tooltip/popup

**Verificação final:** `npm run build` sem erros. Todas as páginas renderizam dados reais.

Confirme o plano antes de executar.
