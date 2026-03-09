# Outline: Plano de Governo Interativo do Tocantins

**Status:** Rascunho v1 — para discussão e refinamento
**Data:** 2026-03-03
**Frente:** F4 — Artefatos Político-Governamentais
**Entrega prevista:** Julho de 2026
**Audiência:** Público (web aberta, acessível ao eleitor)
**Conexão acadêmica:** PS2 (transformações na gestão), OE3 (como IT-IA informa elaboração de políticas)

---

## 1. Conceito

Um Plano de Governo Interativo é uma plataforma web pública onde o cidadão tocantinense pode navegar pelas propostas de governo de forma não linear — por eixo temático, por município, por indicador, ou por problema identificado. Diferente de um PDF tradicional de plano de governo, a versão interativa permite:

- Visualizar como cada proposta se conecta a dados reais do território (do dashboard tocantins-integrado).
- Filtrar propostas relevantes para seu município ou região.
- Entender a lógica de priorização (por que esta proposta e não outra?).
- Contribuir com sugestões (integração com a Plataforma de Sugestões Cidadãs — Fase 2).

---

## 2. Arquitetura proposta

### Camada 1: Diagnóstico territorial (dados)
Alimentada pelo dashboard tocantins-integrado. O cidadão visualiza a situação de seu município antes de ver as propostas. Isso cria o vínculo entre dados e propostas — a proposta não é genérica, é resposta a um diagnóstico.

### Camada 2: Propostas por eixo temático (conteúdo)
Cada proposta vinculada a indicadores, metas, e municípios prioritários.

### Camada 3: Navegação interativa (interface)
Múltiplos caminhos de entrada: por município, por tema, por problema, por região.

### Camada 4 (futura): Participação cidadã
Recebimento e processamento de sugestões — conecta com a Plataforma de Sugestões Cidadãs.

---

## 3. Eixos temáticos propostos

Baseados no perfil socioeconômico do Tocantins (139 municípios, IDH 0,699, economia agropecuária com polos urbanos em Palmas, Araguaína e Gurupi) e nas competências de um governo estadual.

### Eixo 1: Desenvolvimento Regional e Redução de Desigualdades
**Problema central:** Forte concentração econômica em poucos polos, com ampla maioria dos municípios em situação de vulnerabilidade.
**Indicadores-chave:** PIB per capita por município, índice de desigualdade intermunicipal, taxa de urbanização, fluxos migratórios internos.
**Propostas-tipo:** Polos regionais de desenvolvimento, descentralização de investimentos, fortalecimento de cadeias produtivas locais.

### Eixo 2: Educação e Capital Humano
**Problema central:** Indicadores educacionais abaixo da média nacional em muitos municípios, evasão escolar no ensino médio, baixa qualificação profissional.
**Indicadores-chave:** IDEB, taxa de abandono escolar, matrículas no ensino técnico/superior, cobertura de creches.
**Propostas-tipo:** Expansão do ensino técnico integrado, parcerias com universidades, programas de primeira infância.

### Eixo 3: Saúde e Qualidade de Vida
**Problema central:** Acesso desigual a serviços de saúde, dependência de deslocamento a grandes centros, indicadores materno-infantis preocupantes em municípios menores.
**Indicadores-chave:** Cobertura da atenção básica, mortalidade infantil, leitos per capita, tempo de deslocamento para serviço de média complexidade.
**Propostas-tipo:** Telemedicina, fortalecimento de hospitais regionais, programa estadual de saúde da mulher.

### Eixo 4: Infraestrutura e Conectividade
**Problema central:** Logística precária em municípios afastados, baixa conectividade digital, déficit habitacional.
**Indicadores-chave:** Malha rodoviária pavimentada, acesso à internet banda larga, cobertura de saneamento, déficit habitacional.
**Propostas-tipo:** Programa de estradas vicinais, expansão de internet em áreas rurais, regularização fundiária.

### Eixo 5: Meio Ambiente e Sustentabilidade
**Problema central:** Tocantins na transição Cerrado-Amazônia, pressão do agronegócio, queimadas, recursos hídricos.
**Indicadores-chave:** Área desmatada, focos de incêndio, unidades de conservação, qualidade da água.
**Propostas-tipo:** Programa estadual de combate a queimadas, ICMS ecológico, bioeconomia do Cerrado.

### Eixo 6: Segurança Pública e Cidadania
**Problema central:** Indicadores de violência crescentes em polos urbanos, violência contra a mulher, déficit de efetivo policial em municípios menores.
**Indicadores-chave:** Taxa de homicídios, feminicídios, efetivo policial per capita, ocorrências por tipo.
**Propostas-tipo:** Programa de policiamento comunitário, centros de atendimento à mulher, integração de dados de segurança.

### Eixo 7: Gestão Pública e Inovação (eixo transversal)
**Problema central:** Baixa capacidade institucional de muitos municípios, gestão baseada em intuição e não em dados, fragmentação de políticas.
**Indicadores-chave:** IEGM (TCE), receita própria vs. transferências, índice de transparência, digitalização de serviços.
**Propostas-tipo:** Plataforma estadual de inteligência territorial (evolução do dashboard), programa de capacitação de gestores municipais, governo digital.

**Nota:** Este eixo é onde o projeto acadêmico e o artefato político convergem mais diretamente. A proposta de IT-IA para o estado é simultaneamente proposta de governo e objeto de pesquisa.

---

## 4. Estrutura de navegação da plataforma

```
Página Inicial
├── "Conheça o Tocantins" → Mapa interativo com indicadores por município
│   └── Clique no município → Ficha municipal (do Caderno Tocantins) + propostas relevantes
├── "Eixos do Plano" → 7 eixos temáticos
│   └── Clique no eixo → Diagnóstico + propostas + metas + municípios prioritários
├── "Buscar por tema" → Campo de busca livre
│   └── Resultados filtrados com propostas e dados relacionados
├── "Sua região" → Navegação por regiões de planejamento
│   └── Diagnóstico regional + propostas regionalizadas
└── "Participe" (Fase 2) → Formulário de sugestões
    └── Integração com Plataforma de Sugestões Cidadãs
```

---

## 5. Stack técnica sugerida

| Componente | Tecnologia | Justificativa |
|---|---|---|
| Frontend | React + Next.js | SSR para SEO, performance em dispositivos modestos |
| Visualização | Mapbox ou Leaflet + D3.js | Mapas interativos do Tocantins, gráficos dinâmicos |
| Backend | API leve (Node.js ou Python/FastAPI) | Servir dados do dashboard |
| Dados | Mesmo banco do tocantins-integrado | Consistência de dados, sem duplicação |
| Hospedagem | Vercel ou similar | Deploy rápido, CDN, baixo custo |
| Acessibilidade | WCAG 2.1 AA | Obrigatório para plataforma pública |
| Mobile | Responsivo (mobile-first) | Maioria do acesso será por celular |

---

## 6. Cronograma preliminar

| Marco | Data | Entregável |
|---|---|---|
| Outline aprovado | Março 2026 | Este documento (revisado) |
| Definição de eixos e propostas (conteúdo) | Abril 2026 | Documento de conteúdo por eixo |
| Protótipo navegável (wireframe) | Maio 2026 | Figma ou protótipo HTML |
| Desenvolvimento v1 | Junho 2026 | Plataforma funcional com dados reais |
| Revisão e testes | Julho 2026 | Versão final para lançamento |
| Lançamento público | Julho-Agosto 2026 | Início da campanha |
| Integração com Plataforma de Sugestões (Fase 2) | Agosto 2026 | Módulo "Participe" |

---

## 7. Dupla leitura

**Valor prático:** Ferramenta de campanha que demonstra capacidade de gestão baseada em dados, diferencial competitivo frente a planos de governo tradicionais (PDF genérico). Engajamento do eleitor com propostas concretas para seu município.

**Valor acadêmico:** Demonstração empírica de como a IT-IA pode informar a elaboração de políticas públicas (PS2). Teste de como a visualização de dados territoriais altera a percepção e participação cidadã. Artefato do Ciclo 4/5 da pesquisa-ação. Dados de uso da plataforma (analytics) são dados de pesquisa.

---

## 8. Riscos e mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Conteúdo genérico (propostas sem dados) | Média | Alto | Vincular cada proposta a indicadores reais do dashboard |
| Atraso no desenvolvimento | Alta | Alto | Priorizar MVP com 3 eixos e expandir iterativamente |
| Baixo acesso pela população | Média | Médio | Design mobile-first, linguagem acessível, divulgação em redes sociais |
| Dados desatualizados | Baixa | Alto | Usar mesma base do dashboard (atualização centralizada) |
| Confusão com material partidário | Média | Alto | Tom institucional, transparência metodológica, fontes públicas citadas |

---

## 9. Próximos passos

1. **Revisar este outline** com a equipe da senadora — validar eixos e abordagem.
2. **Definir conteúdo por eixo** — propostas, metas, indicadores (T04 → T04B).
3. **Prototipar a navegação** — wireframe ou mockup interativo.
4. **Avaliar viabilidade técnica** com Claude Code (integração com tocantins-integrado).
5. **Definir equipe de desenvolvimento** — quem codifica, quem produz conteúdo, quem revisa.
