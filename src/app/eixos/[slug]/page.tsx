import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BarChart3, AlertTriangle } from "lucide-react";
import { eixos, getEixoBySlug } from "@/data/eixos";
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
 * Página de detalhe de um eixo temático
 * Mostra: diagnóstico, indicadores-chave, propostas com metas
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

      {/* Indicadores-chave */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-400" />
          Indicadores-Chave
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {eixo.indicadoresChave.map((indicador) => (
            <div
              key={indicador}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: eixo.corHex }}
              />
              <span className="text-sm text-gray-700">{indicador}</span>
            </div>
          ))}
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
