import Link from "next/link";

/**
 * Footer da plataforma
 * Inclui informações sobre fontes de dados e links institucionais
 */
export function Footer() {
  return (
    <footer className="bg-[var(--foreground)] text-white/70 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Coluna 1: Sobre */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">
              Plano de Governo Interativo
            </h3>
            <p className="text-xs leading-relaxed">
              Propostas baseadas em dados reais para os 139 municípios do
              Tocantins. Todas as informações são de fontes públicas oficiais.
            </p>
          </div>

          {/* Coluna 2: Fontes de dados */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">
              Fontes de Dados
            </h3>
            <ul className="text-xs space-y-1">
              <li>IBGE — Instituto Brasileiro de Geografia e Estatística</li>
              <li>INEP — Instituto Nacional de Estudos e Pesquisas Educacionais</li>
              <li>DATASUS — Departamento de Informática do SUS</li>
              <li>TCE-TO — Tribunal de Contas do Estado</li>
            </ul>
          </div>

          {/* Coluna 3: Links */}
          <div>
            <h3 className="text-white font-semibold mb-3 text-sm">
              Links
            </h3>
            <ul className="text-xs space-y-1">
              <li>
                <Link href="/sobre" className="hover:text-white transition-colors">
                  Sobre o Plano
                </Link>
              </li>
              <li>
                <Link href="/eixos" className="hover:text-white transition-colors">
                  Eixos Temáticos
                </Link>
              </li>
              <li>
                <Link href="/mapa" className="hover:text-white transition-colors">
                  Mapa do Tocantins
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs">
          <p>
            Dados públicos de fontes oficiais. Plataforma desenvolvida com
            transparência metodológica.
          </p>
        </div>
      </div>
    </footer>
  );
}
