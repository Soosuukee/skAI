import { useState, useEffect } from "react";
import { Provider } from "@/app/types/provider";
import { Job } from "@/app/types/job";
import { getApiBaseUrl } from "@/app/utils/api";

const providerBasicCache = new Map<
  string,
  {
    data: any;
    timestamp: number;
    ttl: number;
  }
>();

const CACHE_TTL = 10 * 60 * 1000;
// Interface pour les données de base du provider (étend Provider)
export interface ProviderBasic extends Omit<Provider, "role" | "job"> {
  role: string;
  avatar: string;
  languages: string[];
  job?: Job;
  location?: {
    name: string;
    city: string;
    country?: string;
  };
}

export function useProviderBasic(slug: string) {
  const [provider, setProvider] = useState<ProviderBasic | null>(null);
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

        const apiBaseUrl = getApiBaseUrl();

        // Récupérer seulement le provider et son job
        const providerResponse = await fetch(`${apiBaseUrl}/providers/${slug}`);

        if (!providerResponse.ok) {
          throw new Error("Provider not found");
        }

        const providerResponseData = await providerResponse.json();
        const providerData = providerResponseData.data;

        // Récupérer le job avec l'ID du provider
        const jobId = providerData.jobId;
        let jobData: Job | undefined;

        if (jobId) {
          const jobResponse = await fetch(`${apiBaseUrl}/jobs/${jobId}`);
          jobData = jobResponse.ok ? await jobResponse.json() : undefined;
        }

        // Créer l'objet provider de base
        const providerBasic: ProviderBasic = {
          id: providerData.id,
          slug: providerData.slug,
          firstName: providerData.firstName,
          lastName: providerData.lastName,
          email: providerData.email,
          profilePicture: providerData.profilePicture,
          joinedAt: providerData.joinedAt,
          jobId: providerData.jobId,
          countryId: providerData.countryId,
          city: providerData.city,
          state: providerData.state,
          postalCode: providerData.postalCode,
          address: providerData.address,
          role: jobData?.title || "Expert IA",
          avatar: providerData.profilePicture,
          languages: providerData.languages || [],
          job: jobData,
          location: providerData.location,
        };

        setProvider(providerBasic);

        // Mettre en cache les données
        providerBasicCache.set(cacheKey, {
          data: providerBasic,
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
