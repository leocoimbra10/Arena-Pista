import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, User, Swords, Clock, MapPin, Trophy, MessageCircle } from 'lucide-react';
import type { NivelJogador, TipoQuadra } from '@/types';

// Mock users for testing - WITH MULTIPLE AVAILABILITIES
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
  {
    id: '3',
    nome: 'Pedro Santos',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro',
    nivel: 'iniciante' as NivelJogador,
    modalidade: 'beach_tennis' as TipoQuadra,
    tipo: 'buscando_parceiro',
    winRate: 45,
    disponibilidades: [
      { diaSemana: 'Segunda', periodo: 'Noite', horario: '20:00' },
      { diaSemana: 'Terça', periodo: 'Noite', horario: '20:00' },
      { diaSemana: 'Sexta', periodo: 'Noite', horario: '19:00' },
    ]
  },
  {
    id: '4',
    nome: 'Julia Ferreira',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julia',
    nivel: 'avancado' as NivelJogador,
    modalidade: 'volei' as TipoQuadra,
    tipo: 'buscando_adversario',
    winRate: 78,
    disponibilidades: [
      { diaSemana: 'Quarta', periodo: 'Manhã', horario: '09:00' },
      { diaSemana: 'Sexta', periodo: 'Manhã', horario: '08:00' },
      { diaSemana: 'Sábado', periodo: 'Tarde', horario: '16:00' },
    ]
  },
  {
    id: '5',
    nome: 'Roberto Lima',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
    nivel: 'intermediario' as NivelJogador,
    modalidade: 'futevolei' as TipoQuadra,
    tipo: 'buscando_parceiro',
    winRate: 58,
    disponibilidades: [
      { diaSemana: 'Terça', periodo: 'Tarde', horario: '16:00' },
      { diaSemana: 'Quinta', periodo: 'Tarde', horario: '15:00' },
      { diaSemana: 'Sábado', periodo: 'Manhã', horario: '11:00' },
    ]
  },
  {
    id: '6',
    nome: 'Mariana Souza',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mariana',
    nivel: 'iniciante' as NivelJogador,
    modalidade: 'beach_tennis' as TipoQuadra,
    tipo: 'buscando_parceiro',
    winRate: 42,
    disponibilidades: [
      { diaSemana: 'Segunda', periodo: 'Manhã', horario: '10:00' },
      { diaSemana: 'Quarta', periodo: 'Manhã', horario: '11:00' },
      { diaSemana: 'Domingo', periodo: 'Tarde', horario: '14:00' },
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
  buscando_adversario: 'Adversário',
};

const TIPO_COLORS = {
  buscando_parceiro: 'from-teal-400 to-teal-500',
  buscando_dupla: 'from-purple-400 to-purple-500',
  buscando_adversario: 'from-coral-400 to-coral-500',
};

export function ChallengeSection() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterNivel, setFilterNivel] = useState<NivelJogador | 'todos'>('todos');
  const [filterModalidade, setFilterModalidade] = useState<TipoQuadra | 'todas'>('todas');
  const [selectedUser, setSelectedUser] = useState<typeof MOCK_USERS[0] | null>(null);
  const [selectedTipo, setSelectedTipo] = useState('buscando_parceiro');
  const [selectedNivel, setSelectedNivel] = useState<NivelJogador>('intermediario');
  const [selectedModalidade, setSelectedModalidade] = useState<TipoQuadra>('beach_tennis');
  const [myChallenges, setMyChallenges] = useState<Array<{
    id: string;
    tipo: string;
    nivel: NivelJogador;
    modalidade: TipoQuadra;
    criadoEm: Date;
  }>>([]);

  const handleCreateChallenge = () => {
    const newChallenge = {
      id: Date.now().toString(),
      tipo: selectedTipo,
      nivel: selectedNivel,
      modalidade: selectedModalidade,
      criadoEm: new Date(),
    };
    setMyChallenges([newChallenge, ...myChallenges]);
    setShowCreateDialog(false);
  };

  const handleDeleteChallenge = (id: string) => {
    setMyChallenges(myChallenges.filter(c => c.id !== id));
  };

  const filteredUsers = MOCK_USERS.filter((user) => {
    if (filterNivel !== 'todos' && user.nivel !== filterNivel) return false;
    if (filterModalidade !== 'todas' && user.modalidade !== filterModalidade) return false;
    return true;
  });

  return (
    <div className="min-h-screen pb-24 bg-[#F7F5F2]">
      {/* Header Premium */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-4 py-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-black text-gray-900">Challenge</h1>
        <p className="text-sm font-semibold text-gray-500">Encontre parceiros para jogar</p>
      </div>

      <div className="p-4 space-y-5">
        {/* Hero Card */}
        <div className="rounded-3xl bg-gradient-to-br from-purple-400 to-purple-500 p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Encontre Parceiros</h2>
              <p className="text-sm font-semibold text-white/90">Monte sua equipe ideal</p>
            </div>
          </div>
          <p className="text-white/90 text-sm mb-4 font-medium">
            Conecte-se com jogadores do seu nível e organize partidas incríveis
          </p>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="w-full bg-white text-purple-600 hover:bg-gray-50 font-black rounded-2xl shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            Criar Meu Challenge
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={filterNivel} onValueChange={(v) => setFilterNivel(v as NivelJogador | 'todos')}>
            <SelectTrigger className="rounded-2xl bg-white border-gray-200 text-gray-700 font-bold">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="todos">Todos os níveis</SelectItem>
              <SelectItem value="iniciante">Iniciante</SelectItem>
              <SelectItem value="intermediario">Intermediário</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterModalidade} onValueChange={(v) => setFilterModalidade(v as TipoQuadra | 'todas')}>
            <SelectTrigger className="rounded-2xl bg-white border-gray-200 text-gray-700 font-bold">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-200">
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="beach_tennis">Beach Tennis</SelectItem>
              <SelectItem value="volei">Vôlei</SelectItem>
              <SelectItem value="futevolei">Futevôlei</SelectItem>
              <SelectItem value="peteca">Peteca</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* My Challenges */}
        {myChallenges.length > 0 && (
          <div>
            <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-3 px-1">
              Meus Challenges ({myChallenges.length})
            </h3>
            <div className="space-y-3">
              {myChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="rounded-3xl bg-white border border-gray-200 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1.5 rounded-xl text-xs font-black text-white bg-gradient-to-r ${TIPO_COLORS[challenge.tipo as keyof typeof TIPO_COLORS]
                      }`}>
                      {TIPO_LABELS[challenge.tipo as keyof typeof TIPO_LABELS]}
                    </span>
                    <button
                      onClick={() => handleDeleteChallenge(challenge.id)}
                      className="px-3 py-1.5 rounded-xl bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-1">Nível</p>
                      <p className="text-sm font-black text-gray-900">{NIVEL_LABELS[challenge.nivel]}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-1">Modalidade</p>
                      <p className="text-sm font-black text-gray-900">{MODALIDADE_LABELS[challenge.modalidade]}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players List */}
        <div>
          <h3 className="text-sm font-black text-gray-700 uppercase tracking-wider mb-3 px-1">
            Jogadores Disponíveis ({filteredUsers.length})
          </h3>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-gray-200">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">Nenhum jogador encontrado</p>
              <p className="text-sm text-gray-400 mt-1">Tente ajustar os filtros</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className="w-full rounded-3xl bg-white border border-gray-200 p-5 text-left shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <img
                      src={user.avatar}
                      alt={user.nome}
                      className="w-14 h-14 rounded-2xl border-2 border-gray-200"
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-base font-black text-gray-900 truncate">
                          {user.nome}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-lg text-xs font-black text-white bg-gradient-to-r ${TIPO_COLORS[user.tipo]}`}>
                          {TIPO_LABELS[user.tipo]}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs font-bold text-gray-600">
                            {NIVEL_LABELS[user.nivel]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-xs font-bold text-gray-600">
                            {MODALIDADE_LABELS[user.modalidade]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          <span className="text-xs font-bold text-teal-600">
                            {user.disponibilidades.length} horários
                          </span>
                        </div>
                        <div className="text-xs font-black text-gray-700">
                          {user.winRate}% vitórias
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="bg-white border-gray-200 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-black">Detalhes do Jogador</DialogTitle>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatar}
                  alt={selectedUser.nome}
                  className="w-16 h-16 rounded-2xl border-2 border-gray-200"
                />
                <div>
                  <h3 className="text-lg font-black text-gray-900">{selectedUser.nome}</h3>
                  <p className="text-sm font-bold text-gray-500">{NIVEL_LABELS[selectedUser.nivel]}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 mb-1">Modalidade</p>
                  <p className="text-sm font-black text-gray-900">{MODALIDADE_LABELS[selectedUser.modalidade]}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 mb-1">Win Rate</p>
                  <p className="text-sm font-black text-teal-600">{selectedUser.winRate}%</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-3">Disponibilidades</p>
                <div className="space-y-2">
                  {selectedUser.disponibilidades.map((disp, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-teal-600">{disp.diaSemana}</span>
                        <span className="text-xs text-gray-400">·</span>
                        <span className="text-xs font-bold text-gray-600">{disp.periodo}</span>
                      </div>
                      <span className="text-sm font-black text-gray-900">{disp.horario}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-1">Buscando</p>
                <p className="text-sm font-black text-gray-900">{TIPO_LABELS[selectedUser.tipo as keyof typeof TIPO_LABELS]}</p>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white font-black rounded-2xl shadow-lg"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Challenge Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-black flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Novo Challenge
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Tipo</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'buscando_parceiro', icon: User, label: 'Parceiro', color: 'teal' },
                  { id: 'buscando_dupla', icon: Users, label: 'Dupla', color: 'purple' },
                  { id: 'buscando_adversario', icon: Swords, label: 'Rival', color: 'coral' },
                ].map((tipo) => {
                  const Icon = tipo.icon;
                  return (
                    <button
                      key={tipo.id}
                      onClick={() => setSelectedTipo(tipo.id)}
                      className={`flex flex-col items-center p-3 rounded-2xl transition-all ${selectedTipo === tipo.id
                        ? 'bg-teal-500 border-2 border-teal-600 text-white'
                        : 'bg-gray-50 border border-gray-200 hover:border-teal-400 text-gray-600'
                        }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-bold">{tipo.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Nível</label>
              <Select value={selectedNivel} onValueChange={(v) => setSelectedNivel(v as NivelJogador)}>
                <SelectTrigger className="rounded-2xl bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Modalidade</label>
              <Select value={selectedModalidade} onValueChange={(v) => setSelectedModalidade(v as TipoQuadra)}>
                <SelectTrigger className="rounded-2xl bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="beach_tennis">Beach Tennis</SelectItem>
                  <SelectItem value="volei">Vôlei</SelectItem>
                  <SelectItem value="futevolei">Futevôlei</SelectItem>
                  <SelectItem value="peteca">Peteca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Data Preferida</label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold focus:outline-none focus:border-teal-400 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 mb-2 block">Horário Preferido</label>
              <Select defaultValue="08:00">
                <SelectTrigger className="rounded-2xl bg-gray-50 border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="06:00">06:00</SelectItem>
                  <SelectItem value="07:00">07:00</SelectItem>
                  <SelectItem value="08:00">08:00</SelectItem>
                  <SelectItem value="09:00">09:00</SelectItem>
                  <SelectItem value="10:00">10:00</SelectItem>
                  <SelectItem value="11:00">11:00</SelectItem>
                  <SelectItem value="12:00">12:00</SelectItem>
                  <SelectItem value="13:00">13:00</SelectItem>
                  <SelectItem value="14:00">14:00</SelectItem>
                  <SelectItem value="15:00">15:00</SelectItem>
                  <SelectItem value="16:00">16:00</SelectItem>
                  <SelectItem value="17:00">17:00</SelectItem>
                  <SelectItem value="18:00">18:00</SelectItem>
                  <SelectItem value="19:00">19:00</SelectItem>
                  <SelectItem value="20:00">20:00</SelectItem>
                  <SelectItem value="21:00">21:00</SelectItem>
                  <SelectItem value="22:00">22:00</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleCreateChallenge}
              className="w-full bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white font-black rounded-2xl shadow-lg"
            >
              Criar Challenge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
