import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, AlertTriangle } from "lucide-react";
import { eixos, getEixoBySlug } from "@/data/eixos";
import { getEixoDataBySlug } from "@/data/indicadores-utils";
import { PropostaCard } from "@/components/eixos/proposta-card";
import type { Metadata } from "next";

/**
 * Geração de parâmetros estáticos para pré-renderizar todas as páginas de eixo
 */
export async function generateStaticParams() {
  return eixos.map((eixo) => ({
    slug: eixo.slug,
  }));
}

/**
 * Metadados dinâmicos por eixo
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const eixo = getEixoBySlug(slug);
  if (!eixo) return { title: "Eixo não encontrado" };

  return {
    title: `${eixo.titulo} — Plano de Governo Interativo`,
    description: eixo.problemaCentral,
  };
}

/**
 * Formata um valor numérico para exibição legível
 */
function formatarValor(valor: number, unidade: string): string {
  if (unidade === "R$") {
    if (valor >= 1_000_000_000) return `R$ ${(valor / 1_000_000_000).toFixed(1)}B`;
    if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toFixed(1)}M`;
    if (valor >= 1_000) return `R$ ${(valor / 1_000).toFixed(1)}K`;
    return `R$ ${valor.toFixed(0)}`;
  }
  if (unidade === "%") return `${valor.toFixed(1)}%`;
  if (unidade === "índice" || unidade === "nota") return valor.toFixed(1);
  if (valor >= 1_000_000) return `${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `${(valor / 1_000).toFixed(1)}K`;
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

/**
 * Página de detalhe de um eixo temático
 * Mostra: diagnóstico, indicadores-chave com dados reais, propostas com metas
 */
export default async function EixoDetalhe({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eixo = getEixoBySlug(slug);

  if (!eixo) {
    notFound();
  }

  // Carregar dados reais do JSON
  const eixoData = getEixoDataBySlug(eixo.slug);
  const indicadoresMap = new Map(
    eixoData?.indicadores.map(ind => {
      // Calcular estatísticas (mediana do valor mais recente)
      const valores: number[] = [];
      for (const anos of Object.values(ind.serie_temporal)) {
        const anosKeys = Object.keys(anos as Record<string, number>).sort();
        if (anosKeys.length > 0) {
          valores.push((anos as Record<string, number>)[anosKeys[anosKeys.length - 1]]);
        }
      }
      valores.sort((a, b) => a - b);
      const mediana = valores.length > 0 ? valores[Math.floor(valores.length / 2)] : 0;

      return [ind.id, { ...ind, mediana }];
    }) ?? []
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Navegação de volta */}
      <Link
        href="/eixos"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--primary)] transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar aos eixos
      </Link>

      {/* Cabeçalho do eixo */}
      <div className="mb-10">
        <span
          className="text-sm font-semibold uppercase tracking-wide"
          style={{ color: eixo.corHex }}
        >
          Eixo {eixo.id}
          {eixo.transversal && " — Transversal"}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-2">
          {eixo.titulo}
        </h1>
        <p className="text-lg text-gray-500">{eixo.subtitulo}</p>
        {eixoData && (
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span>
              <strong className="text-gray-900">{eixoData.metadados.total_indicadores}</strong> indicadores
            </span>
            <span>
              <strong className="text-gray-900">{eixoData.metadados.cobertura_municipios}</strong> municípios com dados
            </span>
          </div>
        )}
      </div>

      {/* Diagnóstico / Problema central */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <h2 className="font-semibold text-amber-900 mb-1">Problema Central</h2>
            <p className="text-sm text-amber-800">{eixo.problemaCentral}</p>
          </div>
        </div>
      </div>

      {/* Indicadores-chave com dados reais */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          Indicadores-Chave
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {eixo.indicadoresChave.map((indicadorId) => {
            const ind = indicadoresMap.get(indicadorId);
            if (!ind) return null;

            return (
              <div
                key={indicadorId}
                className="p-4 rounded-lg bg-gray-50 border border-gray-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {ind.nome}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ind.fonte} · {ind.ano_inicio}–{ind.ano_fim}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-lg font-bold"
                      style={{ color: eixo.corHex }}
                    >
                      {formatarValor(ind.mediana, ind.unidade)}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase">
                      mediana estadual
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                  {ind.descricao}
                </p>
                <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                  <span>{ind.cobertura_municipios} municípios</span>
                  <span>{ind.unidade}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Propostas */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Propostas ({eixo.propostas.length})
        </h2>
        <div className="space-y-4">
          {eixo.propostas.map((proposta) => (
            <PropostaCard
              key={proposta.id}
              proposta={proposta}
              corEixo={eixo.corHex}
            />
          ))}
        </div>
      </div>

      {/* Nota sobre dados do território */}
      <div className="mt-10 p-4 bg-[var(--surface)] rounded-lg border border-gray-100 text-sm text-gray-600">
        <p>
          <strong>Sobre os dados:</strong> Os indicadores e diagnósticos são
          baseados em dados públicos oficiais (IBGE, INEP, DATASUS, TCE-TO) e
          processados pelo sistema tocantins-integrado. Os dados são atualizados
          conforme disponibilidade das fontes oficiais.
        </p>
      </div>
    </div>
  );
}
