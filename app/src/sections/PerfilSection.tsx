import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAgendamentos } from '@/hooks/useFirestore';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Trophy,
  Target,
  TrendingUp,
  LogOut,
  Edit3,
  Users,
  Settings,
  ChevronRight,
  Activity,
  History,
  ShieldCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  UserMinus
} from 'lucide-react';
import { toast } from 'sonner';

export function PerfilSection() {
  const { userData, logout } = useAuth();
  const { agendamentos: userAgendamentos } = useUserAgendamentos(userData?.id);

  const aulasConcluidas = userAgendamentos?.filter(a => a.tipo === 'aula').length || 0;
  const horasTotais = Math.round((userAgendamentos?.reduce((acc, a) => {
    if (a.horarioInicio && a.horarioFim) {
      return acc + (a.horarioFim.getTime() - a.horarioInicio.getTime()) / (1000 * 60 * 60);
    }
    return acc;
  }, 0) || 0));

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showFinanceDialog, setShowFinanceDialog] = useState(false);
  const [showDuplaDialog, setShowDuplaDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showAccountDialog, setShowAccountDialog] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [selectedStat, setSelectedStat] = useState<{ label: string; icon: any; color: string } | null>(null);
  const [searchPartner, setSearchPartner] = useState('');

  const mockMatches = [
    { id: '1', date: '25/Jan', opponent: 'Ricardo M.', result: 'vitoria', score: '6/2', type: 'Challenge' },
    { id: '2', date: '20/Jan', opponent: 'Ana P.', result: 'vitoria', score: '6/4', type: 'Torneio' },
    { id: '3', date: '15/Jan', opponent: 'Bruno S.', result: 'derrota', score: '3/6', type: 'Challenge' },
    { id: '4', date: '10/Jan', opponent: 'Carla F.', result: 'vitoria', score: '7/5', type: 'Amistoso' },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const competitiveStats = [
    {
      label: 'Vitórias',
      value: userData?.estatisticas?.vitorias || 0,
      icon: Trophy,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    },
    {
      label: 'Derrotas',
      value: userData?.estatisticas?.derrotas || 0,
      icon: TrendingUp,
      color: 'text-coral-500',
      bgColor: 'bg-coral-50',
      borderColor: 'border-coral-100'
    },
    {
      label: 'Win Rate',
      value: `${userData?.estatisticas?.winRate || 0}%`,
      icon: Target,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100'
    },
  ];

  const trainingStats = [
    {
      label: 'Aulas Concluídas',
      value: aulasConcluidas,
      icon: History,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100'
    },
    {
      label: 'Horas totais',
      value: `${horasTotais}h`,
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
  ];

  const menuItems = [
    {
      icon: Users,
      label: 'Minha Dupla Fixa',
      desc: 'Gerencie sua parceria',
      action: () => setShowDuplaDialog(true)
    },
    {
      icon: History,
      label: 'Histórico de Partidas',
      desc: 'Resultados validados',
      action: () => setShowHistoryDialog(true)
    },
    {
      icon: CreditCard,
      label: 'Pagamentos & Controle',
      desc: 'Mensalidades e Reservas',
      action: () => setShowFinanceDialog(true)
    },
    {
      icon: Settings,
      label: 'Privacidade & Conta',
      desc: 'Configurações gerais',
      action: () => setShowAccountDialog(true)
    },
  ];

  return (
    <div className="min-h-screen pb-24 bg-sand-50 dark:bg-sand-dark-50">
      {/* Beach Premium Header */}
      <div className="bg-white dark:bg-sand-dark-100 border-b border-sand-200 dark:border-sand-dark-200 px-6 py-4 sticky top-0 z-20 shadow-card flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600 dark:text-teal-dark" />
          <h1 className="text-lg font-black text-sand-900 dark:text-sand-dark-900 uppercase tracking-tight">Meu Perfil Atleta</h1>
        </div>
        <button
          onClick={() => setShowEditDialog(true)}
          className="p-2 rounded-full bg-teal-600/10 dark:bg-teal-dark/10 text-teal-600 dark:text-teal-dark hover:bg-teal-600/20 dark:hover:bg-teal-dark/20 transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Profile Card Premium */}
        <div className="relative overflow-hidden rounded-[32px] bg-white border border-gray-200 shadow-xl p-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-teal-50 shadow-inner">
                <img
                  src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id || 'user'}`}
                  alt={userData?.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-teal-500 rounded-full border-4 border-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-gray-900 leading-tight">{userData?.nome}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{userData?.email}</p>

            <div className="flex items-center gap-2 mt-4">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${userData?.nivel === 'iniciante' ? 'bg-emerald-100 text-emerald-700' :
                userData?.nivel === 'intermediario' ? 'bg-amber-100 text-amber-700' :
                  'bg-rose-100 text-rose-700'
                }`}>
                {userData?.nivel}
              </span>
              <span className="px-4 py-1.5 rounded-full bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg">
                🏆 {userData?.pontuacaoAtual} pts
              </span>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-600/10 dark:bg-teal-dark/10 rounded-full blur-3xl -z-10" />
        </div>

        {/* Arena Record Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              Arena Record
              <div className="group relative">
                <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[8px] font-bold text-gray-400 cursor-help uppercase">?</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-medium normal-case">
                  Resultados competitivos validados por adversários ou árbitros.
                </div>
              </div>
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {competitiveStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.label}
                  onClick={() => {
                    setSelectedStat(stat);
                    setShowStatsDialog(true);
                  }}
                  className={`p-3 rounded-2xl bg-white border ${stat.borderColor} shadow-sm transition-all hover:scale-[1.05] active:scale-95 text-left w-full`}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`p-1.5 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-black text-gray-900 leading-none mb-1">{stat.value}</p>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-tight">{stat.label}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Jornada de Treino Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
              Jornada de Treino
              <div className="group relative">
                <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex items-center justify-center text-[8px] font-bold text-gray-400 cursor-help uppercase">?</div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 font-medium normal-case">
                  Evolução confirmada pelos professores desta arena.
                </div>
              </div>
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trainingStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`p-4 rounded-3xl bg-white border ${stat.borderColor} shadow-sm transition-all hover:scale-[1.02] flex items-center gap-4`}
                >
                  <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-black text-gray-900 leading-none mb-1">{stat.value}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-tight">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu Premium */}
        <div className="space-y-2">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Geral</h3>
          <div className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-sm">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="text-left">
                      <span className="block text-sm font-black text-gray-900 uppercase tracking-tight">{item.label}</span>
                      <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-3xl bg-red-50 border border-red-100 text-red-600 text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair do Aplicativo
        </button>
      </div>

      {/* Finance Control Dialog */}
      <Dialog open={showFinanceDialog} onOpenChange={setShowFinanceDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
          <div className="bg-gray-900 p-6 text-white">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-teal-400" />
              Controle Financeiro
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Status de pagamentos PIX/Dinheiro</p>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Mensalidade Atleta */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                Sua Mensalidade
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[8px]">EM DIA</span>
              </h4>
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase">Vencimento: 10/Fev</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Plano Mensalista VIP</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            {/* Aulas com Professores */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                Aulas do Mês
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[8px]">1 PENDENTE</span>
              </h4>
              <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between opacity-60">
                  <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-gray-400" />
                    <p className="text-[11px] font-bold text-gray-900">Aula 15/Jan - Prof. Tiago</p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-600">PAGO</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <p className="text-[11px] font-bold text-gray-900">Aula 25/Jan - Prof. Tiago</p>
                  </div>
                  <span className="text-[9px] font-black text-amber-600">PENDENTE</span>
                </div>
              </div>
            </div>

            {/* Horários Reservados */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                Locações de Quadra
              </h4>
              <div className="p-4 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <p className="text-[11px] font-bold text-gray-900">28/Jan (Hoje) - 19:00</p>
                </div>
                <span className="text-[10px] font-black text-gray-900">R$ 30,00</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-[24px] border border-dashed border-gray-200">
              <p className="text-[9px] font-bold text-gray-500 text-center uppercase leading-relaxed">
                O pagamento deve ser realizado diretamente no balcão do clube via PIX ou dinheiro. Este painel serve apenas para seu controle pessoal.
              </p>
            </div>

            <button
              onClick={() => setShowFinanceDialog(false)}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-lg"
            >
              Entendido
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-black uppercase">Editar Meus Dados</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nome Completo</Label>
              <Input
                defaultValue={userData?.nome}
                className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold focus:ring-teal-500"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black text-gray-400 uppercase ml-1">WhatsApp</Label>
              <Input
                defaultValue={userData?.telefone}
                placeholder="(00) 00000-0000"
                className="bg-gray-50 border-gray-200 rounded-2xl text-gray-900 font-bold focus:ring-teal-500"
              />
            </div>
            <button
              onClick={() => {
                toast.success('Perfil atualizado!');
                setShowEditDialog(false);
              }}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
            >
              Salvar Alterações
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirm Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-xs rounded-[32px]">
          <DialogHeader>
            <DialogTitle className="text-gray-900 font-black uppercase text-center">Encerrar Sessão?</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-gray-500 text-center font-bold px-4">
            Tem certeza que deseja sair agora? Sentiremos sua falta nas quadras!
          </p>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase text-[10px]"
            >
              Voltar
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-black uppercase text-[10px] shadow-lg"
            >
              Sair
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dupla Fixa Dialog */}
      <Dialog open={showDuplaDialog} onOpenChange={setShowDuplaDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
          <div className="bg-[#1a1a2e] p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Minha Dupla Fixa</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Conecte-se para jogar torneios</p>
          </div>

          <div className="p-6 space-y-6">
            {userData?.duplaFixaId ? (
              /* Caso já tenha dupla */
              <div className="space-y-4">
                <div className="bg-teal-50 border border-teal-100 p-4 rounded-3xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.duplaFixaId}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-tighter">Parceria Ativa</p>
                    <h4 className="text-sm font-black text-gray-900">Seu Parceiro</h4>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-3 rounded-2xl text-center">
                    <p className="text-lg font-black text-gray-900">0</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase">Vitórias Juntos</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl text-center">
                    <p className="text-lg font-black text-gray-900">0%</p>
                    <p className="text-[8px] font-black text-gray-400 uppercase">Win Rate</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Caso não tenha dupla - Busca */
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Nome ou e-mail do parceiro"
                    value={searchPartner}
                    onChange={(e) => setSearchPartner(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-100 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Sugestões (Club Members)</p>
                  {/* Mock de busca de usuários */}
                  <div className="p-3 bg-white border border-gray-100 rounded-2xl flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                      <div>
                        <p className="text-[11px] font-black text-gray-900 uppercase">Buscando atletas...</p>
                        <p className="text-[9px] font-bold text-gray-400">Digite para filtrar</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-[9px] font-bold text-amber-800 leading-relaxed uppercase">
                      Escolha com cuidado! A dupla fixa é usada para o ranking oficial e torneios da arena.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                if (!userData?.duplaFixaId) {
                  toast.success('Convite enviado para o parceiro!');
                }
                setShowDuplaDialog(false);
              }}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-lg"
            >
              {userData?.duplaFixaId ? 'Fechar' : 'Convidar Atleta'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Match History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
          <div className="bg-[#1a1a2e] p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-teal-400" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Histórico de Partidas</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Registros oficiais e competitivos</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {mockMatches.map((match) => (
                <div key={match.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${match.result === 'vitoria' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                        {match.result}
                      </span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{match.date} • {match.type}</span>
                    </div>
                    <p className="text-sm font-black text-gray-900 group-hover:text-teal-600 transition-colors">vs {match.opponent}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-gray-900">{match.score}</p>
                    <ChevronRight className="w-3 h-3 text-gray-300 ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100">
              <div className="flex gap-2">
                <Target className="w-4 h-4 text-teal-600 shrink-0" />
                <p className="text-[9px] font-bold text-teal-800 leading-relaxed uppercase">
                  Os resultados são validados pelo sistema de ranking da Arena. Em caso de erro, contate o árbitro.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHistoryDialog(false)}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
            >
              Fechar Histórico
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account & Privacy Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
          <div className="bg-gray-100 p-6 text-center border-b border-gray-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Settings className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Privacidade & Conta</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Gerencie seus dados e acessos</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowAccountDialog(false);
                  setShowEditDialog(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-black text-gray-900 uppercase">Editar Perfil</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>

              <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Segurança</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">Notificações Push</span>
                  <div className="w-10 h-5 bg-teal-500 rounded-full relative shadow-inner">
                    <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between opacity-50">
                  <span className="text-xs font-bold text-gray-700">Autenticação 2FA</span>
                  <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Zona de Risco</p>
                <button className="w-full text-left text-xs font-bold text-rose-700 hover:underline">
                  Excluir minha conta permanentemente
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowAccountDialog(false)}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-lg mt-2"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Detail Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
          <div className={`p-6 text-white text-center ${selectedStat?.label === 'Vitórias' ? 'bg-amber-500' : selectedStat?.label === 'Derrotas' ? 'bg-coral-500' : 'bg-purple-600'}`}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {selectedStat && <selectedStat.icon className="w-8 h-8 text-white" />}
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">{selectedStat?.label} Detalhadas</h3>
            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Últimos registros validados</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {mockMatches
                .filter(m => {
                  if (selectedStat?.label === 'Vitórias') return m.result === 'vitoria';
                  if (selectedStat?.label === 'Derrotas') return m.result === 'derrota';
                  return true;
                })
                .map((match) => (
                  <div key={match.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${match.result === 'vitoria' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {match.result}
                        </span>
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{match.date} • {match.type}</span>
                      </div>
                      <p className="text-sm font-black text-gray-900">vs {match.opponent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-gray-900">{match.score}</p>
                    </div>
                  </div>
                ))}

              {mockMatches.filter(m => {
                if (selectedStat?.label === 'Vitórias') return m.result === 'vitoria';
                if (selectedStat?.label === 'Derrotas') return m.result === 'derrota';
                return true;
              }).length === 0 && (
                  <div className="text-center py-8">
                    <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-400 uppercase">Nenhum registro encontrado</p>
                  </div>
                )}
            </div>

            <button
              onClick={() => setShowStatsDialog(false)}
              className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-xs tracking-widest shadow-lg"
            >
              Fechar Detalhes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
