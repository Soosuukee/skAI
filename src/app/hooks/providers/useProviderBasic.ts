import { useState, useEffect } from "react";
import { Provider } from "@/app/types/provider";
import { getProviderBySlugWithDetails } from "@/app/utils/providerUtils";
import { Country } from "@/app/types/country";

const providerBasicCache = new Map<
  string,
  {
    data: any;
    timestamp: number;
    ttl: number;
  }
>();

const CACHE_TTL = 10 * 60 * 1000;

export function useProvider(slug: string) {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProviderBasic() {
      try {
        setLoading(true);
        setError(null);

        const cacheKey = `provider-basic-${slug}`;
        const cached = providerBasicCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          setProvider(cached.data);
          setLoading(false);
          return;
        }

        // Utiliser la fonction existante pour récupérer le provider
        const provider = await getProviderBySlugWithDetails(slug);
        
        if (!provider) {
          throw new Error("Provider not found");
        }
        
        console.log("=== DEBUG PROVIDER ===");
        console.log("Slug demandé:", slug);
        console.log("Provider complet:", provider);
        console.log("Type de provider:", typeof provider);
        console.log("Provider est null/undefined?", provider === null || provider === undefined);
        console.log("Provider firstName:", provider?.firstName);
        console.log("Provider lastName:", provider?.lastName);
        console.log("Clés du provider:", Object.keys(provider || {}));
        console.log("=== END DEBUG ===");

        setProvider(provider);

        // Mettre en cache les données
        providerBasicCache.set(cacheKey, {
          data: provider,
          timestamp: Date.now(),
          ttl: CACHE_TTL,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProviderBasic();
    }
  }, [slug]);

  return {
    provider,
    loading,
    error,
  };
}
