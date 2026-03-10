# Plano de Governo Interativo do Tocantins

Plataforma web pública que apresenta o plano de governo do Tocantins de forma interativa, conectando propostas a dados reais do território (139 municípios).

## Conceito

Diferente de um PDF tradicional de plano de governo, esta plataforma permite ao cidadão:

- Visualizar como cada proposta se conecta a dados reais do território
- Filtrar propostas relevantes para seu município ou região
- Entender a lógica de priorização das propostas
- Navegar por múltiplos caminhos: por eixo temático, município, região ou tema
- Interagir com um assistente de IA para explorar propostas e dados
- Registrar contribuições e prioridades no canal de escuta cidadã

## Stack Técnica

| Componente | Tecnologia |
|---|---|
| Framework | Next.js 16+ (App Router) com TypeScript |
| Estilização | Tailwind CSS 4 |
| Mapas | Leaflet + react-leaflet |
| Ícones | lucide-react |
| Dados | JSONs do tocantins-integrado |
| IA/LLM | Integração com API de LLM (assistente conversacional e processamento de contribuições) |
| Deploy | Vercel |

## Começando

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

Acesse [http://localhost:3000](http://localhost:3000) após rodar `npm run dev`.

## Estrutura do Projeto

```
plano-governo-interativo/
├── docs/                  # Documentação (outline, conteúdo dos eixos)
│   ├── eixos/             # Conteúdo detalhado por eixo temático
│   └── wireframes/        # Mockups e protótipos
├── src/
│   ├── app/               # Páginas (App Router)
│   ├── components/        # Componentes React reutilizáveis
│   │   ├── eixos/         # Componentes dos eixos temáticos
│   │   ├── layout/        # Header, Footer, Navigation
│   │   ├── mapa/          # Mapa interativo do Tocantins
│   │   └── ui/            # Componentes de interface genéricos
│   ├── data/              # Dados estáticos (eixos, municípios, indicadores)
│   └── lib/               # Utilitários e helpers
├── public/
│   ├── geojson/           # Contornos dos municípios (IBGE)
│   └── images/            # Imagens e ícones estáticos
├── CLAUDE.md              # Instruções para agentes IA
└── README.md              # Este arquivo
```

## Eixos Temáticos

1. **Desenvolvimento Regional** — Redução de desigualdades entre municípios
2. **Educação e Capital Humano** — Indicadores educacionais e qualificação
3. **Saúde e Qualidade de Vida** — Acesso a serviços de saúde
4. **Infraestrutura e Conectividade** — Logística, internet, saneamento
5. **Meio Ambiente e Sustentabilidade** — Cerrado-Amazônia, queimadas, bioeconomia
6. **Segurança Pública e Cidadania** — Violência, policiamento, atendimento
7. **Gestão Pública e Inovação** — Inteligência territorial, governo digital
8. **Agropecuária e Desenvolvimento Rural** — Competitividade com desenvolvimento social
9. **Mineração Sustentável** — Recursos minerais com responsabilidade ambiental
10. **Industrialização e Atração de Investimentos** — Emprego qualificado e valor agregado

## Funcionalidades de IA

A plataforma incorpora inteligência artificial em três dimensões:

1. **Exploração Assistida** — Assistente conversacional que permite perguntas em linguagem natural sobre propostas, dados e municípios
2. **Escuta Inclusiva** — Canal de participação cidadã com IA que ajuda a organizar contribuições em linguagem livre
3. **Inteligência para Planejamento** — Contribuições processadas para identificar padrões e prioridades por município e região

## Conexão Acadêmica

Este projeto é parte do Ciclo 4 da pesquisa-ação do doutorado em Políticas Públicas (ENAP), investigando como a Inteligência Territorial apoiada por IA (IT-IA) pode informar a elaboração de políticas públicas.

## Licença

Todos os direitos reservados. Dados públicos originados de fontes oficiais (IBGE, INEP, DATASUS, etc.).
