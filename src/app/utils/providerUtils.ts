import { Provider, ProviderWithRelations } from '@/app/types/provider';
import { Job } from '@/app/types/job';
import { Language } from '@/app/types/language';
import { Country } from '@/app/types/country';

// URL de base de l'API (externe) — utilise la variable d'environnement si fournie
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';

/**
 * Récupère tous les providers depuis l'API
 */
export async function getAllProviders(): Promise<Provider[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des providers:', error);
    return [];
  }
}

function buildAvatarUrl(profilePicture?: string) {
  if (!profilePicture) return undefined;
  if (/^https?:\/\//.test(profilePicture)) return profilePicture;
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
    const origin = new URL(apiBase).origin; // e.g. http://localhost:8080
    if (profilePicture.startsWith('/')) return `${origin}${profilePicture}`;
    return `${apiBase}${profilePicture.startsWith('/') ? '' : '/'}${profilePicture}`;
  } catch (e) {
    // fallback
    return profilePicture;
  }
}

/**
 * Récupère tous les providers avec leurs jobs et langues
 */
export async function getAllProvidersWithDetails() {
  try {
    const providers = await getAllProviders();
    
    const providersWithDetails = await Promise.all(
      providers.map(async (provider) => {
        const [jobResponse, languagesResponse, countryResponse] = await Promise.all([
          // Job details come from the jobs endpoint
          fetch(`${API_BASE_URL}/jobs/${provider.jobId}`),
          fetch(`${API_BASE_URL}/providers/${provider.id}/languages`),
          fetch(`${API_BASE_URL}/countries/${provider.countryId}`)
        ]);
        
        const job = jobResponse.ok ? await jobResponse.json() : undefined;
        const languages = languagesResponse.ok ? await languagesResponse.json() : [];
        const country = countryResponse.ok ? await countryResponse.json() : undefined;
        return {
          ...provider,
          avatar: buildAvatarUrl((provider as any).profilePicture),
          job,
          languages,
          country
        } as ProviderWithRelations;
      })
    );
    
    return providersWithDetails;
  } catch (error) {
    console.error('Erreur lors de la récupération des providers avec détails:', error);
    return [];
  }
}

/**
 * Trouve un provider par son slug
 */
export async function getProviderBySlug(slug: string): Promise<Provider | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/slug/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération du provider par slug:', error);
    return undefined;
  }
}

/**
 * Récupère toutes les informations d'un provider par son slug
 * (provider + relations: job, languages, etc.)
 */
export async function getProviderAllBySlug(slug: string): Promise<ProviderWithRelations | undefined> {
  try {
    const provider = await getProviderBySlug(slug);
    if (!provider) return undefined;

    const [jobResponse, languagesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/jobs/${provider.jobId}`),
      fetch(`${API_BASE_URL}/providers/${provider.id}/languages`),
    ]);

    const job = jobResponse.ok ? await jobResponse.json() : undefined;
    const languages = languagesResponse.ok ? await languagesResponse.json() : [];

    return {
      ...provider,
      job,
      languages,
    } as ProviderWithRelations;
  } catch (error) {
    console.error('Erreur lors de la récupération complète du provider par slug:', error);
    return undefined;
  }
}

/**
 * Trouve un provider par son slug avec ses détails (job et langues)
 */
export async function getProviderBySlugWithDetails(slug: string) {
  try {
    const provider = await getProviderBySlug(slug);
    if (!provider) return undefined;
    
    const [jobResponse, languagesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/jobs/${provider.jobId}`),
      fetch(`${API_BASE_URL}/providers/${provider.id}/languages`)
    ]);
    
    const job = jobResponse.ok ? await jobResponse.json() : undefined;
    const languages = languagesResponse.ok ? await languagesResponse.json() : [];

    return {
      ...provider,
      avatar: buildAvatarUrl((provider as any).profilePicture),
      job,
      languages
    } as ProviderWithRelations;
  } catch (error) {
    console.error('Erreur lors de la récupération du provider avec détails:', error);
    return undefined;
  }
}

/**
 * Trouve un provider par son ID
 */
export async function getProviderById(providerId: number): Promise<Provider | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération du provider par ID:', error);
    return undefined;
  }
}

/**
 * Trouve un provider par son ID avec ses détails (job et langues)
 */
export async function getProviderByIdWithDetails(providerId: number) {
  try {
    const provider = await getProviderById(providerId);
    if (!provider) return undefined;
    
    const [jobResponse, languagesResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/jobs/${provider?.jobId ?? ''}`),
      fetch(`${API_BASE_URL}/providers/${providerId}/languages`)
    ]);
    
    const job = jobResponse.ok ? await jobResponse.json() : undefined;
    const languages = languagesResponse.ok ? await languagesResponse.json() : [];
    
    return {
      ...provider,
      job,
      languages
    } as ProviderWithRelations;
  } catch (error) {
    console.error('Erreur lors de la récupération du provider avec détails:', error);
    return undefined;
  }
}

/**
 * Génère les paramètres statiques pour les pages de providers
 */
export async function generateProviderStaticParams() {
  try {
    const providers = await getAllProviders();
    
    return providers.map(provider => ({
      slug: provider.slug
    }));
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques:', error);
    return [];
  }
}
