import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserAgendamentos } from '@/hooks/useFirestore';
import { EmptyState } from '@/components/EmptyState';
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
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  UserMinus,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

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
  const [selectedStat, setSelectedStat] = useState<{ label: string; icon: React.ElementType; color: string } | null>(null);
  const [searchPartner, setSearchPartner] = useState('');

  // Privacy & Account settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

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
    } catch {
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
      color: 'text-brand-coral-500',
      bgColor: 'bg-brand-coral-50',
      borderColor: 'border-brand-coral-100'
    },
    {
      label: 'Win Rate',
      value: `${userData?.estatisticas?.winRate || 0}%`,
      icon: Target,
      color: 'text-brand-teal-600',
      bgColor: 'bg-brand-teal-50',
      borderColor: 'border-brand-teal-100'
    },
  ];

  const trainingStats = [
    {
      label: 'Aulas Concluídas',
      value: aulasConcluidas,
      icon: History,
      color: 'text-brand-teal-600',
      bgColor: 'bg-brand-teal-50',
      borderColor: 'border-brand-teal-100'
    },
    {
      label: 'Horas totais',
      value: `${horasTotais}h`,
      icon: Clock,
      color: 'text-brand-blue-600',
      bgColor: 'bg-brand-blue-50',
      borderColor: 'border-brand-blue-100'
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
      icon: Wallet,
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
    <div className="min-h-screen pb-24 bg-brand-sand-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-sand-200 px-6 py-4 sticky top-0 z-20 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-blue-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-brand-blue-600" />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold text-slate-900 leading-tight">Meu Perfil</h1>
            <p className="text-xs text-slate-500">Atleta Arena</p>
          </div>
        </div>
        <button
          onClick={() => setShowEditDialog(true)}
          className="p-2.5 rounded-xl bg-brand-blue-600 text-white shadow-md shadow-brand-blue-200 hover:bg-brand-blue-700 transition-all active:scale-95">
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-white p-6 shadow-sm border border-slate-100">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue-50 rounded-bl-[4rem] -mr-8 -mt-8 -z-0"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg shadow-brand-sand-200 ring-1 ring-slate-100">
                <img
                  src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id || 'user'}`}
                  alt={userData?.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 w-9 h-9 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Name & Email */}
            <h2 className="font-display text-2xl font-bold text-slate-900 leading-tight">{userData?.nome}</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">{userData?.email}</p>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-5">
              <span className={cn(
                "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border",
                userData?.nivel === 'iniciante' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  userData?.nivel === 'intermediario' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                    'bg-red-50 text-red-700 border-red-200'
              )}>
                {userData?.nivel}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-bold uppercase border border-slate-700 shadow-sm">
                🏆 {userData?.pontuacaoAtual} pts
              </span>
            </div>
          </div>
        </div>

        {/* Arena Record */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              Arena Record
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {competitiveStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <button
                  key={stat.label}
                  onClick={() => {
                    setSelectedStat(stat);
                    setShowStatsDialog(true);
                  }}
                  className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all text-center group"
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-colors", stat.bgColor)}>
                    <Icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <p className="font-display text-xl font-bold text-slate-900 leading-none mb-1 group-hover:scale-110 transition-transform">{stat.value}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Jornada de Treino */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display text-sm font-bold text-slate-900 uppercase flex items-center gap-2">
              Jornada de Treino
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trainingStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="p-4 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center gap-3"
                >
                  <div className={cn("p-2.5 rounded-xl shrink-0", stat.bgColor)}>
                    <Icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div className="text-left overflow-hidden">
                    <p className="font-display text-xl font-bold text-slate-900 leading-none mb-1">{stat.value}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase truncate">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-3">
          <h3 className="font-display text-sm font-bold text-slate-900 uppercase px-1">Geral</h3>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={cn(
                    "w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors",
                    index !== menuItems.length - 1 ? 'border-b border-slate-50' : ''
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="text-left">
                      <span className="block font-display text-sm font-bold text-slate-900">{item.label}</span>
                      <span className="block text-[10px] font-medium text-slate-400">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold text-xs uppercase hover:bg-red-100 transition-colors mt-2"
        >
          <LogOut className="w-4 h-4" />
          Sair do Aplicativo
        </button>
      </div>

      {/* Finance Control Dialog */}
      <Dialog open={showFinanceDialog} onOpenChange={setShowFinanceDialog}>
        <DialogContent className="bg-white border-none max-w-sm rounded-[2rem] overflow-hidden p-0 shadow-2xl">
          <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-lg font-display font-bold flex items-center gap-2 relative z-10">
              <Wallet className="w-5 h-5 text-brand-teal-400" />
              Controle Financeiro
            </h3>
            <p className="text-[10px] font-medium text-slate-400 mt-1 relative z-10">Status de pagamentos PIX/Dinheiro</p>
          </div>

          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Mensalidade Atleta */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                Sua Mensalidade
                <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold">EM DIA</span>
              </h4>
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Vencimento: 10/Fev</p>
                    <p className="text-[10px] font-medium text-slate-500">Plano Mensalista VIP</p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>

            {/* Aulas com Professores */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                Aulas do Mês
                <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[9px] font-bold">1 PENDENTE</span>
              </h4>
              <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
                <div className="flex items-center justify-between opacity-50">
                  <div className="flex items-center gap-3">
                    <History className="w-4 h-4 text-slate-400" />
                    <p className="text-[11px] font-bold text-slate-900">Aula 15/Jan - Prof. Tiago</p>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600">PAGO</span>
                </div>
                <div className="w-full h-px bg-slate-50"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <p className="text-[11px] font-bold text-slate-900">Aula 25/Jan - Prof. Tiago</p>
                  </div>
                  <span className="text-[9px] font-bold text-amber-600">PENDENTE</span>
                </div>
              </div>
            </div>

            {/* Horários Reservados */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                Locações de Quadra
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-brand-blue-500" />
                  <p className="text-[11px] font-bold text-slate-900">28/Jan (Hoje) - 19:00</p>
                </div>
                <span className="text-[10px] font-bold text-slate-900">R$ 30,00</span>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-200">
              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                O pagamento deve ser realizado diretamente no balcão do clube via PIX ou dinheiro.
              </p>
            </div>

            <button
              onClick={() => setShowFinanceDialog(false)}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wide shadow-lg hover:bg-slate-800 transition-colors"
            >
              Entendido
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-white border-none max-w-sm rounded-[2rem] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 border-b border-slate-50 bg-slate-50/50">
            <DialogTitle className="text-slate-900 font-display font-bold">Editar Meus Dados</DialogTitle>
          </DialogHeader>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</Label>
              <Input
                defaultValue={userData?.nome}
                className="bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-brand-blue-500 focus:border-brand-blue-500 h-auto"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp</Label>
              <Input
                defaultValue={userData?.telefone}
                placeholder="(00) 00000-0000"
                className="bg-slate-50 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-brand-blue-500 focus:border-brand-blue-500 h-auto"
              />
            </div>
            <button
              onClick={() => {
                toast.success('Perfil atualizado!');
                setShowEditDialog(false);
              }}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all hover:bg-slate-800"
            >
              Salvar Alterações
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirm Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-white border-none max-w-xs rounded-[2rem] p-6 text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogOut className="w-8 h-8 text-red-500" />
          </div>
          <DialogTitle className="text-slate-900 font-display font-bold text-lg mb-2">Encerrar Sessão?</DialogTitle>
          <p className="text-xs text-slate-500 font-medium mb-6 leading-relaxed">
            Tem certeza que deseja sair agora? Sentiremos sua falta nas quadras!
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs uppercase hover:bg-slate-200 transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs uppercase shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
            >
              Sair
            </button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dupla Fixa Dialog */}
      <Dialog open={showDuplaDialog} onOpenChange={setShowDuplaDialog}>
        <DialogContent className="bg-white border-none max-w-sm rounded-[2rem] overflow-hidden p-0 shadow-2xl">
          <div className="bg-brand-sand-900 p-8 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
              <Users className="w-8 h-8 text-brand-teal-400" />
            </div>
            <h3 className="text-xl font-display font-bold">Minha Dupla Fixa</h3>
            <p className="text-[10px] font-medium text-brand-sand-200 mt-1">Conecte-se para jogar torneios</p>
          </div>

          <div className="p-6 space-y-6">
            {userData?.duplaFixaId ? (
              /* Caso já tenha dupla */
              <div className="space-y-4">
                <div className="bg-brand-teal-50 border border-brand-teal-100 p-4 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.duplaFixaId}`} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-brand-teal-600 uppercase tracking-wide">Parceria Ativa</p>
                    <h4 className="text-sm font-bold text-slate-900">Seu Parceiro</h4>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-white rounded-xl shadow-sm">
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <p className="text-lg font-black text-slate-900">0</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Vitórias Juntos</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                    <p className="text-lg font-black text-slate-900">0%</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Win Rate</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Caso não tenha dupla - Busca */
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Nome ou e-mail do parceiro"
                    value={searchPartner}
                    onChange={(e) => setSearchPartner(e.target.value)}
                    className="pl-11 bg-slate-50 border-slate-200 rounded-xl text-xs font-semibold h-11 focus:ring-brand-blue-500"
                  />
                </div>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1">Sugestões (Club Members)</p>
                  {/* Mock de busca de usuários */}
                  <div className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200"></div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-900 uppercase">Buscando atletas...</p>
                        <p className="text-[9px] font-medium text-slate-400">Digite para filtrar</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                  <div className="flex gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <p className="text-[10px] font-medium text-amber-900 leading-relaxed">
                      A dupla fixa é usada para o ranking oficial e torneios da arena.
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
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold uppercase text-xs tracking-wider shadow-lg hover:bg-slate-800 transition-colors"
            >
              {userData?.duplaFixaId ? 'Fechar' : 'Convidar Atleta'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Match History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="bg-white border-none max-w-sm rounded-[2rem] overflow-hidden p-0 shadow-2xl">
          <div className="bg-slate-900 p-6 text-white text-center">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/10">
              <History className="w-7 h-7 text-brand-teal-400" />
            </div>
            <h3 className="text-lg font-display font-bold uppercase">Histórico de Partidas</h3>
            <p className="text-[10px] font-medium text-slate-400 mt-1">Registros oficiais e competitivos</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {mockMatches.map((match) => (
                <div key={match.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:shadow-md transition-all group cursor-default">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={cn("text-[9px] font-bold uppercase px-2 py-0.5 rounded-full",
                        match.result === 'vitoria' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      )}>
                        {match.result}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{match.date} • {match.type}</span>
                    </div>
                    <p className="text-sm font-bold text-slate-900 group-hover:text-brand-blue-600 transition-colors">vs {match.opponent}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{match.score}</p>
                    <ChevronRight className="w-3 h-3 text-slate-300 ml-auto mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-brand-teal-50 p-4 rounded-xl border border-brand-teal-100">
              <div className="flex gap-2">
                <Target className="w-4 h-4 text-brand-teal-600 shrink-0" />
                <p className="text-[10px] font-medium text-brand-teal-900 leading-relaxed">
                  Os resultados são validados pelo sistema de ranking da Arena.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowHistoryDialog(false)}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold uppercase text-xs tracking-wider shadow-lg hover:bg-slate-800 transition-colors"
            >
              Fechar Histórico
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Account & Privacy Dialog */}
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="bg-white border-none max-w-sm rounded-[2rem] overflow-hidden p-0">
          <div className="bg-slate-50 p-6 text-center border-b border-slate-100">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
              <Settings className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-lg font-display font-bold text-slate-900 uppercase">Privacidade & Conta</h3>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-1">Gerencie seus dados e acessos</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowAccountDialog(false);
                  setShowEditDialog(true);
                }}
                className="w-full flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-900 uppercase">Editar Perfil</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </button>

              <div className="p-4 bg-white border border-slate-100 rounded-2xl space-y-4 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Segurança</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Notificações Push</span>
                  <button
                    onClick={() => {
                      setNotificationsEnabled(!notificationsEnabled);
                      toast.success(notificationsEnabled ? 'Notificações desativadas' : 'Notificações ativadas');
                    }}
                    className={cn("w-10 h-6 rounded-full relative transition-colors duration-300 ease-in-out", notificationsEnabled ? 'bg-brand-teal-500' : 'bg-slate-200')}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300", notificationsEnabled ? 'translate-x-5' : 'translate-x-1')}></div>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">Autenticação 2FA</span>
                  <button
                    onClick={() => {
                      setTwoFactorEnabled(!twoFactorEnabled);
                      toast.success(twoFactorEnabled ? '2FA desativado' : '2FA ativado');
                    }}
                    className={cn("w-10 h-6 rounded-full relative transition-colors duration-300 ease-in-out", twoFactorEnabled ? 'bg-brand-teal-500' : 'bg-slate-200')}
                  >
                    <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300", twoFactorEnabled ? 'translate-x-5' : 'translate-x-1')}></div>
                  </button>
                </div>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2">
                <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Zona de Risco</p>
                <button className="w-full text-left text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline transition-colors">
                  Excluir minha conta permanentemente
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowAccountDialog(false)}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold uppercase text-xs tracking-wider shadow-lg hover:bg-slate-800 transition-colors"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Detail Dialog */}
      <Dialog open={showStatsDialog} onOpenChange={setShowStatsDialog}>
        <DialogContent className="bg-white border-none max-w-sm rounded-[2rem] overflow-hidden p-0 shadow-2xl">
          <div className={cn("p-6 text-white text-center",
            selectedStat?.label === 'Vitórias' ? 'bg-amber-500' : selectedStat?.label === 'Derrotas' ? 'bg-brand-coral-500' : 'bg-brand-teal-600'
          )}>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
              {selectedStat && <selectedStat.icon className="w-8 h-8 text-white" />}
            </div>
            <h3 className="text-lg font-display font-bold uppercase tracking-wide">{selectedStat?.label} Detalhadas</h3>
            <p className="text-[10px] font-medium text-white/80 uppercase tracking-widest mt-1">Últimos registros validados</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {mockMatches
                .filter(m => {
                  if (selectedStat?.label === 'Vitórias') return m.result === 'vitoria';
                  if (selectedStat?.label === 'Derrotas') return m.result === 'derrota';
                  return true;
                })
                .map((match) => (
                  <div key={match.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn("text-[8px] font-bold uppercase px-2 py-0.5 rounded-full",
                          match.result === 'vitoria' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        )}>
                          {match.result}
                        </span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">{match.date} • {match.type}</span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">vs {match.opponent}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-slate-900">{match.score}</p>
                    </div>
                  </div>
                ))}

              {mockMatches.filter(m => {
                if (selectedStat?.label === 'Vitórias') return m.result === 'vitoria';
                if (selectedStat?.label === 'Derrotas') return m.result === 'derrota';
                return true;
              }).length === 0 && (
                  <EmptyState
                    icon={AlertCircle}
                    title="Nenhum Registro"
                    description="Não constam partidas com esse resultado no seu histórico recente."
                    color="sand"
                  />
                )}
            </div>

            <button
              onClick={() => setShowStatsDialog(false)}
              className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold uppercase text-xs tracking-wider shadow-lg hover:bg-slate-800 transition-colors"
            >
              Fechar Detalhes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
