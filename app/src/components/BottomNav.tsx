import { Calendar, Trophy, Users, Home, User, ShieldAlert, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { userData } = useAuth();

  const tabs = [
    { id: 'home', icon: Home, label: 'Início', color: 'blue' },
    { id: 'agenda', icon: Calendar, label: 'Agenda', color: 'emerald' },
    { id: 'jogos', icon: Users, label: 'Jogos', color: 'orange' },
    { id: 'ranking', icon: Trophy, label: 'Ranking', color: 'yellow' },
    { id: 'perfil', icon: User, label: 'Perfil', color: 'slate' },
  ];

  if (userData?.role === 'professor') {
    tabs.push({ id: 'professor', icon: GraduationCap, label: 'Aulas', color: 'emerald' });
  }

  if (userData?.role === 'admin') {
    tabs.push({ id: 'admin', icon: ShieldAlert, label: 'Admin', color: 'red' });
  }

  const getColorClasses = (color: string, isActive: boolean) => {
    if (!isActive) {
      return 'text-slate-400';
    }

    const colors = {
      blue: 'text-blue-600 bg-blue-50 border-t-blue-500',
      emerald: 'text-emerald-600 bg-emerald-50 border-t-emerald-500',
      orange: 'text-orange-600 bg-orange-50 border-t-orange-500',
      yellow: 'text-yellow-600 bg-yellow-50 border-t-yellow-500',
      slate: 'text-slate-700 bg-slate-100 border-t-slate-600',
      red: 'text-red-600 bg-red-50 border-t-red-500',
    };

    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-slate-200 z-50 shadow-clay-lg pb-safe">
      <div className="flex justify-around items-stretch h-20 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const colorClasses = getColorClasses(tab.color, isActive);

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center 
                flex-1 relative
                transition-all duration-200 ease-out
                cursor-pointer
                ${isActive ? 'border-t-4' : 'border-t-4 border-transparent'}
                ${colorClasses}
              `}
            >
              <Icon className={`${isActive ? 'w-7 h-7' : 'w-6 h-6'} mb-1 transition-all duration-200`} />
              <span className={`text-[10px] font-semibold tracking-tight ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>

              {/* Subtle pulse for active tab */}
              {isActive && (
                <div className="absolute inset-0 bg-current opacity-5 rounded-t-lg" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
