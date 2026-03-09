'use client';

/**
 * Assistente de IA flutuante (chat)
 * Placeholder visual — a integração real com LLM será feita posteriormente
 * Aparece em todas as páginas via layout.tsx
 */

import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import ChatMessage from './chat-message';

// Respostas pré-programadas para demonstração
const respostasPadrao: Record<string, string> = {
  'educação': 'O Eixo 2 — Educação e Capital Humano — propõe a expansão do ensino técnico com polos descentralizados, parcerias com universidades e o programa "Primeira Infância Tocantinense" para ampliar creches e pré-escolas.',
  'saúde': 'O Eixo 3 — Saúde e Qualidade de Vida — inclui propostas como telemedicina para municípios isolados, rede de hospitais regionais e o programa "Mulher Tocantinense" focado em saúde da mulher.',
  'araguaína': 'Araguaína é o segundo polo econômico do Tocantins, na Região Norte. Possui propostas em diversas áreas, incluindo polo de ensino técnico, hospital regional e centro de referência para mulheres.',
  'palmas': 'Palmas, capital do estado, está na Região Central. Como polo administrativo, concentra serviços e infraestrutura. O plano propõe a plataforma de inteligência territorial e hub de inovação com sede na capital.',
};

interface Mensagem {
  texto: string;
  tipo: 'usuario' | 'assistente';
}

function buscarResposta(pergunta: string): string {
  const perguntaLower = pergunta.toLowerCase();
  for (const [chave, resposta] of Object.entries(respostasPadrao)) {
    if (perguntaLower.includes(chave)) {
      return resposta;
    }
  }
  return 'Estamos preparando o assistente com inteligência artificial. Em breve você poderá fazer perguntas detalhadas sobre propostas, dados e municípios. Por enquanto, experimente perguntar sobre "educação", "saúde", "Araguaína" ou "Palmas".';
}

export default function AssistenteIA() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      texto: 'Olá! Sou o assistente do Plano de Governo. Pergunte sobre propostas, dados ou municípios. Exemplo: "Quais as propostas para educação em Araguaína?"',
      tipo: 'assistente',
    },
  ]);
  const [input, setInput] = useState('');

  const enviarMensagem = () => {
    if (!input.trim()) return;

    const pergunta = input.trim();
    setMensagens((prev) => [...prev, { texto: pergunta, tipo: 'usuario' as const }]);
    setInput('');

    // Simula tempo de resposta
    setTimeout(() => {
      const resposta = buscarResposta(pergunta);
      setMensagens((prev) => [...prev, { texto: resposta, tipo: 'assistente' as const }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        onClick={() => setAberto(!aberto)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
        aria-label={aberto ? 'Fechar assistente' : 'Abrir assistente de IA'}
      >
        {aberto ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Painel de chat */}
      {aberto && (
        <div className="fixed bottom-24 right-6 z-50 w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ maxHeight: '70vh' }}
        >
          {/* Cabeçalho */}
          <div className="bg-[var(--primary)] text-white px-4 py-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <p className="font-semibold text-sm">Assistente do Plano</p>
              <p className="text-xs text-white/80">Pergunte sobre propostas e municípios</p>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-1" style={{ minHeight: '200px' }}>
            {mensagens.map((msg, i) => (
              <ChatMessage key={i} texto={msg.texto} tipo={msg.tipo} />
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta..."
              className="flex-1 text-sm border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              aria-label="Campo de pergunta"
            />
            <button
              onClick={enviarMensagem}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Enviar pergunta"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
