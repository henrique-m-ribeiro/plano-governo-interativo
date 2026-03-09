/**
 * Card de estatística para exibir números-chave
 * Usado na home e nas páginas de eixo
 */
interface StatCardProps {
  numero: string;
  label: string;
  descricao?: string;
}

export function StatCard({ numero, label, descricao }: StatCardProps) {
  return (
    <div className="text-center p-4">
      <div className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
        {numero}
      </div>
      <div className="text-sm font-semibold text-gray-700 mt-1">{label}</div>
      {descricao && (
        <div className="text-xs text-gray-500 mt-1">{descricao}</div>
      )}
    </div>
  );
}
