import Link from "next/link";
import { Map, LayoutGrid, MapPin, Search, ArrowRight } from "lucide-react";
import { EixoCard } from "@/components/eixos/eixo-card";
import { StatCard } from "@/components/ui/stat-card";
import { MapaPlaceholder } from "@/components/mapa/mapa-placeholder";
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
            <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
              Propostas baseadas em dados reais para os 139 municípios.
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
            <StatCard numero="7" label="Eixos Temáticos" descricao="de desenvolvimento" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                descricao: "Explore os 7 eixos: saúde, educação, infraestrutura...",
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
          <MapaPlaceholder />
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
