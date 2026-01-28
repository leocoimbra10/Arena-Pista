import { Clock, DollarSign } from 'lucide-react';
import type { Quadra } from '@/types';
import { Button } from '@/components/ui/button';

interface QuadraCardProps {
  quadra: Quadra;
  onAgendar?: () => void;
}

const tipoLabels = {
  beach_tennis: 'Beach Tennis',
  volei: 'Vôlei de Praia',
  futevolei: 'Futevôlei',
};

const tipoColors = {
  beach_tennis: 'from-[#a3e635] to-[#84cc16]',
  volei: 'from-[#c084fc] to-[#a855f7]',
  futevolei: 'from-[#f472b6] to-[#ec4899]',
};

export function QuadraCard({ quadra, onAgendar }: QuadraCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
      {/* Header with gradient */}
      <div className={`h-24 bg-gradient-to-r ${tipoColors[quadra.tipo]} relative`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-3 left-4">
          <span className="px-2 py-1 rounded-full bg-black/30 text-white text-xs font-medium backdrop-blur-sm">
            {tipoLabels[quadra.tipo]}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{quadra.nome}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{quadra.horarioAbertura} - {quadra.horarioFechamento}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <DollarSign className="w-4 h-4" />
            <span>R$ {quadra.precoHora}/hora</span>
          </div>
        </div>

        <Button 
          onClick={onAgendar}
          className="w-full bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium"
        >
          Ver Horários
        </Button>
      </div>
    </div>
  );
}
