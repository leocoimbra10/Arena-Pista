import { useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
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



export function ChallengeSection() {
  const [filterNivel, setFilterNivel] = useState<NivelJogador | 'todos'>('todos');
  const [filterModalidade, setFilterModalidade] = useState<TipoQuadra | 'todas'>('todas');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);

  // Helper function to handle card click
  const handleUserClick = (user: typeof MOCK_USERS[0]) => {
    setSelectedUser(user);
  };


  const filteredUsers = MOCK_USERS.filter((user) => {
    if (filterNivel !== 'todos' && user.nivel !== filterNivel) return false;
    if (filterModalidade !== 'todas' && user.modalidade !== filterModalidade) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-100 px-6 py-4 sticky top-0 z-20 shadow-clay-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="font-condensed text-2xl font-black text-slate-900 uppercase tracking-tight">Challenge</h1>
            <p className="text-[10px] font-semibold text-slate-500 uppercase">Encontre parceiros</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Hero Card - Create Challenge */}
        <button
          onClick={() => setShowCreateChallenge(true)}
          className="w-full text-left rounded-3xl bg-orange-500 p-6 shadow-orange border-3 border-orange-600 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center border-2 border-white/30">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="font-condensed text-xl font-black text-white uppercase">Encontre Parceiros</h2>
              <p className="text-sm font-semibold text-white/90">Monte sua equipe ideal</p>
            </div>
          </div>
          <p className="text-white/95 text-sm font-medium">
            Conecte-se com jogadores do seu nível e organize partidas incríveis na arena! 🏐
          </p>
        </button>

        {/* Filters as Pills */}
        <div>
          <p className="font-condensed text-xs font-bold text-slate-600 uppercase mb-3">Filtrar por:</p>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {['todos', 'iniciante', 'intermediario', 'avancado'].map(nivel => {
              const active = filterNivel === nivel;
              const labels = { todos: 'Todos', iniciante: 'Iniciante', intermediario: 'Intermediário', avancado: 'Avançado' };
              return (
                <button
                  key={nivel}
                  onClick={() => setFilterNivel(nivel as NivelJogador | 'todos')}
                  className={`px-4 py-2.5 rounded-2xl font-condensed text-xs font-bold uppercase transition-all border-2 whitespace-nowrap ${active
                    ? 'bg-blue-500 text-white border-blue-600 shadow-blue'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400'
                    }`}
                >
                  {labels[nivel as keyof typeof labels]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Players List */}
        <div>
          <h3 className="font-condensed text-base font-bold text-slate-800 uppercase mb-4 px-1">
            Jogadores Disponíveis ({filteredUsers.length})
          </h3>

          {filteredUsers.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Nenhum Jogador"
              description="Não encontramos jogadores com os filtros selecionados. Tente ajustar os filtros."
              color="orange"
              actionLabel="Limpar Filtros"
              onAction={() => {
                setFilterNivel('todos');
                setFilterModalidade('todas');
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user, idx) => {
                const borderColors = ['border-blue-500', 'border-emerald-500', 'border-orange-500'];
                const bgColors = ['bg-blue-100', 'bg-emerald-100', 'bg-orange-100'];
                const borderColor = borderColors[idx % 3];
                const bgColor = bgColors[idx % 3];

                return (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className={`rounded-3xl bg-white p-5 shadow-clay lift-hover cursor-pointer border-l-4 ${borderColor}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <img
                          src={user.avatar}
                          alt={user.nome}
                          className={`w-20 h-20 rounded-full border-3 ${borderColor}`}
                        />
                        <div className={`absolute -bottom-1 -right-1 w-8 h-8 ${bgColor} border-2 border-white rounded-full flex items-center justify-center shadow-clay`}>
                          <Trophy className="w-4 h-4 text-slate-700" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-condensed text-lg font-bold text-slate-900 truncate">
                            {user.nome}
                          </h4>
                          <span className="px-3 py-1 rounded-xl font-condensed text-[10px] font-bold text-white bg-emerald-500 border-2 border-emerald-600 uppercase">
                            {TIPO_LABELS[user.tipo as keyof typeof TIPO_LABELS]}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${borderColor.replace('border-', 'bg-')}`} />
                            <span className="text-xs font-semibold text-slate-600">
                              {NIVEL_LABELS[user.nivel]}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600">
                              {MODALIDADE_LABELS[user.modalidade]}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border-2 border-blue-500">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span className="font-condensed text-xs font-bold text-blue-600">
                              {user.disponibilidades.length} horários
                            </span>
                          </div>
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border-2 border-emerald-500">
                            <span className="font-condensed text-xs font-black text-emerald-700">
                              {user.winRate}% vitórias
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* User Details Dialog */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="relative h-32 bg-gradient-to-br from-blue-500 to-blue-600">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="px-6 pb-6 -mt-16">
              <div className="flex justify-between items-end mb-4">
                <img
                  src={selectedUser.avatar}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-white"
                />
                <button className="mb-2 px-6 py-2.5 bg-emerald-500 text-white rounded-xl font-condensed font-bold uppercase shadow-emerald active:scale-95 transition-all">
                  Convidar
                </button>
              </div>

              <h2 className="font-condensed text-3xl font-black text-slate-900 leading-none">{selectedUser.nome}</h2>
              <p className="text-sm font-medium text-slate-500 mb-6">{MODALIDADE_LABELS[selectedUser.modalidade]} • {NIVEL_LABELS[selectedUser.nivel]}</p>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="font-condensed text-sm font-bold text-slate-700 uppercase mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" /> Disponibilidade
                  </h4>
                  <div className="space-y-2">
                    {selectedUser.disponibilidades.map((d, i) => (
                      <div key={i} className="flex justify-between text-xs font-medium text-slate-600 border-b border-slate-100 last:border-0 pb-1 last:pb-0">
                        <span>{d.diaSemana} ({d.periodo})</span>
                        <span className="font-bold text-slate-800">{d.horario}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Challenge Dialog Stub */}
      {showCreateChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-condensed text-2xl font-black text-slate-900 uppercase">Criar Desafio</h3>
              <p className="text-sm text-slate-500 mt-1">Essa funcionalidade será implementada em breve!</p>
            </div>
            <button
              onClick={() => setShowCreateChallenge(false)}
              className="w-full py-3.5 rounded-2xl bg-slate-100 text-slate-600 font-bold uppercase text-sm hover:bg-slate-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
