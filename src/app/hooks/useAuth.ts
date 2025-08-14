"use client";

import { useState, useEffect } from "react";
import { getUserWithProvider } from "@/app/utils/userUtils";

interface User {
  id: number;
  email: string;
  role: 'provider' | 'client' | 'admin';
  provider_id?: number;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/check-auth");
      const data = await response.json();

      if (response.ok && data.authenticated) {
        // Récupérer les informations complètes de l'utilisateur
        const userWithProvider = getUserWithProvider(data.user.id);
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          user: null,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: "Erreur de vérification d'authentification",
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setAuthState({
          user: data.user,
          loading: false,
          error: null,
        });
        return { success: true };
      } else {
        setAuthState(prev => ({
          ...prev,
          error: data.message || "Erreur de connexion",
        }));
        return { success: false, error: data.message };
      }
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: "Erreur de connexion au serveur",
      }));
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      setAuthState({
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
    checkAuth,
  };
}
