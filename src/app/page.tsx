import Link from "next/link";
import { Map, LayoutGrid, MapPin, Search, MessageCircle, ArrowRight, Bot, Heart, Brain } from "lucide-react";
import { EixoCard } from "@/components/eixos/eixo-card";
import { StatCard } from "@/components/ui/stat-card";
import { MapaDinamico } from "@/components/mapa/mapa-dinamico";
import { eixos, getTotalPropostas } from "@/data/eixos";

/**
 * Página inicial do Plano de Governo Interativo
 * Apresenta os caminhos de navegação, resumo dos eixos e mapa
 */
export default function Home() {
  const totalPropostas = getTotalPropostas();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
              Plano de Governo Interativo do Tocantins
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-2 leading-relaxed">
              Professora Dorinha — Propostas baseadas em dados reais para os 139 municípios.
            </p>
            <p className="text-base md:text-lg text-white/80 mb-8 leading-relaxed">
              Navegue por eixos temáticos, explore seu município e entenda
              como cada proposta responde a um diagnóstico do território.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/mapa"
                className="inline-flex items-center justify-center gap-2 bg-white text-[var(--primary)] font-semibold px-6 py-3 rounded-lg hover:bg-white/90 transition-colors"
              >
                <Map className="w-5 h-5" />
                Explorar o Mapa
              </Link>
              <Link
                href="/eixos"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/20 transition-colors border border-white/20"
              >
                <LayoutGrid className="w-5 h-5" />
                Ver Eixos do Plano
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Números-chave */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard numero="139" label="Municípios" descricao="com dados individuais" />
            <StatCard numero="10" label="Eixos Temáticos" descricao="de desenvolvimento" />
            <StatCard numero={String(totalPropostas)} label="Propostas" descricao="baseadas em dados" />
            <StatCard numero="6" label="Regiões" descricao="de planejamento" />
          </div>
        </div>
      </section>

      {/* Caminhos de navegação */}
      <section className="py-12 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Como você quer navegar?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                href: "/mapa",
                icone: Map,
                titulo: "Pelo Mapa",
                descricao: "Clique no seu município e veja propostas e dados locais.",
              },
              {
                href: "/eixos",
                icone: LayoutGrid,
                titulo: "Por Eixo Temático",
                descricao: "Explore os 10 eixos: saúde, educação, infraestrutura...",
              },
              {
                href: "/regioes",
                icone: MapPin,
                titulo: "Por Região",
                descricao: "Veja o diagnóstico e propostas da sua região.",
              },
              {
                href: "/buscar",
                icone: Search,
                titulo: "Por Tema",
                descricao: "Busque por um assunto que importa para você.",
              },
              {
                href: "/participar",
                icone: MessageCircle,
                titulo: "Sua Voz",
                descricao: "Registre o que é prioritário para o seu município.",
              },
            ].map((caminho) => (
              <Link
                key={caminho.href}
                href={caminho.href}
                className="group flex flex-col items-center text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-[var(--primary-light)] transition-all"
              >
                <caminho.icone className="w-10 h-10 text-[var(--primary)] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 mb-1">{caminho.titulo}</h3>
                <p className="text-sm text-gray-500">{caminho.descricao}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Mapa do Tocantins (preview) */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Conheça o Tocantins
            </h2>
            <Link
              href="/mapa"
              className="text-sm text-[var(--primary)] font-medium hover:underline inline-flex items-center gap-1"
            >
              Ver mapa completo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <MapaDinamico />
        </div>
      </section>

      {/* Uma plataforma que escuta */}
      <section className="py-16 bg-gradient-to-br from-[var(--primary)]/5 to-[var(--primary-light)]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Uma plataforma que escuta
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mais que um plano estático: uma ferramenta viva que usa inteligência artificial
              para conectar cidadãos, dados e propostas.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Bot className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Exploração Assistida</h3>
              <p className="text-sm text-gray-600">
                Faça perguntas em linguagem natural sobre propostas, dados e municípios.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="font-semibold mb-2">Escuta Inclusiva</h3>
              <p className="text-sm text-gray-600">
                Canal de participação com IA que ajuda quem tem dificuldade em preencher formulários.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Inteligência para Planejamento</h3>
              <p className="text-sm text-gray-600">
                Contribuições processadas para identificar padrões e prioridades por município e região.
              </p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/participar"
              className="inline-flex items-center gap-2 bg-[var(--primary)] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[var(--primary-light)] transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              Participe
            </Link>
          </div>
        </div>
      </section>

      {/* Eixos temáticos */}
      <section className="py-12 bg-[var(--surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Eixos do Plano
            </h2>
            <Link
              href="/eixos"
              className="text-sm text-[var(--primary)] font-medium hover:underline inline-flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eixos.map((eixo) => (
              <EixoCard key={eixo.id} eixo={eixo} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
