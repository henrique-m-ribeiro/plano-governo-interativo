# Planejamento Operacional — Plano de Governo Interativo

**Versão:** 1.0
**Data:** 15 de março de 2026
**Referência:** plano-acao-governo-interativo-v1.md
**Período de execução:** março–julho de 2026

---

## Modelo de Trabalho: Três Ambientes

Cada ambiente contribui com sua especialidade. O fluxo geral é: pesquisa e estratégia no Cowork, desenvolvimento técnico no Claude Code, consultas rápidas e brainstorming no Claude chat.

### Cowork (Claude Opus — desktop)
- **Especialidade:** pesquisa profunda, análise estratégica, redação de documentos, criação de artefatos (docx, pptx, xlsx)
- **Capacidades únicas:** busca na web, análise de múltiplas fontes em paralelo, documentos formatados, raciocínio complexo multi-etapa
- **Usa quando:** pesquisa de eixos, redação de documentos-eixo, análise de benchmarks, produção de materiais de comunicação, planejamento estratégico

### Claude Code (terminal)
- **Especialidade:** desenvolvimento técnico, operações em repositórios git, implementação de código
- **Capacidades únicas:** acesso direto aos 5 repos do ecossistema, execução de builds/testes, manipulação de múltiplos arquivos, deploy
- **Usa quando:** atualizar scaffolding Next.js, migrar conteúdo para plataforma, implementar funcionalidades, sincronizar repos, operações de governança (diários PA, ADRs, CLAUDE.md)

### Claude Chat (claude.ai)
- **Especialidade:** consultas rápidas, brainstorming, revisão de ideias, conversas exploratórias
- **Capacidades únicas:** leveza, rapidez, bom para iterar sobre ideias antes de formalizar
- **Usa quando:** testar um argumento antes de escrever, revisar um trecho, tirar dúvida rápida, brainstorming de nomes/slogans, consultas pontuais durante o dia

---

## FASE 1 — Fundamentos (16–31 março)

### Sessão 1.1 — Mapa da máquina estadual
**Ambiente:** Cowork
**Duração estimada:** 1 sessão (2-3 horas)
**Pré-requisitos:** nenhum

| Passo | Descrição | Método |
|-------|-----------|--------|
| 1.1.1 | Levantar estrutura completa do governo do Tocantins: todas as secretarias, autarquias, agências e suas vinculações | Pesquisa web (portal TO, Diário Oficial, legislação) |
| 1.1.2 | Mapear mudanças recentes (2025-2026): novas secretarias, reorganizações, nomeações | Pesquisa web (notícias, DO-TO) |
| 1.1.3 | Para cada secretaria/órgão: identificar competências, programas principais, orçamento quando disponível | Pesquisa web + análise |
| 1.1.4 | Construir tabela de competências: o que é estadual, o que é municipal, o que é federal, em cada área temática | Análise e redação |
| 1.1.5 | Redigir documento de referência "mapa-maquina-estadual-to.md" | Redação e salvamento no workspace |

**Entrega:** `01-academico/governo-to/mapa-maquina-estadual-to.md`

---

### Sessão 1.2 — Alinhamento dos 10 eixos
**Ambiente:** Cowork (análise) + Claude Code (atualização técnica)
**Duração estimada:** 1 sessão Cowork (1-2 horas) + 1 sessão Claude Code (1 hora)
**Pré-requisitos:** Sessão 1.1 concluída

**Parte A — Cowork:**

| Passo | Descrição | Método |
|-------|-----------|--------|
| 1.2.1 | Comparar os 7 eixos do código (eixos.ts) com os 10 do memo v4 | Análise comparativa |
| 1.2.2 | Para cada um dos 10 eixos, definir: escopo preciso, secretarias responsáveis (usando mapa da 1.1), fontes de dados primárias, sobreposições com outros eixos | Análise cruzada |
| 1.2.3 | Produzir tabela de referência eixo × secretaria × fontes × sobreposições | Redação |
| 1.2.4 | Revisar ordem de produção da Fase 2 à luz do mapa institucional | Análise estratégica |

**Entrega Cowork:** `03-gestao-projeto/tabela-eixos-referencia.md`

**Parte B — Claude Code:**

| Passo | Descrição | Método |
|-------|-----------|--------|
| 1.2.5 | Atualizar eixos.ts para incluir eixos 8, 9, 10 conforme instrucoes-claude-code-v4.md (BLOCO 2) | Desenvolvimento |
| 1.2.6 | Atualizar referências numéricas em page.tsx, sobre/page.tsx, CLAUDE.md, README.md | Desenvolvimento |
| 1.2.7 | Garantir build sem erros | Teste |

**Entrega Claude Code:** scaffolding atualizado para 10 eixos no repo plano-governo-interativo

---

### Sessão 1.3 — Mapeamento do PPA e ações vigentes
**Ambiente:** Cowork
**Duração estimada:** 1-2 sessões (3-4 horas total)
**Pré-requisitos:** Sessões 1.1 e 1.2 concluídas

| Passo | Descrição | Método |
|-------|-----------|--------|
| 1.3.1 | Localizar PPA 2024-2027 do Tocantins (documento oficial) | Pesquisa web (SEPLAN-TO, portal transparência) |
| 1.3.2 | Localizar LOA 2026 do Tocantins | Pesquisa web |
| 1.3.3 | Para cada um dos 10 eixos: extrair programas/ações do PPA que se relacionam, com dotação orçamentária | Análise documental |
| 1.3.4 | Identificar resultados conhecidos: o que funciona, o que não funciona, lacunas | Pesquisa web + análise |
| 1.3.5 | Redigir mapeamento PPA × eixos temáticos | Redação |

**Entrega:** `01-academico/governo-to/mapeamento-ppa-eixos.md`

---

### Sessão paralela — Submissão OECD
**Ambiente:** Cowork
**Duração estimada:** 1 sessão (2-3 horas)
**Deadline:** 20 de março de 2026
**Pré-requisitos:** memo v4 (já disponível), formulário OECD (já baixado)

| Passo | Descrição | Método |
|-------|-----------|--------|
| OECD.1 | Definir categoria (Use Case), nível (Subnational), status (Proposed/under development) | Decisão conjunta com Henrique |
| OECD.2 | Definir organização responsável e framing institucional | Decisão conjunta com Henrique |
| OECD.3 | Redigir "Short and simple description" (máx. 500 caracteres) — o campo mais importante | Redação em inglês |
| OECD.4 | Redigir "Initiative overview" (máx. 3.000 caracteres) — adaptação do memo v4 para linguagem institucional | Redação em inglês |
| OECD.5 | Redigir "Results, outcomes and impacts" (máx. 750 caracteres) — impactos esperados | Redação em inglês |
| OECD.6 | Redigir "Challenges and lessons learned" (máx. 1.000 caracteres) | Redação em inglês |
| OECD.7 | Selecionar setores (tags): Civic participation, Education, Health, etc. | Seleção |
| OECD.8 | Preparar materiais de apoio: screenshot da plataforma, PDF do memo (versão institucional?) | Preparação de materiais |
| OECD.9 | Revisão final com Henrique | Revisão conjunta |
| OECD.10 | Submissão via survey.oecd.org | Henrique submete o formulário online |

**Entrega:** Rascunho completo para revisão em `04-comunicacao/correspondencia/oecd-submission-draft.md` + submissão no portal

---

## FASE 2 — Pesquisa por eixo (1–30 abril)

Cada eixo segue o mesmo protocolo de 3 sessões. Abaixo, o detalhamento operacional do protocolo, seguido do calendário.

### Protocolo padrão por eixo (2-3 dias)

#### Sessão A — Diagnóstico (Dia 1)
**Ambiente:** Cowork
**Duração estimada:** 2-3 horas

| Passo | Descrição | Método |
|-------|-----------|--------|
| A.1 | Coletar dados territoriais municipalizados do eixo (fontes oficiais) | Pesquisa web: IBGE, INEP, DATASUS, TCE-TO, SEPLAN-TO, portais setoriais |
| A.2 | Organizar dados em tabela ou visualização por município/região | Análise de dados |
| A.3 | Identificar padrões regionais: quais regiões concentram os piores indicadores? | Análise territorial |
| A.4 | Identificar municípios críticos: os 10-15 mais vulneráveis neste eixo | Análise comparativa |
| A.5 | Levantar ações programáticas do governo atual neste eixo (usando mapeamento PPA da Fase 1) | Consulta ao documento 1.3 |
| A.6 | Redigir seções 1-3 do documento-eixo (Panorama, Diagnóstico, Ações vigentes) | Redação |

**Entrega parcial:** documento-eixo com seções 1-3 preenchidas

#### Sessão B — Benchmarks e propostas (Dia 2)
**Ambiente:** Cowork
**Duração estimada:** 2-3 horas

| Passo | Descrição | Método |
|-------|-----------|--------|
| B.1 | Pesquisar benchmarks nacionais: programas de outros estados que se destacam neste eixo (1-3 referências) | Pesquisa web |
| B.2 | Pesquisar benchmarks internacionais: referências de destaque relevantes para o contexto tocantinense (1-2 referências) | Pesquisa web |
| B.3 | Formular 4-6 opções de propostas, cada uma vinculada a: problema do diagnóstico + evidência de benchmark | Análise e redação |
| B.4 | Para cada proposta: definir meta quantificável, indicador, horizonte temporal, secretaria responsável | Redação estruturada |
| B.5 | Identificar conexões transversais com outros eixos | Análise cruzada |
| B.6 | Identificar riscos e pontos de atenção (implementação, armadilhas políticas, dependências) | Análise estratégica |
| B.7 | Redigir seções 4-7 do documento-eixo (Benchmarks, Propostas, Conexões, Riscos) | Redação |

**Entrega parcial:** documento-eixo com seções 1-7 preenchidas

#### Sessão C — Consolidação e validação (Dia 3, quando necessário)
**Ambiente:** Cowork (redação) + Claude Chat (revisão rápida, se desejado)
**Duração estimada:** 1-2 horas

| Passo | Descrição | Método |
|-------|-----------|--------|
| C.1 | Revisar documento-eixo completo: consistência, clareza, qualidade das propostas | Revisão |
| C.2 | Formular questões para validação com a Senadora e interlocutores | Redação |
| C.3 | Preencher seção "Vozes do território" com placeholder estruturado (categorias de contribuições esperadas) | Redação |
| C.4 | Finalizar documento-eixo com todas as 9 seções | Redação final |
| C.5 | Atualizar lista de referências para aprofundamento futuro | Organização |

**Entrega final:** documento-eixo completo em `01-academico/eixos/eixo-NN-nome.md`

---

### Calendário da Fase 2

#### Bloco 1 — Setoriais (1–10 abril) → Validação 1

| Data | Eixo | Sessão | Observação |
|------|------|--------|------------|
| 01/abr (qua) | 1. Educação e Capital Humano | A — Diagnóstico | Dados INEP/IDEB mais acessíveis |
| 02/abr (qui) | 1. Educação e Capital Humano | B — Benchmarks e propostas | Vitrine: maior credencial da Senadora |
| 03/abr (sex) | 1. Educação e Capital Humano | C — Consolidação | |
| 04/abr (sáb) | — | Folga / contingência | |
| 05/abr (dom) | 2. Saúde e Qualidade de Vida | A — Diagnóstico | Dados DATASUS |
| 06/abr (seg) | 2. Saúde e Qualidade de Vida | B — Benchmarks e propostas | |
| 07/abr (ter) | 3. Segurança Pública e Cidadania | A — Diagnóstico | Atlas da Violência, SSP-TO |
| 08/abr (qua) | 3. Segurança Pública e Cidadania | B — Benchmarks e propostas | |
| 09/abr (qui) | Consolidação bloco 1 | C — Revisão dos 3 eixos | Preparar material para Validação 1 |
| **~10/abr (sex)** | **Validação 1 com a Senadora** | Apresentação dos eixos 1-3 | Formato a definir (reunião, documento, apresentação) |

#### Bloco 2 — Estruturantes e econômicos (11–22 abril) → Validação 2

| Data | Eixo | Sessão | Observação |
|------|------|--------|------------|
| 11/abr (sáb) | — | Folga / incorporar feedback V1 | |
| 12/abr (dom) | 4. Infraestrutura e Conectividade | A — Diagnóstico | AGETO, IBGE |
| 13/abr (seg) | 4. Infraestrutura e Conectividade | B — Benchmarks e propostas | |
| 14/abr (ter) | 5. Meio Ambiente e Sustentabilidade | A — Diagnóstico | NATURATINS, INPE, MMA |
| 15/abr (qua) | 5. Meio Ambiente e Sustentabilidade | B — Benchmarks e propostas | Transição Cerrado-Amazônia |
| 16/abr (qui) | 6. Agropecuária e Desenv. Rural | A — Diagnóstico | SEAGRO, IBGE/PAM |
| 17/abr (sex) | 6. Agropecuária e Desenv. Rural | B — Benchmarks e propostas | Principal motor econômico do estado |
| 18/abr (sáb) | — | Folga / contingência | |
| 19/abr (dom) | Consolidação bloco 2 | C — Revisão dos eixos 4-6 | Preparar material para Validação 2 |
| **~20/abr (seg)** | **Validação 2 com a Senadora** | Apresentação dos eixos 4-6 | |

#### Bloco 3 — Econômicos específicos + integradores (21–30 abril) → Validação 3

| Data | Eixo | Sessão | Observação |
|------|------|--------|------------|
| 21/abr (ter) | — | Feriado (Tiradentes) / incorporar feedback V2 | |
| 22/abr (qua) | 7. Mineração Sustentável | A+B — Diagnóstico e propostas | Eixo menor, 1 sessão combinada |
| 23/abr (qui) | 8. Industrialização e Atração de Investimentos | A+B — Diagnóstico e propostas | Eixo menor, 1 sessão combinada |
| 24/abr (sex) | 9. Gestão Pública e Inovação | A — Diagnóstico | Transversal: costura os instrumentos |
| 25/abr (sáb) | 9. Gestão Pública e Inovação | B — Benchmarks e propostas | IT-IA como proposta-âncora |
| 26/abr (dom) | — | Folga / contingência | |
| 27/abr (seg) | 10. Desenvolvimento Regional | A — Diagnóstico integrado | Síntese dos 9 eixos anteriores |
| 28/abr (ter) | 10. Desenvolvimento Regional | B — Propostas integradoras | Eixo que conecta tudo |
| 29/abr (qua) | 10. Desenvolvimento Regional | C — Consolidação final | |
| **~30/abr (qui)** | **Validação 3 com a Senadora** | Apresentação dos eixos 7-10 + visão integrada | |

---

### Sessões de validação — formato sugerido

**Ambiente:** Cowork (preparação) + Claude Chat (ajustes rápidos pós-reunião)

| Passo | Descrição | Responsável |
|-------|-----------|-------------|
| V.1 | Preparar documento-síntese do bloco (resumo executivo dos eixos) | Cowork |
| V.2 | Preparar apresentação visual se necessário (.pptx ou slides no Cowork) | Cowork |
| V.3 | Listar questões abertas e decisões necessárias | Cowork |
| V.4 | Reunião de validação com a Senadora | Henrique (presencial ou remoto) |
| V.5 | Registrar feedback e decisões | Henrique + Claude Chat |
| V.6 | Incorporar ajustes nos documentos-eixo | Cowork |

---

## FASE 3 — Integração e plataforma (maio–junho)

Fase predominantemente técnica. A pesquisa de conteúdo está feita; agora o trabalho é migrar, implementar e testar.

### Sessão 3.1 — Migração de conteúdo (1ª semana de maio)
**Ambiente:** Claude Code (principal) + Cowork (revisão de conteúdo)
**Duração estimada:** 3-5 dias

**Claude Code:**

| Passo | Descrição |
|-------|-----------|
| 3.1.1 | Converter os 10 documentos-eixo (markdown) em dados estruturados TypeScript (atualizar eixos.ts com propostas, metas, indicadores reais) |
| 3.1.2 | Atualizar as páginas de eixo (/eixos/[slug]) para exibir o conteúdo completo: diagnóstico, propostas, metas, indicadores |
| 3.1.3 | Integrar dados municipalizados do repo tocantins-integrado no mapa interativo |
| 3.1.4 | Garantir que cada município no mapa mostra diagnóstico + propostas relevantes |
| 3.1.5 | Verificar build, responsividade, performance |

**Cowork (em paralelo):**

| Passo | Descrição |
|-------|-----------|
| 3.1.6 | Revisar o conteúdo migrado: as propostas estão fiéis aos documentos-eixo? |
| 3.1.7 | Identificar gaps de conteúdo que surgiram durante a migração |

---

### Sessão 3.2 — Funcionalidades de IA (2ª–3ª semana de maio)
**Ambiente:** Claude Code (implementação) + Cowork (design de prompts e fluxos)
**Duração estimada:** 5-7 dias

**Cowork:**

| Passo | Descrição |
|-------|-----------|
| 3.2.1 | Projetar fluxo conversacional do assistente de exploração: quais perguntas típicas, como responder, tom de voz |
| 3.2.2 | Projetar fluxo do canal de escuta: como a IA ajuda o cidadão a organizar sua contribuição |
| 3.2.3 | Definir prompts de sistema para cada funcionalidade |
| 3.2.4 | Definir estratégia de processamento das contribuições (classificação, extração de temas, priorização) |

**Claude Code:**

| Passo | Descrição |
|-------|-----------|
| 3.2.5 | Implementar assistente de exploração (BLOCO 4 das instruções v4): integração com API de LLM |
| 3.2.6 | Implementar canal de escuta cidadã (BLOCO 3 das instruções v4): formulário + assistente |
| 3.2.7 | Implementar backend de contribuições: Supabase ou similar (evolução do placeholder do BLOCO 7) |
| 3.2.8 | Implementar processamento de contribuições por IA: classificação e extração de padrões |
| 3.2.9 | Testes de integração |

---

### Sessão 3.3 — Interface e navegação (3ª–4ª semana de maio)
**Ambiente:** Claude Code
**Duração estimada:** 3-5 dias

| Passo | Descrição |
|-------|-----------|
| 3.3.1 | Executar BLOCOS 1, 5, 6, 8 das instruções v4 (branding, navegação, página sobre, ajustes menores) |
| 3.3.2 | Implementar design responsivo final (mobile-first) |
| 3.3.3 | Implementar SEO e metadata para cada página/eixo/município |
| 3.3.4 | Otimizar performance (lazy loading, code splitting) |

---

### Sessão 3.4 — Testes e ajustes (junho)
**Ambiente:** Claude Code (correções) + Cowork (testes de conteúdo e usabilidade)
**Duração estimada:** contínuo ao longo de junho

**Cowork:**

| Passo | Descrição |
|-------|-----------|
| 3.4.1 | Revisão editorial de todo o conteúdo na plataforma |
| 3.4.2 | Testes de usabilidade: simulação de navegação por perfis diferentes (cidadão, prefeito, jornalista) |
| 3.4.3 | Preparação de materiais de comunicação: cards por município, infográficos, textos para redes sociais |
| 3.4.4 | Preparar guia de uso para equipe de campanha |

**Claude Code:**

| Passo | Descrição |
|-------|-----------|
| 3.4.5 | Correções de bugs reportados |
| 3.4.6 | Deploy em ambiente de produção |
| 3.4.7 | Configuração de domínio personalizado |
| 3.4.8 | Monitoramento e analytics |

---

### Sessão 3.5 — Materiais de comunicação (junho)
**Ambiente:** Cowork (principal)
**Duração estimada:** 2-3 sessões

| Passo | Descrição | Formato |
|-------|-----------|---------|
| 3.5.1 | Template de card para redes sociais (1 por município) | Imagem/HTML |
| 3.5.2 | Infográficos por eixo: diagnóstico visual + propostas principais | Imagem/PDF |
| 3.5.3 | Guia rápido para equipe de campanha: como usar a plataforma em reuniões | Documento (docx/pdf) |
| 3.5.4 | Texto de lançamento para imprensa | Documento |
| 3.5.5 | Roteiro de demonstração para a Senadora (cenários de uso em entrevistas, reuniões com prefeitos) | Documento |

---

## FASE 4 — Lançamento (julho)

### Sessão 4.1 — Soft launch (1ª semana de julho)
**Ambiente:** Claude Code (deploy) + Cowork (monitoramento e ajustes)

| Passo | Descrição | Responsável |
|-------|-----------|-------------|
| 4.1.1 | Deploy final em produção | Claude Code |
| 4.1.2 | Distribuir link para grupo restrito (equipe, interlocutores-chave) | Henrique |
| 4.1.3 | Coletar feedback estruturado | Henrique + Cowork |
| 4.1.4 | Implementar ajustes prioritários | Claude Code |

### Sessão 4.2 — Lançamento público (2ª–3ª semana de julho)
**Ambiente:** Cowork (comunicação) + Claude Code (suporte técnico)

| Passo | Descrição | Responsável |
|-------|-----------|-------------|
| 4.2.1 | Lançamento público integrado à campanha | Henrique + equipe de campanha |
| 4.2.2 | Ativação de comunicação: publicação dos 139 cards municipais nas redes | Equipe de campanha |
| 4.2.3 | Monitoramento de acessos, contribuições e feedback | Claude Code (analytics) + Cowork (análise) |
| 4.2.4 | Resposta a contribuições e ajustes contínuos | Ciclo contínuo |

---

## Tarefas Recorrentes (ao longo de todo o período)

| Tarefa | Frequência | Ambiente | Descrição |
|--------|------------|----------|-----------|
| TR01 — Varredura semanal de IA | Semanal (sábado) | Cowork | Monitoramento do ecossistema de IA |
| TR02 — Atualização de contexto | Quinzenal | Cowork | Atualizar sobre-o-projeto.md e regras-de-trabalho.md |
| TR03 — Revisão de prazos | Quinzenal | Cowork | Revisar marcos e prazos do plano |
| TR04 — Relatório mensal | Mensal | Cowork | Progresso consolidado |
| TR05 — Handoff Cowork → Code | Semanal | Cowork → Claude Code | Sincronizar artefatos produzidos |
| Diário de pesquisa-ação | A cada sessão significativa | Claude Code (registro) | Registrar decisões, alternativas, justificativas |
| Backup de documentos-eixo | A cada conclusão de eixo | Claude Code | Commit no repo doutorado |

---

## Resumo de sessões por fase e ambiente

| Fase | Cowork | Claude Code | Claude Chat | Total estimado |
|------|--------|-------------|-------------|----------------|
| Fase 1 — Fundamentos | 4-5 sessões | 1 sessão | — | ~15h |
| Fase 1 — OECD (paralelo) | 1-2 sessões | — | — | ~4h |
| Fase 2 — Pesquisa (10 eixos) | 20-25 sessões | — | Pontual | ~60h |
| Fase 2 — Validações (3) | 3 sessões prep. | — | Pontual | ~6h |
| Fase 3 — Integração | 5-7 sessões | 10-15 sessões | — | ~50h |
| Fase 4 — Lançamento | 2-3 sessões | 2-3 sessões | — | ~10h |
| **Total** | **~37 sessões** | **~16 sessões** | **Pontual** | **~145h** |

---

## Riscos do planejamento operacional

1. **Compressão de abril:** 10 eixos em 30 dias é ambicioso. Mitigação: eixos 7 e 8 (Mineração, Industrialização) compactados em 1 dia cada; dias de contingência no calendário.
2. **Dependência de dados públicos:** fontes oficiais podem estar desatualizadas ou inacessíveis. Mitigação: identificar fontes alternativas na Fase 1; trabalhar com os dados disponíveis e sinalizar lacunas.
3. **Validação com a Senadora:** agenda política pode impedir as 3 validações no calendário. Mitigação: validações podem ser assíncronas (documento + comentários), não apenas presenciais.
4. **Complexidade técnica da Fase 3:** integração de IA pode exigir mais tempo que o estimado. Mitigação: priorizar funcionalidades (assistente de exploração > canal de escuta > inteligência de planejamento); aceitar que algumas funcionalidades podem ser placeholder no lançamento.
5. **Acúmulo de frentes simultâneas:** doutorado, gabinete e plano de governo competem por atenção. Mitigação: blocos temáticos definidos com antecedência permitem trabalhar em sessões focadas.

---

## Dupla leitura deste documento

- **Valor prático:** planejamento operacional detalhado com ~53 sessões distribuídas em 4 meses, papéis definidos para 3 ambientes de IA, calendário diário para abril, e estimativa total de ~145 horas de trabalho.
- **Valor acadêmico:** evidência de orquestração multi-ferramenta em pesquisa-ação (OE4/PS3). O protocolo padronizado por eixo é contribuição metodológica para o framework de IT-IA (OE2). A divisão Cowork/Code/Chat é dado empírico sobre padrões de delegação humano-IA em produção intelectual complexa (PS3). O modelo de "construção progressiva" (setoriais → integradores) documenta como a inteligência territorial emerge da síntese setorial (OE3).
