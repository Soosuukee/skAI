"use client";

import { useState, useEffect } from "react";
import { Article } from "@/app/types/article";
import { getApiBaseUrl } from "@/app/utils/api";

export const useProviderArticle = (providerSlug: string, articleSlug: string) => {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!providerSlug || !articleSlug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const base = getApiBaseUrl();
        const response = await fetch(`${base}/providers/${providerSlug}/articles/${articleSlug}`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Article non trouvé");
          }
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const json = await response.json();
        const data = json?.data ?? json;
        setArticle((data || null) as Article | null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [providerSlug, articleSlug]);

  return { article, loading, error };
};
