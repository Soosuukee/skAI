import { useState, useEffect } from 'react';
import { Service } from '@/app/types/service';
import { getApiBaseUrl } from '@/app/utils/api';

// Cache simple pour éviter les requêtes répétées
const servicesCache = new Map<string, {
  data: Service[];
  timestamp: number;
  ttl: number;
}>();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes pour les services

export function useProviderServices(providerSlug: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        setError(null);

        if (!providerSlug) {
          setServices([]);
          return;
        }

        // Vérifier le cache d'abord
        const cacheKey = `services-${providerSlug}`;
        const cached = servicesCache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          setServices(cached.data);
          setLoading(false);
          return;
        }

        const apiBaseUrl = getApiBaseUrl();
        
        // Récupérer les services du provider
        const response = await fetch(`${apiBaseUrl}/providers/${providerSlug}/services`);
        
        if (!response.ok) {
          if (response.status === 404) {
            // Pas de services trouvés, ce n'est pas une erreur
            setServices([]);
            return;
          }
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();
        const servicesData = responseData.data || responseData || [];

        // Transformer les données de l'API vers le format Service
        const transformedServices: Service[] = servicesData.map((serviceData: any) => ({
          id: serviceData.id || serviceData.serviceId,
          providerId: serviceData.providerId,
          title: serviceData.title,
          summary: serviceData.summary || serviceData.description,
          slug: serviceData.slug || serviceData.title?.toLowerCase().replace(/\s+/g, '-'),
          isActive: serviceData.isActive !== undefined ? serviceData.isActive : true,
          isFeatured: serviceData.isFeatured || false,
          minPrice: serviceData.minPrice,
          maxPrice: serviceData.maxPrice,
          cover: serviceData.cover,
          createdAt: serviceData.createdAt,
          sections: serviceData.sections,
          tags: serviceData.tags
        }));

        setServices(transformedServices);

        // Mettre en cache les données
        servicesCache.set(cacheKey, {
          data: transformedServices,
          timestamp: Date.now(),
          ttl: CACHE_TTL
        });

      } catch (err) {
        console.error('Erreur lors du chargement des services:', err);
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des services");
        setServices([]);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, [providerSlug]);

  return { 
    services, 
    loading, 
    error 
  };
}
