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
    { id: 'jogos', icon: Users, label: 'Jogos' },
    { id: 'ranking', icon: Trophy, label: 'Ranking' },
    { id: 'perfil', icon: User, label: 'Perfil' },
  ];

  if (userData?.role === 'admin') {
    tabs.push({ id: 'admin', icon: ShieldAlert, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-gray-800 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-full transition-all ${isActive ? 'text-[#4ADE80]' : 'text-gray-500'
                }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[9px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
