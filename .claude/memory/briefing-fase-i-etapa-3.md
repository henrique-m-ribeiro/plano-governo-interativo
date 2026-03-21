# Briefing Técnico — Etapa I-3: Consolidação CSV → JSON por Eixo

## 1. Mapeamento CSV → Eixo (definitivo)

Todos os caminhos abaixo são relativos a `data/pipeline/` (após cópia do doutorado).

### Eixo 1 — Desenvolvimento Regional e Redução de Desigualdades

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/demografia/censo_2022_populacao.csv` | populacao_2022 | 2022 | 139 |
| `basedosdados/csv/demografia/estimativa_populacao_ibge.csv` | pop_estimada | 2025 | 139 |
| `basedosdados/csv/economia/pib_municipal_ibge.csv` | pib_2021..2023, pib_percapita_2021..2023 | 2021-2023 | 139 |
| `geoportal-seplan/csv/populacao/popul_resid_por_situacao_do_domicilio_e_sexo_2010.csv` | pop urbana/rural por sexo | 2010 | 139 |
| `geoportal-seplan/csv/populacao/populacao_censitaria_municip_1991_2000_2010.csv` | série pop censitária | 1991,2000,2010 | 139 |

**Indicadores a gerar:** populacao (série histórica), pib_percapita (série), taxa_urbanizacao, crescimento_demografico

### Eixo 2 — Educação e Capital Humano

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/educacao/ideb_municipio_bd.csv` | ideb, taxa_aprovacao, notas SAEB | 2009-2023 | 139 |
| `basedosdados/csv/educacao/censo_escolar_matriculas_bd.csv` | matriculas por rede/etapa | 2019-2020 | 139 |
| `geoportal-seplan/csv/educacao/inidce_2009.csv` | IDEB 2009 | 2009 | 139 |
| `geoportal-seplan/csv/educacao/inidce_2011.csv` | IDEB 2011 | 2011 | 139 |
| `geoportal-seplan/csv/educacao/indice_2013.csv` | IDEB 2013 | 2013 | 139 |
| `geoportal-seplan/csv/educacao/indice_2015.csv` | IDEB 2015 | 2015 | 139 |
| `geoportal-seplan/csv/educacao/matriculas_2012.csv` | matrículas por nível | 2012 | 139 |
| `geoportal-seplan/csv/educacao/matriculas_2014.csv` | matrículas por nível | 2014 | 139 |
| `geoportal-seplan/csv/educacao/matriculas_2015.csv` | matrículas por nível | 2015 | 139 |
| `geoportal-seplan/csv/educacao/docentes_separados_2014.csv` | docentes por categoria | 2014 | 139 |
| `geoportal-seplan/csv/educacao/docentes_separados_por_categoria_2012.csv` | docentes por categoria | 2012 | 139 |
| `geoportal-seplan/csv/educacao/docentes_separados_por_categoria_2015.csv` | docentes por categoria | 2015 | 139 |
| `geoportal-seplan/csv/educacao/estabelecimentos_2012.csv` | escolas por tipo | 2012 | 139 |
| `geoportal-seplan/csv/educacao/estabelecimentos_2014.csv` | escolas por tipo | 2014 | 139 |
| `geoportal-seplan/csv/educacao/estabelecimentos_2015.csv` | escolas por tipo | 2015 | 139 |
| `geoportal-seplan/csv/educacao/taxa_abandono_2013.csv` | abandono escolar | 2013 | 139 |
| `geoportal-seplan/csv/educacao/taxa_abandono_2015.csv` | abandono escolar | 2015 | 139 |
| `geoportal-seplan/csv/educacao/taxa_aprovacao_2013.csv` | aprovação | 2013 | 139 |
| `geoportal-seplan/csv/educacao/taxa_de_aprovacao_2015.csv` | aprovação | 2015 | 139 |
| `geoportal-seplan/csv/educacao/taxa_de_distorcao_2013.csv` | distorção idade-série | 2013 | 139 |
| `geoportal-seplan/csv/educacao/taxa_de_distorcao_2015.csv` | distorção idade-série | 2015 | 139 |
| `geoportal-seplan/csv/educacao/taxa_de_reprovacao_2013.csv` | reprovação | 2013 | 139 |
| `geoportal-seplan/csv/educacao/taxa_de_reprovacao_2015.csv` | reprovação | 2015 | 139 |

**Indicadores a gerar:** ideb_anos_iniciais, ideb_anos_finais, taxa_aprovacao, taxa_abandono, taxa_distorcao_idade_serie, taxa_reprovacao, matriculas_total, docentes_total, estabelecimentos_total

### Eixo 3 — Saúde e Qualidade de Vida

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/saude/cnes_estabelecimentos_bd.csv` | estabelecimentos por tipo | 2019-2024 | 139 |
| `basedosdados/csv/saude/sim_obitos_causa_bd.csv` | óbitos por CID-10 | 2019-2022 | 139 |
| `geoportal-seplan/csv/saude/acidentes_com_animais_peconhentos.csv` | acidentes notificados | vários | 139 |
| `geoportal-seplan/csv/saude/imunizacao_em_menores.csv` | cobertura vacinal | vários | 139 |
| `geoportal-seplan/csv/saude/leishmaniose_visceral.csv` | casos leishmaniose | vários | 139 |
| `geoportal-seplan/csv/saude/numero_casos_dengue.csv` | casos dengue | vários | 139 |
| `geoportal-seplan/csv/saude/numero_de_leitos_de_internacao_hospitalar.csv` | leitos internação | vários | 139 |
| `geoportal-seplan/csv/saude/numero_de_profissionais_de_saude.csv` | profissionais saúde | vários | 139 |
| `geoportal-seplan/csv/saude/numero_estabelecimentos_saude.csv` | estabelecimentos saúde | vários | 139 |
| `geoportal-seplan/csv/saude/numero_nascidos_vivos_por_sexo_faixa_etaria_de_mae_2009_a_2018.csv` | nascidos vivos | 2009-2018 | 139 |
| `geoportal-seplan/csv/saude/numero_obitos_por_faixa_etaria_2009_a_2018.csv` | óbitos por faixa etária | 2009-2018 | 139 |
| `geoportal-seplan/csv/saude/obitos_por_causa_morte_2009_2010_2013_2014_2015.csv` | óbitos por causa | 2009-2015 | 139 |
| `geoportal-seplan/csv/saude/taxa_de_mortalidade_infantil_2008_a_2015.csv` | TMI | 2008-2015 | 139 |

**Indicadores a gerar:** taxa_mortalidade_infantil, leitos_por_mil_hab, profissionais_saude_por_mil_hab, estabelecimentos_saude, nascidos_vivos, obitos_totais, cobertura_vacinal, casos_dengue

### Eixo 4 — Infraestrutura e Conectividade

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/infraestrutura/anatel_banda_larga_bd.csv` | densidade banda larga | 2019-2024 | 139 |
| `basedosdados/csv/infraestrutura/snis_agua_esgoto_bd.csv` | água, esgoto, tratamento | 2015-2022 | 137 |

**Indicadores a gerar:** densidade_banda_larga, indice_atendimento_agua, indice_atendimento_esgoto, indice_tratamento_esgoto

**Nota:** Eixo com menos dados. 2 municípios sem dados SNIS — registrar quais são.

### Eixo 5 — Meio Ambiente e Sustentabilidade

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/meio_ambiente/mapbiomas_cobertura_solo_bd.csv` | cobertura solo por classe | 2000-2021 | 139 |
| `basedosdados/csv/meio_ambiente/prodes_desmatamento_bd.csv` | desmatamento, veg. natural | 2000-2023 | 139 |

**Indicadores a gerar:** area_desmatada_km2, vegetacao_natural_km2, cobertura_florestal_pct, taxa_desmatamento_anual

### Eixo 6 — Segurança Pública e Cidadania

| CSV | Nível | Anos | Mun. |
|-----|-------|------|------|
| `basedosdados/csv/seguranca/sim_homicidios_municipio_bd.csv` | municipal | vários | 139 |
| `basedosdados/csv/seguranca/fbsp_municipio_tocantins.csv` | municipal | 2016-2021 | 1 (Palmas) |
| `basedosdados/csv/seguranca/violencia_municipal_sinesp_bd.csv` | municipal | vários | 1 (Palmas) |
| `basedosdados/csv/seguranca/fbsp_uf_tocantins.csv` | estadual | 2007-2021 | — |
| `basedosdados/csv/seguranca/fbsp_uf_brasil.csv` | estadual | 2007-2021 | — |
| `basedosdados/csv/seguranca/fbsp_uf_brasil_agregado.csv` | estadual | 2007-2021 | — |
| `basedosdados/csv/seguranca/sinesp_to_bd.csv` | estadual | vários | — |
| `basedosdados/csv/seguranca/sinesp_uf_bd.csv` | estadual | vários | — |
| `basedosdados/csv/seguranca/sinesp_nacional_bd.csv` | estadual | vários | — |

**Indicadores municipais:** taxa_homicidios (SIM, 139 mun.), criminalidade_detalhada (FBSP, só Palmas)
**Contexto estadual:** Incluir seção `contexto_estadual` com séries do FBSP e SINESP para o Tocantins.

### Eixo 7 — Gestão Pública e Inovação

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/gestao_publica/munic_capacidade_bd.csv` | capacidade gestora por tema | 2018-2021 | 139 |
| `basedosdados/csv/gestao_publica/munic_vinculos_bd.csv` | vínculos por tipo/escolaridade | 2018-2021 | 139 |
| `basedosdados/csv/gestao_publica/siconfi_receitas_bd.csv` | receitas por conta | 2019-2023 | 139 |

**Indicadores a gerar:** receita_total, receita_propria, receita_transferencias, servidores_estatutarios, servidores_total, capacidade_gestao

**Nota:** coluna de município é `id_municipio` nos dois primeiros CSVs (sem prefixo 17 — verificar formato).

### Eixo 8 — Agropecuária e Desenvolvimento Rural (INDICADORES AGREGADOS)

**Fontes basedosdados (dados recentes):**

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/agropecuaria/pam_principais_culturas.csv` | culturas principais (área, produção, valor) | 2024 | 139 |
| `basedosdados/csv/agropecuaria/ppm_rebanho_bovino.csv` | bovinos | 2022-2024 | 139 |

**Fontes Geoportal (séries históricas 1989-2018):**

Lavouras temporárias (12 CSVs): soja, milho, arroz, feijão, mandioca, cana-de-açúcar, algodão, amendoim, abacaxi, melancia, melão, sorgo, tomate
Lavouras permanentes (6 CSVs): abacate, banana, coco, laranja, manga, maracujá
Rebanhos (7 CSVs): bovino, bubalino, caprino, equino, ovino, suíno, galináceo
Produtos animais (3 CSVs): leite, mel, ovos de galinha
Outros (2 CSVs): aquicultura, codorna, alho

**Regra de agregação — gerar ~8 indicadores-chave:**
1. `area_soja_ha` — de lavoura_temporaria_soja + pam_principais_culturas
2. `area_milho_ha` — de lavoura_temporaria_milho + pam_principais_culturas
3. `area_arroz_ha` — de lavoura_temporaria_arroz + pam_principais_culturas
4. `efetivo_bovino` — de bovino1989_2018 + ppm_rebanho_bovino
5. `producao_leite_litros` — de leite1
6. `producao_aquicultura` — de aquicultura_2013_2018
7. `area_total_plantada_ha` — soma de todas as lavouras (temporárias + permanentes), por município/ano
8. `diversidade_produtiva` — contagem de culturas com produção > 0, por município (indicador derivado)

### Eixo 9 — Economia e Emprego

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `basedosdados/csv/economia/pib_municipal_setorial_bd.csv` | PIB, VA agro/indústria/serviços | 2010-2021 | 139 |
| `basedosdados/csv/emprego/rais_emprego_setor_bd.csv` | vínculos por setor CNAE | 2019-2024 | 139 |
| `basedosdados/csv/mineracao/cfem_arrecadacao_to.csv` | arrecadação CFEM | 2022-2026 | 66 |
| `basedosdados/csv/mineracao/cfem_distribuicao_to.csv` | distribuição CFEM | 2007-2020 | 74 |
| `geoportal-seplan/csv/economia/pib_e_pib_por_capita.csv` | PIB série longa | vários | 139 |

**Indicadores a gerar:** pib_total, va_agropecuaria, va_industria, va_servicos, emprego_formal_total, cfem_arrecadacao

**Nota:** CFEM cobre apenas municípios com mineração (66-74). Os demais recebem null.

### Eixo 10 — Cultura, Esporte e Juventude

| CSV | Indicadores-chave | Anos | Mun. |
|-----|-------------------|------|------|
| `geoportal-seplan/csv/populacao/popul_resid_cor_raca_sexo_situacao.csv` | pop. por cor/raça, sexo, situação | 2010 | 139 |

**Indicadores a gerar:** populacao_jovem (recorte 15-29 se disponível), diversidade_etnica (composição por cor/raça)

**Nota:** Eixo com MENOS dados disponíveis. Documentar lacunas.

---

## 2. Schema JSON de Saída

Cada arquivo JSON deve seguir esta estrutura:

```json
{
  "eixo": "Nome completo do eixo",
  "slug": "slug-do-eixo",
  "numero": 1,
  "indicadores": [
    {
      "id": "nome_snake_case",
      "nome": "Nome legível em português",
      "unidade": "índice | % | R$ | hab | km² | ha | ton | und | litros",
      "fonte": "Nome da fonte (ex: INEP/MEC, IBGE, MapBiomas)",
      "descricao": "Breve descrição do que o indicador mede",
      "ano_inicio": 2009,
      "ano_fim": 2023,
      "cobertura_municipios": 139,
      "serie_temporal": {
        "1700251": { "2009": 3.8, "2011": 4.1, "2023": 4.7 },
        "1721000": { "2009": 5.0, "2023": 5.5 }
      }
    }
  ],
  "contexto_estadual": null,
  "metadados": {
    "total_indicadores": 20,
    "cobertura_municipios": 139,
    "municipios_sem_dados": [],
    "fontes_utilizadas": ["basedosdados/csv/educacao/ideb_municipio_bd.csv"],
    "ultima_atualizacao": "2026-03-21",
    "gerado_por": "consolidar_csvs_para_json.py"
  }
}
```

**Regras do schema:**
- Chaves de `serie_temporal` são **strings** do cod_ibge (ex: `"1700251"`, não inteiro)
- Valores numéricos: manter precisão original do CSV. Arredondar float para 2 casas decimais
- Valores ausentes: **não incluir** a chave (JSON esparso) — se Abreulândia não tem IDEB 2011, omitir a entrada
- `contexto_estadual`: null para todos os eixos exceto Eixo 6 (Segurança)
- `cobertura_municipios`: quantos dos 139 têm pelo menos 1 dado neste indicador

### Estrutura de `contexto_estadual` (apenas Eixo 6)

```json
"contexto_estadual": {
  "fonte": "FBSP/SINESP",
  "series": {
    "homicidios_dolosos_to": { "2007": 150, "2008": 180 },
    "mvi_to": { "2007": 200 },
    "feminicidios_to": { "2016": 10 }
  }
}
```

---

## 3. Problemas Técnicos Conhecidos

### 3.1 Variação no nome da coluna de município

| Padrão | CSVs afetados | Ação |
|--------|---------------|------|
| `cod_ibge` | Maioria dos basedosdados | Usar diretamente |
| `id_municipio` | munic_capacidade_bd, munic_vinculos_bd, fbsp_municipio, violencia_municipal | Renomear para cod_ibge |
| `codigo_municipio` | cfem_arrecadacao_to | Renomear para cod_ibge |
| `codigo_ente` | cfem_distribuicao_to | Renomear para cod_ibge (filtrar apenas entes municipais) |
| `cod_ibge_1` | ~3 CSVs do Geoportal (identificados no I-1) | Renomear para cod_ibge |
| Coluna ausente | CSVs do Geoportal que usam nome do município | Fazer join com tabela mestra por nome |

### 3.2 Formato largo (Geoportal)

CSVs do Geoportal têm colunas por ano (ex: `pop_1991`, `pop_2000`, `pop_2010`). O script deve:
1. Detectar se é formato largo (múltiplas colunas com padrão `*_AAAA` ou `*AAAA`)
2. Pivotar para formato longo antes de processar
3. Extrair o ano do nome da coluna

### 3.3 Encoding

- basedosdados: UTF-8 BOM (`utf-8-sig`) — confirmado pelo inventário
- Geoportal: provavelmente UTF-8 ou Latin-1 — script deve tentar ambos

### 3.4 Geoportal usa nome do município (não cod_ibge)

Muitos CSVs do Geoportal identificam municípios por nome, não por cod_ibge. Estratégia:
1. Carregar `src/data/municipios_referencia.json` (tabela mestra local)
2. Criar dicionário nome→cod_ibge
3. Lidar com as 3 grafias divergentes conhecidas:
   - "Couto Magalhães" (IBGE) → "Couto de Magalhães" (SEPLAN) → cod_ibge 1706001
   - "Pau D'Arco" (IBGE) → "Pau d'Arco" (SEPLAN) → cod_ibge 1716307
   - "São Valério" (IBGE) → "São Valério da Natividade" (SEPLAN) → cod_ibge 1720499
4. Registrar quaisquer nomes não mapeados no log

---

## 4. Validação Interna (que o script deve fazer)

Ao final da geração de cada JSON, o script deve imprimir:
```
[Eixo 01] 4 indicadores, 139 municípios, anos 1991-2025
[Eixo 02] 9 indicadores, 139 municípios, anos 2009-2023
...
[TOTAL] XXX indicadores, 10 eixos
[ALERTAS] 2 municípios sem dados em Eixo 4 (SNIS)
```

Este output é o que será usado no Bloco C (validação Cowork).
