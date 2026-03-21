# Prompt para Claude Code — Sessão 2 (v2): Etapa I-2 (Tabela Mestra de Municípios)

> Repositório: `plano-governo-interativo`
> Copie o texto abaixo (entre as linhas de código) e cole como primeiro prompt no Claude Code.
> NOTA: Este arquivo substitui `prompt-claude-code-fase-i.md` (que não pôde ser atualizado por bloqueio de permissão).

---

## Prompt de entrada

```
Estou iniciando uma sessão de execução preparada pelo Cowork (📋). Antes de qualquer ação, leia este arquivo:

1. `.claude/memory/handoff-cowork-para-claude-code.md` — instruções completas de handoff (fontes de dados, schema de saída, mapeamento de regiões SEPLAN, checklist de entrega)

Após ler, apresente-me um plano de execução resumido (5-8 itens) e peça confirmação antes de começar a codificar.

Contexto rápido: você vai RECRIAR 1 script Python e REGENERAR 1 JSON (tabela mestra dos 139 municípios do Tocantins com 8 regionais oficiais da SEPLAN + 3 macrorregionais). A versão anterior usava 6 regiões arbitrárias e foi invalidada. Os dados estão no repo irmão ../doutorado/06-dados/ (ou via GitHub raw URLs se não acessível). O mapeamento oficial está em ../doutorado/06-dados/regioes_planejamento_seplan_2024.json (ADR-011). Se identificar melhorias, registre em .claude/memory/propostas-melhorias-fase-i.md.
```

---

## Notas para o usuário (Henrique)

### Pré-requisitos:
- A **Sessão 1** (Etapa I-1 no repo `doutorado`) deve ter sido executada
- O arquivo `regioes_planejamento_seplan_2024.json` deve estar commitado no repo `doutorado`

### Antes de colar o prompt:
1. No repo `doutorado`: commit + push do `06-dados/regioes_planejamento_seplan_2024.json` (NOVO)
2. No repo `plano-governo-interativo`: commit + push dos arquivos atualizados em `.claude/memory/`
3. No Claude Code, certifique-se de estar no repositório `plano-governo-interativo`

### Após a execução:
1. Faça commit + push dos novos arquivos via GitHub Desktop
2. Volte ao **Cowork** para validação (Bloco C)

### Saída esperada desta sessão:
- `scripts/gerar_municipios_referencia.py` (recriado com lógica SEPLAN)
- `src/data/municipios_referencia.json` (139 municípios, 8 regionais, 3 macrorregionais)
- `.claude/memory/propostas-melhorias-fase-i.md`
- `.claude/memory/today.md` (criado/atualizado)
