"use client";

import dynamic from "next/dynamic";

const MapaTocantins = dynamic(
  () => import("./mapa-tocantins").then(mod => ({ default: mod.MapaTocantins })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center"
           style={{ minHeight: "300px", height: "clamp(300px, 60vh, 600px)" }}>
        <p className="text-gray-400 text-sm">Carregando mapa...</p>
      </div>
    ),
  }
);

export function MapaDinamico({ regiao }: { regiao?: string }) {
  return <MapaTocantins regiao={regiao} />;
}
