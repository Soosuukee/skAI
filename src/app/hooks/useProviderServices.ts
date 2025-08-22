"use client";

import { useState, useEffect } from "react";
import servicesData from "@/data/services.json";
import providersData from "@/data/providers.json";

export interface Service {
  service_id: number;
  provider_id: number;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  min_price: number | null;
  max_price: number | null;
}

export const useProviderServices = (providerSlug: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = () => {
      try {
        setLoading(true);
        setError(null);

        // Trouver le provider par son slug
        const provider = providersData.find(p => p.slug === providerSlug);
        
        if (!provider) {
          throw new Error("Provider non trouvé");
        }

        // Filtrer les services pour ce provider
        const providerServices = servicesData.filter(
          (service) => service.provider_id === provider.provider_id
        );

        setServices(providerServices);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des services");
      } finally {
        setLoading(false);
      }
    };

    if (providerSlug) {
      fetchServices();
    }
  }, [providerSlug]);

  return { services, loading, error };
};
