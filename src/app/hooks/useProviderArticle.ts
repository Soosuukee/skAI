"use client";

import { useState, useEffect } from "react";
import { Article } from "@/app/types/article";

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

        const response = await fetch(`/api/providers/${providerSlug}/articles/${articleSlug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Article non trouvé");
          }
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setArticle(data);
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
