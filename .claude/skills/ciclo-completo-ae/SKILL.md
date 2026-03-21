---
name: ciclo-completo-ae
description: Orquestrar o ciclo completo A-B-C-D-E de trabalho entre Cowork e Claude Code, conforme governanca ADR-010. Use quando for necessario planejar e executar uma etapa do plano de incorporacao do inicio ao fim, passando por todos os blocos. Trigger quando o usuario mencionar "ciclo completo", "executar etapa", "A ate E", "Bloco A", "fluxo completo", "plano de incorporacao", ou quando iniciar uma nova etapa do MVP.
---

# Ciclo Completo A→E (Governanca Cowork↔Claude Code)

Skill para orquestrar o fluxo completo de trabalho entre Cowork e Claude Code, conforme definido na ADR-010. Cada etapa do plano de incorporacao do MVP passa por 5 blocos sequenciais, divididos entre os dois ambientes.

## Visao Geral do Ciclo

```
Bloco A (Cowork)  → Preparacao: escopo, briefing, handoff
Bloco B (CC)      → Execucao: codigo, scripts, build
Bloco C (Cowork)  → Validacao: verificar saidas, comparar fontes
Bloco D (Cowork)  → Integracao: merge, atualizar dependencias
Bloco E (Cowork)  → Checkpoint: registrar em memory/, avaliar proximos passos
```

## Bloco A — Preparacao (Cowork)

Objetivo: garantir que o Claude Code tenha tudo que precisa para executar sem ambiguidade.

### Checklist do Bloco A
1. Identificar a etapa a executar (referencia ao plano de incorporacao)
2. Verificar pre-requisitos (etapas anteriores concluidas? dados disponiveis?)
3. Resolver decisoes de design pendentes (registrar ADRs se necessario)
4. Preparar pacote de handoff (usar skill `handoff-cowork-cc`):
   - Instrucoes de execucao
   - Briefing tecnico
   - Prompt pronto
5. Verificar que arquivos de entrada estao commitados e acessiveis
6. Atualizar today.md com "Bloco A concluido para [etapa]"

### Entregavel
Pacote de 3 arquivos em `.claude/memory/` do repositorio-alvo.

## Bloco B — Execucao (Claude Code)

Objetivo: executar a tarefa tecnica conforme o handoff.

### O que acontece (fora do Cowork)
- Usuario abre Claude Code no repositorio-alvo
- Cola o prompt do Bloco A
- Claude Code le handoff + briefing
- Apresenta plano de execucao ao usuario
- Executa apos confirmacao
- Produz briefing de saida

### Papel do Cowork durante o Bloco B
- Nenhum. O Cowork aguarda o retorno do usuario com o briefing de saida.
- Se o usuario reportar problemas, o Cowork pode ajudar a diagnosticar e preparar instrucoes corretivas.

## Bloco C — Validacao (Cowork)

Objetivo: verificar que a saida do Claude Code atende aos criterios de qualidade.

### Checklist do Bloco C
1. Receber briefing de saida do Claude Code (usar skill `handoff-cc-cowork`)
2. Executar validacao automatizada (usar skill `validacao-dados`)
3. Interpretar resultados:
   - APROVADO → prosseguir para Bloco D
   - APROVADO COM RESSALVA → decidir se corrige antes ou depois do merge
   - REPROVADO → preparar instrucoes de correcao e voltar ao Bloco B
4. Registrar resultado em today.md

### Decisao critica: Voltar ao B ou prosseguir?

| Cenario | Decisao |
|---|---|
| Validacao aprovada, sem ressalvas | → Bloco D |
| Validacao aprovada com ressalvas baixas | → Bloco D (corrigir depois) |
| Validacao aprovada com ressalvas medias | → Corrigir no CC primeiro, depois Bloco D |
| Validacao reprovada | → Voltar ao Bloco B com instrucoes corretivas |
| Validacao reprovada pela segunda vez | → Parar. Reavaliar abordagem no Cowork. |

## Bloco D — Integracao (Cowork)

Objetivo: integrar o artefato validado ao sistema.

### Checklist do Bloco D
1. Merge da branch para main (ou orientar o usuario a fazer via Claude Code)
2. Verificar que o merge nao quebrou nada (build, testes)
3. Atualizar dependencias (outros arquivos que referenciam o artefato)
4. Verificar consistencia com artefatos existentes (ex: regioes.ts vs municipios_referencia.json)

## Bloco E — Checkpoint (Cowork)

Objetivo: registrar o que foi aprendido e planejar o proximo passo.

### Checklist do Bloco E
1. Atualizar `memory/today.md`:
   - Adicionar item numerado com resultado da etapa
   - Marcar etapa como concluida em "Proximos passos"
   - Adicionar proxima etapa como pendente
2. Atualizar `memory/projects.md` se o estado do repo mudou significativamente
3. Registrar ADRs em `memory/decisions.md` para decisoes tomadas durante o ciclo
4. Avaliar: o handoff funcionou bem? O que melhorar no proximo ciclo?
5. Produzir reflexao de pesquisa-acao (30% da regra 70/30):
   - O que este ciclo revela sobre a colaboracao H-IA?
   - Que dados de pesquisa foram gerados?
   - Algum padrao emergente?

## Contabilidade do Ciclo

Ao final de cada ciclo, registrar:

```markdown
### Ciclo [N] — [Nome da Etapa]
- **Duracao total:** [tempo do Bloco A ao E]
- **Iteracoes B↔C:** [quantas vezes voltou ao Claude Code]
- **Causa de iteracoes extras:** [se houver]
- **ADRs gerados:** [lista]
- **Dados de pesquisa:** [o que foi observado sobre PS1/PS2/PS3]
```

## Licoes Aprendidas (Ciclo 4, Fase I)

1. **Primeiro ciclo completo (I-1 + I-2):** Provou que o modelo ADR-010 funciona. A separacao clara Cowork/CC reduziu ambiguidade.
2. **Iteracoes B↔C sao normais:** I-2 precisou de 2 execucoes (v1 com 6 regioes → v2 com 8 SEPLAN). A validacao cruzada (Bloco C) capturou o problema.
3. **Handoff e o gargalo de qualidade:** Um handoff mal feito gera retrabalho. Investir tempo no Bloco A economiza tempo nos Blocos B e C.
4. **Bloco E e subestimado:** A reflexao no checkpoint gera os dados mais valiosos para a pesquisa-acao. Nao pular.

## Valor Academico (Pesquisa-Acao)

O ciclo A→E e o padrao central de colaboracao H-IA no ecossistema:
- **PS3:** Como a divisao de trabalho se organiza entre Cowork (planejamento/validacao) e CC (execucao)?
- **OE4:** O ciclo A→E e um padrao de delegacao que pode ser formalizado e transferido?
- **OE1:** O proprio ciclo e parte do framework de pesquisa-acao (metodo dentro do metodo)
- Cada ciclo completo e um dado de pesquisa. Documentar fielmente.
