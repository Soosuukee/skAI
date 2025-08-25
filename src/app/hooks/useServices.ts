import { useState, useEffect } from 'react';
import { ServiceWithSlug } from '@/app/types/service';
import { getServicesByProvider, getServiceBySlug } from '@/app/utils/serviceUtils';
import providers from '@/data/providers.json';

export function useProviderServices(providerSlug: string) {
  const [services, setServices] = useState<ServiceWithSlug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        // Trouver le provider par son slug
        const provider = providers.find(p => p.slug === providerSlug);
        if (!provider) {
          setError('Provider non trouvé');
          setLoading(false);
          return;
        }

        // Récupérer les services du provider
        const providerServices = await getServicesByProvider(provider.provider_id);
        setServices(providerServices);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des services');
        console.error('Erreur useProviderServices:', err);
      } finally {
        setLoading(false);
      }
    };

    if (providerSlug) {
      loadServices();
    }
  }, [providerSlug]);

  return { services, loading, error };
}

export function useService(serviceSlug: string) {
  const [service, setService] = useState<ServiceWithSlug | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadService = async () => {
      try {
        const foundService = await getServiceBySlug(serviceSlug);
        if (!foundService) {
          setError('Service non trouvé');
        } else {
          setService(foundService);
          setError(null);
        }
      } catch (err) {
        setError('Erreur lors du chargement du service');
        console.error('Erreur useService:', err);
      } finally {
        setLoading(false);
      }
    };

    if (serviceSlug) {
      loadService();
    }
  }, [serviceSlug]);

  return { service, loading, error };
}
