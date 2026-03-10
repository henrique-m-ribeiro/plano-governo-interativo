/**
 * Estrutura de dados para contribuições cidadãs
 * Interfaces TypeScript para o canal de escuta
 */

export interface Contribuicao {
  id: string;
  municipioId: number;
  eixoId: number | null; // null = "Não sei / Outro"
  texto: string;
  textoProcessado?: string; // versão organizada pela IA
  nome?: string;
  contato?: string;
  dataRegistro: string; // ISO 8601
  tags?: string[]; // extraídas por IA
  sentimento?: 'positivo' | 'neutro' | 'negativo';
}

export interface ResumoEscuta {
  municipioId: number;
  totalContribuicoes: number;
  principaisTemas: string[];
  prioridadesCidadao: string[];
  ultimaAtualizacao: string;
}
