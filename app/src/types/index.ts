export type NivelJogador = 'iniciante' | 'intermediario' | 'avancado';
export type TipoQuadra = 'beach_tennis' | 'volei' | 'futevolei';
export type StatusAgendamento = 'pendente' | 'confirmado' | 'cancelado' | 'concluido';
export type TipoChallenge = 'buscando_parceiro' | 'buscando_dupla' | 'buscando_adversario';
export type StatusChallenge = 'ativo' | 'match' | 'cancelado';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  role: 'atleta' | 'admin' | 'professor';
  nivel: NivelJogador;
  telefone?: string;
  pontuacaoAtual: number;
  posicaoRanking: number;
  estatisticas: {
    vitorias: number;
    derrotas: number;
    jogos: number;
    winRate: number;
    aulasConcluidas?: number;
    horasQuadra?: number;
  };
  financeiro?: {
    mensalista: boolean;
    vencimentoMensalidade?: Date;
    statusMensalidade: 'em_dia' | 'pendente' | 'atrasado';
    planoNome?: string;
  };
  duplaFixaId?: string;
  createdAt: Date;
}

export interface Professor {
  id: string;
  nome: string;
  email: string;
  avatar?: string;
  modalidades: string[];
  comissao: number; // Porcentagem de repasse (ex: 70)
  bio?: string;
  telefone?: string;
  ativa: boolean;
  createdAt: Date;
}

export interface Pagamento {
  id: string;
  usuarioId: string;
  valor: number;
  tipo: 'mensalidade' | 'aula' | 'locacao';
  descricao: string;
  status: 'pendente' | 'pago' | 'cancelado';
  metodo?: 'pix' | 'dinheiro';
  dataVencimento: Date;
  dataPagamento?: Date;
  createdAt: Date;
}

export interface Dupla {
  id: string;
  nome: string;
  jogador1Id: string;
  jogador2Id: string;
  jogador1?: Usuario;
  jogador2?: Usuario;
  pontuacao: number;
  posicaoRanking: number;
  estatisticas: {
    vitorias: number;
    derrotas: number;
    jogos: number;
    winRate: number;
  };
  ativa: boolean;
  createdAt: Date;
}

export interface Temporada {
  id: string;
  nome: string;
  dataInicio: Date;
  dataFim: Date;
  ativa: boolean;
  premiacao?: string;
  rankingFinal?: RankingItem[];
}

export interface RankingItem {
  posicao: number;
  usuarioId?: string;
  duplaId?: string;
  nome: string;
  pontuacao: number;
  vitorias: number;
  jogos: number;
}

export interface Quadra {
  id: string;
  nome: string;
  tipo: TipoQuadra;
  ativa: boolean;
  horarioAbertura: string;
  horarioFechamento: string;
  duracaoSlot: number;
  precoHora: number;
  descricao?: string;
  imagem?: string;
}

export interface Agendamento {
  id: string;
  quadraId: string;
  quadra?: Quadra;
  data: Date;
  horarioInicio: Date;
  horarioFim: Date;
  status: StatusAgendamento;
  tipo: 'individual' | 'dupla' | 'desafio' | 'aula';
  professorId?: string;
  jogadores: string[];
  jogadoresInfo?: Usuario[];
  dupla1Id?: string;
  dupla2Id?: string;
  dupla1?: Dupla;
  dupla2?: Dupla;
  criadoPor: string;
  resultado?: {
    placar1: number;
    placar2: number;
    vencedorId?: string;
    vencedorDuplaId?: string;
    confirmado: boolean;
  };
  createdAt: Date;
}

export interface Challenge {
  id: string;
  jogadorId: string;
  jogador?: Usuario;
  tipo: TipoChallenge;
  nivel: NivelJogador;
  modalidade: TipoQuadra;
  dataPreferida?: Date;
  horarioPreferido?: string;
  status: StatusChallenge;
  matchCom?: string;
  matchChallenge?: Challenge;
  createdAt: Date;
}

export interface Partida {
  id: string;
  temporadaId: string;
  data: Date;
  quadraId: string;
  agendamentoId: string;
  tipo: 'individual' | 'dupla';
  jogador1Id: string;
  jogador2Id: string;
  jogador3Id?: string;
  jogador4Id?: string;
  dupla1Id?: string;
  dupla2Id?: string;
  placar1: number;
  placar2: number;
  vencedorId?: string;
  vencedorDuplaId?: string;
  pontosGanhosVencedor: number;
  pontosPerdidosPerdedor: number;
  confirmada: boolean;
}

export interface TimeSlot {
  hora: string;
  disponivel: boolean;
  agendamento?: Agendamento;
}
