import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, MapPin, Trophy } from 'lucide-react';
import type { NivelJogador, TipoQuadra } from '@/types';

// Mock users
const MOCK_USERS = [
  {
    id: '1',
    nome: 'Carlos Silva',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    nivel: 'avancado' as NivelJogador,
    modalidade: 'beach_tennis' as TipoQuadra,
    tipo: 'buscando_parceiro',
    winRate: 72,
    disponibilidades: [
      { diaSemana: 'Segunda', periodo: 'Manhã', horario: '08:00' },
      { diaSemana: 'Quarta', periodo: 'Tarde', horario: '15:00' },
      { diaSemana: 'Sábado', periodo: 'Manhã', horario: '09:00' },
    ]
  },
  {
    id: '2',
    nome: 'Ana Costa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    nivel: 'intermediario' as NivelJogador,
    modalidade: 'volei' as TipoQuadra,
    tipo: 'buscando_dupla',
    winRate: 65,
    disponibilidades: [
      { diaSemana: 'Terça', periodo: 'Tarde', horario: '14:00' },
      { diaSemana: 'Quinta', periodo: 'Noite', horario: '19:00' },
      { diaSemana: 'Domingo', periodo: 'Manhã', horario: '10:00' },
    ]
  },
];

const NIVEL_LABELS = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

const MODALIDADE_LABELS = {
  beach_tennis: 'Beach Tennis',
  volei: 'Vôlei',
  futevolei: 'Futevôlei',
};

const TIPO_LABELS = {
  buscando_parceiro: 'Parceiro',
  buscando_dupla: 'Dupla',
  buscando_adversario: 'Advers\u00e1rio',
};

const TIPO_COLORS = {
  buscando_parceiro: 'from-teal-600 to-teal-500',
  buscando_dupla: 'from-coral-500 to-coral-400', // NO PURPLE - using coral
  buscando_adversario: 'from-teal-700 to-teal-600',
};

export function ChallengeSection() {
  const [filterNivel, setFilterNivel] = useState<NivelJogador | 'todos'>('todos');
  const [filterModalidade, setFilterModalidade] = useState<TipoQuadra | 'todas'>('todas');


  const filteredUsers = MOCK_USERS.filter((user) => {
    if (filterNivel !== 'todos' && user.nivel !== filterNivel) return false;
    if (filterModalidade !== 'todas' && user.modalidade !== filterModalidade) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-24 bg-sand-50 dark:bg-sand-dark-50">
      {/* Beach Premium Header */}
      <div className="bg-white dark:bg-sand-dark-100 border-b border-sand-200 dark:border-sand-dark-200 px-6 py-4 sticky top-0 z-20 shadow-card">
        <h1 className="text-2xl font-black text-sand-900 dark:text-sand-dark-900 tracking-tight">CHALLENGE</h1>
        <p className="text-sm font-bold text-sand-400 dark:text-sand-dark-400">Encontre parceiros para jogar</p>
      </div>

      <div className="p-6 space-y-5">
        {/* Hero Card - TEAL instead of purple */}
        <div className="rounded-3xl bg-gradient-to-br from-teal-600 to-teal-500 dark:from-teal-dark dark:to-teal-dark/80 p-6 shadow-button-teal">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Encontre Parceiros</h2>
              <p className="text-sm font-bold text-white/90">Monte sua equipe ideal</p>
            </div>
          </div>
          <p className="text-white/90 text-sm mb-4 font-medium">
            Conecte-se com jogadores do seu nível e organize partidas incríveis
          </p>
          {/* TODO: Implement create challenge feature
          <BeachButton
            onClick={() => setShowCreateDialog(true)}
            variant="ghost"
            className="w-full bg-white text-teal-600 dark:text-teal-dark hover:bg-white/90 font-black rounded-2xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Meu Challenge
          </BeachButton>
          */}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={filterNivel} onValueChange={(v) => setFilterNivel(v as NivelJogador | 'todos')}>
            <SelectTrigger className="rounded-2xl bg-white dark:bg-sand-dark-100 border-sand-200 dark:border-sand-dark-200 text-sand-900 dark:text-sand-dark-900 font-black">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-sand-dark-100 border-sand-200 dark:border-sand-dark-200 z-50">
              <SelectItem value="todos">Todos os níveis</SelectItem>
              <SelectItem value="iniciante">Iniciante</SelectItem>
              <SelectItem value="intermediario">Intermediário</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterModalidade} onValueChange={(v) => setFilterModalidade(v as TipoQuadra | 'todas')}>
            <SelectTrigger className="rounded-2xl bg-white dark:bg-sand-dark-100 border-sand-200 dark:border-sand-dark-200 text-sand-900 dark:text-sand-dark-900 font-black">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-sand-dark-100 border-sand-200 dark:border-sand-dark-200 z-50">
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="beach_tennis">Beach Tennis</SelectItem>
              <SelectItem value="volei">Vôlei</SelectItem>
              <SelectItem value="futevolei">Futevôlei</SelectItem>
              <SelectItem value="peteca">Peteca</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Players List */}
        <div>
          <h3 className="text-sm font-black text-sand-900 dark:text-sand-dark-900 uppercase tracking-wide mb-3 px-1">
            Jogadores Disponíveis ({filteredUsers.length})
          </h3>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-sand-dark-100 rounded-3xl border border-sand-200 dark:border-sand-dark-200">
              <Users className="w-12 h-12 text-sand-400 dark:text-sand-dark-400 mx-auto mb-3" />
              <p className="text-sand-400 dark:text-sand-dark-400 font-bold">Nenhum jogador encontrado</p>
              <p className="text-sm text-sand-400 dark:text-sand-dark-400 mt-1">Tente ajustar os filtros</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="w-full rounded-3xl bg-white dark:bg-sand-dark-100 border border-sand-200 dark:border-sand-dark-200 p-5 text-left shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={user.avatar}
                      alt={user.nome}
                      className="w-14 h-14 rounded-2xl border-2 border-sand-200 dark:border-sand-dark-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-black text-sand-900 dark:text-sand-dark-900 truncate">
                          {user.nome}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-xl text-xs font-black text-white bg-gradient-to-r ${TIPO_COLORS[user.tipo as keyof typeof TIPO_COLORS]}`}>
                          {TIPO_LABELS[user.tipo as keyof typeof TIPO_LABELS]}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-sand-400 dark:text-sand-dark-400" />
                          <span className="text-xs font-bold text-sand-400 dark:text-sand-dark-400">
                            {NIVEL_LABELS[user.nivel]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-sand-400 dark:text-sand-dark-400" />
                          <span className="text-xs font-bold text-sand-400 dark:text-sand-dark-400">
                            {MODALIDADE_LABELS[user.modalidade]}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-dark" />
                          <span className="text-xs font-bold text-teal-600 dark:text-teal-dark">
                            {user.disponibilidades.length} horários
                          </span>
                        </div>
                        <div className="text-xs font-black text-coral-500 dark:text-coral-dark">
                          {user.winRate}% vitórias
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
