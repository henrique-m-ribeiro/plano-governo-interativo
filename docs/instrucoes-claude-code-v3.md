# Instruções para atualização do repositório plano-governo-interativo

## Contexto
O repositório `plano-governo-interativo` possui um scaffolding funcional (Next.js 16, Tailwind, Leaflet, 7 eixos, 139 municípios). Porém, o memo estratégico (v3) que apresenta a plataforma à Senadora Professora Dorinha incluiu **três novas funcionalidades de IA** que ainda não estão refletidas no código. As alterações abaixo atualizam a plataforma para refletir a proposta completa.

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

## BLOCO 2 — Nova página /participar (prioridade alta)

Criar `src/app/participar/page.tsx` — **Canal de Escuta Cidadã**

Esta é a principal adição conceitual ao scaffolding. A página deve ter:

### 2.1 Seção superior: explicação
- Título: "Sua Voz no Plano de Governo"
- Subtítulo explicando que o cidadão pode registrar demandas, sugestões e prioridades para seu município
- Nota de acessibilidade: "Pode escrever como quiser — a inteligência artificial nos ajuda a organizar sua contribuição"

### 2.2 Formulário de contribuição assistido por IA
Campos:
- **Município** (select com os 139 municípios)
- **Eixo temático** (select com os 7 eixos + opção "Não sei / Outro")
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

## BLOCO 3 — Assistente de exploração (prioridade alta)

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

## BLOCO 4 — Navegação atualizada (prioridade alta)

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

## BLOCO 5 — Página /sobre atualizada (prioridade média)

### 5.1 Atualizar `src/app/sobre/page.tsx`
Adicionar nova seção "Inteligência Artificial a Serviço do Cidadão" com 3 cards:
1. **Exploração Assistida** — ícone Bot/MessageCircle — "Faça perguntas em linguagem natural sobre propostas, dados e municípios"
2. **Escuta Inclusiva** — ícone Heart/Users — "Canal de participação com IA que ajuda quem tem dificuldade em preencher formulários"
3. **Inteligência para o Planejamento** — ícone Brain/TrendingUp — "Contribuições processadas para identificar padrões e prioridades por município e região"

Adicionar parágrafo explicando que a plataforma não é estática: as contribuições dos cidadãos alimentam o plano, que se atualiza com base na escuta do território.

---

## BLOCO 6 — Estrutura de dados para contribuições (prioridade média)

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

## BLOCO 7 — Ajustes menores (prioridade baixa)

### 7.1 Componente `src/components/ui/ia-badge.tsx`
Badge/tag visual que indica funcionalidade de IA. Usado nas páginas que têm integração com IA (buscar, participar, assistente). Cor diferenciada (ex: gradient ou ícone de sparkle).

### 7.2 Atualizar `src/app/buscar/page.tsx`
Adicionar nota visual: "Em breve: busca por linguagem natural com inteligência artificial" — indicando que a busca atual (por texto) será evoluída para busca conversacional.

### 7.3 Atualizar `README.md`
Refletir as novas funcionalidades de IA na descrição do projeto. Mencionar as 3 dimensões: exploração assistida, escuta inclusiva, inteligência para planejamento.

---

## Ordem de execução recomendada
1. **CLAUDE.md** (BLOCO 1.2) — atualizar contexto antes de tudo
2. **Navegação** (BLOCO 4.1) — adicionar rota /participar
3. **Página /participar** (BLOCO 2) — principal adição
4. **Assistente IA** (BLOCO 3) — chat flutuante placeholder
5. **Home page** (BLOCO 4.2) — novo card + seção "plataforma que escuta"
6. **Sobre** (BLOCO 5) — seção de IA
7. **Estrutura de dados** (BLOCO 6) — interfaces e API placeholder
8. **Branding Dorinha** (BLOCO 1.1) — personalização
9. **Ajustes menores** (BLOCO 7)

---

## Notas importantes
- **Todos os componentes de IA são placeholders visuais** neste momento. A integração real com LLM será feita em etapa posterior. O objetivo agora é que a plataforma reflita visualmente a proposta completa do memo v3.
- Manter os **comentários em português** conforme convenção do projeto.
- Manter o **design mobile-first** — o chat flutuante e a página /participar devem funcionar bem em celular.
- O eixo "Participação Cidadã" não é um 8º eixo temático — é uma funcionalidade transversal que alimenta todos os 7 eixos.
- Registrar na documentação (CLAUDE.md ou docs/) que a dimensão de escuta conecta com a pesquisa de doutorado (PS2, PS3, OE3, OE4).
