import Link from "next/link";
import { MapPin, Users, ChevronRight } from "lucide-react";
import { regionais } from "@/data/regioes";

export const metadata = {
  title: "Regiões — Plano de Governo Interativo",
  description:
    "Navegue pelas 8 regiões de planejamento do Tocantins e veja propostas regionalizadas.",
};

/**
 * Página de navegação por regiões de planejamento (SEPLAN/SPG 2024)
 * 8 regionais em 3 macrorregionais (Norte, Centro, Sul)
 */
export default function RegioesPage() {
  // Agrupar por macrorregional
  const macros = [
    { id: "norte", titulo: "Macrorregional Norte", cor: "bg-emerald-100 text-emerald-700" },
    { id: "centro", titulo: "Macrorregional Centro", cor: "bg-amber-100 text-amber-700" },
    { id: "sul", titulo: "Macrorregional Sul", cor: "bg-blue-100 text-blue-700" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Sua Região
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl">
          O Tocantins está dividido em 8 regiões de planejamento (SEPLAN 2024),
          agrupadas em 3 macrorregionais. Explore a região mais próxima de você
          e conheça as propostas para o seu território.
        </p>
      </div>

      {macros.map((macro) => {
        const regsDoMacro = regionais.filter(r => r.macrorregional === macro.id);
        return (
          <section key={macro.id} className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${macro.cor}`}>
                {macro.titulo}
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regsDoMacro.map((reg) => (
                <div
                  key={reg.slug}
                  className="group rounded-xl border border-gray-200 bg-white p-6 hover:shadow-md hover:border-[var(--primary-light)] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
                        <MapPin className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">
                          {reg.nome}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Polo: {reg.polo}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Users className="w-3.5 h-3.5" />
                    <span>{reg.totalMunicipios} municípios</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">
                    {reg.municipios.slice(0, 5).join(", ")}
                    {reg.municipios.length > 5 && ` e mais ${reg.municipios.length - 5}`}
                  </p>

                  <div className="flex items-center gap-1 text-sm text-[var(--primary)] font-medium group-hover:underline">
                    Explorar região
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
