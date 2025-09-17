import { Service } from '@/app/types/service';
import { getApiBaseUrl } from '@/app/utils/api';
const API_BASE_URL = getApiBaseUrl();

function buildAbsoluteImageUrl(url?: string): string | undefined {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  try {
    const origin = new URL(API_BASE_URL).origin; // e.g. http://localhost:8080
    return url.startsWith('/')
      ? `${origin}${url}`
      : `${API_BASE_URL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
  } catch {
    return url;
  }
}

async function parseJsonSafe<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    const text = await response.text();
    throw new SyntaxError(`Non-JSON response (${response.status}): ${text.slice(0, 200)}`);
  }
  return (await response.json()) as T;
}

/**
 * Récupère tous les services depuis l'API
 */
export async function getAllServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/services`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const json = await parseJsonSafe<{ success: boolean; data: Service[] }>(response);
    return json.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return [];
  }
}

/**
 * Récupère les services d'un provider spécifique depuis l'API
 */
export async function getServicesByProvider(providerId: number): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const srvJson = await parseJsonSafe<{ success: boolean; data: Service[] }>(response);
    return srvJson.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des services du provider:', error);
    return [];
  }
}

/**
 * Récupère les services d'un provider (par slug) depuis l'API
 */
export async function getServicesByProviderSlug(providerSlug: string): Promise<Service[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerSlug}/services`, { credentials: 'include' });
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const services: Service[] = await parseJsonSafe<Service[]>(response);
    return services.map((service) => ({
      ...service,
      slug: service.slug || service.title.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des services du provider (slug):', error);
    return [];
  }
}

/**
 * Récupère un service par son slug depuis l'API
 */
export async function getServiceBySlug(slug: string): Promise<Service | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${slug}`, { credentials: 'include' });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const json = await parseJsonSafe<{ success: boolean; data: Service }>(response);
    const service = json.data;
    
    return {
      ...service,
      slug: service.slug || service.title.toLowerCase().replace(/\s+/g, '-')
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du service par slug:', error);
    return undefined;
  }
}

/**
 * Récupère un service par son slug et son provider depuis l'API
 */
export async function getServiceBySlugAndProvider(serviceSlug: string, providerId: number): Promise<Service | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services/${serviceSlug}`, { credentials: 'include' });
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const json = await parseJsonSafe<{ success: boolean; data: Service }>(response);
    const service = json.data;
    
    return {
      ...service,
      slug: service.slug || service.title.toLowerCase().replace(/\s+/g, '-')
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du service par slug et provider:', error);
    return undefined;
  }
}

/**
 * Génère les paramètres statiques pour les pages de services
 */
export async function generateServiceStaticParams() {
  try {
    const services = await getAllServices();
    
    return services.map(service => ({
      slug: service.slug
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques des services:', error);
    return [];
  }
}

/**
 * Génère les paramètres statiques pour les pages de services par provider
 */
export async function generateServiceStaticParamsByProvider(providerId: number) {
  try {
    const services = await getServicesByProvider(providerId);
    
    return services.map(service => ({
      serviceSlug: service.slug
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques des services par provider:', error);
    return [];
  }
}

/**
 * Récupère tous les services avec les informations des providers
 */
export async function getAllServicesWithProviders() {
  try {
    const servicesResponse = await fetch(`${API_BASE_URL}/services`, { credentials: 'include' });
    if (!servicesResponse.ok) {
      throw new Error(`Erreur HTTP: ${servicesResponse.status}`);
    }
    const srvJson = await parseJsonSafe<{ success: boolean; data: any[] }>(servicesResponse);
    const services = srvJson.data;

    const providersResponse = await fetch(`${API_BASE_URL}/providers`, { credentials: 'include' });
    if (!providersResponse.ok) {
      throw new Error(`Erreur HTTP: ${providersResponse.status}`);
    }
    const provJson = await parseJsonSafe<{ success: boolean; data: any[] }>(providersResponse);
    const providers = provJson.data;

    // Associer chaque service avec son provider (API renvoie id et profilePicture)
    const servicesWithProviders = services.map((service) => {
      const provider = providers.find((p: any) => (p.id ?? p.providerId) === service.providerId);
      return {
        ...service,
        cover: buildAbsoluteImageUrl((service as any).cover) || (service as any).cover,
        provider: provider
          ? {
              firstName: provider.firstName,
              lastName: provider.lastName,
              avatar: buildAbsoluteImageUrl(provider.profilePicture || provider.avatar) || '/images/avatar.jpg',
              slug: provider.slug,
            }
          : {
              firstName: 'Unknown',
              lastName: 'Provider',
              avatar: '/images/avatar.jpg',
              slug: 'unknown',
            },
      };
    });

    return servicesWithProviders;
  } catch (error) {
    console.error('Erreur lors de la récupération des services avec providers:', error);
    return [];
  }
}

