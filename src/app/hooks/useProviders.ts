import { useState, useEffect } from 'react';
import { Provider } from '@/app/types/provider';
import { Job } from '@/app/types/job';

// Interface étendue pour inclure le job
export interface ProviderWithJob extends Provider {
  job?: Job;
}

export function useProviders() {
  const [providers, setProviders] = useState<ProviderWithJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/providers', {
          next: { revalidate: 3600 }, // Cache pendant 1 heure
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des providers');
        }

        const providersData: Provider[] = await response.json();

        // Récupérer les jobs pour chaque provider
        const providersWithJobs = await Promise.all(
          providersData.map(async (provider) => {
            try {
              const jobResponse = await fetch(`/api/providers/id/${provider.providerId}/job`);
              const jobData: Job | undefined = jobResponse.ok ? await jobResponse.json() : undefined;
              
              return {
                ...provider,
                job: jobData
              };
            } catch (error) {
              console.error(`Erreur lors de la récupération du job pour ${provider.firstName}:`, error);
              return {
                ...provider,
                job: undefined
              };
            }
          })
        );

        setProviders(providersWithJobs);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    }

    fetchProviders();
  }, []);

  return { 
    providers, 
    loading, 
    error 
  };
}
