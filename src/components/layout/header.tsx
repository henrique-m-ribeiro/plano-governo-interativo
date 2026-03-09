"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Map } from "lucide-react";
import { navegacaoPrincipal } from "@/data/navegacao";

/**
 * Header principal da plataforma
 * Mobile-first: hamburger menu em telas pequenas, links expandidos em telas grandes
 */
export function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header className="bg-[var(--primary)] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Título */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Map className="w-6 h-6" />
            <span className="hidden sm:inline">Plano de Governo Interativo</span>
            <span className="sm:hidden">Plano TO</span>
          </Link>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-6">
            {navegacaoPrincipal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                {item.titulo}
              </Link>
            ))}
          </nav>

          {/* Botão hamburger (mobile) */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuAberto}
          >
            {menuAberto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu mobile expandido */}
        {menuAberto && (
          <nav className="md:hidden pb-4 border-t border-white/20 mt-2 pt-4">
            <div className="flex flex-col gap-3">
              {navegacaoPrincipal.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-white/90 hover:text-white transition-colors py-2"
                  onClick={() => setMenuAberto(false)}
                >
                  {item.titulo}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
