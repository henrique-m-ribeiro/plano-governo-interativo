'use client';

/**
 * Página /participar — Canal de Escuta Cidadã
 * Permite que cidadãos registrem demandas, sugestões e prioridades
 * A IA (placeholder) ajuda a organizar contribuições em linguagem livre
 */

import { useState } from 'react';
import { Send, MessageCircle, Mic, ArrowRight, CheckCircle, Users, Brain, Shield } from 'lucide-react';
import { eixos } from '@/data/eixos';
import { municipios } from '@/data/municipios';
import ChatMessage from '@/components/ia/chat-message';

export default function ParticiparPage() {
  const [municipio, setMunicipio] = useState('');
  const [eixoId, setEixoId] = useState('');
  const [contribuicao, setContribuicao] = useState('');
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);
  const [chatMensagens, setChatMensagens] = useState<{ texto: string; tipo: 'usuario' | 'assistente' }[]>([
    {
      texto: 'Olá! Me conte com suas palavras o que é mais importante para a sua cidade. Eu ajudo a organizar.',
      tipo: 'assistente',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!municipio || !contribuicao.trim()) return;

    try {
      await fetch('/api/contribuicoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          municipio,
          eixoId: eixoId ? Number(eixoId) : null,
          texto: contribuicao,
          nome: nome || undefined,
          contato: contato || undefined,
        }),
      });
    } catch {
      // Silencia erro — o backend ainda é placeholder
    }

    setEnviado(true);
  };

  const enviarChatMsg = () => {
    if (!chatInput.trim()) return;
    const msg = chatInput.trim();
    setChatMensagens((prev) => [...prev, { texto: msg, tipo: 'usuario' as const }]);
    setChatInput('');

    // Resposta placeholder do assistente
    setTimeout(() => {
      setChatMensagens((prev) => [
        ...prev,
        {
          texto: `Entendi! Você mencionou: "${msg}". Essa é uma contribuição importante. Quando o assistente estiver ativo, eu vou ajudar a organizar suas ideias e conectar com os eixos do plano. Por enquanto, use o formulário ao lado para registrar sua contribuição.`,
          tipo: 'assistente' as const,
        },
      ]);
    }, 600);
  };

  if (enviado) {
    return (
      <main className="min-h-screen bg-[var(--surface)]">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-4">
            Contribuição registrada!
          </h1>
          <p className="text-gray-600 mb-8">
            Obrigado por compartilhar o que é importante para você e sua comunidade.
            Sua voz será considerada na construção do plano de governo.
          </p>
          <button
            onClick={() => {
              setEnviado(false);
              setContribuicao('');
              setEixoId('');
              setNome('');
              setContato('');
            }}
            className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:bg-[var(--primary-light)] transition-colors"
          >
            Enviar outra contribuição
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--surface)]">
      {/* Seção superior: explicação */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Sua Voz no Plano de Governo
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-4 max-w-2xl mx-auto">
            Registre suas demandas, sugestões e prioridades para o seu município.
            Cada contribuição ajuda a construir um plano de governo mais próximo da realidade
            do Tocantins.
          </p>
          <p className="text-sm text-white/70 bg-white/10 inline-block px-4 py-2 rounded-full">
            Pode escrever como quiser — a inteligência artificial nos ajuda a organizar sua contribuição
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulário principal */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                Registre sua contribuição
              </h2>

              {/* Município */}
              <div>
                <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
                  Município *
                </label>
                <select
                  id="municipio"
                  value={municipio}
                  onChange={(e) => setMunicipio(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="">Selecione seu município</option>
                  {municipios.map((m) => (
                    <option key={m.codIbge} value={m.nome}>{m.nome}</option>
                  ))}
                </select>
              </div>

              {/* Eixo temático */}
              <div>
                <label htmlFor="eixo" className="block text-sm font-medium text-gray-700 mb-1">
                  Eixo temático
                </label>
                <select
                  id="eixo"
                  value={eixoId}
                  onChange={(e) => setEixoId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                >
                  <option value="">Não sei / Outro</option>
                  {eixos.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.id}. {e.titulo}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contribuição */}
              <div>
                <label htmlFor="contribuicao" className="block text-sm font-medium text-gray-700 mb-1">
                  Sua contribuição *
                </label>
                <textarea
                  id="contribuicao"
                  value={contribuicao}
                  onChange={(e) => setContribuicao(e.target.value)}
                  required
                  rows={6}
                  placeholder="Conte o que é mais importante para você e sua comunidade..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-y"
                />
              </div>

              {/* Nome (opcional) */}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome <span className="text-gray-400">(opcional)</span>
                </label>
                <input
                  type="text"
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Como você gostaria de ser chamado(a)"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              {/* Contato (opcional) */}
              <div>
                <label htmlFor="contato" className="block text-sm font-medium text-gray-700 mb-1">
                  Contato <span className="text-gray-400">(opcional — WhatsApp ou email)</span>
                </label>
                <input
                  type="text"
                  id="contato"
                  value={contato}
                  onChange={(e) => setContato(e.target.value)}
                  placeholder="WhatsApp ou email para retorno"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>

              {/* Botão enviar */}
              <button
                type="submit"
                className="w-full bg-[var(--primary)] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[var(--primary-light)] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar contribuição
              </button>
            </form>
          </div>

          {/* Assistente de escuta (sidebar) */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <button
                onClick={() => setChatAberto(!chatAberto)}
                className="w-full text-left"
                aria-expanded={chatAberto}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center">
                    {chatAberto ? <MessageCircle className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
                  </div>
                  <h3 className="font-semibold text-[var(--foreground)]">
                    Precisa de ajuda?
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Clique aqui e a inteligência artificial ajuda você a organizar suas ideias.
                </p>
              </button>

              {/* Chat placeholder do assistente de escuta */}
              {chatAberto && (
                <div className="mt-4 border-t pt-4">
                  <div className="space-y-1 max-h-64 overflow-y-auto mb-3">
                    {chatMensagens.map((msg, i) => (
                      <ChatMessage key={i} texto={msg.texto} tipo={msg.tipo} />
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          enviarChatMsg();
                        }
                      }}
                      placeholder="Digite aqui..."
                      className="flex-1 text-sm border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      aria-label="Mensagem para o assistente"
                    />
                    <button
                      onClick={enviarChatMsg}
                      disabled={!chatInput.trim()}
                      className="w-9 h-9 rounded-full bg-[var(--accent)] text-white flex items-center justify-center disabled:opacity-50"
                      aria-label="Enviar mensagem"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seção inferior: transparência */}
        <section className="mt-16 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
            O que acontece com sua contribuição?
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">1. Registro</h3>
              <p className="text-xs text-gray-600">Sua contribuição é registrada e associada ao seu município</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">2. Processamento</h3>
              <p className="text-xs text-gray-600">A IA organiza e identifica temas e padrões nas contribuições</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">3. Análise</h3>
              <p className="text-xs text-gray-600">Padrões e prioridades são identificados por município e região</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-sm mb-1">4. Incorporação</h3>
              <p className="text-xs text-gray-600">As prioridades cidadãs alimentam e atualizam o plano de governo</p>
            </div>
          </div>
          <div className="mt-8 flex items-start gap-3 bg-blue-50 rounded-lg p-4">
            <ArrowRight className="w-5 h-5 text-[var(--primary)] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-700">
              A escuta não termina na eleição. Este é um processo contínuo: as contribuições dos
              cidadãos continuam alimentando o plano, que se atualiza com base na voz do território.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
