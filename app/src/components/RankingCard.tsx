import { Medal, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react';
import type { Usuario, Dupla } from '@/types';

interface RankingCardProps {
  position: number;
  item: Usuario | Dupla;
  type: 'individual' | 'dupla';
  previousPosition?: number;
}

export function RankingCard({ position, item, type, previousPosition }: RankingCardProps) {
  const isDupla = type === 'dupla';
  const dupla = isDupla ? (item as Dupla) : null;
  const usuario = !isDupla ? (item as Usuario) : null;

  const positionChange = previousPosition ? previousPosition - position : 0;

  const getMedalStyles = (pos: number) => {
    switch (pos) {
      case 1: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 2: return 'bg-gray-100 text-gray-700 border-gray-200';
      case 3: return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-white text-gray-400 border-gray-100';
    }
  };

  const name = isDupla ? dupla?.nome : usuario?.nome;
  const points = isDupla ? dupla?.pontuacao : usuario?.pontuacaoAtual;
  const wins = isDupla ? (dupla?.estatisticas?.vitorias || 0) : (usuario?.estatisticas?.vitorias || 0);
  const avatar = !isDupla
    ? (usuario?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usuario?.id}`)
    : `https://api.dicebear.com/7.x/shapes/svg?seed=${dupla?.id}`;

  return (
    <div id={`rank-${item.id}`} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-teal-200 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-50/50 to-transparent pointer-events-none" />
      {/* Position */}
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-black border-2 transition-colors ${getMedalStyles(position)}`}>
        {position <= 3 ? (
          <Medal className="w-5 h-5" />
        ) : (
          <span className="text-sm">{position}</span>
        )}
      </div>

      {/* Avatar & Info */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
          />
          {position <= 3 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
              <div className={`w-2 h-2 rounded-full ${position === 1 ? 'bg-yellow-400' : position === 2 ? 'bg-gray-400' : 'bg-amber-600'}`} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">
              {name}
            </p>
            {usuario?.nivel && (
              <span className="text-[8px] font-black text-white bg-orange-500 px-1 rounded uppercase">
                Cat {usuario.nivel.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-500 uppercase tracking-wider bg-teal-50 px-1.5 rounded">
              {wins} Vitórias
            </span>
          </div>
        </div>
      </div>

      {/* Points & Trend */}
      <div className="flex items-center gap-3 pl-2 border-l border-gray-50">
        <div className="text-right">
          <p className="text-base font-black text-gray-900 leading-none">
            {points}
          </p>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">pts</p>
        </div>

        {positionChange !== 0 ? (
          <div className={`flex items-center ${positionChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
            {positionChange > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-200 group-hover:text-teal-400 transition-colors" />
        )}
      </div>
    </div>
  );
}
