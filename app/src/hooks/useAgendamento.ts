import { useState, useCallback } from 'react';
import { collection, addDoc, updateDoc, doc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Agendamento, TimeSlot } from '@/types';

export function useAgendamento() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const criarAgendamento = useCallback(async (agendamento: Omit<Agendamento, 'id' | 'createdAt'>) => {
    setLoading(true);
    try {
      // Verificar conflitos
      const q = query(
        collection(db, 'agendamentos'),
        where('quadraId', '==', agendamento.quadraId),
        where('status', 'in', ['pendente', 'confirmado'])
      );
      const snapshot = await getDocs(q);
      
      const conflito = snapshot.docs.some((doc) => {
        const existing = doc.data();
        const existingStart = existing.horarioInicio.toDate();
        const existingEnd = existing.horarioFim.toDate();
        const newStart = agendamento.horarioInicio;
        const newEnd = agendamento.horarioFim;
        
        return (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        );
      });

      if (conflito) {
        throw new Error('Horário já está ocupado');
      }

      const docRef = await addDoc(collection(db, 'agendamentos'), {
        ...agendamento,
        data: Timestamp.fromDate(agendamento.data),
        horarioInicio: Timestamp.fromDate(agendamento.horarioInicio),
        horarioFim: Timestamp.fromDate(agendamento.horarioFim),
        createdAt: Timestamp.now(),
      });
      
      return docRef.id;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelarAgendamento = useCallback(async (agendamentoId: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'agendamentos', agendamentoId), {
        status: 'cancelado',
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmarAgendamento = useCallback(async (agendamentoId: string) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'agendamentos', agendamentoId), {
        status: 'confirmado',
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarResultado = useCallback(async (
    agendamentoId: string,
    placar1: number,
    placar2: number,
    vencedorId?: string,
    vencedorDuplaId?: string
  ) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'agendamentos', agendamentoId), {
        resultado: {
          placar1,
          placar2,
          vencedorId,
          vencedorDuplaId,
          confirmado: true,
        },
        status: 'concluido',
      });
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const gerarTimeSlots = useCallback((
    quadra: { horarioAbertura: string; horarioFechamento: string; duracaoSlot: number },
    agendamentos: Agendamento[]
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [horaAbertura, minAbertura] = quadra.horarioAbertura.split(':').map(Number);
    const [horaFechamento, minFechamento] = quadra.horarioFechamento.split(':').map(Number);
    
    const inicio = new Date();
    inicio.setHours(horaAbertura, minAbertura, 0, 0);
    
    const fim = new Date();
    fim.setHours(horaFechamento, minFechamento, 0, 0);

    let atual = new Date(inicio);
    
    while (atual < fim) {
      const horaStr = atual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      
      const agendamento = agendamentos.find((a) => {
        const inicioAgendamento = new Date(a.horarioInicio);
        const fimAgendamento = new Date(a.horarioFim);
        return atual >= inicioAgendamento && atual < fimAgendamento;
      });

      slots.push({
        hora: horaStr,
        disponivel: !agendamento,
        agendamento,
      });

      atual = new Date(atual.getTime() + quadra.duracaoSlot * 60000);
    }

    return slots;
  }, []);

  return {
    loading,
    error,
    criarAgendamento,
    cancelarAgendamento,
    confirmarAgendamento,
    registrarResultado,
    gerarTimeSlots,
  };
}
