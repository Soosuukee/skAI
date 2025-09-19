"use client";

import { useState, useEffect } from "react";
import { Article } from "@/app/types/article";
import { getApiBaseUrl } from "@/app/utils/api";

export const useProviderArticles = (providerSlug: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      if (!providerSlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const base = getApiBaseUrl();
        const response = await fetch(`${base}/providers/${providerSlug}/articles`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const json = await response.json();
        const data = json?.data ?? json;
        setArticles(Array.isArray(data) ? data as Article[] : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [providerSlug]);

  return { articles, loading, error };
};
