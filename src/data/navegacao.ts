/**
 * Estrutura de navegação da plataforma
 * Define os caminhos de entrada e a organização do menu
 */

export interface ItemNavegacao {
  titulo: string;
  href: string;
  descricao: string;
  icone: string;
}

export const navegacaoPrincipal: ItemNavegacao[] = [
  {
    titulo: "Conheça o Tocantins",
    href: "/mapa",
    descricao: "Mapa interativo com indicadores por município",
    icone: "Map",
  },
  {
    titulo: "Eixos do Plano",
    href: "/eixos",
    descricao: "7 eixos temáticos com diagnóstico e propostas",
    icone: "LayoutGrid",
  },
  {
    titulo: "Sua Região",
    href: "/regioes",
    descricao: "Navegação por regiões de planejamento",
    icone: "MapPin",
  },
  {
    titulo: "Buscar",
    href: "/buscar",
    descricao: "Busque por tema, município ou proposta",
    icone: "Search",
  },
  {
    titulo: "Participe",
    href: "/participar",
    descricao: "Registre demandas e prioridades para seu município",
    icone: "MessageCircle",
  },
];

export const navegacaoSecundaria: ItemNavegacao[] = [
  {
    titulo: "Sobre o Plano",
    href: "/sobre",
    descricao: "Metodologia e fontes de dados",
    icone: "Info",
  },
];
