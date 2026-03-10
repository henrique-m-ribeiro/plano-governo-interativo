import { EixoCard } from "@/components/eixos/eixo-card";
import { eixos, getTotalPropostas } from "@/data/eixos";

export const metadata = {
  title: "Eixos do Plano — Plano de Governo Interativo",
  description: "Conheça os 10 eixos temáticos do plano de governo para o Tocantins.",
};

/**
 * Página de listagem de todos os eixos temáticos
 */
export default function EixosPage() {
  const totalPropostas = getTotalPropostas();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Cabeçalho */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Eixos do Plano de Governo
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          O plano está organizado em 10 eixos temáticos, cada um com diagnóstico
          territorial, indicadores-chave e propostas baseadas em dados reais dos
          139 municípios do Tocantins.
        </p>
        <div className="flex gap-6 mt-4 text-sm text-gray-500">
          <span>
            <strong className="text-gray-900">{eixos.length}</strong> eixos temáticos
          </span>
          <span>
            <strong className="text-gray-900">{totalPropostas}</strong> propostas
          </span>
          <span>
            <strong className="text-gray-900">1</strong> eixo transversal
          </span>
        </div>
      </div>

      {/* Grid de eixos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eixos.map((eixo) => (
          <EixoCard key={eixo.id} eixo={eixo} />
        ))}
      </div>
    </div>
  );
}
