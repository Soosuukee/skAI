import providers from '@/data/providers.json';
import services from '@/data/services.json';

export interface ServiceWithProvider {
  service_id: number;
  provider_id: number;
  slug: string;
  title: string;
  content: string;
  created_at: string;
  min_price: number | null;
  max_price: number | null;
  provider: {
    firstName: string;
    lastName: string;
    slug: string;
    avatar: string;
    role: string;
  };
}

export function getAllServicesWithProviders(): ServiceWithProvider[] {
  return services.map(service => {
    const provider = providers.find(p => p.provider_id === service.provider_id);
    
    if (!provider) {
      throw new Error(`Provider not found for service ${service.service_id}`);
    }

    return {
      ...service,
      provider: {
        firstName: provider.firstName,
        lastName: provider.lastName,
        slug: provider.slug,
        avatar: provider.avatar,
        role: provider.role,
      }
    };
  });
}

export function getServicesByProvider(providerSlug: string): ServiceWithProvider[] {
  const provider = providers.find(p => p.slug === providerSlug);
  
  if (!provider) {
    return [];
  }

  return services
    .filter(service => service.provider_id === provider.provider_id)
    .map(service => ({
      ...service,
      provider: {
        firstName: provider.firstName,
        lastName: provider.lastName,
        slug: provider.slug,
        avatar: provider.avatar,
        role: provider.role,
      }
    }));
}
