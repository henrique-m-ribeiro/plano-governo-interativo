import Link from "next/link";
import { MapPin, Users, ChevronRight } from "lucide-react";
import { regioes } from "@/data/regioes";

export const metadata = {
  title: "Regiões — Plano de Governo Interativo",
  description:
    "Navegue pelas 6 regiões de planejamento do Tocantins e veja propostas regionalizadas.",
};

/**
 * Página de navegação por regiões de planejamento
 * Caminho alternativo de entrada: por região geográfica
 */
export default function RegioesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Sua Região
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          O Tocantins está dividido em 6 regiões de planejamento, cada uma com
          características, desafios e oportunidades próprias. Explore a região
          mais próxima de você.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {regioes.map((regiao) => (
          <div
            key={regiao.id}
            className="group rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-[var(--primary-light)] transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
                  <MapPin className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {regiao.nome}
                  </h3>
                  <p className="text-sm text-gray-500">{regiao.descricao}</p>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {regiao.caracteristicas}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
              <Users className="w-3.5 h-3.5" />
              <span>{regiao.totalMunicipios} municípios</span>
              <span className="text-gray-300">|</span>
              <span>
                Principais: {regiao.municipiosPrincipais.slice(0, 3).join(", ")}
              </span>
            </div>

            <div className="flex items-center gap-1 text-sm text-[var(--primary)] font-medium group-hover:underline">
              Explorar região
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
