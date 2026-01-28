import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Quadra } from '@/types';

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
        ...doc.data(),
      })) as Quadra[];
      setQuadras(items);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addQuadra = async (quadra: Omit<Quadra, 'id'>) => {
    const docRef = await addDoc(collection(db, 'quadras'), quadra);
    return docRef.id;
  };

  const updateQuadra = async (id: string, quadra: Partial<Quadra>) => {
    await updateDoc(doc(db, 'quadras', id), quadra as Record<string, unknown>);
  };

  const deleteQuadra = async (id: string) => {
    await updateDoc(doc(db, 'quadras', id), { ativa: false });
  };

  return { quadras, loading, addQuadra, updateQuadra, deleteQuadra };
}
