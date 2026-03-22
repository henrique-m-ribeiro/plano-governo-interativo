/**
 * Script para processar CSVs do pipeline e gerar dados estruturados para a plataforma
 * Lê os CSVs de data/pipeline/ e gera JSONs em src/data/
 *
 * Uso: node scripts/processar-pipeline.mjs
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PIPELINE = join(ROOT, 'data', 'pipeline');
const DATA_OUT = join(ROOT, 'src', 'data');

// Utilitário para ler CSV (simples, sem dependência externa)
function lerCSV(caminho) {
  if (!existsSync(caminho)) {
    console.warn(`  [SKIP] Arquivo não encontrado: ${caminho}`);
    return [];
  }
  const conteudo = readFileSync(caminho, 'utf-8').replace(/^\uFEFF/, ''); // remove BOM
  const linhas = conteudo.trim().split('\n');
  if (linhas.length < 2) return [];
  const cabecalho = linhas[0].split(',').map(c => c.trim());
  return linhas.slice(1).map(linha => {
    const valores = linha.split(',').map(v => v.trim());
    const obj = {};
    cabecalho.forEach((col, i) => {
      obj[col] = valores[i] || '';
    });
    return obj;
  });
}

function toNum(val) {
  if (!val || val === '' || val === '...') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

// ============================================================
// 1. Carregar Censo 2022 (cod_ibge + nome + populacao)
// ============================================================
console.log('1. Carregando Censo 2022...');
const censo = lerCSV(join(PIPELINE, 'basedosdados/csv/demografia/censo_2022_populacao.csv'));
const municipiosBase = censo.map(r => ({
  codIbge: parseInt(r.cod_ibge),
  nome: r.nome,
  populacao2022: toNum(r.populacao_2022),
})).filter(m => m.codIbge);
console.log(`   ${municipiosBase.length} municípios encontrados`);

// ============================================================
// 2. Carregar Regiões de Planejamento SEPLAN
// ============================================================
console.log('2. Carregando regiões de planejamento...');
const regioesJSON = JSON.parse(readFileSync(join(PIPELINE, 'regioes_planejamento_seplan_2024.json'), 'utf-8'));
const mapaRegiao = {}; // nome -> { regional, macrorregional }
// Mapa de nomes divergentes entre Censo IBGE e SEPLAN
const aliasNomes = {
  'Couto Magalhães': 'Couto de Magalhães',
  'São Valério': 'São Valério da Natividade',
  "Pau D'Arco": "Pau d'Arco",
};
const aliasInverso = {};
for (const [ibge, seplan] of Object.entries(aliasNomes)) {
  aliasInverso[seplan] = ibge;
}

for (const [slugRegional, dados] of Object.entries(regioesJSON.regionais)) {
  for (const nomeM of dados.municipios) {
    // Registrar tanto pelo nome SEPLAN quanto pelo nome IBGE
    const info = {
      regional: dados.nome,
      regionalSlug: slugRegional,
      macrorregional: dados.macrorregional,
      polo: dados.polo,
    };
    mapaRegiao[nomeM] = info;
    if (aliasInverso[nomeM]) {
      mapaRegiao[aliasInverso[nomeM]] = info;
    }
  }
}
console.log(`   ${Object.keys(mapaRegiao).length} municípios mapeados para regiões`);

// ============================================================
// 3. Carregar PIB
// ============================================================
console.log('3. Carregando PIB...');
const pib = lerCSV(join(PIPELINE, 'basedosdados/csv/economia/pib_municipal_ibge.csv'));
const mapaPib = {};
for (const r of pib) {
  mapaPib[r.cod_ibge] = {
    pib2023: toNum(r.pib_2023),
    pibPerCapita2023: toNum(r.pib_percapita_2023),
    pib2022: toNum(r.pib_2022),
    pibPerCapita2022: toNum(r.pib_percapita_2022),
  };
}

// PIB setorial (mais recente por município)
const pibSetorial = lerCSV(join(PIPELINE, 'basedosdados/csv/economia/pib_municipal_setorial_bd.csv'));
const mapaPibSetorial = {};
for (const r of pibSetorial) {
  const ano = parseInt(r.ano);
  if (!mapaPibSetorial[r.cod_ibge] || ano > mapaPibSetorial[r.cod_ibge].ano) {
    mapaPibSetorial[r.cod_ibge] = {
      ano,
      vaAgropecuaria: toNum(r.va_agropecuaria),
      vaIndustria: toNum(r.va_industria),
      vaServicos: toNum(r.va_servicos),
    };
  }
}

// ============================================================
// 4. Carregar IDEB (mais recente por município)
// ============================================================
console.log('4. Carregando IDEB...');
const ideb = lerCSV(join(PIPELINE, 'basedosdados/csv/educacao/ideb_municipio_bd.csv'));
const mapaIdeb = {};
for (const r of ideb) {
  const ano = parseInt(r.ano);
  const chave = `${r.cod_ibge}_${r.rede}_${r.ensino}`;
  if (!mapaIdeb[chave] || ano > mapaIdeb[chave].ano) {
    mapaIdeb[chave] = { ano, ideb: toNum(r.ideb), rede: r.rede, ensino: r.ensino };
  }
}
// Agrupar por município: pegar ideb municipal (rede pública) mais recente
const idebPorMunicipio = {};
for (const [chave, val] of Object.entries(mapaIdeb)) {
  const codIbge = chave.split('_')[0];
  if (!idebPorMunicipio[codIbge]) idebPorMunicipio[codIbge] = [];
  idebPorMunicipio[codIbge].push(val);
}

// ============================================================
// 5. Carregar Saúde (estabelecimentos CNES)
// ============================================================
console.log('5. Carregando CNES...');
const cnes = lerCSV(join(PIPELINE, 'basedosdados/csv/saude/cnes_estabelecimentos_bd.csv'));
// Pegar total de estabelecimentos por município (ano mais recente)
const mapaCnes = {};
for (const r of cnes) {
  const ano = parseInt(r.ano);
  const cod = r.cod_ibge;
  if (!mapaCnes[cod]) mapaCnes[cod] = { ano: 0, total: 0 };
  if (ano > mapaCnes[cod].ano) {
    mapaCnes[cod] = { ano, total: toNum(r.estabelecimentos) || 0 };
  } else if (ano === mapaCnes[cod].ano) {
    mapaCnes[cod].total += toNum(r.estabelecimentos) || 0;
  }
}

// ============================================================
// 6. Carregar Infraestrutura (água/esgoto)
// ============================================================
console.log('6. Carregando SNIS água/esgoto...');
const snis = lerCSV(join(PIPELINE, 'basedosdados/csv/infraestrutura/snis_agua_esgoto_bd.csv'));
const mapaSnis = {};
for (const r of snis) {
  const ano = parseInt(r.ano);
  const cod = r.cod_ibge;
  if (!mapaSnis[cod] || ano > mapaSnis[cod].ano) {
    mapaSnis[cod] = {
      ano,
      indiceAgua: toNum(r.indice_atendimento_agua),
      indiceEsgoto: toNum(r.indice_atendimento_esgoto),
    };
  }
}

// ============================================================
// 7. Carregar Banda Larga (Anatel)
// ============================================================
console.log('7. Carregando banda larga...');
const bandaLarga = lerCSV(join(PIPELINE, 'basedosdados/csv/infraestrutura/anatel_banda_larga_bd.csv'));
const mapaBandaLarga = {};
for (const r of bandaLarga) {
  const ano = parseInt(r.ano);
  const cod = r.cod_ibge;
  if (!mapaBandaLarga[cod] || ano > mapaBandaLarga[cod].ano) {
    mapaBandaLarga[cod] = { ano, densidade: toNum(r.acessos_densidade) };
  }
}

// ============================================================
// 8. Carregar Agropecuária (rebanho bovino)
// ============================================================
console.log('8. Carregando rebanho bovino...');
const bovinos = lerCSV(join(PIPELINE, 'basedosdados/csv/agropecuaria/ppm_rebanho_bovino.csv'));
const mapaBovinos = {};
for (const r of bovinos) {
  mapaBovinos[r.cod_ibge] = {
    bovinos2024: toNum(r.bovinos_2024),
    bovinos2023: toNum(r.bovinos_2023),
  };
}

// ============================================================
// 9. Carregar Emprego (RAIS - total por município mais recente)
// ============================================================
console.log('9. Carregando emprego RAIS...');
const rais = lerCSV(join(PIPELINE, 'basedosdados/csv/emprego/rais_emprego_setor_bd.csv'));
const mapaEmprego = {};
for (const r of rais) {
  const ano = parseInt(r.ano);
  const cod = r.cod_ibge;
  if (!mapaEmprego[cod]) mapaEmprego[cod] = { ano: 0, totalVinculos: 0 };
  if (ano > mapaEmprego[cod].ano) {
    mapaEmprego[cod] = { ano, totalVinculos: toNum(r.vinculos) || 0 };
  } else if (ano === mapaEmprego[cod].ano) {
    mapaEmprego[cod].totalVinculos += toNum(r.vinculos) || 0;
  }
}

// ============================================================
// 10. Carregar Segurança (homicídios)
// ============================================================
console.log('10. Carregando homicídios...');
const homicidios = lerCSV(join(PIPELINE, 'basedosdados/csv/seguranca/sim_homicidios_municipio_bd.csv'));
const mapaHomicidios = {};
for (const r of homicidios) {
  const ano = parseInt(r.ano);
  const cod = r.cod_ibge;
  if (!mapaHomicidios[cod] || ano > mapaHomicidios[cod].ano) {
    mapaHomicidios[cod] = { ano, total: toNum(r.homicidios) };
  }
}

// ============================================================
// 11. Carregar Desmatamento (PRODES)
// ============================================================
console.log('11. Carregando desmatamento...');
const desmatamento = lerCSV(join(PIPELINE, 'basedosdados/csv/meio_ambiente/prodes_desmatamento_bd.csv'));
const mapaDesmatamento = {};
for (const r of desmatamento) {
  const ano = parseInt(r.ano);
  const cod = r.cod_ibge;
  if (!mapaDesmatamento[cod] || ano > mapaDesmatamento[cod].ano) {
    mapaDesmatamento[cod] = {
      ano,
      desmatado: toNum(r.desmatado),
      vegetacaoNatural: toNum(r.vegetacao_natural),
    };
  }
}

// ============================================================
// MONTAR DADOS FINAIS
// ============================================================
console.log('\nMontando dados integrados...');

const municipiosCompletos = municipiosBase.map(m => {
  const cod = String(m.codIbge);
  const regiao = mapaRegiao[m.nome] || {};
  const pibData = mapaPib[cod] || {};
  const pibSet = mapaPibSetorial[cod] || {};
  const snisData = mapaSnis[cod] || {};
  const blData = mapaBandaLarga[cod] || {};
  const bovData = mapaBovinos[cod] || {};
  const empData = mapaEmprego[cod] || {};
  const homData = mapaHomicidios[cod] || {};
  const desmData = mapaDesmatamento[cod] || {};
  const cnesData = mapaCnes[cod] || {};

  // IDEB: pegar o mais recente da rede estadual ou municipal, anos iniciais
  const idebs = idebPorMunicipio[cod] || [];
  const idebMaisRecente = idebs.length > 0
    ? idebs.sort((a, b) => b.ano - a.ano)[0]
    : null;

  return {
    codIbge: m.codIbge,
    nome: m.nome,
    regional: regiao.regional || null,
    regionalSlug: regiao.regionalSlug || null,
    macrorregional: regiao.macrorregional || null,
    polo: regiao.polo || null,
    indicadores: {
      populacao2022: m.populacao2022,
      pib2023: pibData.pib2023 || pibData.pib2022 || null,
      pibPerCapita2023: pibData.pibPerCapita2023 || pibData.pibPerCapita2022 || null,
      vaAgropecuaria: pibSet.vaAgropecuaria || null,
      vaIndustria: pibSet.vaIndustria || null,
      vaServicos: pibSet.vaServicos || null,
      ideb: idebMaisRecente ? idebMaisRecente.ideb : null,
      idebAno: idebMaisRecente ? idebMaisRecente.ano : null,
      estabelecimentosSaude: cnesData.total || null,
      indiceAgua: snisData.indiceAgua || null,
      indiceEsgoto: snisData.indiceEsgoto || null,
      densidadeBandaLarga: blData.densidade || null,
      bovinos2024: bovData.bovinos2024 || null,
      empregosFormal: empData.totalVinculos || null,
      homicidios: homData.total || null,
      homicidiosAno: homData.ano || null,
      desmatadoKm2: desmData.desmatado || null,
      vegetacaoNaturalKm2: desmData.vegetacaoNatural || null,
    },
  };
});

// Ordenar alfabeticamente
municipiosCompletos.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

// ============================================================
// GERAR ARQUIVO municipios.ts
// ============================================================
console.log('Gerando municipios.ts...');

const municipiosTS = `/**
 * Dados dos 139 municípios do Tocantins com indicadores reais
 * Gerado automaticamente por scripts/processar-pipeline.mjs
 * Fontes: IBGE Censo 2022, PIB Municipal, IDEB, CNES, SNIS, Anatel, RAIS, SIM, PRODES, PPM
 * Regiões: SEPLAN/SPG 2024
 */

export interface Indicadores {
  populacao2022: number | null;
  pib2023: number | null;
  pibPerCapita2023: number | null;
  vaAgropecuaria: number | null;
  vaIndustria: number | null;
  vaServicos: number | null;
  ideb: number | null;
  idebAno: number | null;
  estabelecimentosSaude: number | null;
  indiceAgua: number | null;
  indiceEsgoto: number | null;
  densidadeBandaLarga: number | null;
  bovinos2024: number | null;
  empregosFormal: number | null;
  homicidios: number | null;
  homicidiosAno: number | null;
  desmatadoKm2: number | null;
  vegetacaoNaturalKm2: number | null;
}

export interface Municipio {
  codIbge: number;
  nome: string;
  regional: string | null;
  regionalSlug: string | null;
  macrorregional: string | null;
  polo: string | null;
  indicadores: Indicadores;
}

export const municipios: Municipio[] = ${JSON.stringify(municipiosCompletos, null, 2)};

// Helpers
export function getMunicipioByCod(codIbge: number): Municipio | undefined {
  return municipios.find(m => m.codIbge === codIbge);
}

export function getMunicipioByNome(nome: string): Municipio | undefined {
  return municipios.find(m => m.nome === nome);
}

export function getMunicipiosByRegional(regionalSlug: string): Municipio[] {
  return municipios.filter(m => m.regionalSlug === regionalSlug);
}

export function getMunicipiosByMacrorregional(macrorregional: string): Municipio[] {
  return municipios.filter(m => m.macrorregional === macrorregional);
}

export function getNomesMunicipios(): string[] {
  return municipios.map(m => m.nome);
}
`;

writeFileSync(join(DATA_OUT, 'municipios.ts'), municipiosTS, 'utf-8');

// ============================================================
// GERAR ARQUIVO regioes.ts
// ============================================================
console.log('Gerando regioes.ts...');

const regionais = Object.entries(regioesJSON.regionais).map(([slug, dados]) => ({
  slug,
  nome: dados.nome,
  macrorregional: dados.macrorregional,
  polo: dados.polo,
  totalMunicipios: dados.total_municipios,
  municipios: dados.municipios,
}));

const regioesTS = `/**
 * Regiões de planejamento do Tocantins (SEPLAN/SPG 2024)
 * Gerado automaticamente por scripts/processar-pipeline.mjs
 * 8 regionais em 3 macrorregionais (Sul, Centro, Norte)
 */

export interface Regional {
  slug: string;
  nome: string;
  macrorregional: string;
  polo: string;
  totalMunicipios: number;
  municipios: string[];
}

export const regionais: Regional[] = ${JSON.stringify(regionais, null, 2)};

export const macrorregionais = ${JSON.stringify(regioesJSON.macrorregionais, null, 2)};

export function getRegionalBySlug(slug: string): Regional | undefined {
  return regionais.find(r => r.slug === slug);
}

export function getRegionaisByMacro(macro: string): Regional[] {
  return regionais.filter(r => r.macrorregional === macro);
}
`;

writeFileSync(join(DATA_OUT, 'regioes.ts'), regioesTS, 'utf-8');

// ============================================================
// ESTATÍSTICAS FINAIS
// ============================================================
const comPib = municipiosCompletos.filter(m => m.indicadores.pib2023 !== null).length;
const comIdeb = municipiosCompletos.filter(m => m.indicadores.ideb !== null).length;
const comSaude = municipiosCompletos.filter(m => m.indicadores.estabelecimentosSaude !== null).length;
const comAgua = municipiosCompletos.filter(m => m.indicadores.indiceAgua !== null).length;
const comBL = municipiosCompletos.filter(m => m.indicadores.densidadeBandaLarga !== null).length;
const comBovinos = municipiosCompletos.filter(m => m.indicadores.bovinos2024 !== null).length;
const comEmprego = municipiosCompletos.filter(m => m.indicadores.empregosFormal !== null).length;
const comHomicidios = municipiosCompletos.filter(m => m.indicadores.homicidios !== null).length;
const comDesmatamento = municipiosCompletos.filter(m => m.indicadores.desmatadoKm2 !== null).length;
const comRegiao = municipiosCompletos.filter(m => m.regional !== null).length;

console.log('\n=== RESUMO DA INTEGRAÇÃO ===');
console.log(`Municípios: ${municipiosCompletos.length}`);
console.log(`Com região: ${comRegiao}/139`);
console.log(`Com PIB: ${comPib}/139`);
console.log(`Com IDEB: ${comIdeb}/139`);
console.log(`Com CNES (saúde): ${comSaude}/139`);
console.log(`Com água/esgoto: ${comAgua}/139`);
console.log(`Com banda larga: ${comBL}/139`);
console.log(`Com bovinos: ${comBovinos}/139`);
console.log(`Com emprego: ${comEmprego}/139`);
console.log(`Com homicídios: ${comHomicidios}/139`);
console.log(`Com desmatamento: ${comDesmatamento}/139`);
console.log('\nArquivos gerados:');
console.log(`  - src/data/municipios.ts`);
console.log(`  - src/data/regioes.ts`);
console.log('\nConcluído com sucesso!');
