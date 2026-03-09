import { MapaPlaceholder } from "@/components/mapa/mapa-placeholder";

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
      </div>

      {/* Container do mapa */}
      <div className="mb-8">
        <MapaPlaceholder />
      </div>

      {/* Legenda / Filtros (placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">
            Filtrar por indicador
          </h3>
          <p className="text-xs text-gray-500">
            Selecione um indicador para colorir o mapa por nível de desenvolvimento.
          </p>
          <select className="mt-2 w-full text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-600" disabled>
            <option>IDH Municipal</option>
            <option>PIB per capita</option>
            <option>IDEB</option>
            <option>Mortalidade infantil</option>
          </select>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">
            Filtrar por região
          </h3>
          <p className="text-xs text-gray-500">
            Foque em uma das 6 regiões de planejamento do estado.
          </p>
          <select className="mt-2 w-full text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-600" disabled>
            <option>Todas as regiões</option>
            <option>Central</option>
            <option>Norte</option>
            <option>Sul</option>
            <option>Sudeste</option>
            <option>Bico do Papagaio</option>
            <option>Oeste</option>
          </select>
        </div>

        <div className="p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm mb-2">
            Buscar município
          </h3>
          <p className="text-xs text-gray-500">
            Digite o nome do município para localizá-lo no mapa.
          </p>
          <input
            type="text"
            placeholder="Ex: Palmas, Araguaína..."
            className="mt-2 w-full text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-600"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
