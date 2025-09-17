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

function extractUser(payload: any): any | undefined {
  if (!payload) return undefined;
  // Common shapes
  const candidates = [
    payload.user,
    payload.client,
    payload.provider,
    payload.data?.user,
    payload.data?.client,
    payload.data?.provider,
    payload.currentUser,
  ].filter(Boolean);
  if (candidates.length > 0) return candidates[0];

  // New common shape: { success, data: {...user...} }
  if (
    payload.data &&
    typeof payload.data === "object" &&
    (payload.data.role || payload.data.email || payload.data.id)
  ) {
    return payload.data;
  }

  // Sometimes the payload itself is the user (has id + role or email)
  if ((payload.id || payload.user_id) && (payload.role || payload.email)) {
    return payload;
  }
  return undefined;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  // API JWT Lexik - plus besoin de userType
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include",
  });
  
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    return { success: false, message: "Réponse invalide du serveur (non-JSON)" };
  }

  if (!res.ok) {
    return { success: false, message: data.message || "Identifiants invalides" };
  }

  // JWT Lexik retourne directement le token à la racine
  const token: string = data.token;
  
  if (!token) {
    return { success: false, message: "Token non retourné par l'API" };
  }

  // Persister le token
  try {
    localStorage.setItem("authToken", token);
    document.cookie = `authToken=${token}; path=/;`;
  } catch {}

  // Récupérer les informations utilisateur via /me
  let user: any;
  try {
    const meRes = await fetch(`${baseUrl}/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: "include"
    });
    if (meRes.ok) {
      const meData = await meRes.json();
      user = meData.data || meData;
      localStorage.setItem("authUser", JSON.stringify(user));
    }
  } catch (e) {
    console.error("Erreur lors de la récupération des infos utilisateur:", e);
  }

  if (!user) {
    return { success: false, message: "Impossible de récupérer les informations utilisateur" };
  }

  return { success: true, user, token };
}

export async function checkAuth(token?: string): Promise<{ authenticated: boolean; user?: any }> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
  
  // Utiliser le token du localStorage si pas fourni
  const authToken = token || localStorage.getItem("authToken");
  
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${baseUrl}/me`, {
    headers,
    credentials: "include",
  });
  
  if (!res.ok) {
    // Fallback: try localStorage user if backend not available
    try {
      const cached =
        localStorage.getItem("authUser") ||
        localStorage.getItem("authuser") ||
        localStorage.getItem("user");
      if (cached) return { authenticated: true, user: JSON.parse(cached) };
    } catch {}
    return { authenticated: false };
  }
  
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    // Fallback: try localStorage user if response is not JSON
    try {
      const cached =
        localStorage.getItem("authUser") ||
        localStorage.getItem("authuser") ||
        localStorage.getItem("user");
      if (cached) return { authenticated: true, user: JSON.parse(cached) };
    } catch {}
    return { authenticated: false };
  }
  
  // JWT Lexik retourne les données dans data.data
  const user = data.data || data;
  return { authenticated: Boolean(user), user: user };
}

export async function logout(): Promise<void> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8081/api/v1";
  try {
    await fetch(`${baseUrl}/auth/logout`, { method: "POST", credentials: "include" });
  } catch (e) {
    console.error("Logout request failed:", e);
  }

  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authuser");
    localStorage.removeItem("user");
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } catch (e) {
    // ignore
  }
}


