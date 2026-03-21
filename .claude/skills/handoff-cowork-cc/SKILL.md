---
name: handoff-cowork-cc
description: Preparar pacotes de handoff do Cowork para o Claude Code, seguindo o protocolo ADR-010. Use sempre que for necessario transferir uma tarefa de codificacao, build, deploy ou git do Cowork para execucao no Claude Code. Inclui briefing tecnico, instrucoes de execucao e prompt pronto para colar. Trigger quando o usuario mencionar "handoff", "preparar para o Claude Code", "sessao no CC", "transferir tarefa", ou quando uma etapa do plano de incorporacao for marcada como Claude Code.
---

# Handoff Cowork → Claude Code

Skill para preparar pacotes completos de transferencia de tarefas do ambiente Cowork (gestao, analise, planejamento) para o ambiente Claude Code (codificacao, scripts, git, deploy), conforme governanca ADR-010.

## Contexto

No ecossistema de pesquisa-acao do doutorado, o trabalho e dividido em dois ambientes complementares:
- **Cowork** prepara, planeja, valida e documenta
- **Claude Code** executa codigo, scripts, build, testes e git

O handoff e o mecanismo que garante continuidade e qualidade entre os dois ambientes. Um handoff bem feito reduz retrabalho e ambiguidade, e gera dados de pesquisa sobre o padrao de colaboracao H-IA (PS3/OE4).

## Estrutura do Pacote de Handoff

Cada handoff produz 3 arquivos no repositorio-alvo, em `.claude/memory/`:

### 1. `handoff-cowork-para-claude-code.md` — Instrucoes de execucao

```markdown
# Handoff Cowork → Claude Code — [Nome da Etapa]

## Escopo
- O que fazer (descricao objetiva)
- O que NAO fazer (limites explicitos)

## Repositorio e Branch
- Repo: [nome]
- Branch: main (ou especificar)
- Diretorio de trabalho: [caminho]

## Arquivos de Entrada
- [caminho exato do arquivo 1] — descricao
- [caminho exato do arquivo 2] — descricao

## Arquivos de Saida Esperados
- [caminho exato] — descricao e formato
- Schema/estrutura esperada (quando aplicavel)

## Decisoes de Design Ja Tomadas
- [decisao 1] (ref: ADR-XXX)
- [decisao 2]

## Checklist de Entrega
- [ ] Arquivo X gerado em [caminho]
- [ ] Validacao Y passou (detalhar criterios)
- [ ] Commit + push realizados

## Permissoes
- Pode propor melhorias alem do escopo? Sim/Nao
- Se sim, registrar em arquivo separado (propostas-melhoria.md)

## Briefing de Saida Obrigatorio
Ao concluir, produzir resumo com:
1. O que foi feito (itens numerados)
2. Arquivos criados/modificados (caminhos)
3. Resultado das validacoes
4. Decisoes tomadas durante execucao
5. Problemas encontrados (se houver)
```

### 2. `briefing-[nome-etapa].md` — Briefing tecnico detalhado

Conteudo varia conforme a tarefa. Deve incluir:
- Mapeamento de dados (caminhos, formatos, encoding)
- Schemas de entrada e saida (JSON, CSV)
- Regras de negocio e transformacao
- Casos especiais e excecoes conhecidas
- Criterios de validacao quantitativos (contagens, totais esperados)

### 3. `prompt-claude-code-[nome].md` — Prompt pronto para colar

Texto exato que o usuario colara no Claude Code para iniciar a sessao. Deve:
- Referenciar os dois arquivos acima
- Ser auto-contido (o Claude Code deve conseguir executar sem perguntas)
- Incluir instrucao para ler o handoff e briefing antes de executar
- Pedir confirmacao do plano antes de executar

## Processo de Preparacao

### Passo 1 — Definir escopo
Antes de escrever qualquer arquivo, responder:
- Qual etapa do plano esta sendo transferida?
- Qual repositorio recebera o codigo?
- Quais dados de entrada existem e onde estao?
- Quais decisoes de design ja foram tomadas (ADRs)?
- O Claude Code tem acesso a todos os arquivos necessarios?
  - Se o arquivo esta em outro repo, fornecer URL do GitHub raw como fallback

### Passo 2 — Verificar pre-requisitos
- Dados de entrada existem e estao commitados/acessiveis?
- Decisoes pendentes foram resolvidas?
- Ha dependencias de outras etapas?

### Passo 3 — Escrever o pacote
Produzir os 3 arquivos na ordem: handoff → briefing → prompt.

### Passo 4 — Validar o pacote
Reler os 3 arquivos verificando:
- Caminhos de arquivo estao corretos e existem?
- Schema de saida esta completo?
- Checklist de entrega e mensuravel?
- Prompt e auto-contido?

### Passo 5 — Registrar em today.md
Atualizar `memory/today.md` com o handoff preparado.

## Licoes Aprendidas (Ciclo 4)

1. **Repos irmãos nao se veem:** Claude Code aberto em um repo nao acessa `../outro-repo/`. Sempre fornecer URLs GitHub raw como fallback.
2. **Branch vs main:** Claude Code pode criar branches proprias. Especificar no handoff se deve commitar em main ou em branch.
3. **Grafias divergentes:** Dados de fontes diferentes podem ter grafias diferentes para os mesmos nomes. Documentar divergencias conhecidas no briefing.
4. **Permissao para melhorar:** Dar permissao explicita para o Claude Code propor melhorias alem do escopo incentiva qualidade. Mas exigir registro separado.
5. **Checklist quantitativo:** "139 municipios" e melhor que "todos os municipios". Numeros concretos permitem validacao automatica.

## Valor Academico (Pesquisa-Acao)

Cada handoff e um dado de pesquisa sobre:
- **PS3 (colaboracao H-IA):** Como a divisao de trabalho entre humano e IA se estrutura
- **OE4 (padroes H-IA):** O pacote de 3 arquivos e um padrao emergente de delegacao
- Registrar: tempo de preparacao, numero de iteracoes, qualidade da entrega
