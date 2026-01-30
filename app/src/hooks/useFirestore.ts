import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  type QueryConstraint
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import type { Usuario, Agendamento, Quadra } from '@/types';

export function useCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(items);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  const add = async (item: Omit<T, 'id'>) => {
    const docRef = await addDoc(collection(db, collectionName), {
      ...item,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  };

  const update = async (id: string, item: Partial<T>) => {
    await updateDoc(doc(db, collectionName, id), item as Record<string, unknown>);
  };

  const remove = async (id: string) => {
    await deleteDoc(doc(db, collectionName, id));
  };

  return { data, loading, error, add, update, remove };
}

export function useDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!docId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (doc) => {
        if (doc.exists()) {
          setData({ id: doc.id, ...doc.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, docId]);

  const update = async (item: Partial<T>) => {
    if (docId) {
      await updateDoc(doc(db, collectionName, docId), item as Record<string, unknown>);
    }
  };

  return { data, loading, error, update };
}

export function useAgendamentos(data?: Date) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!data) {
      setLoading(false);
      return;
    }

    const startOfDay = new Date(data);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(data);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'agendamentos'),
      where('data', '>=', Timestamp.fromDate(startOfDay)),
      where('data', '<=', Timestamp.fromDate(endOfDay)),
      orderBy('data')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        data: doc.data().data?.toDate(),
        horarioInicio: doc.data().horarioInicio?.toDate(),
        horarioFim: doc.data().horarioFim?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Agendamento[];
      setAgendamentos(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [data]);

  return { agendamentos, loading };
}

export function useUserAgendamentos(userId?: string) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'agendamentos'),
      where('jogadores', 'array-contains', userId),
      orderBy('data', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        data: doc.data().data?.toDate(),
        horarioInicio: doc.data().horarioInicio?.toDate(),
        horarioFim: doc.data().horarioFim?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Agendamento[];
      setAgendamentos(items);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar agendamentos do usuário:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { agendamentos, loading };
}

export function useRanking(userId?: string) {
  const [ranking, setRanking] = useState<Usuario[]>([]);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      orderBy('pontuacaoAtual', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        ...doc.data(),
        posicao: index + 1,
      })) as unknown as Usuario[];

      setRanking(items);

      if (userId) {
        const index = items.findIndex(u => u.id === userId);
        setUserPosition(index !== -1 ? index + 1 : null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { ranking, userPosition, loading };
}

interface ChallengeData {
  jogadorId: string;
  tipo: string;
  nivel: string;
  modalidade: string;
  dataPreferida?: Date | null;
  horarioPreferido?: string | null;
}

interface Challenge {
  id: string;
  jogadorId: string;
  jogador?: Usuario;
  tipo: string;
  nivel: string;
  modalidade: string;
  dataPreferida?: Date;
  horarioPreferido?: string;
  status: string;
  matchCom?: string;
  createdAt: Date;
}

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'challenges'),
      where('status', '==', 'ativo'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        dataPreferida: doc.data().dataPreferida?.toDate(),
      })) as Challenge[];
      setChallenges(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const criarChallenge = async (challenge: ChallengeData) => {
    const docRef = await addDoc(collection(db, 'challenges'), {
      ...challenge,
      status: 'ativo',
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  };

  const darMatch = async (challengeId: string, matchChallengeId: string) => {
    await updateDoc(doc(db, 'challenges', challengeId), {
      status: 'match',
      matchCom: matchChallengeId,
    });
    await updateDoc(doc(db, 'challenges', matchChallengeId), {
      status: 'match',
      matchCom: challengeId,
    });
  };

  const cancelarChallenge = async (challengeId: string) => {
    await updateDoc(doc(db, 'challenges', challengeId), {
      status: 'cancelado',
    });
  };

  return { challenges, loading, criarChallenge, darMatch, cancelarChallenge };
}

export function useQuadras() {
  const [quadras, setQuadras] = useState<Quadra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'quadras'),
      where('ativa', '==', true),
      orderBy('nome')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as Quadra[];
      setQuadras(items);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar quadras:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addQuadra = async (data: Omit<Quadra, 'id'>) => {
    try {
      await addDoc(collection(db, 'quadras'), {
        ...data,
        ativa: true
      });
      toast.success('Quadra adicionada com sucesso!');
    } catch (error) {
      console.error("Erro ao adicionar quadra:", error);
      const errorMessage = (error as any).code || (error as any).message || 'Erro desconhecido';
      toast.error(`Erro: ${errorMessage}`);
      throw error;
    }
  };

  const updateQuadra = async (id: string, data: Partial<Quadra>) => {
    try {
      await updateDoc(doc(db, 'quadras', id), data);
      toast.success('Quadra atualizada com sucesso!');
    } catch (error) {
      console.error("Erro ao atualizar quadra:", error);
      toast.error('Erro ao atualizar quadra');
      throw error;
    }
  };

  return { quadras, loading, addQuadra, updateQuadra };
}
