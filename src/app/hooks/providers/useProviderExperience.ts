import { useState, useEffect } from 'react';
import { Experience } from '@/app/types/experience';
import { getApiBaseUrl } from '@/app/utils/api';

// Cache simple pour éviter les requêtes répétées
const experienceCache = new Map<string, {
  data: Experience[];
  timestamp: number;
  ttl: number;
}>();

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes pour les expériences

export function useProviderExperience(providerSlug: string) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExperiences() {
      try {
        setLoading(true);
        setError(null);

        if (!providerSlug) {
          setExperiences([]);
          return;
        }

        // Vérifier le cache d'abord
        const cacheKey = `experiences-${providerSlug}`;
        const cached = experienceCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          setExperiences(cached.data);
          setLoading(false);
          return;
        }

        const apiBaseUrl = getApiBaseUrl();
        
        // Récupérer les expériences du provider
        const response = await fetch(`${apiBaseUrl}/providers/${providerSlug}/experiences`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Pas d'expériences trouvées, ce n'est pas une erreur
            setExperiences([]);
            return;
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        const experiencesData: Experience[] = responseData.data || responseData || [];

        setExperiences(experiencesData);

        // Mettre en cache les données
        experienceCache.set(cacheKey, {
          data: experiencesData,
          timestamp: Date.now(),
          ttl: CACHE_TTL
        });

      } catch (err) {
        console.error('Erreur lors du chargement des expériences:', err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des expériences");
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    }

    fetchExperiences();
  }, [providerSlug]);

  return { 
    experiences, 
    loading, 
    error 
  };
}
