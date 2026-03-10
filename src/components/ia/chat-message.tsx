/**
 * Componente de mensagem de chat reutilizável
 * Usado no assistente flutuante e na página /participar
 */

interface ChatMessageProps {
  texto: string;
  tipo: 'usuario' | 'assistente';
  timestamp?: string;
}

export default function ChatMessage({ texto, tipo, timestamp }: ChatMessageProps) {
  const isUsuario = tipo === 'usuario';

  return (
    <div className={`flex ${isUsuario ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUsuario
            ? 'bg-[var(--primary)] text-white rounded-br-md'
            : 'bg-[var(--surface)] text-[var(--foreground)] rounded-bl-md'
        }`}
      >
        <p>{texto}</p>
        {timestamp && (
          <span className={`block text-xs mt-1 ${isUsuario ? 'text-white/70' : 'text-gray-400'}`}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
