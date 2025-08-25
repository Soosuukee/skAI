import { useState, useEffect } from 'react';
import { ProviderWithDetails } from '@/app/types/provider';

export function useProviderWithDetails(slug: string) {
  const [provider, setProvider] = useState<ProviderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviderData() {
      try {
        setLoading(true);
        setError(null);

        // Un seul appel API qui retourne toutes les données
        const response = await fetch(`/api/providers/${slug}`);

        if (!response.ok) {
          throw new Error('Provider not found');
        }

        const providerData: ProviderWithDetails = await response.json();
        setProvider(providerData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProviderData();
    }
  }, [slug]);

  return { 
    provider, 
    loading, 
    error 
  };
}
