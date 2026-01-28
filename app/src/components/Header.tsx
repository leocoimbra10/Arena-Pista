import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { userData } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f1a]/95 backdrop-blur-lg border-b border-white/5">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button 
              onClick={onMenuClick}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-300" />
            </button>
          )}
          <div>
            <p className="text-xs text-gray-400">Bem-vindo</p>
            <h1 className="text-lg font-bold text-white">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <Bell className="w-5 h-5 text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#a3e635] rounded-full" />
          </button>
          <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-[#a3e635]/30">
            <img 
              src={userData?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.id || 'user'}`}
              alt={userData?.nome || 'Usuário'}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
