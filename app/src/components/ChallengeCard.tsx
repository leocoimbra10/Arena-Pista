import { Calendar, Clock, Hand } from 'lucide-react';
import type { Challenge } from '@/types';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChallengeCardProps {
  challenge: Challenge;
  onMatch?: () => void;
  onCancel?: () => void;
}

const nivelColors = {
  iniciante: 'bg-green-500/20 text-green-400',
  intermediario: 'bg-yellow-500/20 text-yellow-400',
  avancado: 'bg-red-500/20 text-red-400',
};

const tipoLabels = {
  buscando_parceiro: 'Busca Parceiro',
  buscando_dupla: 'Busca Dupla',
  buscando_adversario: 'Busca Adversário',
};

export function ChallengeCard({ challenge, onMatch, onCancel }: ChallengeCardProps) {
  const { user } = useAuth();
  const isOwner = user?.uid === challenge.jogadorId;

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-[#a3e635] to-[#84cc16]">
            <img 
              src={challenge.jogador?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${challenge.jogadorId}`}
              alt={challenge.jogador?.nome}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-white">{challenge.jogador?.nome}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${nivelColors[challenge.nivel]}`}>
                {challenge.nivel.charAt(0).toUpperCase() + challenge.nivel.slice(1)}
              </span>
              <span className="text-xs text-gray-400">
                {challenge.modalidade === 'beach_tennis' ? 'Beach Tennis' : 
                 challenge.modalidade === 'volei' ? 'Vôlei' : 'Futevôlei'}
              </span>
            </div>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-[#a3e635]/20 text-[#a3e635] text-xs font-medium">
          {tipoLabels[challenge.tipo]}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
        {challenge.dataPreferida && (
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{format(challenge.dataPreferida, 'dd/MM', { locale: ptBR })}</span>
          </div>
        )}
        {challenge.horarioPreferido && (
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{challenge.horarioPreferido}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!isOwner && onMatch && (
          <Button 
            onClick={onMatch}
            className="flex-1 bg-[#a3e635] hover:bg-[#84cc16] text-black font-medium"
          >
            <Hand className="w-4 h-4 mr-2" />
            Dar Match
          </Button>
        )}
        {isOwner && onCancel && (
          <Button 
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
          >
            Cancelar
          </Button>
        )}
      </div>
    </div>
  );
}
