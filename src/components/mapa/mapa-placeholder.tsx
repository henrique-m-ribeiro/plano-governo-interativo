"use client";

import { MapPin } from "lucide-react";

/**
 * Componente placeholder para o mapa do Tocantins
 * Usado até que os dados GeoJSON dos municípios sejam integrados
 * O mapa real usará react-leaflet com GeoJSON dos 139 municípios (IBGE)
 *
 * TODO: Substituir por MapaTocantins quando GeoJSON estiver disponível
 */
export function MapaPlaceholder() {
  return (
    <div className="relative bg-gradient-to-b from-[var(--primary-light)]/10 to-[var(--primary)]/5 rounded-xl border-2 border-dashed border-[var(--primary-light)]/30 flex flex-col items-center justify-center min-h-[400px] md:min-h-[500px]">
      <MapPin className="w-16 h-16 text-[var(--primary-light)]/40 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Mapa Interativo do Tocantins
      </h3>
      <p className="text-sm text-gray-500 text-center max-w-md px-4">
        O mapa interativo com os 139 municípios será exibido aqui.
        Clique em qualquer município para ver sua ficha com indicadores e
        propostas relevantes.
      </p>
      <div className="mt-4 flex gap-3 text-xs text-gray-400">
        <span className="bg-white px-3 py-1 rounded-full shadow-sm">
          Leaflet + GeoJSON
        </span>
        <span className="bg-white px-3 py-1 rounded-full shadow-sm">
          139 municípios
        </span>
        <span className="bg-white px-3 py-1 rounded-full shadow-sm">
          Dados do IBGE
        </span>
      </div>
    </div>
  );
}
