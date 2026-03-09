"use client";

import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { eixos } from "@/data/eixos";
import { PropostaCard } from "@/components/eixos/proposta-card";

/**
 * Página de busca livre por temas, propostas e municípios
 * Caminho de entrada para o cidadão que já sabe o que procura
 */
export default function BuscarPage() {
  const [termo, setTermo] = useState("");

  // Busca simples por texto nos títulos e descrições das propostas
  const resultados = termo.length >= 2
    ? eixos.flatMap((eixo) =>
        eixo.propostas
          .filter(
            (p) =>
              p.titulo.toLowerCase().includes(termo.toLowerCase()) ||
              p.descricao.toLowerCase().includes(termo.toLowerCase()) ||
              p.indicadoresRelacionados.some((i) =>
                i.toLowerCase().includes(termo.toLowerCase())
              )
          )
          .map((proposta) => ({ proposta, eixo }))
      )
    : [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Buscar por Tema
        </h1>
        <p className="text-lg text-gray-600">
          Busque por um assunto que importa para você. Pode ser um tema
          (educação, saúde), um indicador (IDEB, mortalidade) ou uma proposta.
        </p>
      </div>

      {/* Campo de busca */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="Ex: telemedicina, estradas, queimadas, ensino técnico..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          autoFocus
        />
      </div>

      {/* Resultados */}
      {termo.length >= 2 && (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {resultados.length} resultado{resultados.length !== 1 && "s"} para
            &ldquo;{termo}&rdquo;
          </p>

          {resultados.length > 0 ? (
            <div className="space-y-4">
              {resultados.map(({ proposta, eixo }) => (
                <div key={proposta.id}>
                  <span
                    className="text-xs font-semibold uppercase tracking-wide mb-1 block"
                    style={{ color: eixo.corHex }}
                  >
                    Eixo {eixo.id}: {eixo.titulo}
                  </span>
                  <PropostaCard proposta={proposta} corEixo={eixo.corHex} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="mb-2">Nenhum resultado encontrado.</p>
              <p className="text-sm">
                Tente termos como: saúde, educação, estradas, queimadas,
                internet, segurança, gestão.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Nota sobre busca com IA */}
      <div className="mb-6 flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-sm text-purple-800">
        <Sparkles className="w-4 h-4 shrink-0" />
        <p>Em breve: busca por linguagem natural com inteligência artificial.</p>
      </div>

      {/* Sugestões quando não há busca */}
      {termo.length < 2 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Sugestões de busca:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "telemedicina",
              "ensino técnico",
              "estradas vicinais",
              "queimadas",
              "internet",
              "policiamento",
              "gestão pública",
              "creches",
            ].map((sugestao) => (
              <button
                key={sugestao}
                onClick={() => setTermo(sugestao)}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
              >
                {sugestao}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
