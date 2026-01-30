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
        await ensureUserDocument(firebaseUser);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const ensureUserDocument = async (firebaseUser: FirebaseUser) => {
    try {
      const docRef = doc(db, 'users', firebaseUser.uid);
      const docSnap = await getDoc(docRef);

      // Determine expected role from whitelist
      const expectedRole = getRoleFromEmail(firebaseUser.email);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentRole = data.role || 'atleta';

        // Check if role needs update (Promotion only for safety, or strict sync?)
        // Let's do strict sync to allow simple admin removal via env var
        const shouldUpdateRole = currentRole !== expectedRole;

        if (shouldUpdateRole) {
          console.log(`[Auth] Updating user role from ${currentRole} to ${expectedRole}`);
          await setDoc(docRef, { role: expectedRole }, { merge: true });
        }

        setUserData({
          id: firebaseUser.uid,
          ...data,
          role: shouldUpdateRole ? expectedRole : currentRole,
          createdAt: data.createdAt?.toDate(),
        } as Usuario);

      } else {
        // Create new user document
        const newUser: Partial<Usuario> = {
          nome: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || undefined,
          role: expectedRole,
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
        setUserData({ id: firebaseUser.uid, ...newUser } as Usuario);
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await ensureUserDocument(user);
    }
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Logic for user doc creation is now handled by onAuthStateChanged -> ensureUserDocument
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        const { signInWithRedirect } = await import('firebase/auth');
        await signInWithRedirect(auth, provider);
      } else {
        throw error;
      }
    }
  };

  const register = async (email: string, password: string, nome: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // User doc creation handled by onAuthStateChanged -> ensureUserDocument
    // However, for manual register we want to force the 'nome' provided in the form
    // The onAuthStateChanged will fire, but we can pre-emptively write the doc here with the correct name
    // before ensureUserDocument runs (or it will see it exists and just read it).

    // Actually, ensureUserDocument uses displayName. For email/pass, displayName is null initially.
    // So we MUST write the doc here for Email/Pass registration to capture the 'nome'.

    const firebaseUser = result.user;
    const role = getRoleFromEmail(email);

    const newUser: Partial<Usuario> = {
      nome,
      email,
      role,
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
