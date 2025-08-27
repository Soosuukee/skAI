"use client";

import { useState, useEffect } from "react";
import { Article } from "@/app/types/article";

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

        const response = await fetch(`/api/providers/${providerSlug}/articles`);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data);
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
