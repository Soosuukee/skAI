import { Service, ServiceWithSlug } from '@/app/types/service';

// URL de base de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Récupère tous les services depuis l'API
 */
export async function getAllServices(): Promise<ServiceWithSlug[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/services`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const services: Service[] = await response.json();
    
    return services.map(service => ({
      ...service,
      slug: service.slug || service.title.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return [];
  }
}

/**
 * Récupère les services d'un provider spécifique depuis l'API
 */
export async function getServicesByProvider(providerId: number): Promise<ServiceWithSlug[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const services: Service[] = await response.json();
    
    return services.map(service => ({
      ...service,
      slug: service.slug || service.title.toLowerCase().replace(/\s+/g, '-')
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des services du provider:', error);
    return [];
  }
}

/**
 * Trouve un service par son slug depuis l'API
 */
export async function getServiceBySlug(slug: string): Promise<ServiceWithSlug | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/services/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const service: Service = await response.json();
    
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
 * Trouve un service par son slug et son provider depuis l'API
 */
export async function getServiceBySlugAndProvider(serviceSlug: string, providerId: number): Promise<ServiceWithSlug | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}/services/${serviceSlug}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const service: Service = await response.json();
    
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
