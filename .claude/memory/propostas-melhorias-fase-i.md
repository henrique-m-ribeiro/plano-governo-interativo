# Propostas de Melhoria — Fase I

> Gerado durante execução da Etapa I-2 (2026-03-21)
> Para avaliação no Cowork (📋) antes de implementação.

---

## Proposta: Expandir municipiosPrincipais em regioes.ts
**Contexto:** O arquivo `regioes.ts` lista apenas 21 municípios (3-4 por região), forçando 118 dos 139 municípios a serem atribuídos por inferência de centroide. Isso pode gerar classificações imprecisas em zonas fronteiriças entre regiões.
**Sugestão:** Expandir `municipiosPrincipais` para incluir todos os 139 municípios nas suas regiões corretas, ou criar um mapeamento completo separado (ex: `municipio-regiao-map.json`).
**Impacto:** Eliminaria incerteza na classificação regional. Fundamental para navegação por região no app.
**Esforço:** Baixo (curadoria manual de ~2h com apoio de mapa)
**Prioridade sugerida:** Próxima sessão

---

## Proposta: Atualizar dados de PIB per capita (2022/2023)
**Contexto:** As colunas `pib_percapita_2022` e `pib_percapita_2023` do CSV de PIB Municipal contêm `...` (dados indisponíveis) para todos os 139 municípios. O script usou `pib_percapita_2021` como fallback.
**Sugestão:** Quando o IBGE publicar os dados de 2022/2023, atualizar o CSV no repo `doutorado` e regenerar a tabela mestra. O script já detecta automaticamente o ano mais recente com dados válidos.
**Impacto:** Dados mais atuais para o eleitor.
**Esforço:** Baixo (apenas atualizar CSV e reexecutar script)
**Prioridade sugerida:** Futuro (quando dados disponíveis)

---

## Proposta: Adicionar campo de microrregião
**Contexto:** Os CSVs do Geoportal possuem `regiao_num` com 18 microrregiões (I–XVIII). Embora não correspondam às 6 regiões do MVP, esse dado pode ser útil para navegação mais granular.
**Sugestão:** Incluir campo opcional `microrregiao` na tabela mestra em etapa futura, permitindo drill-down região → microrregião → município.
**Impacto:** Navegação mais rica no app; alinhamento com planejamento estadual.
**Esforço:** Médio (requer mapeamento microrregião → município + ajuste de UI)
**Prioridade sugerida:** Futuro

---

## Proposta: Validar classificação regional com especialista
**Contexto:** A inferência por centroide (usada para 118 municípios) pode classificar incorretamente municípios em zonas limítrofes. Exemplos potenciais: municípios no limite central/oeste ou norte/bico-do-papagaio.
**Sugestão:** Gerar um mapa de verificação (colorido por região atribuída) e validar com alguém que conheça a geografia do Tocantins.
**Impacto:** Garante credibilidade dos dados regionais.
**Esforço:** Baixo (gerar mapa com matplotlib/folium + revisão humana)
**Prioridade sugerida:** Próxima sessão
