import Link from "next/link";
import {
  TrendingUp,
  GraduationCap,
  Heart,
  Building2,
  Leaf,
  Shield,
  Settings,
} from "lucide-react";
import type { Eixo } from "@/data/eixos";

/**
 * Mapeamento de nomes de ícone para componentes lucide-react
 */
const iconeMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  TrendingUp,
  GraduationCap,
  Heart,
  Building2,
  Leaf,
  Shield,
  Settings,
};

interface EixoCardProps {
  eixo: Eixo;
}

/**
 * Card de visualização de um eixo temático
 * Usado na página de listagem de eixos e na home
 */
export function EixoCard({ eixo }: EixoCardProps) {
  const Icone = iconeMap[eixo.icone] || TrendingUp;

  return (
    <Link
      href={`/eixos/${eixo.slug}`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all"
    >
      {/* Cabeçalho do card com ícone e número do eixo */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg shrink-0"
          style={{ backgroundColor: `${eixo.corHex}15` }}
        >
          <Icone className="w-6 h-6" style={{ color: eixo.corHex }} />
        </div>
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: eixo.corHex }}
          >
            Eixo {eixo.id}
            {eixo.transversal && " — Transversal"}
          </span>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--primary)] transition-colors">
            {eixo.titulo}
          </h3>
        </div>
      </div>

      {/* Problema central (resumido) */}
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {eixo.problemaCentral}
      </p>

      {/* Indicadores e propostas em números */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span>{eixo.indicadoresChave.length} indicadores</span>
        <span className="text-gray-300">|</span>
        <span>{eixo.propostas.length} propostas</span>
      </div>
    </Link>
  );
}
