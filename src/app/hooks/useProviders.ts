import { useState, useEffect } from 'react';
import { ProviderWithRelations } from '@/app/types/provider';
import { getAllProvidersWithDetails } from '@/app/utils/providerUtils';

export function useProviders() {
  const [providers, setProviders] = useState<ProviderWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        setLoading(true);
        setError(null);

        const providersData = await getAllProvidersWithDetails();
        setProviders(providersData || []);

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
