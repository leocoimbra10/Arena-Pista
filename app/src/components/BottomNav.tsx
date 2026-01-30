import { Calendar, Trophy, Users, Home, User, ShieldAlert, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

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

  if (userData?.role === 'professor') {
    tabs.splice(3, 0, { id: 'professor', icon: GraduationCap, label: 'Aulas' });
  }

  if (userData?.role === 'admin') {
    tabs.push({ id: 'admin', icon: ShieldAlert, label: 'Admin' });
  }

  return (
    <nav className="fixed bottom-6 left-6 right-6 z-50">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-slate-900/20 max-w-md mx-auto h-[72px] flex items-center justify-between px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300",
                isActive
                  ? "bg-brand-blue-500 text-white shadow-lg shadow-brand-blue-500/30 translate-y-[-8px]"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-6 h-6 transition-transform", isActive && "scale-105")} />
              {isActive && (
                <span className="absolute -bottom-6 text-[10px] font-bold text-slate-900 bg-white/90 px-2 py-0.5 rounded-full shadow-sm animate-fade-in-up">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
