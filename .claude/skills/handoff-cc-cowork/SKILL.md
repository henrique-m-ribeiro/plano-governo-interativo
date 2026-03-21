---
name: handoff-cc-cowork
description: Processar briefings de saida do Claude Code e integrar resultados no Cowork, seguindo o protocolo ADR-010. Use sempre que o usuario retornar de uma sessao do Claude Code com resultados para validar e integrar. Trigger quando o usuario mencionar "voltei do Claude Code", "etapa concluida", "resultado da execucao", "briefing de saida", colar um resumo de execucao do CC, ou quando reportar que uma tarefa foi concluida no CC.
---

# Handoff Claude Code → Cowork

Skill para receber e processar briefings de saida do Claude Code, validar entregas, e integrar resultados no ambiente Cowork, conforme governanca ADR-010.

## Contexto

Quando o usuario retorna de uma sessao do Claude Code, ele traz um briefing de saida (estruturado ou informal). O Cowork precisa:
1. Interpretar o que foi feito
2. Validar os artefatos produzidos
3. Atualizar os arquivos de memoria
4. Decidir os proximos passos

## Processo de Recepcao

### Passo 1 — Receber o briefing

O briefing pode vir em 3 formatos:
- **Estruturado:** O Claude Code seguiu o formato do handoff e produziu um resumo com os 5 itens (o que fez, arquivos, validacoes, decisoes, problemas)
- **Informal:** O usuario cola o texto do Claude Code sem formatacao especifica
- **Parcial:** O usuario reporta apenas o resultado ("deu certo" / "deu erro em X")

Em qualquer caso, extrair:
1. **Artefatos produzidos:** quais arquivos foram criados/modificados e onde
2. **Resultado das validacoes internas:** o que o Claude Code ja verificou
3. **Decisoes tomadas:** algo mudou em relacao ao handoff original?
4. **Problemas encontrados:** erros, limitacoes, divergencias
5. **Propostas de melhoria:** sugestoes alem do escopo (se permitido no handoff)

### Passo 2 — Verificar completude

Cruzar o briefing recebido com a checklist do handoff original:

```markdown
## Checklist de Entrega (cruzamento)
| Item do Handoff | Status no Briefing | Verificado? |
|---|---|---|
| [item 1] | Concluido/Pendente/Nao mencionado | Sim/Nao |
| [item 2] | ... | ... |
```

Se itens nao foram mencionados no briefing, perguntar ao usuario ou verificar diretamente nos arquivos.

### Passo 3 — Disparar validacao

Usar a skill `validacao-dados` para executar validacao automatizada dos artefatos. Isso e o Bloco C do ciclo A→E.

### Passo 4 — Processar decisoes e propostas

Para cada decisao tomada pelo Claude Code durante execucao:
- Avaliar se e consistente com o design original
- Se for uma ADR nova, registrar em `memory/decisions.md`
- Se for uma divergencia, decidir se aceita ou corrige

Para cada proposta de melhoria:
- Avaliar merito (vale implementar agora ou depois?)
- Registrar como item futuro em today.md ou como issue

### Passo 5 — Atualizar memoria

Atualizar `memory/today.md` com:
1. Item numerado descrevendo o resultado da sessao do Claude Code
2. Resultado da validacao (Bloco C)
3. Decisoes tomadas
4. Proximos passos atualizados

Se o resultado mudar o estado de um projeto significativamente, atualizar `memory/projects.md` tambem.

## Padroes de Resposta

### Caso 1 — Execucao bem-sucedida
```
Briefing recebido. Resultado:
- [N] artefatos gerados conforme esperado
- Validacao: [APROVADO/REPROVADO] (detalhes)
- [N] decisoes tomadas pelo CC: [listar]
- Recomendacao: [merge / corrigir / prosseguir]
```

### Caso 2 — Execucao com problemas
```
Briefing recebido. Problemas identificados:
- [descricao do problema]
- Causa provavel: [analise]
- Opcoes:
  A) [correcao rapida — instrucoes para o CC]
  B) [reexecucao com handoff corrigido]
  C) [reavaliar abordagem]
```

### Caso 3 — Acesso negado a recursos
O Claude Code nao conseguiu acessar um arquivo de outro repositorio.
- Fornecer URL do GitHub raw como fallback
- Ou instruir o usuario a copiar o arquivo para o repo-alvo
- Atualizar o handoff para prevenir o problema no proximo ciclo

## Licoes Aprendidas (Ciclo 4)

1. **Claude Code reporta proativamente:** Quando o handoff e bem feito, o CC produz briefings detalhados sem precisar ser perguntado. Investir no Bloco A.
2. **Branches inesperadas:** O CC pode criar branches proprias. Verificar onde os commits foram feitos e se precisa de merge.
3. **Propostas de melhoria sao valiosas:** O CC sugeriu campo `polo_regional` que nao estava no handoff. Dar permissao para propor melhorias gera inovacao incremental.
4. **Grafias divergentes:** O CC pode usar grafias de fontes diferentes. Sempre validar nomes com comparacao cruzada.

## Valor Academico (Pesquisa-Acao)

O handoff de retorno e um dado rico sobre:
- **PS3 (colaboracao H-IA):** Como a IA reporta seu trabalho? Quao util e o briefing?
- **OE4 (padroes H-IA):** O formato de briefing de saida converge para um padrao?
- Registrar: completude do briefing, necessidade de perguntas adicionais, qualidade do auto-relato
