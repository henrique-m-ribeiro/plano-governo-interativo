/**
 * Dados dos 10 eixos temáticos do Plano de Governo
 * Cada eixo contém: identificação, problema central, indicadores-chave, propostas e cor de identidade visual
 */

export interface Proposta {
  id: string;
  titulo: string;
  descricao: string;
  meta?: string;
  municipiosPrioritarios?: string[];
  indicadoresRelacionados: string[];
}

export interface Eixo {
  id: number;
  slug: string;
  titulo: string;
  subtitulo: string;
  problemaCentral: string;
  indicadoresChave: string[];
  propostas: Proposta[];
  cor: string; // cor principal do eixo (Tailwind class)
  corHex: string; // cor em hexadecimal para mapas e gráficos
  icone: string; // nome do ícone lucide-react
  transversal?: boolean; // se é eixo transversal
}

export const eixos: Eixo[] = [
  {
    id: 1,
    slug: "desenvolvimento-regional",
    titulo: "Desenvolvimento Regional",
    subtitulo: "Redução de Desigualdades",
    problemaCentral:
      "Forte concentração econômica em poucos polos, com ampla maioria dos municípios em situação de vulnerabilidade.",
    indicadoresChave: [
      "populacao",
      "pib_percapita",
      "taxa_urbanizacao",
      "crescimento_demografico",
      "pib_total",
      "va_servicos",
      "populacao_censitaria",
    ],
    propostas: [
      {
        id: "e1-p1",
        titulo: "Polos Regionais de Desenvolvimento",
        descricao:
          "Criação de polos regionais estratégicos para descentralizar o investimento público e atrair atividades econômicas para além dos grandes centros.",
        meta: "Implantar 8 polos regionais até 2030",
        indicadoresRelacionados: [
          "PIB per capita por município",
          "Índice de desigualdade intermunicipal",
        ],
      },
      {
        id: "e1-p2",
        titulo: "Descentralização de Investimentos",
        descricao:
          "Redistribuição do investimento estadual com critérios de equidade territorial, priorizando municípios com menor capacidade fiscal.",
        indicadoresRelacionados: [
          "PIB per capita por município",
          "Índice de desigualdade intermunicipal",
        ],
      },
      {
        id: "e1-p3",
        titulo: "Fortalecimento de Cadeias Produtivas Locais",
        descricao:
          "Programa de apoio técnico e financeiro para desenvolvimento de cadeias produtivas baseadas na vocação econômica de cada região.",
        indicadoresRelacionados: [
          "PIB per capita por município",
          "Taxa de urbanização",
        ],
      },
    ],
    cor: "blue",
    corHex: "#2563eb",
    icone: "TrendingUp",
  },
  {
    id: 2,
    slug: "educacao-capital-humano",
    titulo: "Educação e Capital Humano",
    subtitulo: "Qualificação e Oportunidades",
    problemaCentral:
      "Indicadores educacionais abaixo da média nacional em muitos municípios, evasão escolar no ensino médio, baixa qualificação profissional.",
    indicadoresChave: [
      "ideb_anos_iniciais",
      "ideb_ensino_medio",
      "nota_saeb_matematica",
      "nota_saeb_lingua_portuguesa",
      "taxa_aprovacao",
      "taxa_abandono",
      "matriculas_total",
    ],
    propostas: [
      {
        id: "e2-p1",
        titulo: "Expansão do Ensino Técnico Integrado",
        descricao:
          "Ampliação da oferta de ensino técnico integrado ao ensino médio, com cursos alinhados às vocações econômicas regionais.",
        meta: "Dobrar vagas de ensino técnico até 2030",
        indicadoresRelacionados: [
          "Matrículas no ensino técnico/superior",
          "Taxa de abandono escolar",
        ],
      },
      {
        id: "e2-p2",
        titulo: "Parcerias com Universidades",
        descricao:
          "Convênios com universidades públicas e privadas para interiorização do ensino superior e programas de extensão.",
        indicadoresRelacionados: ["Matrículas no ensino técnico/superior"],
      },
      {
        id: "e2-p3",
        titulo: "Programa de Primeira Infância",
        descricao:
          "Expansão da cobertura de creches e pré-escolas, com foco nos municípios com menor atendimento.",
        meta: "Atingir 60% de cobertura de creches até 2030",
        indicadoresRelacionados: ["Cobertura de creches", "IDEB"],
      },
    ],
    cor: "amber",
    corHex: "#d97706",
    icone: "GraduationCap",
  },
  {
    id: 3,
    slug: "saude-qualidade-vida",
    titulo: "Saúde e Qualidade de Vida",
    subtitulo: "Acesso Universal e Equitativo",
    problemaCentral:
      "Acesso desigual a serviços de saúde, dependência de deslocamento a grandes centros, indicadores materno-infantis preocupantes em municípios menores.",
    indicadoresChave: [
      "taxa_mortalidade_infantil",
      "leitos_internacao",
      "profissionais_saude",
      "estabelecimentos_saude",
      "cobertura_vacinal",
      "casos_dengue",
      "obitos_totais",
      "acidentes_peconhentos_total",
    ],
    propostas: [
      {
        id: "e3-p1",
        titulo: "Telemedicina para o Interior",
        descricao:
          "Implantação de programa estadual de telemedicina, conectando unidades de saúde do interior a especialistas nos grandes centros.",
        meta: "Cobertura de telemedicina em 100% dos municípios até 2029",
        indicadoresRelacionados: [
          "Tempo de deslocamento para serviço de média complexidade",
          "Cobertura da atenção básica",
        ],
      },
      {
        id: "e3-p2",
        titulo: "Fortalecimento de Hospitais Regionais",
        descricao:
          "Investimento em hospitais regionais para reduzir a dependência de deslocamento a Palmas para serviços de média complexidade.",
        indicadoresRelacionados: [
          "Leitos per capita",
          "Tempo de deslocamento para serviço de média complexidade",
        ],
      },
      {
        id: "e3-p3",
        titulo: "Programa Estadual de Saúde da Mulher",
        descricao:
          "Atenção integral à saúde da mulher com foco em pré-natal, parto humanizado e prevenção do câncer de mama e colo de útero.",
        indicadoresRelacionados: [
          "Mortalidade infantil",
          "Cobertura da atenção básica",
        ],
      },
    ],
    cor: "red",
    corHex: "#dc2626",
    icone: "Heart",
  },
  {
    id: 4,
    slug: "infraestrutura-conectividade",
    titulo: "Infraestrutura e Conectividade",
    subtitulo: "Integração Territorial",
    problemaCentral:
      "Logística precária em municípios afastados, baixa conectividade digital, déficit habitacional.",
    indicadoresChave: [
      "densidade_banda_larga",
      "indice_atendimento_agua",
      "indice_atendimento_esgoto",
      "indice_tratamento_esgoto",
    ],
    propostas: [
      {
        id: "e4-p1",
        titulo: "Programa de Estradas Vicinais",
        descricao:
          "Recuperação e pavimentação de estradas vicinais estratégicas para escoamento da produção e acesso a serviços.",
        meta: "Pavimentar 2.000 km de estradas vicinais até 2030",
        indicadoresRelacionados: ["Malha rodoviária pavimentada"],
      },
      {
        id: "e4-p2",
        titulo: "Internet para Todos os Municípios",
        descricao:
          "Programa de expansão de internet banda larga para áreas rurais e municípios sem cobertura adequada.",
        meta: "Banda larga em 100% das sedes municipais até 2028",
        indicadoresRelacionados: ["Acesso à internet banda larga"],
      },
      {
        id: "e4-p3",
        titulo: "Regularização Fundiária",
        descricao:
          "Programa estadual de regularização fundiária urbana e rural, garantindo segurança jurídica para moradores e produtores.",
        indicadoresRelacionados: ["Déficit habitacional"],
      },
    ],
    cor: "slate",
    corHex: "#475569",
    icone: "Building2",
  },
  {
    id: 5,
    slug: "meio-ambiente-sustentabilidade",
    titulo: "Meio Ambiente e Sustentabilidade",
    subtitulo: "Cerrado-Amazônia em Equilíbrio",
    problemaCentral:
      "Tocantins na transição Cerrado-Amazônia, pressão do agronegócio, queimadas, recursos hídricos.",
    indicadoresChave: [
      "area_desmatada_km2",
      "vegetacao_natural_km2",
      "cobertura_natural_pct",
      "taxa_desmatamento_anual",
    ],
    propostas: [
      {
        id: "e5-p1",
        titulo: "Programa Estadual de Combate a Queimadas",
        descricao:
          "Sistema integrado de prevenção e combate a incêndios florestais com monitoramento por satélite e brigadas regionais.",
        meta: "Reduzir focos de incêndio em 40% até 2030",
        indicadoresRelacionados: ["Focos de incêndio", "Área desmatada"],
      },
      {
        id: "e5-p2",
        titulo: "ICMS Ecológico",
        descricao:
          "Fortalecimento do ICMS Ecológico para incentivar municípios a preservar áreas ambientais e adotar práticas sustentáveis.",
        indicadoresRelacionados: [
          "Unidades de conservação",
          "Área desmatada",
        ],
      },
      {
        id: "e5-p3",
        titulo: "Bioeconomia do Cerrado",
        descricao:
          "Fomento à bioeconomia com aproveitamento sustentável da biodiversidade do Cerrado (baru, pequi, buriti, etc.).",
        indicadoresRelacionados: [
          "Unidades de conservação",
          "Qualidade da água",
        ],
      },
    ],
    cor: "green",
    corHex: "#16a34a",
    icone: "Leaf",
  },
  {
    id: 6,
    slug: "seguranca-publica-cidadania",
    titulo: "Segurança Pública e Cidadania",
    subtitulo: "Proteção e Prevenção",
    problemaCentral:
      "Indicadores de violência crescentes em polos urbanos, violência contra a mulher, déficit de efetivo policial em municípios menores.",
    indicadoresChave: [
      "homicidios",
      "homicidios_masculino",
      "homicidios_feminino",
      "homicidio_doloso_fbsp",
    ],
    propostas: [
      {
        id: "e6-p1",
        titulo: "Policiamento Comunitário",
        descricao:
          "Implantação de programa de policiamento comunitário nos municípios de maior vulnerabilidade.",
        indicadoresRelacionados: [
          "Taxa de homicídios",
          "Efetivo policial per capita",
        ],
      },
      {
        id: "e6-p2",
        titulo: "Centros de Atendimento à Mulher",
        descricao:
          "Criação e fortalecimento de centros de referência de atendimento à mulher em situação de violência.",
        meta: "Centro de atendimento em todas as microrregiões até 2029",
        indicadoresRelacionados: ["Feminicídios", "Ocorrências por tipo"],
      },
      {
        id: "e6-p3",
        titulo: "Integração de Dados de Segurança",
        descricao:
          "Sistema unificado de dados de segurança pública para análise territorial e alocação inteligente de recursos.",
        indicadoresRelacionados: [
          "Taxa de homicídios",
          "Ocorrências por tipo",
          "Efetivo policial per capita",
        ],
      },
    ],
    cor: "purple",
    corHex: "#9333ea",
    icone: "Shield",
  },
  {
    id: 7,
    slug: "gestao-publica-inovacao",
    titulo: "Gestão Pública e Inovação",
    subtitulo: "Eixo Transversal",
    problemaCentral:
      "Baixa capacidade institucional de muitos municípios, gestão baseada em intuição e não em dados, fragmentação de políticas.",
    indicadoresChave: [
      "receita_total",
      "receita_tributaria",
      "receita_transferencias",
      "servidores_estatutarios",
      "servidores_total",
      "capacidade_gestao",
    ],
    propostas: [
      {
        id: "e7-p1",
        titulo: "Plataforma Estadual de Inteligência Territorial",
        descricao:
          "Evolução do dashboard tocantins-integrado para plataforma institucional de apoio à decisão, acessível a todos os municípios.",
        meta: "Plataforma operacional com dados dos 139 municípios até 2028",
        indicadoresRelacionados: [
          "IEGM (TCE)",
          "Índice de transparência",
          "Digitalização de serviços",
        ],
      },
      {
        id: "e7-p2",
        titulo: "Capacitação de Gestores Municipais",
        descricao:
          "Programa de formação continuada para gestores e servidores municipais em gestão baseada em dados e evidências.",
        meta: "Capacitar gestores de 100% dos municípios até 2029",
        indicadoresRelacionados: [
          "IEGM (TCE)",
          "Receita própria vs. transferências",
        ],
      },
      {
        id: "e7-p3",
        titulo: "Governo Digital Estadual",
        descricao:
          "Digitalização completa dos serviços públicos estaduais, com foco em acessibilidade e interoperabilidade.",
        meta: "80% dos serviços públicos digitalizados até 2030",
        indicadoresRelacionados: [
          "Digitalização de serviços",
          "Índice de transparência",
        ],
      },
    ],
    cor: "teal",
    corHex: "#0d9488",
    icone: "Settings",
    transversal: true,
  },
  {
    id: 8,
    slug: "agropecuaria",
    titulo: "Agropecuária e Desenvolvimento Rural",
    subtitulo: "Competitividade com Desenvolvimento Social",
    problemaCentral:
      "O Tocantins possui enorme potencial agropecuário, mas a cadeia produtiva ainda é concentrada em poucos municípios e o valor agregado permanece baixo, com exportação predominante de grãos e gado in natura, sem industrialização local que gere emprego e renda para toda a população.",
    indicadoresChave: [
      "area_soja_ha",
      "area_milho_ha",
      "efetivo_bovino",
      "producao_leite_litros",
      "area_total_plantada_ha",
      "diversidade_produtiva",
      "va_agropecuaria",
    ],
    propostas: [
      {
        id: "e8-p1",
        titulo: "Assistência Técnica e Extensão Rural Universal",
        descricao:
          "Expansão dos serviços de assistência técnica e extensão rural (ATER) para alcançar 100% dos agricultores familiares, com foco em tecnologias de baixo carbono e aumento de produtividade sustentável.",
        meta: "Cobertura de ATER em todos os 139 municípios até 2030",
        indicadoresRelacionados: [
          "Participação da agricultura familiar",
          "Área plantada vs. produtividade",
        ],
      },
      {
        id: "e8-p2",
        titulo: "Agroindústria de Proximidade",
        descricao:
          "Programa de implantação de agroindústrias de pequeno porte nos polos regionais para agregação de valor à produção local, gerando emprego e reduzindo a dependência da exportação de matéria-prima bruta.",
        meta: "Implantar 20 agroindústrias de proximidade até 2030",
        indicadoresRelacionados: [
          "Valor Bruto da Produção Agropecuária",
          "Empregos formais no agronegócio",
        ],
      },
      {
        id: "e8-p3",
        titulo: "Seguro e Crédito Rural Acessível",
        descricao:
          "Criação de linha estadual complementar de crédito e seguro rural para pequenos e médios produtores, reduzindo barreiras burocráticas e ampliando a proteção contra perdas climáticas.",
        indicadoresRelacionados: [
          "Participação da agricultura familiar",
          "Valor Bruto da Produção Agropecuária",
        ],
      },
    ],
    cor: "yellow",
    corHex: "#8B6914",
    icone: "Wheat",
  },
  {
    id: 9,
    slug: "mineracao",
    titulo: "Mineração Sustentável",
    subtitulo: "Recursos Minerais com Responsabilidade",
    problemaCentral:
      "O Tocantins possui reservas minerais significativas, mas a exploração ainda é desordenada em muitas regiões, com impactos ambientais e sociais que poderiam ser mitigados com regulação moderna, fiscalização efetiva e exigência de contrapartidas para o desenvolvimento local.",
    indicadoresChave: [
      "cfem_arrecadacao",
      "cfem_distribuicao",
    ],
    propostas: [
      {
        id: "e9-p1",
        titulo: "Regulação e Fiscalização Integrada",
        descricao:
          "Modernização do marco regulatório estadual de mineração com sistema integrado de fiscalização ambiental, garantindo que toda atividade minerária tenha licença válida e plano de recuperação de áreas degradadas.",
        meta: "100% das atividades minerárias licenciadas e fiscalizadas até 2029",
        indicadoresRelacionados: [
          "Licenças ambientais vigentes",
          "Áreas de recuperação ambiental",
        ],
      },
      {
        id: "e9-p2",
        titulo: "CFEM para Desenvolvimento Local",
        descricao:
          "Programa de orientação e capacitação dos municípios mineradores para aplicação eficiente da CFEM em infraestrutura social, educação e diversificação econômica.",
        indicadoresRelacionados: [
          "Receita de CFEM por município",
          "Empregos no setor mineral",
        ],
      },
      {
        id: "e9-p3",
        titulo: "Mineração de Pequena Escala Regularizada",
        descricao:
          "Programa estadual de regularização e apoio técnico à mineração de pequena escala (garimpo), com foco em práticas ambientalmente responsáveis e formalização dos trabalhadores.",
        indicadoresRelacionados: [
          "Empregos no setor mineral",
          "Licenças ambientais vigentes",
        ],
      },
    ],
    cor: "gray",
    corHex: "#6B7280",
    icone: "Mountain",
  },
  {
    id: 10,
    slug: "industrializacao",
    titulo: "Industrialização e Atração de Investimentos",
    subtitulo: "Emprego Qualificado e Valor Agregado",
    problemaCentral:
      "O Tocantins exporta matéria-prima bruta e importa produtos manufaturados. A ausência de parque industrial robusto limita as oportunidades de emprego qualificado e faz com que a riqueza gerada no estado seja transferida para outras regiões sem beneficiar a população local.",
    indicadoresChave: [
      "va_industria",
      "emprego_formal_total",
    ],
    propostas: [
      {
        id: "e10-p1",
        titulo: "Distritos Industriais Regionais",
        descricao:
          "Implantação de distritos industriais nos polos regionais com infraestrutura pronta (energia, água, logística, internet), incentivos fiscais transparentes e foco em cadeias produtivas com vocação local.",
        meta: "Implantar 6 distritos industriais regionais até 2030",
        indicadoresRelacionados: [
          "Participação industrial no PIB estadual",
          "Número de indústrias instaladas",
        ],
      },
      {
        id: "e10-p2",
        titulo: "Programa Estadual de Qualificação Industrial",
        descricao:
          "Parceria com SENAI, SESI e universidades para formar mão de obra qualificada para a indústria, com cursos alinhados às demandas das empresas atraídas para o estado.",
        meta: "Qualificar 10.000 trabalhadores para a indústria até 2030",
        indicadoresRelacionados: [
          "Empregos industriais formais",
          "Participação industrial no PIB estadual",
        ],
      },
      {
        id: "e10-p3",
        titulo: "Atração de Investimentos com Contrapartida Social",
        descricao:
          "Programa estruturado de atração de investimentos industriais com exigência de contrapartidas sociais: emprego local, fornecedores regionais e investimento em formação profissional.",
        indicadoresRelacionados: [
          "Balança comercial de manufaturados",
          "Empregos industriais formais",
          "Número de indústrias instaladas",
        ],
      },
    ],
    cor: "indigo",
    corHex: "#4338CA",
    icone: "Factory",
  },
];

/**
 * Busca um eixo pelo slug
 */
export function getEixoBySlug(slug: string): Eixo | undefined {
  return eixos.find((e) => e.slug === slug);
}

/**
 * Busca um eixo pelo id
 */
export function getEixoById(id: number): Eixo | undefined {
  return eixos.find((e) => e.id === id);
}

/**
 * Retorna o total de propostas em todos os eixos
 */
export function getTotalPropostas(): number {
  return eixos.reduce((total, eixo) => total + eixo.propostas.length, 0);
}
