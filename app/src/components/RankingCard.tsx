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
      case 1: return 'bg-coral-500/10 dark:bg-coral-dark/10 text-coral-500 dark:text-coral-dark border-coral-500/20 dark:border-coral-dark/20';
      case 2: return 'bg-sand-200 dark:bg-sand-dark-200 text-sand-900 dark:text-sand-dark-900 border-sand-300 dark:border-sand-dark-300';
      case 3: return 'bg-teal-600/10 dark:bg-teal-dark/10 text-teal-600 dark:text-teal-dark border-teal-600/20 dark:border-teal-dark/20';
      default: return 'bg-white dark:bg-sand-dark-100 text-sand-400 dark:text-sand-dark-400 border-sand-200 dark:border-sand-dark-200';
    }
  };

  const name = isDupla ? dupla?.nome : usuario?.nome;
  const points = isDupla ? dupla?.pontuacao : usuario?.pontuacaoAtual;
  const wins = isDupla ? (dupla?.estatisticas?.vitorias || 0) : (usuario?.estatisticas?.vitorias || 0);
  const avatar = !isDupla
    ? (usuario?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usuario?.id}`)
    : `https://api.dicebear.com/7.x/shapes/svg?seed=${dupla?.id}`;

  return (
    <div id={`rank-${item.id}`} className="flex items-center gap-3 p-4 rounded-3xl bg-white dark:bg-sand-dark-100 border border-sand-200 dark:border-sand-dark-200 shadow-card hover:border-teal-600/30 dark:hover:border-teal-dark/30 transition-all group overflow-hidden relative">
      <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-sand-50/50 dark:from-sand-dark-50/50 to-transparent pointer-events-none" />
      {/* Position - Beach Premium Colors */}
      <div className={`flex items-center justify-center w-10 h-10 rounded-2xl font-black border-2 transition-colors ${getMedalStyles(position)}`}>
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
            className="w-10 h-10 rounded-full object-cover border-2 border-sand-200 dark:border-sand-dark-200"
          />
          {position <= 3 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-sand-dark-100 rounded-full flex items-center justify-center shadow-sm">
              <div className={`w-2 h-2 rounded-full ${position === 1 ? 'bg-coral-500 dark:bg-coral-dark' : position === 2 ? 'bg-sand-400 dark:bg-sand-dark-400' : 'bg-teal-600 dark:bg-teal-dark'}`} />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-black text-sand-900 dark:text-sand-dark-900 truncate uppercase tracking-tight">
              {name}
            </p>
            {usuario?.nivel && (
              <span className="text-[8px] font-black text-white bg-coral-500 dark:bg-coral-dark px-1.5 py-0.5 rounded-lg uppercase">
                Cat {usuario.nivel.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-teal-600 dark:text-teal-dark uppercase tracking-wide bg-teal-600/10 dark:bg-teal-dark/10 px-1.5 py-0.5 rounded">
              {wins} Vitórias
            </span>
          </div>
        </div>
      </div>

      {/* Points & Trend */}
      <div className="flex items-center gap-3 pl-2 border-l border-sand-200 dark:border-sand-dark-200">
        <div className="text-right">
          <p className="text-base font-black text-sand-900 dark:text-sand-dark-900 leading-none">
            {points}
          </p>
          <p className="text-[9px] font-black text-sand-400 dark:text-sand-dark-400 uppercase tracking-tight">pts</p>
        </div>

        {positionChange !== 0 ? (
          <div className={`flex items-center ${positionChange > 0 ? 'text-teal-600 dark:text-teal-dark' : 'text-coral-500 dark:text-coral-dark'}`}>
            {positionChange > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        ) : (
          <ChevronRight className="w-4 h-4 text-sand-200 dark:text-sand-dark-200 group-hover:text-teal-600 dark:group-hover:text-teal-dark transition-colors" />
        )}
      </div>
    </div>
  );
}
