"use client";

import { useEffect, useState } from "react";
import type { Provider } from "@/app/types/provider";
import { getApiBaseUrl } from "@/app/utils/api";

export function useProvider(slug: string) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const abort = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const base = getApiBaseUrl();
        const res = await fetch(`${base}/providers/${slug}`, {
          credentials: "include",
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = (json?.data ?? json) as Provider;
        setProvider(data);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => abort.abort();
  }, [slug]);

  return { provider, loading, error };
}


