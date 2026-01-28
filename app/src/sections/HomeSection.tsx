import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/StatCard';
import { Header } from '@/components/Header';
import { 
  Trophy, 
  Calendar, 
  Users, 
  TrendingUp, 
  Flame,
  Target,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRanking } from '@/hooks/useFirestore';

export function HomeSection() {
  const { userData } = useAuth();
  const { ranking, loading } = useRanking();

  const top3 = ranking.slice(0, 3);
  const userPosition = ranking.findIndex((r) => r.id === userData?.id) + 1;

  const quickActions = [
    { 
      icon: Calendar, 
      label: 'Agendar', 
      description: 'Reserve sua quadra',
      color: 'bg-[#a3e635]/20 text-[#a3e635]' 
    },
    { 
      icon: Users, 
      label: 'Challenge', 
      description: 'Encontre parceiros',
      color: 'bg-[#c084fc]/20 text-[#c084fc]' 
    },
    { 
      icon: Trophy, 
      label: 'Ranking', 
      description: 'Veja sua posição',
      color: 'bg-[#f472b6]/20 text-[#f472b6]' 
    },
  ];

  return (
    <div className="min-h-screen pb-20 bg-[#0f0f1a]">
      <Header title="ArenaPro" />
      
      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#a3e635]/20 to-[#84cc16]/10 border border-[#a3e635]/20 p-5">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-[#a3e635]" />
              <span className="text-sm text-[#a3e635] font-medium">Temporada Ativa</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Olá, {userData?.nome?.split(' ')[0] || 'Atleta'}!
            </h2>
            <p className="text-gray-400 text-sm">
              Você está em <span className="text-[#a3e635] font-bold">#{userPosition || '-'}º</span> no ranking
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#a3e635]/10 rounded-full blur-3xl" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard 
            title="Pontos"
            value={userData?.pontuacaoAtual || 0}
            subtitle="Na temporada"
            icon={Target}
            color="lime"
          />
          <StatCard 
            title="Jogos"
            value={userData?.estatisticas?.jogos || 0}
            subtitle={`${userData?.estatisticas?.vitorias || 0} vitórias`}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Ações Rápidas</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button 
                  key={action.label}
                  className="flex flex-col items-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className={`p-3 rounded-xl ${action.color} mb-2`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white">{action.label}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5">{action.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Ranking Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">Top Ranking</h3>
            <Button variant="ghost" size="sm" className="text-[#a3e635] hover:text-[#84cc16]">
              Ver todos <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Carregando...</div>
            ) : (
              top3.map((player, index) => (
                <div 
                  key={player.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-400/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-300/20 text-gray-300' :
                    'bg-amber-600/20 text-amber-600'
                  }`}>
                    {index + 1}
                  </div>
                  <img 
                    src={player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.id}`}
                    alt={player.nome}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{player.nome}</p>
                    <p className="text-xs text-gray-500">{player.estatisticas?.jogos || 0} jogos</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#a3e635]">{player.pontuacaoAtual || 0}</p>
                    <p className="text-[10px] text-gray-500">pts</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
