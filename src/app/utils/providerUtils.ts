import { Provider, ProviderWithSlug, ProviderWithLocation } from '@/app/types/provider';
import { slugifyProvider, findProviderBySlug, generateUniqueProviderSlug } from './providerSlugifyService';
import { getLocationById } from './locationUtils';
import providers from '@/data/providers.json';

/**
 * Transforme les données JSON existantes vers le nouveau format Provider
 */
function transformProviderData(jsonProvider: any): Provider {
  return {
    providerId: jsonProvider.provider_id,
    firstName: jsonProvider.firstName,
    lastName: jsonProvider.lastName,
    email: jsonProvider.email,
    role: jsonProvider.role,
    locationId: 2, // Par défaut États-Unis pour l'instant
    avatar: jsonProvider.avatar,
    bio: jsonProvider.job, // Utilise job comme bio temporairement
    skills: [], // À remplir plus tard
    experience: "", // À remplir plus tard
    languages: jsonProvider.languages || [],
    socialLinks: {}, // À remplir plus tard
    createdAt: new Date(), // À remplir plus tard
    updatedAt: new Date() // À remplir plus tard
  };
}

/**
 * Récupère tous les providers avec leurs slugs calculés
 */
export function getAllProviders(): ProviderWithSlug[] {
  const providersWithSlugs: ProviderWithSlug[] = [];
  const providersArray = providers.map(transformProviderData);
  
  providersArray.forEach(provider => {
    const slug = generateUniqueProviderSlug(
      providersArray.slice(0, providersArray.indexOf(provider)), // Providers déjà traités
      provider.firstName,
      provider.lastName
    );
    
    providersWithSlugs.push({
      ...provider,
      slug
    });
  });
  
  return providersWithSlugs;
}

/**
 * Trouve un provider par son slug
 */
export function getProviderBySlug(slug: string): ProviderWithSlug | undefined {
  const allProviders = getAllProviders();
  return allProviders.find(provider => provider.slug === slug);
}

/**
 * Trouve un provider par son ID
 */
export function getProviderById(providerId: number): ProviderWithSlug | undefined {
  const allProviders = getAllProviders();
  return allProviders.find(provider => provider.providerId === providerId);
}

/**
 * Récupère tous les providers avec leurs locations complètes
 */
export function getAllProvidersWithLocation(): ProviderWithLocation[] {
  const allProviders = getAllProviders();
  
  return allProviders.map(provider => {
    const location = getLocationById(provider.locationId);
    if (!location) {
      throw new Error(`Location not found for provider ${provider.providerId}`);
    }
    
    return {
      ...provider,
      location
    };
  });
}

/**
 * Trouve un provider par son slug avec sa location complète
 */
export function getProviderBySlugWithLocation(slug: string): ProviderWithLocation | undefined {
  const allProviders = getAllProvidersWithLocation();
  return allProviders.find(provider => provider.slug === slug);
}

/**
 * Génère les paramètres statiques pour les pages de providers
 */
export function generateProviderStaticParams() {
  const allProviders = getAllProviders();
  
  return allProviders.map(provider => ({
    slug: provider.slug
  }));
}
