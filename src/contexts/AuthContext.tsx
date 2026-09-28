import React, { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, firebaseConfigured, googleProvider, db } from "../lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isCreator: () => boolean;
  canEditPrompt: (creatorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (firebaseConfigured) return null;
    try { return JSON.parse(localStorage.getItem("prompt-lab-local-user") || "null") as User | null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfigured || !auth || !db) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // Update last login
            await setDoc(
              userDocRef,
              {
                lastLogin: serverTimestamp(),
              },
              { merge: true }
            );

            const userData = userDoc.data();
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email!,
              displayName: firebaseUser.displayName!,
              photoURL: firebaseUser.photoURL!,
              role: userData.role || "viewer",
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin,
            });
          } else {
            // Create new user with viewer role
            const newUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: "viewer",
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };
            await setDoc(userDocRef, newUser);
            setUser(newUser as User);
          }
        } catch (error) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const useLocalUser = () => {
      const localUser: User = { uid: "local-google-user", email: "local@example.com", displayName: "Local Google user", photoURL: "", role: "viewer", createdAt: new Date().toISOString(), lastLogin: new Date().toISOString() };
      localStorage.setItem("prompt-lab-local-user", JSON.stringify(localUser));
      setUser(localUser);
    };
    if (!auth || !googleProvider) {
      useLocalUser();
      return;
    }
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      // Keep local development usable when Firebase keys or authorized domains
      // have not been configured yet. Production deployments still use Google.
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        useLocalUser();
        return;
      }
      throw new Error("Failed to sign in with Google. Please try again.");
    }
  };

  const logout = async () => {
    if (!auth) { localStorage.removeItem("prompt-lab-local-user"); setUser(null); return; }
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error("Failed to sign out. Please try again.");
    }
  };

  const isAdmin = () => user?.role === "admin";
  const isCreator = () => user?.role === "creator" || user?.role === "admin";
  const canEditPrompt = (creatorId: string) => {
    if (!user) return false;
    return user.role === "admin" || user.uid === creatorId;
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    logout,
    isAdmin,
    isCreator,
    canEditPrompt,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
