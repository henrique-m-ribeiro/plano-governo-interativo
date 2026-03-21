# CLAUDE.md — Plano de Governo Interativo do Tocantins

## Projeto
Plataforma web pública que apresenta o plano de governo da Senadora Professora Dorinha
para o Tocantins de forma interativa, conectando propostas a dados reais do território
(139 municípios). A plataforma é destinada à candidatura de Professora Dorinha ao governo
do estado, apresentando o plano de governo com base em evidências e escuta cidadã.

## Ecossistema
- **Repo acadêmico central:** [doutorado](https://github.com/henrique-m-ribeiro/doutorado) — CSVs originais do pipeline como artefato de pesquisa
- **Dashboard territorial:** [tocantins-integrado](https://github.com/henrique-m-ribeiro/tocantins-integrado) — sistema técnico complementar
- **Cadernos municipais:** [caderno-tocantins-2026](https://github.com/henrique-m-ribeiro/caderno-tocantins-2026) — conteúdo dos 9 volumes
- **Framework metodológico:** [ia-collab-os](https://github.com/henrique-m-ribeiro/ia-collab-os) — colaboração H-IA v2.2

## Conexão Acadêmica
- **Ciclo PA:** Ciclo 4 — Frente F4 (Artefatos Político-Governamentais)
- **Perguntas de pesquisa:** PS2 (como IT-IA reconfigura a gestão territorial), OE3 (transformações na gestão)
- **Dupla leitura:** Artefato político (ferramenta de campanha) + Dado de pesquisa (como IT-IA informa políticas públicas)

## Stack Técnica
- **Framework:** Next.js 16+ (App Router) com TypeScript
- **Estilização:** Tailwind CSS 4
- **Mapas:** Leaflet + react-leaflet (planejado — atualmente placeholder, GeoJSON pendente de integração)
- **Ícones:** lucide-react
- **Dados:** CSVs do pipeline em `data/pipeline/` (copiados do doutorado), JSONs consolidados em `src/data/indicadores/` (ADR-013). Este repo é a fonte canônica de dados para o app.
- **IA/LLM:** Integração com API de LLM para assistente conversacional e processamento de contribuições
- **Deploy:** Replit (MVP atual em https://plano-governo-interativo.replit.app)
- **Acessibilidade:** WCAG 2.1 AA obrigatório
- **Mobile-first:** Acesso principal será por celular

## Convenções de Código
- Comentários em português (para manutenção por equipe não-técnica)
- Nomes de arquivo: kebab-case (sem acentos)
- Componentes React: PascalCase
- Variáveis e funções: camelCase
- Dados estáticos em `src/data/`
- Componentes reutilizáveis em `src/components/`

## Estrutura dos 10 Eixos Temáticos
1. Desenvolvimento Regional e Redução de Desigualdades
2. Educação e Capital Humano
3. Saúde e Qualidade de Vida
4. Infraestrutura e Conectividade
5. Meio Ambiente e Sustentabilidade
6. Segurança Pública e Cidadania
7. Gestão Pública e Inovação (eixo transversal — convergência acadêmica)
8. Agropecuária e Desenvolvimento Rural
9. Economia e Emprego
10. Cultura, Esporte e Juventude

Os eixos refletem as vocações econômicas e sociais do Tocantins e dialogam com pautas
de alto engajamento no eleitorado. O diagnóstico territorial parte do trabalho da
Secretaria de Planejamento do Tocantins (dados no repo caderno-tocantins-2026).

## Funcionalidades de IA
A plataforma incorpora IA em três dimensões complementares:

1. **Exploração Assistida** — Assistente conversacional (chat flutuante) que permite ao cidadão
   fazer perguntas em linguagem natural sobre propostas, dados e municípios.
2. **Escuta Inclusiva** — Canal de participação cidadã (/participar) com IA que ajuda quem tem
   dificuldade em preencher formulários, organizando contribuições em linguagem livre.
3. **Inteligência para Planejamento** — Contribuições processadas por IA para identificar padrões,
   temas recorrentes e prioridades por município e região, alimentando o plano continuamente.

A dimensão de escuta conecta diretamente com a pesquisa de doutorado:
- PS2: como IT-IA reconfigura a gestão territorial
- PS3: como a escuta mediada por IA transforma a relação governo-cidadão
- OE3: transformações na gestão pública
- OE4: potencial de replicação e escalabilidade

## Princípios de Design
- **Dados primeiro:** Toda proposta vinculada a indicadores reais
- **Navegação múltipla:** Por município, por eixo, por tema, por região
- **Linguagem acessível:** Evitar jargão técnico, priorizar clareza
- **Tom institucional:** Não partidário, baseado em evidências
- **Performance:** Otimizado para conexões lentas (interior do TO)

## Estado Atual do MVP (2026-03-20)
- 8 páginas implementadas com dados placeholder/genéricos
- `municipios.ts` sem cod_ibge, sem indicadores reais
- Mapa placeholder sem GeoJSON real
- Eixos com propostas genéricas
- **Plano de incorporação:** `doutorado/02-pesquisa-acao/plano-incorporacao-mvp.md` (v3, 4 fases)
- **137 indicadores reais disponíveis** no pipeline do doutorado, pendentes de integração

## Governança de Ambientes
- **Cowork (📋):** Preparação de dados, documentos-eixo, briefings, revisão
- **Claude Code (🔧):** Codificação, scripts CSV→JSON, componentes React, build, git, deploy
- **Handoff:** via `memory/today.md` no repo doutorado
- **Referência:** ADR-010 em `doutorado/.claude/memory/decisions.md`

## Antes de Qualquer Tarefa
1. Identifique qual eixo temático e qual camada (dados/conteúdo/interface) o trabalho endereça
2. Consulte o plano de incorporação para verificar em qual fase/etapa o trabalho se insere
3. Considere a dupla leitura (valor prático + valor acadêmico)
4. Verifique se há dados do pipeline (doutorado/06-dados/) que devem ser integrados
5. Mantenha o design mobile-first
