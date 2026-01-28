import { Clock, DollarSign, MapPin } from 'lucide-react';
import type { Quadra } from '@/types';

interface QuadraCardProps {
  quadra: Quadra;
  onAgendar?: () => void;
}

const tipoLabels = {
  beach_tennis: 'Beach Tennis',
  volei: 'Vôlei de Praia',
  futevolei: 'Futevôlei',
};

const quadraImages = {
  beach_tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80',
  volei: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
  futevolei: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
};

const tipoGradients = {
  beach_tennis: 'from-purple-900/70 via-fuchsia-950/80 to-purple-950/90',
  volei: 'from-cyan-900/70 via-teal-950/80 to-cyan-950/90',
  futevolei: 'from-orange-900/70 via-red-950/80 to-orange-950/90',
};

const tipoBorders = {
  beach_tennis: 'border-purple-700/50',
  volei: 'border-cyan-700/50',
  futevolei: 'border-orange-700/50',
};

export function QuadraCard({ quadra, onAgendar }: QuadraCardProps) {
  return (
    <button
      onClick={onAgendar}
      className="group relative overflow-hidden rounded-3xl h-40 shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] w-full text-left"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-300"
        style={{ backgroundImage: `url(${quadraImages[quadra.tipo]})` }}
      />

      {/* Dark Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${tipoGradients[quadra.tipo]}`} />

      {/* Border */}
      <div className={`absolute inset-0 border-2 ${tipoBorders[quadra.tipo]} rounded-3xl`} />

      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500" />

      {/* Content */}
      <div className="relative h-full p-5 flex flex-col justify-between">
        {/* Type Badge */}
        <div className="flex items-center justify-between">
          <span className={`
            px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-sm 
            border ${tipoBorders[quadra.tipo]}
            text-xs font-black text-white uppercase tracking-wider
          `}>
            {tipoLabels[quadra.tipo]}
          </span>
          <MapPin className="w-5 h-5 text-white/60" />
        </div>

        {/* Title & Info */}
        <div>
          <h3 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
            {quadra.nome}
          </h3>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-white/80" />
              <span className="text-sm font-bold text-white/90">
                {quadra.horarioAbertura} - {quadra.horarioFechamento}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-black text-yellow-300">
                R$ {quadra.precoHora}/h
              </span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
