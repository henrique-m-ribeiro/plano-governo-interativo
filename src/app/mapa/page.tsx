import { MapaDinamico } from "@/components/mapa/mapa-dinamico";
import { regionais } from "@/data/regioes";

export const metadata = {
  title: "Mapa do Tocantins — Plano de Governo Interativo",
  description:
    "Mapa interativo dos 139 municípios do Tocantins com indicadores e propostas.",
};

/**
 * Página do mapa interativo
 * Camada 1 da arquitetura: diagnóstico territorial
 * O cidadão visualiza a situação do seu município antes de ver as propostas
 */
export default function MapaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Conheça o Tocantins
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          Explore o mapa interativo com dados de cada um dos 139 municípios.
          Clique em qualquer município para ver seu diagnóstico territorial
          e as propostas mais relevantes para a região.
        </p>
        <div className="flex gap-4 mt-3 text-sm text-gray-500">
          <span><strong className="text-gray-900">139</strong> municípios</span>
          <span><strong className="text-gray-900">{regionais.length}</strong> regionais SEPLAN</span>
          <span><strong className="text-gray-900">60</strong> indicadores</span>
        </div>
      </div>

      {/* Mapa interativo */}
      <div className="mb-8">
        <MapaDinamico />
      </div>

      {/* Informações adicionais */}
      <div className="p-4 bg-[var(--surface)] rounded-lg border border-gray-100 text-sm text-gray-600">
        <p>
          <strong>Como usar:</strong> Selecione um indicador no menu acima do mapa
          para colorir os municípios por nível. Passe o mouse sobre um município
          para ver o nome e clique para ver os dados detalhados.
        </p>
      </div>
    </div>
  );
}
