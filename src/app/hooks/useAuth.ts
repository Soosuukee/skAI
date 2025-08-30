"use client";

import { useState, useEffect } from "react";
import { getUserWithProvider } from "@/app/utils/userUtils";
import * as authService from "@/app/utils/authService";

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
      const token = localStorage.getItem("authToken") || undefined;
      const result = await authService.checkAuth(token);
      if (result.authenticated && result.user) {
        setAuthState({
          user: result.user,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({ user: null, loading: false, error: null });
      }
    } catch (error) {
      setAuthState({ user: null, loading: false, error: "Erreur de vérification d'authentification" });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login(email, password);

      if (data.success) {
        setAuthState({ user: data.user, loading: false, error: null });
        return { success: true };
      }

      setAuthState(prev => ({ ...prev, error: data.message || "Erreur de connexion" }));
      return { success: false, error: data.message };
    } catch (error) {
      setAuthState(prev => ({ ...prev, error: "Erreur de connexion au serveur" }));
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
