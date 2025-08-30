import { useState, useEffect } from 'react';
import { Service } from '@/app/types/service';
import { getServicesByProviderSlug, getServiceBySlug } from '@/app/utils/serviceUtils';

export function useProviderServices(providerSlug: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const providerServices = await getServicesByProviderSlug(providerSlug);
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
  const [service, setService] = useState<Service | null>(null);
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
