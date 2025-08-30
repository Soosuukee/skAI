"use client";

/**
 * Petit service utilitaire pour l'authentification côté client.
 * Il encapsule les appels aux endpoints décrits dans `READMEapi.md`.
 */

export interface AuthResponse {
  success: boolean;
  user?: any;
  token?: string;
  message?: string;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  // Utiliser l'API externe décrite dans READMEapi.md
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return { success: false, message: data.message || "Erreur de connexion" };
  }

  return { success: true, user: data.user, token: data.token };
}

export async function checkAuth(token?: string): Promise<{ authenticated: boolean; user?: any }> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
  const res = await fetch(`${baseUrl}/auth/me`, {
    headers,
    credentials: "include",
  });

  if (!res.ok) return { authenticated: false };

  const data = await res.json();
  return { authenticated: true, user: data.user };
}

export async function logout(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
  try {
    await fetch(`${baseUrl}/auth/logout`, { method: "POST", credentials: "include" });
  } catch (e) {
    console.error("Logout request failed:", e);
  }

  try {
    localStorage.removeItem("authToken");
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } catch (e) {
    // ignore
  }
}


