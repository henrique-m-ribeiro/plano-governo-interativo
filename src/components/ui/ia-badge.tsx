/**
 * Badge/tag visual que indica funcionalidade de IA
 * Usado nas páginas que integram inteligência artificial
 */

import { Sparkles } from 'lucide-react';

interface IABadgeProps {
  texto?: string;
}

export function IABadge({ texto = 'IA' }: IABadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-500 to-blue-500 text-white">
      <Sparkles className="w-3 h-3" />
      {texto}
    </span>
  );
}
