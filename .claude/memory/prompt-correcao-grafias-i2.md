# Prompt — Correção de 3 Grafias em municipios_referencia.json

> Colar este prompt no Claude Code (repo: plano-governo-interativo)

---

Preciso corrigir 3 nomes de municípios no arquivo `src/data/municipios_referencia.json` (branch `claude/cowork-handoff-setup-q0yPv`). Os nomes atuais seguem a grafia do Censo/IBGE, mas devem seguir a grafia oficial da SEPLAN/TO (2024), conforme ADR-011.

Correções:

1. `"Couto Magalhães"` → `"Couto de Magalhães"` (cod_ibge: 1706001)
2. `"Pau D'Arco"` → `"Pau d'Arco"` (cod_ibge: 1716307)
3. `"São Valério"` → `"São Valério da Natividade"` (cod_ibge: 1720499)

Regras:
- Fazer checkout da branch `claude/cowork-handoff-setup-q0yPv` antes de editar
- Alterar APENAS o campo `"nome"` de cada registro — não alterar nenhum outro campo
- Commit com mensagem: `fix: corrigir grafias de 3 municípios para padrão SEPLAN (ADR-011)`
- Push para a branch

Verificação após editar:
- Confirmar que o JSON continua válido (parsear com Python ou jq)
- Confirmar que o total continua 139
- Mostrar as 3 linhas alteradas
