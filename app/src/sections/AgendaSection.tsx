import { useState } from 'react';
import { Header } from '@/components/Header';
import { QuadraCard } from '@/components/QuadraCard';
import { useQuadras } from '@/hooks/useQuadras';
import { useAgendamentos } from '@/hooks/useFirestore';
import { useAgendamento } from '@/hooks/useAgendamento';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format, addDays, startOfWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, X } from 'lucide-react';
import type { Quadra } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface TimeSlot {
  hora: string;
  ocupado: boolean;
}

export function AgendaSection() {
  const { quadras, loading: loadingQuadras } = useQuadras();
  const [selectedQuadra, setSelectedQuadra] = useState<Quadra | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const { user } = useAuth();
  const { agendamentos } = useAgendamentos(selectedDate);
  const { criarAgendamento, loading: saving } = useAgendamento();

  // Generate week days
  const weekStart = startOfWeek(selectedDate, { locale: ptBR });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePrevWeek = () => {
    setSelectedDate(addDays(selectedDate, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate(addDays(selectedDate, 7));
  };

  const handleAgendar = async () => {
    if (!selectedQuadra || !selectedSlot || !user) return;

    try {
      const [hours, minutes] = selectedSlot.split(':').map(Number);
      const horarioInicio = new Date(selectedDate);
      horarioInicio.setHours(hours, minutes, 0, 0);
      
      const horarioFim = new Date(horarioInicio);
      horarioFim.setMinutes(horarioFim.getMinutes() + selectedQuadra.duracaoSlot);

      await criarAgendamento({
        quadraId: selectedQuadra.id,
        data: selectedDate,
        horarioInicio,
        horarioFim,
        status: 'confirmado',
        tipo: 'individual',
        jogadores: [user.uid],
        criadoPor: user.uid,
      });

      toast.success('Agendamento realizado com sucesso!');
      setShowConfirmDialog(false);
      setSelectedSlot(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao agendar');
    }
  };

  // Generate time slots
  const generateSlots = (): TimeSlot[] => {
    if (!selectedQuadra) return [];
    
    const slots: TimeSlot[] = [];
    const [horaAbertura, minAbertura] = selectedQuadra.horarioAbertura.split(':').map(Number);
    const [horaFechamento, minFechamento] = selectedQuadra.horarioFechamento.split(':').map(Number);
    
    const inicio = new Date(selectedDate);
    inicio.setHours(horaAbertura, minAbertura, 0, 0);
    
    const fim = new Date(selectedDate);
    fim.setHours(horaFechamento, minFechamento, 0, 0);

    let atual = new Date(inicio);
    
    while (atual < fim) {
      const horaStr = atual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const ocupado = agendamentos.some((a) => {
        if (a.quadraId !== selectedQuadra.id) return false;
        const inicioAgendamento = new Date(a.horarioInicio);
        const fimAgendamento = new Date(a.horarioFim);
        return atual >= inicioAgendamento && atual < fimAgendamento;
      });

      slots.push({ hora: horaStr, ocupado });
      atual = new Date(atual.getTime() + selectedQuadra.duracaoSlot * 60000);
    }

    return slots;
  };

  if (selectedQuadra) {
    const slots = generateSlots();

    return (
      <div className="min-h-screen pb-20 bg-[#0f0f1a]">
        <Header 
          title={selectedQuadra.nome} 
          onMenuClick={() => setSelectedQuadra(null)}
        />
        
        <div className="p-4 space-y-4">
          {/* Week Selector */}
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={handlePrevWeek}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => setShowCalendar(true)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="text-sm font-medium text-white">
                {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
              </span>
            </button>
            <button 
              onClick={handleNextWeek}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Days */}
          <div className="flex justify-between gap-1">
            {weekDays.map((day) => {
              const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
              const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center p-2 rounded-xl transition-all ${
                    isSelected 
                      ? 'bg-[#a3e635] text-black' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <span className="text-[10px] uppercase">{format(day, 'EEE', { locale: ptBR })}</span>
                  <span className={`text-lg font-bold ${isToday && !isSelected ? 'text-[#a3e635]' : ''}`}>
                    {format(day, 'd')}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Horários disponíveis - {format(selectedDate, 'dd/MM')}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.hora}
                  disabled={slot.ocupado}
                  onClick={() => {
                    setSelectedSlot(slot.hora);
                    setShowConfirmDialog(true);
                  }}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    slot.ocupado
                      ? 'bg-red-500/10 text-red-400 cursor-not-allowed'
                      : selectedSlot === slot.hora
                      ? 'bg-[#a3e635] text-black'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {slot.ocupado ? (
                    <span className="flex items-center justify-center gap-1">
                      <X className="w-3 h-3" /> {slot.hora}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      <Clock className="w-3 h-3" /> {slot.hora}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Dialog */}
        <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
          <DialogContent className="bg-[#1a1a2e] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Selecione uma data</DialogTitle>
            </DialogHeader>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setShowCalendar(false);
                }
              }}
              className="border-0"
            />
          </DialogContent>
        </Dialog>

        {/* Confirm Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="bg-[#1a1a2e] border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Confirmar Agendamento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-gray-400">Quadra</p>
                <p className="text-white font-medium">{selectedQuadra.nome}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-gray-400">Data e Horário</p>
                <p className="text-white font-medium">
                  {format(selectedDate, 'dd/MM/yyyy')} às {selectedSlot}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowConfirmDialog(false)}
                  className="flex-1 border-white/20 text-gray-300"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAgendar}
                  disabled={saving}
                  className="flex-1 bg-[#a3e635] hover:bg-[#84cc16] text-black"
                >
                  {saving ? 'Agendando...' : 'Confirmar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-[#0f0f1a]">
      <Header title="Agendar Quadra" />
      
      <div className="p-4 space-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#a3e635]/20 to-[#84cc16]/10 border border-[#a3e635]/20 p-4">
          <h2 className="text-lg font-bold text-white mb-1">Escolha sua quadra</h2>
          <p className="text-sm text-gray-400">Selecione uma quadra para ver os horários disponíveis</p>
        </div>

        {loadingQuadras ? (
          <div className="text-center py-8 text-gray-500">Carregando quadras...</div>
        ) : (
          <div className="grid gap-4">
            {quadras.map((quadra) => (
              <QuadraCard 
                key={quadra.id} 
                quadra={quadra} 
                onAgendar={() => setSelectedQuadra(quadra)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
