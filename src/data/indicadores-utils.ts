/**
 * Utilitários para acessar indicadores dos JSONs por eixo
 * Os 10 JSONs em src/data/indicadores/ são a fonte de verdade
 */

import eixo01 from '@/data/indicadores/eixo-01.json';
import eixo02 from '@/data/indicadores/eixo-02.json';
import eixo03 from '@/data/indicadores/eixo-03.json';
import eixo04 from '@/data/indicadores/eixo-04.json';
import eixo05 from '@/data/indicadores/eixo-05.json';
import eixo06 from '@/data/indicadores/eixo-06.json';
import eixo07 from '@/data/indicadores/eixo-07.json';
import eixo08 from '@/data/indicadores/eixo-08.json';
import eixo09 from '@/data/indicadores/eixo-09.json';
import eixo10 from '@/data/indicadores/eixo-10.json';

// Tipo de um indicador conforme schema ADR-013
export interface Indicador {
  id: string;
  nome: string;
  unidade: string;
  fonte: string;
  descricao: string;
  ano_inicio: number;
  ano_fim: number;
  cobertura_municipios: number;
  serie_temporal: Record<string, Record<string, number>>;
}

export interface EixoData {
  eixo: string;
  slug: string;
  numero: number;
  indicadores: Indicador[];
  contexto_estadual: unknown;
  metadados: {
    total_indicadores: number;
    cobertura_municipios: number;
    municipios_sem_dados: string[];
    fontes_utilizadas: string[];
    ultima_atualizacao: string;
    gerado_por: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EIXOS_DATA: EixoData[] = [
  eixo01, eixo02, eixo03, eixo04, eixo05,
  eixo06, eixo07, eixo08, eixo09, eixo10,
] as unknown as EixoData[];

// Mapeamento slug → número do eixo
const SLUG_TO_NUMERO: Record<string, number> = {
  'desenvolvimento-regional': 1,
  'educacao-capital-humano': 2,
  'saude-qualidade-vida': 3,
  'infraestrutura-conectividade': 4,
  'meio-ambiente-sustentabilidade': 5,
  'seguranca-publica-cidadania': 6,
  'gestao-publica-inovacao': 7,
  'agropecuaria': 8,
  'mineracao': 9,
  'industrializacao': 10,
};

/**
 * Retorna os dados completos de um eixo pelo seu número (1-10)
 */
export function getEixoData(numero: number): EixoData | undefined {
  return EIXOS_DATA.find(e => e.numero === numero);
}

/**
 * Retorna os dados completos de um eixo pelo slug usado em eixos.ts
 */
export function getEixoDataBySlug(slug: string): EixoData | undefined {
  const numero = SLUG_TO_NUMERO[slug];
  if (!numero) return undefined;
  return getEixoData(numero);
}

/**
 * Retorna os indicadores de um eixo com estatísticas agregadas
 */
export function getIndicadoresEixo(numero: number) {
  const eixo = getEixoData(numero);
  if (!eixo) return [];

  return eixo.indicadores.map(ind => {
    const valores: number[] = [];
    for (const anos of Object.values(ind.serie_temporal)) {
      const anosKeys = Object.keys(anos);
      if (anosKeys.length > 0) {
        // Usar o valor do ano mais recente
        const anoRecente = anosKeys.sort().pop()!;
        valores.push(anos[anoRecente]);
      }
    }

    valores.sort((a, b) => a - b);
    const soma = valores.reduce((s, v) => s + v, 0);
    const media = valores.length > 0 ? soma / valores.length : 0;
    const mediana = valores.length > 0
      ? valores[Math.floor(valores.length / 2)]
      : 0;

    return {
      ...ind,
      estatisticas: {
        media: Math.round(media * 100) / 100,
        mediana: Math.round(mediana * 100) / 100,
        min: valores.length > 0 ? valores[0] : 0,
        max: valores.length > 0 ? valores[valores.length - 1] : 0,
        total_municipios: valores.length,
      },
    };
  });
}

/**
 * Retorna todos os indicadores de um município, agrupados por eixo
 */
export function getIndicadoresMunicipio(codIbge: number) {
  const cod = String(codIbge);
  const resultado: {
    eixo: string;
    numero: number;
    slug: string;
    indicadores: { id: string; nome: string; unidade: string; valores: Record<string, number> }[];
  }[] = [];

  for (const eixo of EIXOS_DATA) {
    const indicadoresMun: { id: string; nome: string; unidade: string; valores: Record<string, number> }[] = [];

    for (const ind of eixo.indicadores) {
      const serie = ind.serie_temporal[cod];
      if (serie && Object.keys(serie).length > 0) {
        indicadoresMun.push({
          id: ind.id,
          nome: ind.nome,
          unidade: ind.unidade,
          valores: serie,
        });
      }
    }

    if (indicadoresMun.length > 0) {
      resultado.push({
        eixo: eixo.eixo,
        numero: eixo.numero,
        slug: eixo.slug,
        indicadores: indicadoresMun,
      });
    }
  }

  return resultado;
}

/**
 * Retorna o valor mais recente de um indicador para um município
 */
export function getValorRecente(indicador: Indicador, codIbge: number): number | null {
  const serie = indicador.serie_temporal[String(codIbge)];
  if (!serie) return null;
  const anos = Object.keys(serie).sort();
  if (anos.length === 0) return null;
  return serie[anos[anos.length - 1]];
}

/**
 * Retorna o valor mais recente de um indicador por ID para um município
 */
export function getValorIndicador(indicadorId: string, codIbge: number): number | null {
  for (const eixo of EIXOS_DATA) {
    const ind = eixo.indicadores.find(i => i.id === indicadorId);
    if (ind) {
      return getValorRecente(ind, codIbge);
    }
  }
  return null;
}

/**
 * Retorna um indicador pelo ID, buscando em todos os eixos
 */
export function getIndicadorById(id: string): Indicador | undefined {
  for (const eixo of EIXOS_DATA) {
    const ind = eixo.indicadores.find(i => i.id === id);
    if (ind) return ind;
  }
  return undefined;
}
