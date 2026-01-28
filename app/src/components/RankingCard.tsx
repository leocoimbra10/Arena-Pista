import { Medal, TrendingUp, TrendingDown } from 'lucide-react';
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
  
  const getMedalColor = (pos: number) => {
    switch (pos) {
      case 1: return 'text-yellow-400 bg-yellow-400/20';
      case 2: return 'text-gray-300 bg-gray-300/20';
      case 3: return 'text-amber-600 bg-amber-600/20';
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
      {/* Position */}
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold ${getMedalColor(position)}`}>
        {position <= 3 ? (
          <Medal className="w-5 h-5" />
        ) : (
          <span className="text-sm">{position}</span>
        )}
      </div>

      {/* Avatar/Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {isDupla ? (
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a3e635] to-[#84cc16] flex items-center justify-center text-xs font-bold text-black">
                {dupla?.nome.charAt(0)}
              </div>
            </div>
          ) : (
            <img 
              src={usuario?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usuario?.id}`}
              alt={usuario?.nome}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {isDupla ? dupla?.nome : usuario?.nome}
            </p>
            <p className="text-xs text-gray-400">
              {isDupla 
                ? `${(dupla?.estatisticas?.vitorias || 0)}V ${(dupla?.estatisticas?.derrotas || 0)}D`
                : `${(usuario?.estatisticas?.vitorias || 0)}V ${(usuario?.estatisticas?.derrotas || 0)}D`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Points & Trend */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-lg font-bold text-[#a3e635]">
            {isDupla ? dupla?.pontuacao : usuario?.pontuacaoAtual}
          </p>
          <p className="text-[10px] text-gray-500">pontos</p>
        </div>
        {positionChange !== 0 && (
          <div className={`flex items-center ${positionChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {positionChange > 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
