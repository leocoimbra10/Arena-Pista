import { useState } from 'react';
import { Header } from '@/components/Header';
import { ChallengeCard } from '@/components/ChallengeCard';
import { useChallenges } from '@/hooks/useFirestore';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Filter, Users, User, Swords } from 'lucide-react';
import type { NivelJogador, TipoQuadra, TipoChallenge } from '@/types';
import { toast } from 'sonner';

export function ChallengeSection() {
  const { challenges, loading, criarChallenge, darMatch, cancelarChallenge } = useChallenges();
  const { user, userData } = useAuth();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filterNivel, setFilterNivel] = useState<NivelJogador | 'todos'>('todos');
  const [filterModalidade, setFilterModalidade] = useState<TipoQuadra | 'todas'>('todas');

  const [newChallenge, setNewChallenge] = useState<{
    tipo: TipoChallenge;
    nivel: NivelJogador;
    modalidade: TipoQuadra;
    dataPreferida: string;
    horarioPreferido: string;
  }>({
    tipo: 'buscando_parceiro',
    nivel: userData?.nivel || 'iniciante',
    modalidade: 'beach_tennis',
    dataPreferida: '',
    horarioPreferido: '',
  });

  const handleCriarChallenge = async () => {
    if (!user) return;

    try {
      await criarChallenge({
        jogadorId: user.uid,
        tipo: newChallenge.tipo,
        nivel: newChallenge.nivel,
        modalidade: newChallenge.modalidade,
        dataPreferida: newChallenge.dataPreferida ? new Date(newChallenge.dataPreferida) : null,
        horarioPreferido: newChallenge.horarioPreferido || null,
      });

      toast.success('Challenge criado com sucesso!');
      setShowCreateDialog(false);
    } catch (error) {
      toast.error('Erro ao criar challenge');
    }
  };

  const handleDarMatch = async (challengeId: string) => {
    if (!user) return;

    try {
      // Create my challenge first
      const myChallengeId = await criarChallenge({
        jogadorId: user.uid,
        tipo: 'buscando_parceiro',
        nivel: userData?.nivel || 'iniciante',
        modalidade: 'beach_tennis',
      });

      // Then match
      if (myChallengeId) {
        await darMatch(challengeId, myChallengeId);
        toast.success('Match realizado! Entre em contato com seu parceiro.');
      }
    } catch (error) {
      toast.error('Erro ao dar match');
    }
  };

  const filteredChallenges = challenges.filter((c: any) => {
    if (c.jogadorId === user?.uid) return true; // Always show my challenges
    if (filterNivel !== 'todos' && c.nivel !== filterNivel) return false;
    if (filterModalidade !== 'todas' && c.modalidade !== filterModalidade) return false;
    return true;
  });

  const myChallenges = challenges.filter((c: any) => c.jogadorId === user?.uid);
  const availableChallenges = filteredChallenges.filter((c: any) => c.jogadorId !== user?.uid);

  return (
    <div className="min-h-screen pb-20 bg-[#0f0f1a]">
      <Header title="Challenge" />
      
      <div className="p-4 space-y-4">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c084fc]/20 to-[#a855f7]/10 border border-[#c084fc]/20 p-5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-[#c084fc]" />
              <span className="text-sm text-[#c084fc] font-medium">Encontre Parceiros</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Está sem parceiro para jogar?
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Crie um challenge ou encontre alguém na lista de espera
            </p>
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-[#c084fc] hover:bg-[#a855f7] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Challenge
            </Button>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#c084fc]/10 rounded-full blur-3xl" />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={filterNivel} onValueChange={(v) => setFilterNivel(v as NivelJogador | 'todos')}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10">
              <SelectItem value="todos">Todos os níveis</SelectItem>
              <SelectItem value="iniciante">Iniciante</SelectItem>
              <SelectItem value="intermediario">Intermediário</SelectItem>
              <SelectItem value="avancado">Avançado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterModalidade} onValueChange={(v) => setFilterModalidade(v as TipoQuadra | 'todas')}>
            <SelectTrigger className="flex-1 bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="Modalidade" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a2e] border-white/10">
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="beach_tennis">Beach Tennis</SelectItem>
              <SelectItem value="volei">Vôlei</SelectItem>
              <SelectItem value="futevolei">Futevôlei</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* My Challenges */}
        {myChallenges.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">Meus Challenges</h3>
            <div className="space-y-3">
              {myChallenges.map((challenge: any) => (
                <ChallengeCard 
                  key={challenge.id}
                  challenge={challenge}
                  onCancel={() => cancelarChallenge(challenge.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">
            Jogadores Disponíveis ({availableChallenges.length})
          </h3>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Carregando...</div>
          ) : availableChallenges.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500">Nenhum jogador disponível no momento</p>
              <p className="text-sm text-gray-600 mt-1">Seja o primeiro a criar um challenge!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {availableChallenges.map((challenge: any) => (
                <ChallengeCard 
                  key={challenge.id}
                  challenge={challenge}
                  onMatch={() => handleDarMatch(challenge.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Challenge Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-[#1a1a2e] border-white/10 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#c084fc]" />
              Novo Challenge
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Tipo</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'buscando_parceiro', icon: User, label: 'Parceiro' },
                  { id: 'buscando_dupla', icon: Users, label: 'Dupla' },
                  { id: 'buscando_adversario', icon: Swords, label: 'Adversário' },
                ].map((tipo) => {
                  const Icon = tipo.icon;
                  return (
                    <button
                      key={tipo.id}
                      onClick={() => setNewChallenge({ ...newChallenge, tipo: tipo.id as TipoChallenge })}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                        newChallenge.tipo === tipo.id
                          ? 'bg-[#c084fc] text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1" />
                      <span className="text-xs">{tipo.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Nível</label>
              <Select 
                value={newChallenge.nivel} 
                onValueChange={(v) => setNewChallenge({ ...newChallenge, nivel: v as NivelJogador })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/10">
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Modalidade</label>
              <Select 
                value={newChallenge.modalidade} 
                onValueChange={(v) => setNewChallenge({ ...newChallenge, modalidade: v as TipoQuadra })}
              >
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-white/10">
                  <SelectItem value="beach_tennis">Beach Tennis</SelectItem>
                  <SelectItem value="volei">Vôlei</SelectItem>
                  <SelectItem value="futevolei">Futevôlei</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Data Preferida (opcional)</label>
              <input
                type="date"
                value={newChallenge.dataPreferida}
                onChange={(e) => setNewChallenge({ ...newChallenge, dataPreferida: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c084fc]"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">Horário Preferido (opcional)</label>
              <input
                type="time"
                value={newChallenge.horarioPreferido}
                onChange={(e) => setNewChallenge({ ...newChallenge, horarioPreferido: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-[#c084fc]"
              />
            </div>

            <Button 
              onClick={handleCriarChallenge}
              className="w-full bg-[#c084fc] hover:bg-[#a855f7] text-white"
            >
              Criar Challenge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
