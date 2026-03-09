# CLAUDE.md — Plano de Governo Interativo do Tocantins

## Projeto
Plataforma web pública que apresenta o plano de governo da Senadora Professora Dorinha
para o Tocantins de forma interativa, conectando propostas a dados reais do território
(139 municípios). A plataforma é destinada à candidatura de Professora Dorinha ao governo
do estado, apresentando o plano de governo com base em evidências e escuta cidadã.

## Ecossistema
- **Repo acadêmico central:** [doutorado](https://github.com/henrique-m-ribeiro/doutorado)
- **Dados territoriais:** [tocantins-integrado](https://github.com/henrique-m-ribeiro/tocantins-integrado) — fonte dos indicadores e fichas municipais
- **Cadernos municipais:** [caderno-tocantins-2026](https://github.com/henrique-m-ribeiro/caderno-tocantins-2026) — conteúdo dos 9 volumes
- **Framework metodológico:** [ia-collab-os](https://github.com/henrique-m-ribeiro/ia-collab-os) — colaboração H-IA v2.2

## Conexão Acadêmica
- **Ciclo PA:** Ciclo 4 — Frente F4 (Artefatos Político-Governamentais)
- **Perguntas de pesquisa:** PS2 (como IT-IA reconfigura a gestão territorial), OE3 (transformações na gestão)
- **Dupla leitura:** Artefato político (ferramenta de campanha) + Dado de pesquisa (como IT-IA informa políticas públicas)

## Stack Técnica
- **Framework:** Next.js 16+ (App Router) com TypeScript
- **Estilização:** Tailwind CSS 4
- **Mapas:** Leaflet + react-leaflet (GeoJSON dos 139 municípios)
- **Ícones:** lucide-react
- **Dados:** JSONs importados do tocantins-integrado (não duplicar banco)
- **IA/LLM:** Integração com API de LLM para assistente conversacional e processamento de contribuições
- **Deploy:** Vercel (free tier)
- **Acessibilidade:** WCAG 2.1 AA obrigatório
- **Mobile-first:** Acesso principal será por celular

## Convenções de Código
- Comentários em português (para manutenção por equipe não-técnica)
- Nomes de arquivo: kebab-case (sem acentos)
- Componentes React: PascalCase
- Variáveis e funções: camelCase
- Dados estáticos em `src/data/`
- Componentes reutilizáveis em `src/components/`

## Estrutura dos 7 Eixos Temáticos
1. Desenvolvimento Regional e Redução de Desigualdades
2. Educação e Capital Humano
3. Saúde e Qualidade de Vida
4. Infraestrutura e Conectividade
5. Meio Ambiente e Sustentabilidade
6. Segurança Pública e Cidadania
7. Gestão Pública e Inovação (eixo transversal — convergência acadêmica)

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

## Antes de Qualquer Tarefa
1. Identifique qual eixo temático e qual camada (dados/conteúdo/interface) o trabalho endereça
2. Considere a dupla leitura (valor prático + valor acadêmico)
3. Verifique se há dados do tocantins-integrado que devem ser integrados
4. Mantenha o design mobile-first
