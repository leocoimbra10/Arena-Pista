import { Calendar, Trophy, Users, Home, User, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { userData } = useAuth();

  const tabs = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'agenda', icon: Calendar, label: 'Agenda' },
    { id: 'challenge', icon: Users, label: 'Challenge' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'perfil', icon: User, label: 'Perfil' },
  ];

  if (userData?.role === 'admin') {
    tabs.push({ id: 'admin', icon: ShieldAlert, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e]/95 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all duration-300 ${isActive
                  ? 'text-[#a3e635]'
                  : 'text-gray-400 hover:text-gray-200'
                }`}
            >
              <div className={`relative p-2 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-[#a3e635]/20 scale-110'
                  : ''
                }`}>
                <Icon className="w-5 h-5" />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#a3e635] rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
