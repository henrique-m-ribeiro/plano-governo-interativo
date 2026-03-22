# Handoff Cowork → Claude Code — Etapa I-3b: Gerar 10 JSONs por Eixo com Séries Temporais

> **Contexto:** A I-3 original entregou `municipios.ts` (18 indicadores) e `regioes.ts` (8 regionais SEPLAN) com sucesso. Mas NÃO gerou os 10 JSONs por eixo com séries temporais. Esta etapa I-3b complementa com os artefatos faltantes.

## Instruções de Execução

**IMPORTANTE:** Este trabalho é grande. Você pode e DEVE quebrá-lo em fases. Não tente processar todos os 91 CSVs de uma vez. A sequência sugerida abaixo permite entregas parciais e validação incremental.

**Se em qualquer momento o escopo parecer grande demais para a sessão atual:**
- Entregue o que já foi feito (commit parcial)
- Documente o que falta no briefing de saída
- O Cowork preparará uma continuação

## Sequência de Execução (5 fases)

### Fase A — Infraestrutura (fazer primeiro)

1. Criar diretório `src/data/indicadores/`
2. Criar o esqueleto do script `scripts/gerar_jsons_por_eixo.py` com:
   - Função de leitura de CSV com detecção automática de encoding (`utf-8-sig` → `utf-8` → `latin-1`)
   - Função de detecção de coluna de município (`cod_ibge`, `id_municipio`, `codigo_municipio`, `codigo_ente`, `cod_ibge_1`)
   - Função de detecção de formato largo vs longo e pivotagem
   - Dicionário de alias de nomes de municípios (3 grafias divergentes: "Couto Magalhães"→1706001, "Pau D'Arco"→1716307, "São Valério"→1720499)
   - Função de escrita de JSON seguindo o schema (ver abaixo)
   - Carregar `src/data/municipios_referencia.json` como tabela mestra para match de nomes
3. Copiar GeoJSON: de `../doutorado/06-dados/geoportal-seplan/geojson/municipios_tocantins.geojson` para `data/pipeline/geoportal-seplan/geojson/` (ou via URL raw do GitHub)
4. Corrigir 3 grafias em `municipios.ts`:
   - `"Couto Magalhães"` → `"Couto de Magalhães"`
   - `"Pau D'Arco"` → `"Pau d'Arco"`
   - `"São Valério"` (buscar ocorrência que NÃO termina em "da Natividade") → `"São Valério da Natividade"`

**Entregável:** Script esqueleto funcional + correções + GeoJSON. Pode commitar aqui.

### Fase B — Eixos simples (basedosdados, formato longo, cod_ibge)

Processar primeiro os eixos cujos CSVs são do basedosdados (formato longo, coluna `cod_ibge` presente, encoding `utf-8-sig`). São os mais fáceis:

| Eixo | CSVs | Complexidade |
|------|------|-------------|
| 4. Infraestrutura | 2 CSVs | Baixa |
| 5. Meio Ambiente | 2 CSVs | Baixa |
| 7. Gestão Pública | 3 CSVs | Média (id_municipio) |
| 9. Economia | 5 CSVs | Média (CFEM usa codigo_municipio) |

**Entregável:** 4 JSONs gerados e validados. Pode commitar aqui.

### Fase C — Eixos com muitos CSVs do Geoportal

Estes eixos misturam basedosdados (formato longo) com Geoportal (formato largo, por nome de município):

| Eixo | CSVs | Complexidade |
|------|------|-------------|
| 1. Desenv. Regional | 5 CSVs (2 basedosdados + 2 Geoportal) | Média |
| 3. Saúde | 13 CSVs (2 basedosdados + 11 Geoportal) | Alta |
| 6. Segurança | 9 CSVs (misto + contexto estadual) | Alta |

**Entregável:** 3 JSONs gerados. Pode commitar aqui.

### Fase D — Educação (23 CSVs)

O eixo 2 tem 23 CSVs (2 basedosdados + 21 Geoportal). Tratar separadamente por volume:

| Subgrupo | CSVs | O que extrair |
|----------|------|---------------|
| IDEB | 6 CSVs (1 bd + 4 Geoportal indice_*) | ideb por ano, aprovação, notas SAEB |
| Matrículas | 4 CSVs (1 bd + 3 Geoportal matriculas_*) | total matrículas por ano |
| Docentes | 3 CSVs Geoportal | total docentes por ano |
| Estabelecimentos | 3 CSVs Geoportal | total escolas por ano |
| Taxas | 7 CSVs Geoportal (abandono, aprovação, distorção, reprovação) | taxas por ano |

**Entregável:** 1 JSON (eixo-02). Pode commitar aqui.

### Fase E — Agropecuária (34 CSVs → ~8 indicadores agregados)

O eixo 8 é o maior (34 CSVs). A decisão é agregar em ~8 indicadores-chave:

1. `area_soja_ha` — de `lavoura_temporaria_soja_*.csv` + `pam_principais_culturas.csv`
2. `area_milho_ha` — de `lavoura_temporaria_milho_*.csv` + `pam_principais_culturas.csv`
3. `area_arroz_ha` — de `lavoura_temporaria_arroz_*.csv` + `pam_principais_culturas.csv`
4. `efetivo_bovino` — de `bovino1989_2018.csv` + `ppm_rebanho_bovino.csv`
5. `producao_leite_litros` — de `leite1.csv`
6. `producao_aquicultura` — de `aquicultura_2013_2018.csv`
7. `area_total_plantada_ha` — soma de todas as lavouras (temporárias + permanentes)
8. `diversidade_produtiva` — contagem de culturas com produção > 0 por município

E o eixo 10 (Cultura) com apenas 1 CSV.

**Entregável:** 2 JSONs (eixo-08 + eixo-10). Pode commitar aqui.

---

## Schema JSON de Saída (OBRIGATÓRIO)

Cada um dos 10 arquivos DEVE seguir esta estrutura. Não alterar.

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
    "fontes_utilizadas": ["caminho/do/csv.csv"],
    "ultima_atualizacao": "2026-03-22",
    "gerado_por": "gerar_jsons_por_eixo.py"
  }
}
```

**Regras inegociáveis:**
- Chaves de `serie_temporal` são **strings** do cod_ibge (ex: `"1700251"`)
- Incluir **TODOS os anos** disponíveis no CSV — não apenas o mais recente
- Valores ausentes: **omitir** a chave (JSON esparso, sem nulls em serie_temporal)
- Floats: 2 casas decimais
- `contexto_estadual`: `null` exceto Eixo 6 (Segurança), que inclui séries estaduais

## Arquivos de Entrada

Todos já em `data/pipeline/` (copiados na I-3):
- `inventario-csvs-pipeline.json` — inventário completo
- `regioes_planejamento_seplan_2024.json` — referência SEPLAN
- CSVs em `basedosdados/csv/` (30) e `geoportal-seplan/csv/` (68)

Referência: `src/data/municipios_referencia.json` (139 municípios)

Mapeamento CSV→Eixo detalhado: ver `briefing-fase-i-etapa-3.md` (já presente nesta pasta)

## Checklist de Entrega Final

- [ ] 10 arquivos JSON em `src/data/indicadores/` conforme schema
- [ ] Cada JSON tem `serie_temporal` com múltiplos anos
- [ ] Total de indicadores ≥ 60
- [ ] `README.md` em `src/data/indicadores/`
- [ ] 3 grafias corrigidas em `municipios.ts`
- [ ] GeoJSON copiado para `data/pipeline/geoportal-seplan/geojson/`
- [ ] Script `scripts/gerar_jsons_por_eixo.py` funcional
- [ ] Relatório de validação impresso
- [ ] Commits realizados (podem ser múltiplos, um por fase)

Se não conseguir completar todas as fases, commitar o que foi feito e documentar o que falta.

## Briefing de Saída

Ao concluir (total ou parcial), produzir:
1. Fases completadas (A/B/C/D/E)
2. JSONs gerados com contagem de indicadores e anos por eixo
3. Fases pendentes (se houver) com diagnóstico do que falta
4. Problemas encontrados
