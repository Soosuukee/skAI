import { useState, useEffect } from 'react';
import { Education } from '@/app/types/education';
import { getApiBaseUrl } from '@/app/utils/api';

// Cache simple pour éviter les requêtes répétées
const educationCache = new Map<string, {
  data: Education[];
  timestamp: number;
  ttl: number;
}>();

const CACHE_TTL = 15 * 60 * 1000; // 15 minutes pour l'éducation

export function useProviderEducation(providerSlug: string) {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEducations() {
      try {
        setLoading(true);
        setError(null);

        if (!providerSlug) {
          setEducations([]);
          return;
        }

        // Vérifier le cache d'abord
        const cacheKey = `educations-${providerSlug}`;
        const cached = educationCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          setEducations(cached.data);
          setLoading(false);
          return;
        }

        const apiBaseUrl = getApiBaseUrl();
        
        // Récupérer l'éducation du provider
        const response = await fetch(`${apiBaseUrl}/providers/${providerSlug}/educations`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Pas d'éducation trouvée, ce n'est pas une erreur
            setEducations([]);
            return;
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        const educationsData: Education[] = responseData.data || responseData || [];

        setEducations(educationsData);

        // Mettre en cache les données
        educationCache.set(cacheKey, {
          data: educationsData,
          timestamp: Date.now(),
          ttl: CACHE_TTL
        });

      } catch (err) {
        console.error('Erreur lors du chargement de l\'éducation:', err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'éducation");
        setEducations([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEducations();
  }, [providerSlug]);

  return { 
    educations, 
    loading, 
    error 
  };
}
