"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getMunicipioByCode } from "@/data/municipios";
import { getIndicadorById, getValorRecente, type Indicador } from "@/data/indicadores-utils";

// Indicadores disponíveis para choropleth
const INDICADORES_MAPA = [
  { id: "populacao", label: "População" },
  { id: "pib_percapita", label: "PIB per capita" },
  { id: "ideb_anos_iniciais", label: "IDEB (anos iniciais)" },
  { id: "densidade_banda_larga", label: "Banda larga" },
  { id: "indice_atendimento_agua", label: "Atendimento de água" },
  { id: "area_desmatada_km2", label: "Área desmatada" },
  { id: "efetivo_bovino", label: "Efetivo bovino" },
];

// Paleta de cores para 5 classes (azul claro → azul escuro)
const CORES = ["#eff6ff", "#93c5fd", "#3b82f6", "#1d4ed8", "#1e3a5f"];
const COR_SEM_DADO = "#e5e7eb";

interface Props {
  regiao?: string;
}

function calcularQuintis(valores: number[]): number[] {
  const sorted = [...valores].sort((a, b) => a - b);
  if (sorted.length < 5) return sorted;
  return [
    sorted[Math.floor(sorted.length * 0.2)],
    sorted[Math.floor(sorted.length * 0.4)],
    sorted[Math.floor(sorted.length * 0.6)],
    sorted[Math.floor(sorted.length * 0.8)],
  ];
}

function getCorQuintil(valor: number, breaks: number[]): string {
  if (breaks.length === 0) return CORES[2];
  for (let i = 0; i < breaks.length; i++) {
    if (valor <= breaks[i]) return CORES[i];
  }
  return CORES[4];
}

function formatarValor(valor: number, unidade: string): string {
  if (unidade === "R$") {
    if (valor >= 1_000_000) return `R$ ${(valor / 1_000_000).toFixed(1)}M`;
    if (valor >= 1_000) return `R$ ${(valor / 1_000).toFixed(1)}K`;
    return `R$ ${valor.toFixed(0)}`;
  }
  if (unidade === "%") return `${valor.toFixed(1)}%`;
  if (valor >= 1_000_000) return `${(valor / 1_000_000).toFixed(1)}M`;
  if (valor >= 1_000) return `${(valor / 1_000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
  return valor.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

export function MapaTocantins({ regiao }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const geoLayer = useRef<L.GeoJSON | null>(null);
  const legendRef = useRef<L.Control | null>(null);
  const [indicadorId, setIndicadorId] = useState("populacao");
  const [geoData, setGeoData] = useState<GeoJSON.FeatureCollection | null>(null);

  // Carregar GeoJSON
  useEffect(() => {
    fetch("/data/tocantins-municipios.geojson")
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Erro ao carregar GeoJSON:", err));
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false,
    }).setView([-10.2, -48.3], 6);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 14,
    }).addTo(map);

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Renderizar GeoJSON com choropleth
  const renderGeoJSON = useCallback(() => {
    const map = mapInstance.current;
    if (!map || !geoData) return;

    // Remover camada anterior
    if (geoLayer.current) {
      map.removeLayer(geoLayer.current);
    }
    if (legendRef.current) {
      legendRef.current.remove();
    }

    // Obter indicador
    const indicador: Indicador | undefined = getIndicadorById(indicadorId);
    if (!indicador) return;

    // Calcular valores para quintis
    const valores: number[] = [];
    for (const feature of geoData.features) {
      const codarea = feature.properties?.codarea;
      if (!codarea) continue;
      const val = getValorRecente(indicador, Number(codarea));
      if (val !== null) valores.push(val);
    }
    const breaks = calcularQuintis(valores);

    // Criar camada GeoJSON
    const layer = L.geoJSON(geoData, {
      filter: (feature) => {
        if (!regiao) return true;
        const cod = Number(feature.properties?.codarea);
        const mun = getMunicipioByCode(cod);
        return mun?.regionalSlug === regiao;
      },
      style: (feature) => {
        const codarea = feature?.properties?.codarea;
        const val = codarea ? getValorRecente(indicador, Number(codarea)) : null;
        const cor = val !== null ? getCorQuintil(val, breaks) : COR_SEM_DADO;

        return {
          fillColor: cor,
          weight: 1,
          color: "#94a3b8",
          fillOpacity: 0.8,
        };
      },
      onEachFeature: (feature, featureLayer) => {
        const codarea = feature.properties?.codarea;
        const cod = Number(codarea);
        const mun = getMunicipioByCode(cod);
        const nome = mun?.nome ?? codarea;
        const regional = mun?.regional ?? "";
        const val = getValorRecente(indicador, cod);

        // Tooltip ao hover
        featureLayer.bindTooltip(
          `<strong>${nome}</strong><br/>${regional}`,
          { sticky: true, className: "mapa-tooltip" }
        );

        // Popup ao clicar
        const valorTexto = val !== null
          ? formatarValor(val, indicador.unidade)
          : "Dado não disponível";

        const popupContent = `
          <div style="min-width:180px">
            <h3 style="margin:0 0 4px;font-size:14px;font-weight:700">${nome}</h3>
            <p style="margin:0 0 8px;font-size:11px;color:#6b7280">${regional}</p>
            <div style="border-top:1px solid #e5e7eb;padding-top:8px">
              <p style="margin:0;font-size:11px;color:#6b7280">${indicador.nome}</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#1d4ed8">${valorTexto}</p>
            </div>
          </div>
        `;
        featureLayer.bindPopup(popupContent);

        // Hover highlight
        featureLayer.on({
          mouseover: (e) => {
            const target = e.target as L.Path;
            target.setStyle({ weight: 2, color: "#1d4ed8" });
          },
          mouseout: (e) => {
            layer.resetStyle(e.target as L.Path);
          },
        });
      },
    }).addTo(map);

    geoLayer.current = layer;

    // Fit bounds
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }

    // Legenda
    const legend = new L.Control({ position: "bottomright" });
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "leaflet-legend");
      div.style.cssText = "background:white;padding:8px 12px;border-radius:6px;box-shadow:0 1px 4px rgba(0,0,0,.2);font-size:11px;line-height:1.6";

      const label = INDICADORES_MAPA.find(i => i.id === indicadorId)?.label ?? "";
      let html = `<strong style="font-size:12px">${label}</strong><br/>`;

      const breakLabels = breaks.length >= 4
        ? [
            `≤ ${formatarValor(breaks[0], indicador.unidade)}`,
            `≤ ${formatarValor(breaks[1], indicador.unidade)}`,
            `≤ ${formatarValor(breaks[2], indicador.unidade)}`,
            `≤ ${formatarValor(breaks[3], indicador.unidade)}`,
            `> ${formatarValor(breaks[3], indicador.unidade)}`,
          ]
        : CORES.map((_, i) => `Grupo ${i + 1}`);

      for (let i = 0; i < 5; i++) {
        html += `<span style="display:inline-block;width:14px;height:14px;background:${CORES[i]};margin-right:4px;vertical-align:middle;border:1px solid #cbd5e1;border-radius:2px"></span>${breakLabels[i]}<br/>`;
      }
      html += `<span style="display:inline-block;width:14px;height:14px;background:${COR_SEM_DADO};margin-right:4px;vertical-align:middle;border:1px solid #cbd5e1;border-radius:2px"></span>Sem dado`;

      div.innerHTML = html;
      return div;
    };
    legend.addTo(map);
    legendRef.current = legend;
  }, [geoData, indicadorId, regiao]);

  useEffect(() => {
    renderGeoJSON();
  }, [renderGeoJSON]);

  return (
    <div>
      {/* Seletor de indicador */}
      <div className="mb-3">
        <select
          value={indicadorId}
          onChange={(e) => setIndicadorId(e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-3 py-2 text-gray-700 bg-white"
        >
          {INDICADORES_MAPA.map((opt) => (
            <option key={opt.id} value={opt.id}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Container do mapa */}
      <div
        ref={mapRef}
        className="w-full rounded-xl border border-gray-200 shadow-sm"
        style={{ minHeight: "300px", height: "clamp(300px, 60vh, 600px)" }}
      />
    </div>
  );
}
