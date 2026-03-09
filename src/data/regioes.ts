/**
 * Regiões de planejamento do Tocantins
 * Agrupamento dos 139 municípios em regiões para navegação
 * Fonte: Secretaria de Planejamento do Tocantins
 */

export interface Regiao {
  id: string;
  nome: string;
  descricao: string;
  municipiosPrincipais: string[];
  totalMunicipios: number;
  caracteristicas: string;
}

export const regioes: Regiao[] = [
  {
    id: "central",
    nome: "Região Central",
    descricao: "Região metropolitana de Palmas e entorno",
    municipiosPrincipais: ["Palmas", "Porto Nacional", "Paraíso do Tocantins", "Miracema do Tocantins"],
    totalMunicipios: 25,
    caracteristicas: "Polo administrativo e de serviços. Maior concentração de PIB e população urbana.",
  },
  {
    id: "norte",
    nome: "Região Norte",
    descricao: "Região de Araguaína e norte do estado",
    municipiosPrincipais: ["Araguaína", "Colinas do Tocantins", "Guaraí", "Tocantinópolis"],
    totalMunicipios: 35,
    caracteristicas: "Segundo maior polo econômico. Forte agropecuária e comércio regional.",
  },
  {
    id: "sul",
    nome: "Região Sul",
    descricao: "Região de Gurupi e sul do estado",
    municipiosPrincipais: ["Gurupi", "Dianópolis", "Natividade", "Arraias"],
    totalMunicipios: 30,
    caracteristicas: "Terceiro polo econômico. Agropecuária e turismo histórico.",
  },
  {
    id: "sudeste",
    nome: "Região Sudeste",
    descricao: "Região do Jalapão e sudeste",
    municipiosPrincipais: ["Taguatinga", "Ponte Alta do Tocantins", "Mateiros"],
    totalMunicipios: 15,
    caracteristicas: "Área de preservação ambiental (Jalapão). Turismo ecológico e comunidades tradicionais.",
  },
  {
    id: "bico-do-papagaio",
    nome: "Bico do Papagaio",
    descricao: "Extremo norte do estado, entre os rios Araguaia e Tocantins",
    municipiosPrincipais: ["Augustinópolis", "Axixá do Tocantins", "São Miguel do Tocantins"],
    totalMunicipios: 25,
    caracteristicas: "Região de maior vulnerabilidade socioeconômica. Comunidades ribeirinhas e quilombolas.",
  },
  {
    id: "oeste",
    nome: "Região Oeste",
    descricao: "Região da Ilha do Bananal e oeste do estado",
    municipiosPrincipais: ["Formoso do Araguaia", "Lagoa da Confusão", "Cristalândia"],
    totalMunicipios: 9,
    caracteristicas: "Ilha do Bananal (maior ilha fluvial do mundo). Produção agropecuária irrigada.",
  },
];

/**
 * Busca uma região pelo id
 */
export function getRegiaoById(id: string): Regiao | undefined {
  return regioes.find((r) => r.id === id);
}
