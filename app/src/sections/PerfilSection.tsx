import { useState } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
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
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export function PerfilSection() {
  const { userData, logout } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const stats = [
    { 
      label: 'Jogos', 
      value: userData?.estatisticas?.jogos || 0,
      icon: Target,
      color: 'text-[#a3e635]'
    },
    { 
      label: 'Vitórias', 
      value: userData?.estatisticas?.vitorias || 0,
      icon: Trophy,
      color: 'text-yellow-400'
    },
    { 
      label: 'Derrotas', 
      value: userData?.estatisticas?.derrotas || 0,
      icon: TrendingUp,
      color: 'text-red-400'
    },
    { 
      label: 'Win Rate', 
      value: `${userData?.estatisticas?.winRate || 0}%`,
      icon: Target,
      color: 'text-[#c084fc]'
    },
  ];

  const menuItems = [
    { icon: Users, label: 'Minha Dupla', action: () => toast.info('Em desenvolvimento') },
    { icon: Trophy, label: 'Histórico de Partidas', action: () => toast.info('Em desenvolvimento') },
    { icon: Settings, label: 'Configurações', action: () => toast.info('Em desenvolvimento') },
  ];

  return (
    <div className="min-h-screen pb-20 bg-[#0f0f1a]">
      <Header title="Meu Perfil" />
      
      <div className="p-4 space-y-4">
        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#a3e635]/20 to-[#84cc16]/10 border border-[#a3e635]/20 p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-[#a3e635]/30">
                <img 
                  src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id || 'user'}`}
                  alt={userData?.nome}
                  className="w-full h-full object-cover"
                />
              </div>
              <button 
                onClick={() => setShowEditDialog(true)}
                className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#a3e635] text-black hover:bg-[#84cc16] transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{userData?.nome}</h2>
              <p className="text-sm text-gray-400">{userData?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  userData?.nivel === 'iniciante' ? 'bg-green-500/20 text-green-400' :
                  userData?.nivel === 'intermediario' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {userData?.nivel?.charAt(0).toUpperCase()}{userData?.nivel?.slice(1)}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#a3e635]/20 text-[#a3e635] text-xs font-medium">
                  {userData?.pontuacaoAtual} pts
                </span>
              </div>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635]/10 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div 
                key={stat.label}
                className="p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-gray-400">{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Menu */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Menu</h3>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-white/10">
                    <Icon className="w-5 h-5 text-gray-300" />
                  </div>
                  <span className="text-white font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            );
          })}
        </div>

        {/* Logout Button */}
        <Button 
          variant="outline"
          onClick={() => setShowLogoutDialog(true)}
          className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-[#1a1a2e] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Editar Perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-gray-400">Nome</Label>
              <Input 
                defaultValue={userData?.nome}
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-400">Telefone</Label>
              <Input 
                defaultValue={userData?.telefone}
                placeholder="(00) 00000-0000"
                className="bg-white/5 border-white/10 text-white mt-1"
              />
            </div>
            <Button 
              onClick={() => {
                toast.success('Perfil atualizado!');
                setShowEditDialog(false);
              }}
              className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-black"
            >
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Logout Confirm Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="bg-[#1a1a2e] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmar Logout</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400">Tem certeza que deseja sair da sua conta?</p>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
              className="flex-1 border-white/20 text-gray-300"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleLogout}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Sair
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
