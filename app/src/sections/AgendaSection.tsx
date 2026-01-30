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
  MapPin,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Sunrise
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';


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
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Erro ao agendar');
      }
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
    <div className="min-h-screen pb-24 bg-brand-sand-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-brand-sand-200 sticky top-0 z-20 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-blue-50 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-brand-blue-600" />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-slate-900 leading-tight">Reservar Quadra</h1>
              <p className="text-xs text-slate-500">Escolha seu horário</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-full border border-slate-100 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Ao Vivo</span>
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
                className={cn(
                  "flex flex-col items-center justify-center min-w-[4rem] h-[4.5rem] rounded-2xl transition-all duration-300",
                  active
                    ? "bg-brand-blue-600 text-white shadow-md shadow-brand-blue-200 scale-105"
                    : "bg-transparent text-slate-400 hover:bg-white hover:text-slate-600 border border-transparent hover:border-slate-100"
                )}
              >
                <span className="text-[10px] font-bold uppercase mb-0.5 opacity-80">
                  {format(date, 'EEE', { locale: ptBR }).replace('.', '')}
                </span>
                <span className="text-xl font-bold leading-none font-display">
                  {format(date, 'd')}
                </span>
                {active && <div className="w-1 h-1 bg-white rounded-full mt-1.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Shift Filter Pills */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          {[
            { value: 'manha', label: 'Manhã', icon: Sunrise },
            { value: 'tarde', label: 'Tarde', icon: Sun },
            { value: 'noite', label: 'Noite', icon: Moon }
          ].map(shift => {
            const active = selectedShift === shift.value;
            const Icon = shift.icon;
            return (
              <button
                key={shift.value}
                onClick={() => setSelectedShift(shift.value as Shift)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                  active
                    ? "bg-brand-blue-50 text-brand-blue-700 shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className={cn("w-4 h-4", active ? "text-brand-blue-600" : "text-slate-400")} />
                {shift.label}
              </button>
            );
          })}
        </div>

        {/* Court Listing */}
        <div className="space-y-6">
          {loadingQuadras ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-brand-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carregando quadras...</p>
            </div>
          ) : quadras.map((court) => {
            const slots = getSlotsForCourt(court.id);
            return (
              <div
                key={court.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
              >
                {/* Court Header */}
                <div className="p-5 border-b border-slate-50 flex items-start justify-between bg-gradient-to-r from-transparent to-slate-50/50">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-sand-100 flex items-center justify-center">
                      <Palmtree className="w-6 h-6 text-brand-sand-600" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-slate-900 mb-0.5">{court.nome}</h3>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-xs font-medium text-slate-500">{court.descricao || 'Quadra Oficial'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-display text-xl font-bold text-slate-900 block">R$ {court.precoHora}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/hora</span>
                  </div>
                </div>

                {/* Slots Grid */}
                <div className="p-5">
                  <div className="grid grid-cols-4 gap-3">
                    {slots.length > 0 ? slots.map((slot) => {
                      const isSelected = selectedSlot?.courtId === court.id && selectedSlot?.time === slot.time;
                      return (
                        <button
                          key={slot.time}
                          disabled={slot.ocupado}
                          onClick={() => setSelectedSlot({ courtId: court.id, time: slot.time })}
                          className={cn(
                            "py-2.5 rounded-xl text-sm font-bold transition-all duration-200 border",
                            slot.ocupado
                              ? "bg-slate-50 border-transparent text-slate-300 cursor-not-allowed"
                              : isSelected
                                ? "bg-brand-blue-600 border-brand-blue-600 text-white shadow-md shadow-brand-blue-200 scale-105"
                                : "bg-white border-slate-200 text-slate-600 hover:border-brand-blue-300 hover:text-brand-blue-600"
                          )}
                        >
                          {slot.time}
                        </button>
                      );
                    }) : (
                      <div className="col-span-4 py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-xs font-medium text-slate-400">
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
        <div className="fixed bottom-24 left-6 right-6 z-30 animate-in slide-in-from-bottom-4 duration-500">
          <button
            onClick={() => setShowConfirmDialog(true)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-between px-6 hover:bg-slate-800 transition-all active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="block text-sm font-bold">Confirmar Reserva</span>
                <span className="block text-[10px] text-slate-300 font-medium">
                  {quadras.find(c => c.id === selectedSlot.courtId)?.nome} • {selectedSlot.time}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-white border-none max-w-sm rounded-[2rem] overflow-hidden p-0 shadow-2xl">
          {/* Header */}
          <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 bg-white/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 text-center">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <ShieldCheck className="w-8 h-8 text-brand-teal-400" />
              </div>
              <h3 className="font-display text-xl font-bold">Confirmar Reserva</h3>
              <p className="text-xs text-slate-400 mt-1">Verifique os detalhes abaixo</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-4">
            {/* Quadra */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Quadra</p>
                <p className="font-display text-sm font-bold text-slate-900">{quadras.find(c => c.id === selectedSlot?.courtId)?.nome}</p>
              </div>
              <Palmtree className="w-5 h-5 text-slate-400" />
            </div>

            {/* Horário */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Data e Horário</p>
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-bold text-slate-900">
                    {format(selectedDate, 'dd/MM')}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                  <p className="font-display text-sm font-bold text-slate-900">
                    {selectedSlot?.time}
                  </p>
                </div>
              </div>
              <Clock className="w-5 h-5 text-slate-400" />
            </div>

            {/* Valor */}
            <div className="p-5 rounded-2xl bg-brand-sand-50 border border-brand-sand-100 flex items-center justify-between">
              <span className="text-xs font-bold text-brand-sand-700">Total a pagar</span>
              <span className="font-display text-xl font-bold text-brand-sand-800">R$ {quadras.find(c => c.id === selectedSlot?.courtId)?.precoHora},00</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 py-3.5 rounded-xl text-slate-500 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAgendar}
                disabled={saving}
                className="flex-[2] py-3.5 rounded-xl bg-brand-blue-600 text-white font-bold text-xs shadow-lg shadow-brand-blue-200 hover:bg-brand-blue-700 hover:scale-[1.02] transition-all disabled:opacity-60 disabled:hover:scale-100"
              >
                {saving ? 'Processando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
