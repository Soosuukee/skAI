import { getApiBaseUrl } from "@/app/utils/api";
import type { Language } from "@/app/types/language";

export async function getLanguages(): Promise<Language[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/languages`, { credentials: "include" });
  if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("application/json")) throw new Error("Réponse non-JSON");
  const json = await res.json();
  return (json?.data ?? json) as Language[];
}


