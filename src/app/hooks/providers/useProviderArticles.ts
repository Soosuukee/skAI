import { useState, useEffect } from 'react';
import { getApiBaseUrl } from '@/app/utils/api';

// Cache simple pour éviter les requêtes répétées
const articlesCache = new Map<string, {
  data: any[];
  timestamp: number;
  ttl: number;
}>();

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes pour les articles

export function useProviderArticles(providerSlug: string) {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError(null);

        if (!providerSlug) {
          setArticles([]);
          return;
        }

        // Vérifier le cache d'abord
        const cacheKey = `articles-${providerSlug}`;
        const cached = articlesCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          setArticles(cached.data);
          setLoading(false);
          return;
        }

        const apiBaseUrl = getApiBaseUrl();
        
        // Récupérer les articles du provider
        const response = await fetch(`${apiBaseUrl}/providers/${providerSlug}/articles`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Pas d'articles trouvés, ce n'est pas une erreur
            setArticles([]);
            return;
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        const articlesData = responseData.data || responseData || [];

        setArticles(articlesData);

        // Mettre en cache les données
        articlesCache.set(cacheKey, {
          data: articlesData,
          timestamp: Date.now(),
          ttl: CACHE_TTL
        });

      } catch (err) {
        console.error('Erreur lors du chargement des articles:', err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des articles");
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [providerSlug]);

  return { 
    articles, 
    loading, 
    error 
  };
}
