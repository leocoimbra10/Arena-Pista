import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
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

  const name = isDupla ? dupla?.nome : usuario?.nome;
  const points = isDupla ? dupla?.pontuacao : usuario?.pontuacaoAtual;
  const wins = isDupla ? (dupla?.estatisticas?.vitorias || 0) : (usuario?.estatisticas?.vitorias || 0);
  const avatar = !isDupla
    ? (usuario?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${usuario?.id}`)
    : `https://api.dicebear.com/7.x/shapes/svg?seed=${dupla?.id}`;

  return (
    <div id={`rank-${item.id}`} className="relative flex items-center gap-4 p-4 rounded-3xl bg-white shadow-clay md:hover:scale-[1.02] transition-all border-l-4 border-slate-200">
      {/* Position Badge */}
      <div className="flex flex-col items-center justify-center w-10 shrink-0">
        <span className="font-condensed text-2xl font-black text-slate-300">
          #{position}
        </span>
      </div>

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden border-3 border-slate-100 shadow-sm">
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        {isDupla && (
          <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm uppercase">
            Dupla
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-condensed text-lg font-black text-slate-900 truncate tracking-tight">{name}</h3>
        <div className="flex items-center gap-2 mt-0.5">
          {usuario?.nivel && (
            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase border ${usuario.nivel === 'iniciante' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                usuario.nivel === 'intermediario' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-red-50 text-red-700 border-red-200'
              }`}>
              {usuario.nivel}
            </span>
          )}
          <span className="px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
            {wins} Vitórias
          </span>
        </div>
      </div>

      {/* Points & Trend */}
      <div className="text-right shrink-0">
        <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl shadow-lg mb-1">
          <span className="font-condensed text-sm font-black tracking-wide">{points} PTS</span>
        </div>

        {positionChange !== 0 ? (
          <div className={`flex items-center justify-end gap-1 text-[10px] font-bold uppercase ${positionChange > 0 ? 'text-emerald-500' : 'text-red-500'
            }`}>
            {positionChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(positionChange)} Pos
          </div>
        ) : (
          <div className="flex items-center justify-end gap-1 text-[10px] font-bold uppercase text-slate-400">
            <Minus className="w-3 h-3" />
            Estável
          </div>
        )}
      </div>
    </div>
  );
}
