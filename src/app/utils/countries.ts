import { getApiBaseUrl } from "@/app/utils/api";
import type { Country } from "@/app/types/country";

export async function getCountries(): Promise<Country[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/countries`, { credentials: "include" });
  if (!res.ok) throw new Error(`Erreur HTTP: ${res.status}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.toLowerCase().includes("application/json")) throw new Error("Réponse non-JSON");
  const json = await res.json();
  return (json?.data ?? json) as Country[];
}


