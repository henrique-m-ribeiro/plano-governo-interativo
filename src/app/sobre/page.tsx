import { Database, GitBranch, Eye, Users } from "lucide-react";

export const metadata = {
  title: "Sobre o Plano — Plano de Governo Interativo",
  description:
    "Metodologia, fontes de dados e transparência do Plano de Governo Interativo do Tocantins.",
};

/**
 * Página sobre o plano — metodologia e transparência
 * Tom institucional, baseado em evidências, fontes públicas citadas
 */
export default function SobrePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">
        Sobre o Plano
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-3xl">
        Transparência metodológica: como este plano foi construído, quais dados
        utiliza e por que apresenta as propostas desta forma.
      </p>

      {/* O que é */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          O que é o Plano de Governo Interativo?
        </h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          É uma plataforma web pública onde o cidadão tocantinense pode navegar
          pelas propostas de governo de forma não linear — por eixo temático, por
          município, por indicador, ou por problema identificado. Cada proposta
          está vinculada a dados reais do território, permitindo que o eleitor
          entenda a lógica de priorização.
        </p>
        <p className="text-gray-600 leading-relaxed">
          O objetivo é substituir o PDF genérico de plano de governo por uma
          ferramenta que demonstre capacidade de gestão baseada em dados e que
          engaje o cidadão com propostas concretas para seu município.
        </p>
      </section>

      {/* Princípios */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Princípios Metodológicos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icone: Database,
              titulo: "Dados Primeiro",
              descricao:
                "Toda proposta nasce de um diagnóstico territorial. Não há proposta genérica — cada uma responde a um indicador real.",
            },
            {
              icone: Eye,
              titulo: "Transparência Total",
              descricao:
                "Todas as fontes de dados são públicas e citadas. A metodologia é aberta para verificação e contestação.",
            },
            {
              icone: GitBranch,
              titulo: "Navegação Múltipla",
              descricao:
                "O cidadão escolhe como quer navegar: por município, tema, região ou problema. Sem hierarquia imposta.",
            },
            {
              icone: Users,
              titulo: "Linguagem Acessível",
              descricao:
                "Termos técnicos são explicados. Gráficos são legíveis em celular. O plano é para todos.",
            },
          ].map((principio) => (
            <div
              key={principio.titulo}
              className="p-5 bg-white rounded-lg border border-gray-200"
            >
              <principio.icone className="w-6 h-6 text-[var(--primary)] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">
                {principio.titulo}
              </h3>
              <p className="text-sm text-gray-600">{principio.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fontes de dados */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Fontes de Dados
        </h2>
        <div className="bg-[var(--surface)] rounded-lg p-6 border border-gray-100">
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 shrink-0" />
              <span>
                <strong>IBGE</strong> — Censo Demográfico, PIB Municipal,
                Pesquisa Nacional por Amostra de Domicílios (PNAD)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 shrink-0" />
              <span>
                <strong>INEP</strong> — Índice de Desenvolvimento da Educação
                Básica (IDEB), Censo Escolar
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 shrink-0" />
              <span>
                <strong>DATASUS</strong> — Sistema de Informações sobre
                Mortalidade, Atenção Básica, Nascidos Vivos
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 shrink-0" />
              <span>
                <strong>TCE-TO</strong> — Índice de Efetividade da Gestão
                Municipal (IEGM)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] mt-2 shrink-0" />
              <span>
                <strong>INPE</strong> — Dados de desmatamento e queimadas
                (PRODES, DETER)
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Nota sobre a plataforma */}
      <section className="p-5 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
        <p className="mb-2">
          <strong>Nota sobre a plataforma:</strong>
        </p>
        <p>
          Esta plataforma foi desenvolvida como parte de um projeto de pesquisa
          acadêmica sobre Inteligência Territorial e IA na Gestão Pública
          (doutorado em Políticas Públicas — ENAP). Os dados são processados pelo
          sistema tocantins-integrado, um dashboard de diagnóstico dos 139
          municípios. A criação e uso desta plataforma geram dados de pesquisa
          sobre como a IT-IA pode informar a elaboração de políticas públicas.
        </p>
      </section>
    </div>
  );
}
