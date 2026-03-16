# Tabela de Referência — 10 Eixos Temáticos

**Data:** 16 de março de 2026
**Finalidade:** Guia para produção dos documentos-eixo na Fase 2
**Referências:** memo-plano-governo-interativo-v4.docx, eixos.ts, mapa-maquina-estadual-to.md

---

## 1. Análise Comparativa: Código (7 eixos) × Memo v4 (10 eixos)

| ID | Eixo no código (eixos.ts) | Eixo no memo v4 | Status |
|----|--------------------------|------------------|--------|
| 1 | Desenvolvimento Regional | Desenvolvimento Regional | ✅ Alinhado (escopo similar) |
| 2 | Educação e Capital Humano | Educação e Capital Humano | ✅ Alinhado |
| 3 | Saúde e Qualidade de Vida | Saúde e Qualidade de Vida | ✅ Alinhado |
| 4 | Infraestrutura e Conectividade | Infraestrutura e Conectividade | ✅ Alinhado (memo inclui Hub Logístico) |
| 5 | Meio Ambiente e Sustentabilidade | Meio Ambiente | ✅ Alinhado |
| 6 | Segurança Pública e Cidadania | Segurança Pública | ✅ Alinhado |
| 7 | Gestão Pública e Inovação | Gestão Pública e Inovação | ✅ Alinhado |
| — | (não existe) | Agropecuária e Desenvolvimento Rural | 🔴 **Novo** — criar eixo 8 |
| — | (não existe) | Mineração Sustentável | 🔴 **Novo** — criar eixo 9 |
| — | (não existe) | Industrialização e Atração de Investimentos | 🔴 **Novo** — criar eixo 10 |

### Ações para o Claude Code (Sessão 1.2B)

1. Adicionar eixos 8, 9, 10 ao eixos.ts seguindo a interface Eixo existente
2. Atualizar referências numéricas ("7 eixos" → "10 eixos") em page.tsx, sobre/page.tsx, CLAUDE.md, README.md
3. Verificar que ícones lucide-react existem para Wheat, Mountain, Factory (ou alternativas)
4. Build sem erros

---

## 2. Ficha de Referência por Eixo

### Eixo 1 — Educação e Capital Humano (Ordem de produção: 1º)

**Tipo:** Setorial (vitrine)
**Escopo:** Ensino médio estadual, ensino técnico, UNITINS, colaboração com municípios na educação infantil e fundamental, creches, qualificação profissional

**Secretarias e órgãos responsáveis:**
- SEDUC (Secretaria da Educação) — principal
- UNITINS (Universidade Estadual do Tocantins)
- FAPT (Fundação de Amparo à Pesquisa)

**Competência estadual:** Ensino médio (rede estadual), ensino técnico, UNITINS, colaboração com municípios no fundamental, formação de professores
**Competência municipal:** Educação infantil, ensino fundamental
**Competência federal:** UFT, IFTO, FNDE, FUNDEB (regulação)

**Fontes de dados primárias:**
- INEP: IDEB, Censo Escolar, taxas de aprovação/reprovação/abandono, matrículas
- IBGE/PNAD: escolaridade, analfabetismo, taxa de frequência escolar
- SEPLAN-TO: indicadores municipalizados
- TCE-TO/IEGM: dimensão Educação

**Sobreposições com outros eixos:**
- Gestão Pública (capacitação de gestores)
- Industrialização (ensino técnico alinhado a vocações econômicas)
- Desenvolvimento Regional (interiorização do ensino superior)
- Agropecuária (formação técnica rural)

**Indicadores-chave no código:**
- IDEB, taxa de abandono escolar, matrículas ensino técnico/superior, cobertura de creches

---

### Eixo 2 — Saúde e Qualidade de Vida (Ordem de produção: 2º)

**Tipo:** Setorial
**Escopo:** Hospitais regionais, telemedicina, saúde da mulher, atenção à pessoa com deficiência, coordenação da rede SUS estadual

**Secretarias e órgãos responsáveis:**
- SESAU (Secretaria da Saúde) — principal
- Superintendência da Rede de Cuidados à Pessoa com Deficiência

**Competência estadual:** Hospitais regionais e de referência, média e alta complexidade, coordenação da rede SUS estadual, vigilância em saúde
**Competência municipal:** Atenção básica (UBS, ESF), vacinação
**Competência federal:** Hospitais universitários, SAMU, SUS (regulação e financiamento), ANVISA

**Fontes de dados primárias:**
- DATASUS/TabNet: mortalidade, morbidade, leitos, cobertura de ESF, procedimentos
- IBGE: acesso a serviços de saúde, deslocamento para atendimento
- SEPLAN-TO: indicadores municipalizados
- TCE-TO/IEGM: dimensão Saúde

**Sobreposições com outros eixos:**
- Infraestrutura (conectividade para telemedicina, saneamento)
- Segurança (violência contra a mulher — interface com Secretaria da Mulher)
- Desenvolvimento Regional (acesso desigual a serviços)

**Indicadores-chave no código:**
- Cobertura da atenção básica, mortalidade infantil, leitos per capita, tempo de deslocamento para média complexidade

---

### Eixo 3 — Segurança Pública e Cidadania (Ordem de produção: 3º)

**Tipo:** Setorial
**Escopo:** Policiamento, prevenção à violência, atendimento à mulher, sistema socioeducativo, direitos humanos

**Secretarias e órgãos responsáveis:**
- SSP (Secretaria da Segurança Pública) — principal
- SECIJU (Secretaria da Cidadania e Justiça)
- Secretaria da Mulher
- PMTO (Polícia Militar)
- CBMTO (Corpo de Bombeiros Militar)
- DETRAN
- Superintendência de Direitos Humanos e Políticas de Drogas

**Competência estadual:** Polícias Civil e Militar, Bombeiros, sistema penitenciário, políticas de prevenção
**Competência municipal:** Guarda municipal, iluminação pública, urbanismo preventivo
**Competência federal:** PF, PRF, Justiça Federal, legislação penal

**Fontes de dados primárias:**
- SSP-TO: ocorrências, homicídios, feminicídios, efetivo policial
- Atlas da Violência (IPEA/Fórum Brasileiro de Segurança Pública)
- IBGE/MUNIC: existência de órgãos de segurança municipal
- DATASUS: mortalidade por causas externas

**Sobreposições com outros eixos:**
- Saúde (violência como problema de saúde pública)
- Educação (prevenção pela educação, socioeducativo)
- Desenvolvimento Regional (violência concentrada em áreas vulneráveis)
- Infraestrutura (iluminação, conectividade para videomonitoramento)

**Indicadores-chave no código:**
- Taxa de homicídios, feminicídios, efetivo policial per capita, ocorrências por tipo

---

### Eixo 4 — Infraestrutura e Conectividade (Ordem de produção: 4º)

**Tipo:** Estruturante
**Escopo:** Rodovias estaduais, estradas vicinais, internet, saneamento, habitação, Hub Logístico, regularização fundiária

**Secretarias e órgãos responsáveis:**
- SECIHD (Secretaria das Cidades, Habitação e Desenvolvimento Urbano) — principal
- SEPLAN/AGETO (Agência de Transportes, Obras e Infraestrutura) — rodovias e obras
- ATS (Agência Tocantinense de Saneamento)
- ATR (Agência de Regulação)
- Tocantins Parcerias (PPPs)
- TocantinsGás

**Nota:** Há fragmentação institucional — AGETO está na SEPLAN, não na SECIHD. Infraestrutura rodoviária e desenvolvimento urbano respondem a pastas diferentes.

**Competência estadual:** Rodovias estaduais, saneamento (com municípios), habitação, regularização fundiária, gás canalizado
**Competência municipal:** Ruas, transporte urbano, plano diretor, drenagem
**Competência federal:** Rodovias federais (BR-153, BR-010, BR-242), ferrovias (FIOL/Norte-Sul), aeroportos, telecomunicações (ANATEL)

**Fontes de dados primárias:**
- AGETO: malha rodoviária estadual, condições, investimentos
- IBGE/PNAD: acesso a saneamento, internet, habitação
- SNIS (Sistema Nacional de Informações sobre Saneamento): cobertura de água e esgoto
- ANATEL: cobertura de banda larga e 4G/5G por município
- SEPLAN-TO: indicadores municipalizados

**Sobreposições com outros eixos:**
- Agropecuária (estradas vicinais para escoamento)
- Saúde (saneamento como determinante de saúde, conectividade para telemedicina)
- Educação (internet para escolas)
- Industrialização (Hub Logístico, ferrovia, infraestrutura industrial)
- Mineração (estradas para escoamento mineral)

**Indicadores-chave no código:**
- Malha rodoviária pavimentada, acesso à internet banda larga, cobertura de saneamento, déficit habitacional

---

### Eixo 5 — Meio Ambiente e Sustentabilidade (Ordem de produção: 5º)

**Tipo:** Estruturante
**Escopo:** Combate a queimadas, desmatamento, bioeconomia, ICMS Ecológico, recursos hídricos, transição Cerrado-Amazônia

**Secretarias e órgãos responsáveis:**
- SEMARH (Secretaria do Meio Ambiente e Recursos Hídricos) — principal
- NATURATINS (Instituto Natureza do Tocantins)
- CBMTO (Corpo de Bombeiros — combate a incêndios florestais)

**Nota:** A AMETO (mineração) não está na SEMARH, mas na SECIHD. Isso cria desconexão entre regulação mineral e política ambiental.

**Competência estadual:** Licenciamento ambiental, gestão de UCs estaduais, fiscalização, recursos hídricos, política de mudanças climáticas
**Competência municipal:** Licenciamento local, áreas verdes urbanas, resíduos sólidos
**Competência federal:** ICMBio (UCs federais), IBAMA, Serviço Florestal, política nacional de clima

**Fontes de dados primárias:**
- INPE: PRODES (desmatamento), BDQueimadas (focos de incêndio)
- MapBiomas: uso e cobertura da terra
- ANA (Agência Nacional de Águas): recursos hídricos
- NATURATINS: licenciamentos, UCs estaduais
- IBGE: cobertura vegetal, áreas protegidas

**Sobreposições com outros eixos:**
- Agropecuária (desmatamento vs. produção, bioeconomia)
- Mineração (impacto ambiental da mineração)
- Infraestrutura (saneamento, recursos hídricos)
- Desenvolvimento Regional (ICMS Ecológico como instrumento de equalização)

**Indicadores-chave no código:**
- Área desmatada, focos de incêndio, unidades de conservação, qualidade da água

---

### Eixo 6 — Agropecuária e Desenvolvimento Rural (Ordem de produção: 6º)

**Tipo:** Econômico
**Escopo:** Competitividade agropecuária, cadeias produtivas, extensão rural, cooperativismo, pesca e aquicultura, agroindustrialização

**Secretarias e órgãos responsáveis:**
- SEAGRO (Secretaria da Agricultura e Pecuária) — principal
- Secretaria da Pesca e Aquicultura
- ADAPEC (Agência de Defesa Agropecuária)
- RURALTINS (Instituto de Desenvolvimento Rural)

**Competência estadual:** Política agrícola estadual, defesa agropecuária, extensão rural (RURALTINS), fomento, pesquisa (UNITINS/FAPT), incentivos
**Competência municipal:** Apoio ao produtor local, feiras, mercados municipais
**Competência federal:** MAPA, EMBRAPA, CONAB, crédito rural (PRONAF, PRONAMP), política de preços

**Fontes de dados primárias:**
- IBGE/PAM: Produção Agrícola Municipal
- IBGE/PPM: Pesquisa Pecuária Municipal
- IBGE/Censo Agropecuário
- SEAGRO: dados estaduais de produção
- CONAB: séries de produção e preços
- RAIS/CAGED: empregos formais no setor

**Sobreposições com outros eixos:**
- Meio Ambiente (uso da terra, desmatamento, bioeconomia)
- Infraestrutura (estradas vicinais, conectividade rural, irrigação)
- Industrialização (agroindustrialização, valor agregado)
- Educação (ensino técnico rural)
- Desenvolvimento Regional (agro como motor econômico territorial)

**Indicadores-chave (a definir no código):**
- Valor Bruto da Produção Agropecuária, área plantada vs. produtividade, empregos formais no agronegócio

---

### Eixo 7 — Mineração Sustentável (Ordem de produção: 7º)

**Tipo:** Econômico (específico)
**Escopo:** Regulação mineral, fiscalização, contrapartidas ao desenvolvimento local, sustentabilidade ambiental da mineração

**Secretarias e órgãos responsáveis:**
- AMETO (Agência Estadual de Mineração) — principal (vinculada à SECIHD)
- NATURATINS (licenciamento ambiental)

**Nota estratégica:** A vinculação da AMETO à SECIHD (e não à SEMARH) é uma escolha política que privilegia o desenvolvimento sobre a sustentabilidade. O plano de governo pode propor reequilíbrio.

**Competência estadual:** Regulação estadual, licenciamento, CFEM (parcela estadual), fiscalização
**Competência municipal:** CFEM (parcela municipal), uso do solo
**Competência federal:** ANM (Agência Nacional de Mineração), DNPM, legislação mineral, IBAMA (licenciamento federal)

**Fontes de dados primárias:**
- ANM: CFEM por município, títulos minerários, substâncias
- AMETO: dados estaduais de mineração
- IBGE: PIB do setor extrativo mineral
- RAIS/CAGED: empregos no setor mineral

**Sobreposições com outros eixos:**
- Meio Ambiente (impacto ambiental, licenciamento)
- Infraestrutura (estradas para escoamento, energia)
- Desenvolvimento Regional (CFEM como receita para municípios)
- Industrialização (beneficiamento mineral local)

**Indicadores-chave (a definir no código):**
- Receita de CFEM por município, licenças ambientais vigentes, empregos no setor mineral

---

### Eixo 8 — Industrialização e Atração de Investimentos (Ordem de produção: 8º)

**Tipo:** Econômico
**Escopo:** Atração de indústrias, incentivos fiscais, parques industriais, agroindustrialização, empregabilidade, Hub Logístico

**Secretarias e órgãos responsáveis:**
- SICS/SEINC (Secretaria da Indústria, Comércio e Serviços) — principal
- JUCETINS (Junta Comercial)
- AEM (Agência de Metrologia e Inovação)
- Agência de Fomento
- Secretaria de Parcerias e Investimentos

**Competência estadual:** Incentivos fiscais (ICMS), parques industriais, atração de investimentos, fomento, metrologia
**Competência municipal:** Zoneamento industrial, IPTU, ISS
**Competência federal:** Política industrial nacional, BNDES, Zona Franca, comércio exterior, legislação trabalhista

**Fontes de dados primárias:**
- IBGE: PIB setorial, Cadastro de Empresas
- RAIS/CAGED: empregos industriais formais
- SICS: incentivos concedidos, investimentos atraídos
- MDIC: balança comercial estadual
- FIRJAN/FIETO: índice de competitividade industrial

**Sobreposições com outros eixos:**
- Agropecuária (agroindustrialização)
- Educação (ensino técnico para indústria)
- Infraestrutura (Hub Logístico, energia, ferrovia)
- Mineração (beneficiamento mineral)
- Desenvolvimento Regional (descentralização industrial)

**Indicadores-chave (a definir no código):**
- Participação industrial no PIB estadual, empregos industriais formais, balança comercial de manufaturados

---

### Eixo 9 — Gestão Pública e Inovação (Ordem de produção: 9º)

**Tipo:** Transversal
**Escopo:** Inteligência territorial, governo digital, capacitação de gestores municipais, transparência, modernização administrativa

**Secretarias e órgãos responsáveis:**
- SEPLAN (Secretaria do Planejamento e Orçamento) — planejamento e monitoramento
- SECAD (Secretaria da Administração) — gestão de pessoal e modernização
- CGE (Controladoria-Geral do Estado) — controle interno e transparência
- ATI (Agência de Tecnologia da Informação) — infraestrutura digital e sistemas
- FAPT (Fundação de Amparo à Pesquisa) — inovação

**Competência estadual:** Modernização da máquina, governo digital, planejamento estratégico, controle interno, cooperação técnica com municípios
**Competência municipal:** Gestão local, transparência municipal
**Competência federal:** Governo federal digital, ENAP, SERPRO, padrões nacionais de interoperabilidade

**Fontes de dados primárias:**
- TCE-TO/IEGM: todas as dimensões (educação, saúde, planejamento, fiscal, meio ambiente, cidades, TI)
- IBGE/ESTADIC e MUNIC: capacidade institucional estadual e municipal
- Portal da Transparência TO
- CGE: relatórios de auditoria e controle
- SEPLAN: indicadores de gestão

**Sobreposições com outros eixos:**
- Todos — eixo transversal que instrumentaliza a gestão de todos os demais
- Educação (capacitação de gestores)
- Desenvolvimento Regional (inteligência territorial como ferramenta de equalização)

**Indicadores-chave no código:**
- IEGM (TCE), receita própria vs. transferências, índice de transparência, digitalização de serviços

---

### Eixo 10 — Desenvolvimento Regional (Ordem de produção: 10º — último, integrador)

**Tipo:** Integrador
**Escopo:** Redução de desigualdades territoriais, polos regionais, descentralização, cooperativismo, regularização fundiária, regiões metropolitanas, equidade fiscal, culturas e turismo, povos originários

**Secretarias e órgãos responsáveis:**
- Secretaria de Desenvolvimento das Regiões Metropolitanas — principal (nova, 2026)
- SETAS (Secretaria do Trabalho e Desenvolvimento Social)
- SECULT (Secretaria da Cultura e Turismo)
- Secretaria dos Povos Originários e Tradicionais
- ITERTINS (Instituto de Terras)
- Agência de Fomento

**Competência estadual:** Política de desenvolvimento regional, equalização territorial, regiões metropolitanas, cooperação intermunicipal, incentivos regionalizados
**Competência municipal:** Planos diretores, consórcios intermunicipais
**Competência federal:** PNDR (Política Nacional de Desenvolvimento Regional), SUDENE/SUDAM, fundos constitucionais (FNO, FNE)

**Fontes de dados primárias:**
- IBGE: PIB municipal, IDH-M, desigualdade intermunicipal, Censo, PNAD
- IPEA: Atlas do Desenvolvimento Humano
- SEPLAN-TO: regionalizações, indicadores municipalizados
- ITERTINS: regularização fundiária
- FNO/BASA: crédito regional

**Sobreposições com outros eixos:**
- Todos — eixo integrador que sintetiza diagnósticos e propostas transversais
- Agropecuária, mineração e indústria (vocações econômicas regionais)
- Infraestrutura (conectividade como condição para desenvolvimento)
- Educação e saúde (acesso equitativo a serviços)

**Indicadores-chave no código:**
- PIB per capita por município, índice de desigualdade intermunicipal, taxa de urbanização, fluxos migratórios internos

---

## 3. Regiões de Planejamento × Eixos de Atenção Prioritária

| Região | Municípios | Eixos de maior atenção | Justificativa |
|--------|-----------|------------------------|---------------|
| Central (Palmas) | 25 | Gestão Pública, Industrialização, Infraestrutura | Polo administrativo, concentração econômica |
| Norte (Araguaína) | 35 | Saúde, Educação, Agropecuária | 2º polo econômico, hospitais regionais |
| Sul (Gurupi) | 30 | Agropecuária, Educação, Infraestrutura | 3º polo, forte produção agropecuária |
| Sudeste (Jalapão) | 15 | Meio Ambiente, Desenvolvimento Regional, Infraestrutura | Preservação + turismo ecológico + vulnerabilidade |
| Bico do Papagaio | 25 | Desenvolvimento Regional, Saúde, Segurança | Maior vulnerabilidade, quilombolas, ribeirinhos |
| Oeste (Ilha do Bananal) | 9 | Agropecuária, Meio Ambiente, Desenvolvimento Regional | Produção irrigada + preservação ambiental |

---

## 4. Lacunas Identificadas para o Claude Code

O scaffolding técnico (eixos.ts) precisa das seguintes atualizações:

1. **Adicionar eixos 8, 9, 10** conforme instrucoes-claude-code-v4.md (BLOCO 2)
2. **Revisar propostas dos eixos 1-7** — as propostas atuais são genéricas e provisórias; serão substituídas pelo conteúdo dos documentos-eixo da Fase 2
3. **Adicionar campo `secretariasResponsaveis`** à interface Eixo — permite vincular cada eixo às secretarias mapeadas
4. **Adicionar campo `fonteDeDados`** à interface Eixo — permite indicar as fontes de cada indicador
5. **Considerar campo `regioesPrioritarias`** — para vincular eixos a regiões de planejamento

---

## Dupla leitura deste documento

- **Valor prático:** Ficha de referência completa para os 10 eixos com secretarias, competências, fontes de dados, sobreposições e indicadores. Guia direto para a produção da Fase 2 e para as atualizações técnicas no Claude Code.
- **Valor acadêmico:** Mapeamento institucional-temático como etapa metodológica da pesquisa-ação (OE1). A análise de sobreposições revela a natureza sistêmica do planejamento territorial (OE2). As notas sobre fragmentação institucional (AMETO/SECIHD, AGETO/SEPLAN) são dados sobre a estrutura de governança estadual (PS2/OE3).
