import { Target, BarChart3 } from "lucide-react";
import type { Proposta } from "@/data/eixos";

interface PropostaCardProps {
  proposta: Proposta;
  corEixo: string;
}

/**
 * Card de visualização de uma proposta individual
 * Mostra título, descrição, meta (se houver) e indicadores relacionados
 */
export function PropostaCard({ proposta, corEixo }: PropostaCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 hover:shadow-sm transition-shadow">
      {/* Título da proposta */}
      <h4 className="font-semibold text-gray-900 mb-2">{proposta.titulo}</h4>

      {/* Descrição */}
      <p className="text-sm text-gray-600 mb-4">{proposta.descricao}</p>

      {/* Meta, se houver */}
      {proposta.meta && (
        <div
          className="flex items-center gap-2 text-sm mb-3 px-3 py-2 rounded-md"
          style={{ backgroundColor: `${corEixo}10` }}
        >
          <Target className="w-4 h-4 shrink-0" style={{ color: corEixo }} />
          <span className="font-medium" style={{ color: corEixo }}>
            Meta:
          </span>
          <span className="text-gray-700">{proposta.meta}</span>
        </div>
      )}

      {/* Indicadores relacionados */}
      <div className="flex items-start gap-2 text-xs text-gray-500">
        <BarChart3 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <div className="flex flex-wrap gap-1">
          {proposta.indicadoresRelacionados.map((indicador) => (
            <span
              key={indicador}
              className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
            >
              {indicador}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
