import { useState, useMemo } from 'react';
import { useAgendamentos, useQuadras } from '@/hooks/useFirestore';
import { useAgendamento } from '@/hooks/useAgendamento';
import { format, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Clock,
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
    <div className="min-h-screen pb-24 bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-100 sticky top-0 z-20 shadow-clay-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <Palmtree className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="font-condensed text-base font-bold text-slate-900 uppercase tracking-tight">Reservar Quadra</h1>
              <p className="text-[10px] font-semibold text-slate-500 uppercase">Escolha seu horário</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-2xl border-2 border-emerald-500">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Live</span>
          </div>
        </div>

        {/* Date Strip */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar px-6 pb-4">
          {dateStrip.map((date, i) => {
            const active = isSameDay(date, selectedDate);
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center justify-center min-w-[72px] h-20 rounded-2xl font-condensed transition-all ${active
                  ? 'bg-blue-500 text-white border-3 border-blue-600 shadow-blue scale-105'
                  : 'bg-white text-slate-500 border-2 border-slate-200 hover:border-blue-400'
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase mb-1 ${active ? 'opacity-90' : 'opacity-70'}`}>
                  {format(date, 'EEE', { locale: ptBR }).replace('.', '')}
                </span>
                <span className="text-2xl font-black leading-none">
                  {format(date, 'd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Shift Filter Pills */}
        <div className="flex gap-3">
          {[
            { value: 'manha', label: 'Manhã', icon: '🌅' },
            { value: 'tarde', label: 'Tarde', icon: '☀️' },
            { value: 'noite', label: 'Noite', icon: '🌙' }
          ].map(shift => {
            const active = selectedShift === shift.value;
            return (
              <button
                key={shift.value}
                onClick={() => setSelectedShift(shift.value as Shift)}
                className={`flex-1 px-4 py-3.5 rounded-2xl font-condensed text-xs font-bold uppercase transition-all border-3 ${active
                  ? 'bg-orange-500 text-white border-orange-600 shadow-orange'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-orange-400'
                  }`}
              >
                <span className="mr-1.5">{shift.icon}</span>
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
                className={`bg-white rounded-3xl overflow-hidden shadow-clay lift-hover border-l-4 ${quadras.indexOf(court) % 3 === 0 ? 'border-blue-500' :
                  quadras.indexOf(court) % 3 === 1 ? 'border-emerald-500' :
                    'border-orange-500'
                  }`}
              >
                {/* Court Header */}
                <div className="p-5 border-b-2 border-slate-100 flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${quadras.indexOf(court) % 3 === 0 ? 'bg-blue-100' :
                      quadras.indexOf(court) % 3 === 1 ? 'bg-emerald-100' :
                        'bg-orange-100'
                      }`}>
                      <Palmtree className={`w-7 h-7 ${quadras.indexOf(court) % 3 === 0 ? 'text-blue-600' :
                        quadras.indexOf(court) % 3 === 1 ? 'text-emerald-600' :
                          'text-orange-600'
                        }`} />
                    </div>
                    <div>
                      <h3 className="font-condensed text-base font-bold text-slate-900 uppercase mb-1">{court.nome}</h3>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[10px] font-semibold text-slate-500 uppercase">{court.descricao || 'Destaque da Arena'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-condensed text-2xl font-black text-slate-900 block">R$ {court.precoHora}</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">POR HORA</span>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="p-5 bg-slate-50">
                  <div className="grid grid-cols-4 gap-2.5">
                    {slots.length > 0 ? slots.map((slot) => {
                      const isSelected = selectedSlot?.courtId === court.id && selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={slot.ocupado}
                          onClick={() => setSelectedSlot({ courtId: court.id, time: slot.time })}
                          className={`
                            py-3.5 rounded-2xl font-condensed text-xs font-black transition-all
                            ${slot.ocupado
                              ? 'bg-slate-200 border-2 border-slate-300 text-slate-400 cursor-not-allowed opacity-60'
                              : isSelected
                                ? 'bg-emerald-500 border-3 border-emerald-600 text-white shadow-emerald scale-105 z-10'
                                : 'bg-white border-2 border-slate-300 text-slate-700 hover:border-emerald-400 hover:scale-102 shadow-clay-sm'
                            }
                          `}
                        >
                          {slot.time}
                        </button>
                      );
                    }) : (
                      <div className="col-span-4 py-6 text-center">
                        <p className="font-condensed text-xs font-bold text-slate-400 uppercase">
                          Nenhum horário disponível
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

      {/* Sticky Confirmation Button */}
      {selectedSlot && (
        <div className="fixed bottom-[96px] left-0 right-0 px-6 animate-in fade-in slide-in-from-bottom-4 duration-300 z-30">
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="w-full bg-emerald-500 text-white font-condensed font-bold uppercase tracking-wide py-5 rounded-3xl shadow-emerald border-3 border-emerald-600 flex items-center justify-between px-6 hover:scale-102 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <span className="text-sm">Confirmar Reserva</span>
            </div>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white border-slate-200 max-w-sm rounded-3xl overflow-hidden p-0">
          {/* Header */}
          <div className="bg-emerald-500 p-6 text-white text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-emerald border-3 border-white/30">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
            <h3 className="font-condensed text-2xl font-black uppercase">Confirmar Reserva</h3>
            <p className="text-xs text-emerald-100 font-medium mt-1.5">Verifique os detalhes abaixo</p>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Quadra */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 border-2 border-blue-500">
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Quadra Selecionada</p>
                <p className="font-condensed text-base font-black text-slate-900">{quadras.find(c => c.id === selectedSlot?.courtId)?.nome}</p>
              </div>
              <Palmtree className="w-6 h-6 text-blue-600" />
            </div>

            {/* Horário */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50 border-2 border-orange-500">
              <div>
                <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">Horário & Data</p>
                <p className="font-condensed text-base font-black text-slate-900">
                  {format(selectedDate, 'dd/MM')} às {selectedSlot?.time}
                </p>
              </div>
              <Clock className="w-6 h-6 text-orange-600" />
            </div>

            {/* Valor */}
            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-between">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Valor da Locação</span>
              <span className="font-condensed text-2xl font-black text-emerald-800">R$ {quadras.find(c => c.id === selectedSlot?.courtId)?.precoHora},00</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-4 rounded-2xl bg-slate-100 text-slate-600 font-condensed font-bold uppercase text-xs border-2 border-slate-300 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgendar}
                disabled={saving}
                className="flex-1 py-4 rounded-2xl bg-emerald-500 text-white font-condensed font-black uppercase text-xs shadow-emerald border-2 border-emerald-600 hover:scale-105 transition-all disabled:opacity-60"
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
