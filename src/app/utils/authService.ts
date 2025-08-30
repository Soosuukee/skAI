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

  // Sometimes the payload itself is the user (has id + role or email)
  if ((payload.id || payload.user_id) && (payload.role || payload.email)) {
    return payload;
  }
  return undefined;
}

export async function login(email: string, password: string, userType?: 'provider' | 'client' | 'admin'): Promise<AuthResponse> {
  // Revenir à l'API externe définie par READMEapi
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      userType ? { email, password, userType } : { email, password }
    ),
    credentials: "include",
  });
  let data: any;
  try {
    data = await res.json();
  } catch (e) {
    return { success: false, message: "Réponse invalide du serveur (non-JSON)" };
  }

  if (!res.ok) {
    return { success: false, message: data.message || "Erreur de connexion" };
  }

  // Normaliser token et user quelle que soit la forme de réponse
  let token: string | undefined = data?.token || data?.accessToken || data?.access_token;
  let user: any = extractUser(data);

  // Si l'API ne renvoie pas l'utilisateur au login, tenter /auth/me
  if (!user) {
    try {
      const meRes = await fetch(`${baseUrl}/auth/me`, { credentials: "include" });
      if (meRes.ok) {
        const me = await meRes.json();
        user = extractUser(me) ?? me;
      }
    } catch {}
  }

  // Persister en local pour garder la session côté front même si /auth/me fluctue
  try {
    if (user) localStorage.setItem("authUser", JSON.stringify(user));
    if (token) localStorage.setItem("authToken", token);
  } catch {}

  if (!user) {
    return { success: false, message: "Utilisateur non retourné par l'API" };
  }

  return { success: true, user, token };
}

export async function checkAuth(token?: string): Promise<{ authenticated: boolean; user?: any }> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api/v1";
  const res = await fetch(`${baseUrl}/auth/me`, {
    headers,
    credentials: "include",
  });
  if (!res.ok) {
    // Fallback: try localStorage user if backend not available
    try {
      const cached = localStorage.getItem("authUser");
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
      const cached = localStorage.getItem("authUser");
      if (cached) return { authenticated: true, user: JSON.parse(cached) };
    } catch {}
    return { authenticated: false };
  }
  const user = extractUser(data) ?? data;
  return { authenticated: Boolean(user), user: user };
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
    localStorage.removeItem("authUser");
    document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  } catch (e) {
    // ignore
  }
}


