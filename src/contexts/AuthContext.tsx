import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

interface ExtendedUser extends FirebaseUser {
  isAdmin?: boolean;
}

interface AuthContextType {
  user: ExtendedUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.data();
        
        // Combine Firebase user with Firestore data
        const extendedUser: ExtendedUser = {
          ...firebaseUser,
          isAdmin: userData?.isAdmin || false
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 