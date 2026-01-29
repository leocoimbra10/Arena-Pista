import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { Usuario } from '@/types';

// Admin email whitelist from environment variable
const ADMIN_EMAILS = import.meta.env.VITE_ADMIN_EMAILS
  ? import.meta.env.VITE_ADMIN_EMAILS.split(',').map((email: string) => email.trim().toLowerCase())
  : [];

// Teacher email whitelist from environment variable
const TEACHER_EMAILS = import.meta.env.VITE_TEACHER_EMAILS
  ? import.meta.env.VITE_TEACHER_EMAILS.split(',').map((email: string) => email.trim().toLowerCase())
  : [];

// Helper: Determine role based on email whitelists
const getRoleFromEmail = (email: string | null): 'admin' | 'professor' | 'atleta' => {
  if (!email) return 'atleta';
  const emailLower = email.toLowerCase();

  if (ADMIN_EMAILS.includes(emailLower)) return 'admin';
  if (TEACHER_EMAILS.includes(emailLower)) return 'professor';
  return 'atleta';
};

interface AuthContextType {
  user: FirebaseUser | null;
  userData: Usuario | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, nome: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData(firebaseUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData({
          id: uid,
          ...data,
          role: data.role || 'atleta', // Use actual role from database, default to 'atleta'
          createdAt: data.createdAt?.toDate(),
        } as Usuario);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await fetchUserData(user.uid);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Check if user exists in Firestore
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Auto-assign role based on email whitelists
      const role = getRoleFromEmail(firebaseUser.email);

      // Create new user document
      const newUser: Partial<Usuario> = {
        nome: firebaseUser.displayName || 'Usuário',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || undefined,
        role, // Auto-assigned based on email whitelist
        nivel: 'iniciante',
        pontuacaoAtual: 0,
        posicaoRanking: 0,
        estatisticas: {
          vitorias: 0,
          derrotas: 0,
          jogos: 0,
          winRate: 0,
        },
        createdAt: new Date(),
      };
      await setDoc(docRef, newUser);
    }
  };

  const register = async (email: string, password: string, nome: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = result.user;

    // Auto-assign role based on email whitelists
    const role = getRoleFromEmail(email);

    const newUser: Partial<Usuario> = {
      nome,
      email,
      role, // Auto-assigned based on email whitelist
      nivel: 'iniciante',
      pontuacaoAtual: 0,
      posicaoRanking: 0,
      estatisticas: {
        vitorias: 0,
        derrotas: 0,
        jogos: 0,
        winRate: 0,
      },
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userData,
      loading,
      login,
      loginWithGoogle,
      register,
      logout,
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
