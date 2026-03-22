# Handoff Cowork → Claude Code — Etapas I-4, I-5, I-6 (consolidado)

> Data: 2026-03-22
> Precedência: I-3d (branch `claude/i3d-realinhamento-eixos-lJeTm`, mergeada em main)
> Referência: `doutorado/02-pesquisa-acao/plano-incorporacao-mvp.md` (Fase I, seções I-4, I-5, I-6)

## Contexto

A Fase I (Dados Fundacionais) está quase concluída. As etapas I-1 a I-3d criaram:
- `municipios_referencia.json` — 139 municípios, 8 regionais SEPLAN, cod_ibge
- `municipios.ts` — já reestruturado com 139 objetos tipados (I-3), mas com 18 indicadores inline
- `regioes.ts` — já reestruturado com 8 regionais SEPLAN (I-3)
- 10 JSONs em `src/data/indicadores/` — 60 indicadores, 79.927 datapoints (I-3d)
- GeoJSON em `data/pipeline/geoportal-seplan/geojson/municipios_tocantins.geojson` — 139 features, EPSG:4674
- `react-leaflet` e `leaflet` já instalados no `package.json`

**O que falta para concluir a Fase I:**
1. **I-4:** Refinar `municipios.ts` (remover indicadores inline, usar dados dos JSONs)
2. **I-5:** Conectar `eixos.ts` aos JSONs de indicadores (substituir `indicadoresChave` genéricos)
3. **I-6:** Substituir `MapaPlaceholder` por mapa interativo real com Leaflet + GeoJSON

## Repositório e Branch

- **Repo:** `plano-governo-interativo`
- **Branch base:** `main`
- **Nova branch:** criar `claude/i456-fase-i-final` a partir de main

## O que NÃO fazer

- Não alterar os 10 JSONs em `src/data/indicadores/` (são a fonte de verdade)
- Não alterar `municipios_referencia.json`
- Não alterar as propostas em `eixos.ts` (conteúdo será curado na Fase II)
- Não instalar dependências além do necessário para Leaflet (já instalado)
- Não criar novas páginas — apenas modificar as existentes

---

## Etapa I-4: Refinar municipios.ts

### Problema atual

O `municipios.ts` (3.953 linhas, gerado pela I-3) tem 18 indicadores inline por município:
```typescript
indicadores: {
  populacao2022: 2576,
  pib2023: 141930,
  pibPerCapita2023: null,  // ← 100% null em todos os 139 municípios!
  vaAgropecuaria: 74730000,
  // ... etc
}
```

Isso é redundante com os JSONs por eixo e dificulta a manutenção. Além disso, `pibPerCapita2023` é 100% null (140 de 142 ocorrências).

### O que fazer

1. **Simplificar a interface `Municipio`** para conter apenas metadados:
```typescript
export interface Municipio {
  codIbge: number;
  nome: string;
  regional: string;
  regionalSlug: string;
  macrorregional: string;
  polo: string;
}
```

2. **Remover o objeto `indicadores`** inline — todos os indicadores estão nos JSONs por eixo.

3. **Criar função utilitária `getIndicadoresMunicipio(codIbge: number)`** que:
   - Carrega os 10 JSONs
   - Retorna todos os indicadores daquele município, agrupados por eixo
   - Pode ser usada por páginas que precisam de dados municipais

4. **Atualizar imports que dependem de `Indicadores`:**
   - `src/app/participar/page.tsx` — importa municipios (verificar uso)
   - Verificar se alguma página usa `municipio.indicadores.*` diretamente

5. **Manter `codIbge` como `number`** (já é assim, manter consistente)

### Verificação I-4
- [ ] Build (`npm run build`) sem erros
- [ ] 139 municípios em municipios.ts
- [ ] Nenhum campo `indicadores` inline
- [ ] Função `getIndicadoresMunicipio` funcional
- [ ] Páginas que usavam indicadores inline continuam funcionando

---

## Etapa I-5: Conectar eixos.ts aos JSONs

### Problema atual

O `eixos.ts` (540 linhas) tem `indicadoresChave` como array de strings genéricas:
```typescript
indicadoresChave: [
  "PIB per capita por município",
  "Índice de desigualdade intermunicipal",
  "Taxa de urbanização",
  "Fluxos migratórios internos",
],
```

Esses nomes não correspondem aos IDs dos indicadores reais nos JSONs. A página `/eixos/[slug]` apenas renderiza essas strings, sem dados numéricos.

### O que fazer

1. **Criar função `getIndicadoresEixo(numero: number)`** que:
   - Carrega o JSON correspondente (`eixo-{numero:02d}.json`)
   - Retorna a lista de indicadores com metadados (nome, fonte, anos, cobertura)
   - Retorna valores estaduais agregados (média, mediana, min, max por indicador)

2. **Atualizar `indicadoresChave` em `eixos.ts`** para referenciar os IDs reais:
```typescript
indicadoresChave: [
  "populacao",
  "pib_percapita",
  "taxa_urbanizacao",
  "crescimento_demografico",
  "pib_total",
  "va_servicos",
  "populacao_censitaria",
],
```

3. **Atualizar a página `/eixos/[slug]/page.tsx`** para:
   - Importar os indicadores do JSON
   - Mostrar tabela/cards com valores reais (nome, valor estadual médio/mediano, fonte, período)
   - Substituir a lista de strings por componentes com dados

4. **Atualizar a página `/eixos/page.tsx`** (listagem) para:
   - Mostrar o número real de indicadores por eixo (do JSON)
   - Mostrar período de cobertura

5. **NÃO alterar as `propostas`** — essas serão curadas na Fase II. Manter o conteúdo atual.

### Mapeamento eixos.ts slug → JSON

| eixos.ts slug | JSON file | Confirmado |
|---|---|---|
| desenvolvimento-regional | eixo-01.json | ✅ |
| educacao-capital-humano | eixo-02.json | ✅ |
| saude-qualidade-vida | eixo-03.json | ✅ |
| infraestrutura-conectividade | eixo-04.json | ✅ |
| meio-ambiente-sustentabilidade | eixo-05.json | ✅ |
| seguranca-publica-cidadania | eixo-06.json | ✅ |
| gestao-publica-inovacao | eixo-07.json | ✅ |
| agropecuaria | eixo-08.json | ✅ |
| mineracao | eixo-09.json | ✅ |
| industrializacao | eixo-10.json | ✅ |

### Verificação I-5
- [ ] Todos os 10 eixos mostram indicadores reais na página `/eixos/[slug]`
- [ ] Nenhum indicador com valor "placeholder" ou string genérica
- [ ] Número de indicadores por eixo consistente com JSONs
- [ ] Build sem erros
- [ ] Página `/eixos` mostra contagem real de indicadores

---

## Etapa I-6: Integrar GeoJSON no Mapa

### Estado atual
- `react-leaflet@5.0.0`, `leaflet@1.9.4`, `@types/leaflet@1.9.21` já instalados
- `MapaPlaceholder` em `src/components/mapa/mapa-placeholder.tsx` — componente placeholder
- GeoJSON em `data/pipeline/geoportal-seplan/geojson/municipios_tocantins.geojson` (187 KB, 139 features, EPSG:4674, propriedade `codarea` para join)
- Página `/mapa/page.tsx` usa `<MapaPlaceholder />`
- Filtro de região menciona "6 regiões" — atualizar para 8

### O que fazer

1. **Copiar GeoJSON para `public/data/`** (acessível via URL no cliente):
   ```
   cp data/pipeline/geoportal-seplan/geojson/municipios_tocantins.geojson public/data/tocantins-municipios.geojson
   ```

2. **Criar componente `MapaTocantins.tsx`** em `src/components/mapa/`:
   - Dynamic import com `ssr: false` (Leaflet requer DOM)
   - Renderizar 139 polígonos do GeoJSON
   - Coloração padrão por macrorregional (norte=verde, centro=azul, sul=laranja)
   - **Seletor de indicador para choropleth:** pelo menos 3 opções:
     - População (eixo 1: `populacao`)
     - PIB per capita (eixo 1: `pib_percapita`)
     - IDEB (eixo 2: `ideb_anos_iniciais`)
   - Tooltip ao hover: nome do município + regional
   - Popup ao clicar: dados básicos (população, PIB per capita, regional)
   - Legenda com escala de cores
   - Fitbounds automático no Tocantins

3. **Join GeoJSON ↔ dados:** A propriedade `codarea` no GeoJSON é uma string de 7 dígitos (mesmo formato que as chaves dos JSONs de indicadores). Usar `codarea` para cruzar com os indicadores.

4. **Atualizar `/mapa/page.tsx`:**
   - Substituir `<MapaPlaceholder />` por `<MapaTocantins />`
   - Atualizar filtro de região para 8 regionais SEPLAN (usar `regioes.ts`)
   - Atualizar filtro de indicador com opções reais

5. **Responsividade:** Mapa deve funcionar em mobile (min-height 300px) e desktop (min-height 500px)

6. **Configuração CSS de Leaflet:** Garantir que o CSS do Leaflet seja importado:
   ```typescript
   import 'leaflet/dist/leaflet.css';
   ```

### Escala de cores para choropleth
- Usar 5 classes (quintis ou breaks naturais)
- Paleta sugerida: azul claro → azul escuro (dados positivos) ou vermelho → verde (dados de ranking)
- Municípios sem dado: cinza claro com tooltip "Dado não disponível"

### Verificação I-6
- [ ] Mapa renderiza 139 municípios (todos visíveis)
- [ ] Choropleth funciona com pelo menos 3 indicadores
- [ ] Tooltip exibe nome + regional ao hover
- [ ] Popup exibe dados ao clicar
- [ ] Legenda visível e correta
- [ ] Sem erro de hidratação SSR (dynamic import)
- [ ] Responsivo (mobile + desktop)
- [ ] Build sem erros
- [ ] Filtro de região com 8 regionais (não 6)

---

## Sequência de Execução Recomendada

1. **I-4 primeiro** (municipios.ts) — simplifica a base, sem dependências visuais
2. **I-5 segundo** (eixos.ts + páginas) — conecta dados às páginas de eixos
3. **I-6 terceiro** (mapa) — funcionalidade mais visual, testável no final

Commits incrementais permitidos (1 por etapa ou mais granulares).

## Contagem Final Esperada (Checkpoint Fase I)

| Critério | Esperado |
|---|---|
| Municípios em municipios.ts | 139 (tipados, sem indicadores inline) |
| JSONs em src/data/indicadores/ | 10 (60 indicadores, ~80K datapoints) |
| Eixos com indicadores reais | 10/10 |
| Mapa com GeoJSON | 139 polígonos, choropleth, tooltip/popup |
| Build | Sem erros |
| Strings placeholder | 0 (nas páginas de dados) |

## Permissões

- Pode propor melhorias além do escopo? **Sim**, registrar em arquivo separado
- Pode alterar páginas existentes? **Sim**, para integrar dados reais
- Pode criar novos componentes? **Sim** (MapaTocantins, funções utilitárias)
- Pode alterar os JSONs de indicadores? **Não**
- Pode instalar novas dependências? **Apenas se estritamente necessário para Leaflet**

## Briefing de Saída Obrigatório

Ao concluir, produzir resumo com:
1. O que foi feito (itens numerados, por etapa)
2. Arquivos criados/modificados (caminhos)
3. Resultado do build (`npm run build`)
4. Capturas de tela ou descrição do estado visual (mapa, páginas de eixos)
5. Problemas encontrados (se houver)
6. Propostas de melhoria (se houver)
