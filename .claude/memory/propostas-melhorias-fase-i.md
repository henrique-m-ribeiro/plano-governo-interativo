# Propostas de Melhoria — Fase I

> Atualizado durante execução da Etapa I-2 v2 (2026-03-21)
> Para avaliação no Cowork (📋) antes de implementação.

---

## [ADOTADA] Proposta: Campo polo_regional na tabela mestra
**Contexto:** O JSON da SEPLAN 2024 inclui o polo de cada regional (ex: "Palmas", "Araguaína", "Augustinópolis/Tocantinópolis"). Este dado enriquece a navegação e contextualiza cada município.
**Sugestão:** Incluir campo `polo_regional` no schema de cada município.
**Impacto:** Permite mostrar ao cidadão o polo de referência da sua região. Útil para UX de navegação.
**Esforço:** Baixo (campo já incluso no JSON SEPLAN)
**Status:** ✅ Adotada na v2 da Etapa I-2 (aprovada pelo usuário antes da execução).

---

## [SUPERADA] Proposta: Expandir municipiosPrincipais em regioes.ts
**Contexto:** Na v1, `regioes.ts` listava apenas 21 municípios, forçando inferência por centroide.
**Status:** ⚠️ Superada pela adoção do JSON oficial SEPLAN 2024 (ADR-011). O mapeamento agora é 100% determinístico, sem inferência. O `regioes.ts` será atualizado em etapa posterior para refletir as 8 regionais.

---

## Proposta: Atualizar dados de PIB per capita (2022/2023)
**Contexto:** As colunas `pib_percapita_2022` e `pib_percapita_2023` do CSV de PIB Municipal contêm `...` (dados indisponíveis) para todos os 139 municípios. O script usou `pib_percapita_2021` como fallback.
**Sugestão:** Quando o IBGE publicar os dados de 2022/2023, atualizar o CSV no repo `doutorado` e regenerar a tabela mestra. O script já detecta automaticamente o ano mais recente com dados válidos.
**Impacto:** Dados mais atuais para o eleitor.
**Esforço:** Baixo (apenas atualizar CSV e reexecutar script)
**Prioridade sugerida:** Futuro (quando dados disponíveis)

---

## [SUPERADA] Proposta: Validar classificação regional com especialista
**Contexto:** Na v1, a inferência por centroide podia gerar classificações imprecisas.
**Status:** ⚠️ Superada — mapeamento agora é oficial SEPLAN 2024, sem inferência. Validação implícita pela fonte.

---

## Proposta: Atualizar regioes.ts para refletir 8 regionais SEPLAN
**Contexto:** O arquivo `src/data/regioes.ts` ainda define 6 regiões arbitrárias (central, norte, sul, sudeste, bico-do-papagaio, oeste). Com a adoção do SEPLAN 2024, precisa ser atualizado para 8 regionais + 3 macrorregionais.
**Sugestão:** Reescrever `regioes.ts` com as 8 regionais SEPLAN, incluindo todos os 139 municípios, macrorregional e polo. Manter compatibilidade com a interface `Regiao` existente.
**Impacto:** Alinha o código do app com a fonte oficial de dados. Pré-requisito para navegação por região funcional.
**Esforço:** Baixo
**Prioridade sugerida:** Próxima sessão (Etapa I-3 ou similar)

---

## Proposta: Divergências de grafia SEPLAN vs Censo/IBGE
**Contexto:** 3 municípios têm grafia diferente entre SEPLAN e Censo: "Couto de Magalhães"/"Couto Magalhães", "Pau d'Arco"/"Pau D'Arco", "São Valério da Natividade"/"São Valério". Resolvidos com mapeamento manual no script.
**Sugestão:** Documentar essas divergências no pipeline de dados e considerar padronizar em um dos formatos no repo `doutorado`.
**Impacto:** Evita erros futuros em cruzamentos de dados.
**Esforço:** Baixo
**Prioridade sugerida:** Futuro
