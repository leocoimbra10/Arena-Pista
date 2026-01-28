import { useState, useMemo } from 'react';
import { useAgendamentos, useQuadras } from '@/hooks/useFirestore';
import { useAgendamento } from '@/hooks/useAgendamento';
import { format, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Clock,
  Sun,
  Moon,
  Sunrise,
  Palmtree,
  ShieldCheck,
  Check,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';



type Shift = 'manha' | 'tarde' | 'noite';

export function AgendaSection() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShift, setSelectedShift] = useState<Shift>('tarde');
  const [selectedSlot, setSelectedSlot] = useState<{ courtId: string, time: string } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { user } = useAuth();
  const { agendamentos } = useAgendamentos(selectedDate);
  const { quadras, loading: loadingQuadras } = useQuadras();
  const { criarAgendamento, loading: saving } = useAgendamento();

  // Generate date strip (next 14 days)
  const dateStrip = useMemo(() => {
    return Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  }, []);

  const handleAgendar = async () => {
    if (!selectedSlot || !user) return;

    try {
      const court = quadras.find(c => c.id === selectedSlot.courtId);
      if (!court) return;

      const [hours, minutes] = selectedSlot.time.split(':').map(Number);
      const horarioInicio = new Date(selectedDate);
      horarioInicio.setHours(hours, minutes, 0, 0);

      const horarioFim = new Date(horarioInicio);
      horarioFim.setMinutes(horarioFim.getMinutes() + court.duracaoSlot);

      await criarAgendamento({
        quadraId: court.id,
        data: selectedDate,
        horarioInicio,
        horarioFim,
        status: 'confirmado',
        tipo: 'individual',
        jogadores: [user.uid],
        criadoPor: user.uid,
      });

      toast.success('Reserva confirmada! Bom jogo! 🎾');
      setShowConfirmDialog(false);
      setSelectedSlot(null);
    } catch (error: any) {
      toast.error(error.message || 'Erro ao agendar');
    }
  };

  const getSlotsForCourt = (courtId: string) => {
    const court = quadras.find(c => c.id === courtId);
    if (!court) return [];

    const slots = [];
    const [startH] = court.horarioAbertura.split(':').map(Number);
    const [endH] = court.horarioFechamento.split(':').map(Number);

    for (let h = startH; h < endH; h++) {
      const time = `${h.toString().padStart(2, '0')}:00`;

      // Filter by shift
      let shift: Shift = 'manha';
      if (h >= 12 && h < 18) shift = 'tarde';
      if (h >= 18) shift = 'noite';

      if (shift !== selectedShift) continue;

      const ocupado = agendamentos.some(a => {
        if (a.quadraId !== courtId) return false;
        const hInicio = new Date(a.horarioInicio).getHours();
        return hInicio === h && a.status !== 'cancelado';
      });

      slots.push({ time, ocupado });
    }
    return slots;
  };

  return (
    <div className="min-h-screen pb-32 bg-[#F7F5F2]">
      {/* Date Selector Horizontal Strip */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Palmtree className="w-5 h-5 text-teal-600" />
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-widest">Reservar Quadra</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Live Arena</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto px-4 pb-4 no-scrollbar">
          {dateStrip.map((date, i) => {
            const active = isSameDay(date, selectedDate);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[64px] h-16 rounded-2xl transition-all ${active
                  ? 'bg-gray-900 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-400 border border-gray-100'
                  }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-tighter mb-1 ${active ? 'opacity-70' : 'opacity-40'}`}>
                  {format(date, 'EEE', { locale: ptBR }).replace('.', '')}
                </span>
                <span className="text-lg font-black leading-none">
                  {format(date, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Shift Filters */}
        <div className="flex items-center gap-2">
          {[
            { id: 'manha', label: 'Manhã', icon: Sunrise },
            { id: 'tarde', label: 'Tarde', icon: Sun },
            { id: 'noite', label: 'Noite', icon: Moon }
          ].map((shift) => {
            const ActiveIcon = shift.icon;
            const active = selectedShift === shift.id;
            return (
              <button
                key={shift.id}
                onClick={() => setSelectedShift(shift.id as Shift)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-wider transition-all border ${active
                  ? 'bg-white border-teal-500 text-teal-600 shadow-sm'
                  : 'bg-gray-100 border-transparent text-gray-400'
                  }`}
              >
                <ActiveIcon className={`w-3.5 h-3.5 ${active ? 'text-teal-500' : 'text-gray-400'}`} />
                {shift.label}
              </button>
            );
          })}
        </div>

        {/* Court Listing */}
        <div className="space-y-4">
          {loadingQuadras ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Carregando quadras...</p>
            </div>
          ) : quadras.map((court) => {
            const slots = getSlotsForCourt(court.id);
            return (
              <div
                key={court.id}
                className="bg-white rounded-[32px] border border-gray-200 overflow-hidden shadow-xl"
              >
                {/* Court Info Header */}
                <div className="p-5 border-b border-gray-50 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                      <Palmtree className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">{court.nome}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-gray-300" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{court.descricao || 'Destaque da Arena'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-sm font-black text-gray-900">R$ {court.precoHora}</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">POR HORA</span>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="p-5 bg-gray-50/50">
                  <div className="grid grid-cols-4 gap-2">
                    {slots.length > 0 ? slots.map((slot) => {
                      const isSelected = selectedSlot?.courtId === court.id && selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={slot.ocupado}
                          onClick={() => setSelectedSlot({ courtId: court.id, time: slot.time })}
                          className={`
                            py-3 rounded-xl text-xs font-black transition-all border
                            ${slot.ocupado
                              ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                              : isSelected
                                ? 'bg-[#39FF14] border-[#39FF14] text-black shadow-[0_0_15px_rgba(57,255,20,0.4)] scale-105 z-10'
                                : 'bg-white border-gray-200 text-gray-600 hover:border-teal-400 active:scale-95'
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      );
                    }) : (
                      <div className="col-span-4 py-4 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic">
                          Nenhum horário disponível para este turno
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Confirmation */}
      {selectedSlot && (
        <div className="fixed bottom-[96px] left-0 right-0 px-4 animate-in fade-in slide-in-from-bottom-4 duration-300 z-30">
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="w-full bg-[#39FF14] text-black font-black uppercase tracking-[0.2em] py-5 rounded-[24px] shadow-[0_10px_30px_rgba(57,255,20,0.3)] flex items-center justify-between px-8 border-2 border-white/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
              <span className="text-sm">Confirmar Reserva</span>
            </div>
            <ChevronRight className="w-5 h-5 opacity-50" />
          </button>
        </div>
      )}

      {/* Confirmation Dialog Premium */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white border-gray-200 max-w-sm rounded-[32px] overflow-hidden p-0">
          <div className="bg-gray-900 p-6 text-white text-center">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Quase tudo pronto!</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">Confirme os detalhes da sua reserva</p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Quadra Selecionada</p>
                <p className="text-sm font-black text-gray-900">{quadras.find(c => c.id === selectedSlot?.courtId)?.nome}</p>
              </div>
              <Palmtree className="w-5 h-5 text-teal-600" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Horário & Data</p>
                <p className="text-sm font-black text-gray-900">
                  {format(selectedDate, 'dd/MM')} às {selectedSlot?.time}
                </p>
              </div>
              <Clock className="w-5 h-5 text-teal-600" />
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-between">
              <span className="text-[10px] font-black text-teal-700 uppercase tracking-widest">Valor da Locação</span>
              <span className="text-xl font-black text-teal-800">R$ {quadras.find(c => c.id === selectedSlot?.courtId)?.precoHora},00</span>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 font-black uppercase text-[10px] tracking-widest"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgendar}
                disabled={saving}
                className="flex-1 py-4 rounded-2xl bg-gray-900 text-white font-black uppercase text-[10px] tracking-widest shadow-lg"
              >
                {saving ? 'Agendando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
