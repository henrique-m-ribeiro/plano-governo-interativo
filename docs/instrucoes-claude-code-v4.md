# Instruções para atualização do repositório plano-governo-interativo

## Contexto
O repositório `plano-governo-interativo` possui um scaffolding funcional (Next.js 16, Tailwind, Leaflet, 10 eixos, 139 municípios). Porém, o memo estratégico (v4) que apresenta a plataforma à Senadora Professora Dorinha incluiu mudanças estruturais que ainda não estão refletidas no código:
1. **Expansão de 7 para 10 eixos temáticos** (adição de Agropecuária, Mineração e Industrialização)
2. **Três funcionalidades de IA** (exploração assistida, escuta inclusiva, inteligência para planejamento)
3. **Origem do diagnóstico** na Secretaria de Planejamento do Tocantins (caderno-tocantins-2026), com narrativa de "aproveitar e aperfeiçoar o que há de bom, mudar o que não está dando certo"

As alterações abaixo atualizam a plataforma para refletir a proposta completa.

---

## BLOCO 1 — Identidade e branding (prioridade alta)

### 1.1 Atualizar referências para Professora Dorinha
- No `src/app/layout.tsx`: atualizar metadata (title, description) para mencionar "Professora Dorinha" e "Plano de Governo"
- No hero da `src/app/page.tsx`: ajustar o subtítulo para conectar a plataforma à candidatura de Professora Dorinha ao governo do Tocantins
- No `src/components/layout/footer.tsx`: incluir referência institucional à Senadora

### 1.2 Atualizar CLAUDE.md
Adicionar ao CLAUDE.md:
- Referência à Senadora Professora Dorinha como destinatária da plataforma
- **Nova seção "Funcionalidades de IA"** documentando as 3 dimensões: exploração assistida, escuta inclusiva, inteligência para planejamento
- Na seção Stack Técnica: adicionar "IA/LLM: integração com API de LLM para assistente conversacional e processamento de contribuições"

---

## BLOCO 2 — Expansão para 10 eixos + fonte SEPLAN (prioridade alta)

### 2.1 Atualizar `src/data/eixos.ts`
A estrutura atual tem 10 eixos com 3 propostas cada. Expandir para 10 eixos adicionando:

```typescript
// Eixo 8
{
  id: 8,
  slug: "agropecuaria",
  titulo: "Agropecuária e Desenvolvimento Rural",
  subtitulo: "Competitividade do setor como motor de desenvolvimento econômico e social",
  cor: "#8B6914",
  icone: "Wheat",
  problema: "O Tocantins possui enorme potencial agropecuário, mas a cadeia produtiva ainda é concentrada em poucos municípios e o valor agregado permanece baixo, com exportação predominante de grãos e gado in natura, sem industrialização local que gere emprego e renda para toda a população.",
  indicadores: ["Valor Bruto da Produção Agropecuária", "Área plantada vs. produtividade", "Empregos formais no agronegócio"],
  propostas: [
    // 3 propostas com foco em competitividade + desenvolvimento social
  ]
}

// Eixo 9
{
  id: 9,
  slug: "mineracao",
  titulo: "Mineração Sustentável",
  subtitulo: "Aproveitamento responsável dos recursos minerais com atenção ao meio ambiente",
  cor: "#6B7280",
  icone: "Mountain",
  problema: "O Tocantins possui reservas minerais significativas, mas a exploração ainda é desordenada em muitas regiões, com impactos ambientais e sociais que poderiam ser mitigados com regulação moderna, fiscalização efetiva e exigência de contrapartidas para o desenvolvimento local.",
  indicadores: ["Receita de CFEM por município", "Licenças ambientais vigentes", "Empregos no setor mineral"],
  propostas: [
    // 3 propostas com foco em sustentabilidade + desenvolvimento local
  ]
}

// Eixo 10
{
  id: 10,
  slug: "industrializacao",
  titulo: "Industrialização e Atração de Investimentos",
  subtitulo: "Fixação de indústrias e melhores oportunidades de trabalho",
  cor: "#4338CA",
  icone: "Factory",
  problema: "O Tocantins exporta matéria-prima bruta e importa produtos manufaturados. A ausência de parque industrial robusto limita as oportunidades de emprego qualificado e faz com que a riqueza gerada no estado seja transferida para outras regiões sem beneficiar a população local.",
  indicadores: ["Participação industrial no PIB estadual", "Empregos industriais formais", "Balança comercial de manufaturados"],
  propostas: [
    // 3 propostas com foco em atração de investimentos + empregabilidade
  ]
}
```

**Importante:** Os novos eixos devem seguir exatamente a mesma interface TypeScript (`Eixo`, `Proposta`) que os 7 existentes. As propostas podem ser redigidas com base no contexto dos cadernos municipais (repo caderno-tocantins-2026).

### 2.2 Atualizar referências numéricas
Em todos os arquivos que mencionam "10 eixos", atualizar para "10 eixos":
- `src/app/page.tsx` — StatCard de eixos (7 → 10)
- `src/app/eixos/page.tsx` — título ou descrição
- `src/app/sobre/page.tsx` — texto explicativo
- `CLAUDE.md` — seção "Estrutura dos Eixos Temáticos" (adicionar eixos 8, 9, 10)
- `README.md` — lista de eixos

### 2.3 Atualizar `src/app/sobre/page.tsx` — Origem do diagnóstico
Adicionar nova seção antes de "Fontes de Dados":
- Título: "Base do diagnóstico"
- Texto explicando que o diagnóstico territorial parte do trabalho realizado pela Secretaria de Planejamento do Tocantins, com indicadores municipalizados de alta qualidade
- Reforçar a narrativa: "A plataforma valoriza esse trabalho já feito, e vai além: complementa o diagnóstico técnico com a escuta ativa da população, da academia, dos governos municipais e da sociedade civil. Vamos aproveitar e aperfeiçoar o que há de bom, e vamos mudar o que não está dando certo."
- Referência ao repositório caderno-tocantins-2026 como fonte dos dados municipais processados

### 2.4 Atualizar `src/data/navegacao.ts` — ícones dos novos eixos
Garantir que os ícones dos novos eixos (Wheat, Mountain, Factory) estão importados no lucide-react. Se não existirem, usar alternativas próximas disponíveis na biblioteca.

---

## BLOCO 3 — Nova página /participar (prioridade alta)
<!-- renumerado de BLOCO 2 original -->

Criar `src/app/participar/page.tsx` — **Canal de Escuta Cidadã**

Esta é a principal adição conceitual ao scaffolding. A página deve ter:

### 2.1 Seção superior: explicação
- Título: "Sua Voz no Plano de Governo"
- Subtítulo explicando que o cidadão pode registrar demandas, sugestões e prioridades para seu município
- Nota de acessibilidade: "Pode escrever como quiser — a inteligência artificial nos ajuda a organizar sua contribuição"

### 2.2 Formulário de contribuição assistido por IA
Campos:
- **Município** (select com os 139 municípios)
- **Eixo temático** (select com os 10 eixos + opção "Não sei / Outro")
- **Sua contribuição** (textarea amplo, com placeholder acolhedor tipo "Conte o que é mais importante para você e sua comunidade...")
- **Nome** (opcional)
- **Contato** (opcional — WhatsApp ou email)
- Botão de envio

### 2.3 Componente `AssistenteEscuta` (placeholder)
Um componente que simula o assistente de IA:
- Mostra um ícone de chat/microfone
- Texto: "Precisa de ajuda para escrever? Clique aqui e a inteligência artificial ajuda você a organizar suas ideias."
- Quando clicado, abre um chat placeholder com mensagem: "Olá! Me conte com suas palavras o que é mais importante para a sua cidade. Eu ajudo a organizar."
- Por enquanto, esse chat é um placeholder visual (a integração real com LLM será feita posteriormente)

### 2.4 Seção inferior: transparência
- "O que acontece com sua contribuição?"
- Explicar o fluxo: contribuição → processamento por IA → identificação de padrões → incorporação ao plano
- Reforçar que a escuta continua mesmo após a eleição

---

## BLOCO 4 — Assistente de exploração (prioridade alta)

### 3.1 Componente `AssistenteIA` (chat flutuante)
Criar `src/components/ia/assistente-ia.tsx`:
- Botão flutuante no canto inferior direito (ícone MessageCircle ou similar)
- Ao clicar, abre um painel de chat
- Mensagem inicial: "Olá! Sou o assistente do Plano de Governo. Pergunte sobre propostas, dados ou municípios. Exemplo: 'Quais as propostas para educação em Araguaína?'"
- Campo de input para perguntas
- **Por enquanto, é um placeholder visual** — as respostas podem ser pré-programadas (hardcoded) para 3-4 perguntas demonstrativas, ou simplesmente exibir "Estamos preparando o assistente. Em breve você poderá fazer perguntas aqui."
- O componente deve ser importado no layout.tsx para aparecer em todas as páginas

### 3.2 Criar `src/components/ia/chat-message.tsx`
Componente de mensagem de chat (bolha usuário / bolha assistente) para reutilização tanto no assistente quanto na página /participar.

---

## BLOCO 5 — Navegação atualizada (prioridade alta)

### 4.1 Atualizar `src/data/navegacao.ts`
Adicionar à navegação principal:
```typescript
{
  titulo: "Participe",
  href: "/participar",
  descricao: "Registre demandas e prioridades para seu município",
  icone: "MessageCircle",
}
```

### 4.2 Atualizar `src/app/page.tsx`
Na seção "Como você quer navegar?", adicionar um 5º card:
- Ícone: MessageCircle (lucide-react)
- Título: "Sua Voz"
- Descrição: "Registre o que é prioritário para o seu município."
- Link: /participar

Adicionar uma seção na home page (entre o mapa e os eixos, ou após os eixos) com destaque para a funcionalidade de IA:
- Título: "Uma plataforma que escuta"
- Texto breve explicando as 3 dimensões: exploração assistida, participação cidadã, inteligência para planejamento
- CTA: "Participe" (link para /participar)

### 4.3 Atualizar `src/components/layout/header.tsx`
Garantir que o link "Participe" aparece no menu de navegação (desktop e mobile).

---

## BLOCO 6 — Página /sobre atualizada (prioridade média)

### 5.1 Atualizar `src/app/sobre/page.tsx`
Adicionar nova seção "Inteligência Artificial a Serviço do Cidadão" com 3 cards:
1. **Exploração Assistida** — ícone Bot/MessageCircle — "Faça perguntas em linguagem natural sobre propostas, dados e municípios"
2. **Escuta Inclusiva** — ícone Heart/Users — "Canal de participação com IA que ajuda quem tem dificuldade em preencher formulários"
3. **Inteligência para o Planejamento** — ícone Brain/TrendingUp — "Contribuições processadas para identificar padrões e prioridades por município e região"

Adicionar parágrafo explicando que a plataforma não é estática: as contribuições dos cidadãos alimentam o plano, que se atualiza com base na escuta do território.

---

## BLOCO 7 — Estrutura de dados para contribuições (prioridade média)

### 6.1 Criar `src/data/contribuicoes.ts`
Definir interfaces TypeScript:
```typescript
export interface Contribuicao {
  id: string;
  municipioId: number;
  eixoId: number | null; // null = "Não sei / Outro"
  texto: string;
  textoProcessado?: string; // versão organizada pela IA
  nome?: string;
  contato?: string;
  dataRegistro: string; // ISO 8601
  tags?: string[]; // extraídas por IA
  sentimento?: 'positivo' | 'neutro' | 'negativo';
}

export interface ResumoEscuta {
  municipioId: number;
  totalContribuicoes: number;
  principaisTemas: string[];
  prioridadesCidadao: string[];
  ultimaAtualizacao: string;
}
```

### 6.2 Criar `src/app/api/contribuicoes/route.ts` (placeholder)
API route Next.js que:
- POST: recebe uma contribuição (por enquanto, loga no console e retorna sucesso)
- GET: retorna array vazio (placeholder para quando houver backend)
- Comentário documentando que a integração real será com Supabase ou similar

---

## BLOCO 8 — Ajustes menores (prioridade baixa)

### 7.1 Componente `src/components/ui/ia-badge.tsx`
Badge/tag visual que indica funcionalidade de IA. Usado nas páginas que têm integração com IA (buscar, participar, assistente). Cor diferenciada (ex: gradient ou ícone de sparkle).

### 7.2 Atualizar `src/app/buscar/page.tsx`
Adicionar nota visual: "Em breve: busca por linguagem natural com inteligência artificial" — indicando que a busca atual (por texto) será evoluída para busca conversacional.

### 7.3 Atualizar `README.md`
Refletir as novas funcionalidades de IA na descrição do projeto. Mencionar as 3 dimensões: exploração assistida, escuta inclusiva, inteligência para planejamento.

---

## Ordem de execução recomendada
1. **CLAUDE.md** (BLOCO 1.2) — atualizar contexto antes de tudo
2. **Eixos: 7 → 10** (BLOCO 2.1, 2.2) — expandir dados e referências
3. **Fonte SEPLAN** (BLOCO 2.3) — adicionar origem do diagnóstico na página Sobre
4. **Navegação** (BLOCO 5.1) — adicionar rota /participar
5. **Página /participar** (BLOCO 3) — canal de escuta cidadã
6. **Assistente IA** (BLOCO 4) — chat flutuante placeholder
7. **Home page** (BLOCO 5.2) — novo card + seção "plataforma que escuta"
8. **Sobre** (BLOCO 6) — seção de IA
9. **Estrutura de dados** (BLOCO 7) — interfaces e API placeholder
10. **Branding Dorinha** (BLOCO 1.1) — personalização
11. **Ajustes menores** (BLOCO 8)

---

## Notas importantes
- **Todos os componentes de IA são placeholders visuais** neste momento. A integração real com LLM será feita em etapa posterior. O objetivo agora é que a plataforma reflita visualmente a proposta completa do memo v3.
- Manter os **comentários em português** conforme convenção do projeto.
- Manter o **design mobile-first** — o chat flutuante e a página /participar devem funcionar bem em celular.
- O eixo "Participação Cidadã" não é um 11º eixo temático — é uma funcionalidade transversal que alimenta todos os 10 eixos.
- Os 3 novos eixos (Agropecuária, Mineração, Industrialização) refletem as vocações econômicas do Tocantins e dialogam com pautas que geram engajamento no eleitorado, segundo análise da SIS Brasil.
- O diagnóstico territorial parte do trabalho da Secretaria de Planejamento do Tocantins (dados no repo caderno-tocantins-2026). A plataforma aproveita e aperfeiçoa esse trabalho, complementando-o com escuta ativa. A narrativa é: "vamos aproveitar o que há de bom e mudar o que não está dando certo."
- Registrar na documentação (CLAUDE.md ou docs/) que a dimensão de escuta conecta com a pesquisa de doutorado (PS2, PS3, OE3, OE4).
