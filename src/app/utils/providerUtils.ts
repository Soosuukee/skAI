import { Provider } from "@/app/types/provider";
import { Job } from "@/app/types/job";
import { Country } from "@/app/types/country";
import { Language } from "@/app/types/language";
import { SoftSkill } from "@/app/types/softskill";
import { HardSkill } from "@/app/types/hardskill";
import { getApiBaseUrl } from "@/app/utils/api";

// URL de base de l'API (externe)
const API_BASE_URL = getApiBaseUrl();

// Type enrichi utilisé par l'UI - maintenant Provider contient déjà toutes les relations

// Helper pour gérer { data: ... } ou retour direct
function extractData<T = any>(json: any): T {
  if (!json) return json as T;
  if (json.data !== undefined) return json.data as T;
  return json as T;
}

/**
 * Récupère tous les providers depuis l'API
 */
export async function getAllProviders(): Promise<Provider[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers`);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const json = await response.json();
    const data = extractData<Provider[]>(json);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur lors de la récupération des providers:", error);
    return [];
  }
}

function buildAvatarUrl(profilePicture?: string) {
  if (!profilePicture) return undefined;
  if (/^https?:\/\//.test(profilePicture)) return profilePicture;
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
    const origin = new URL(apiBase).origin; // e.g. http://localhost:8080
    if (profilePicture.startsWith("/")) return `${origin}${profilePicture}`;
    return `${apiBase}${
      profilePicture.startsWith("/") ? "" : "/"
    }${profilePicture}`;
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
        // Les données job et country sont déjà incluses dans la réponse API
        const job = provider.job;
        const country = provider.country;
        const languages = provider.languages || [];
        return {
          ...provider,
          avatar: buildAvatarUrl((provider as any).profilePicture),
          job,
          languages,
          country,
        } as Provider;
      })
    );
    return providersWithDetails;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des providers avec détails:",
      error
    );
    return [];
  }
}

/**
 * Trouve un provider par son slug
 */
export async function getProviderBySlug(
  slug: string
): Promise<Provider | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${slug}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const json = await response.json();
    return extractData<Provider>(json);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du provider par slug:",
      error
    );
    return undefined;
  }
}

/**
 * Récupère toutes les informations d'un provider par son slug
 * (provider + relations: job, languages, etc.)
 */
export async function getProviderAllBySlug(
  slug: string
): Promise<Provider | undefined> {
  try {
    const provider = await getProviderBySlug(slug);
    if (!provider) return undefined;
    // Les données job et country sont déjà incluses dans la réponse API
    const job = provider.job;
    const country = provider.country;
    const languages = provider.languages || [];

    return {
      ...provider,
      avatar: buildAvatarUrl((provider as any).profilePicture) || provider.avatar,
      job,
      languages,
      country,
    } as Provider;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération complète du provider par slug:",
      error
    );
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
    // Les données job et country sont déjà incluses dans la réponse API
    const job = provider.job;
    const country = provider.country;
    const languages = provider.languages || [];

    return {
      ...provider,
      avatar: buildAvatarUrl((provider as any).profilePicture),
      job,
      languages,
      country,
    } as Provider;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du provider avec détails:",
      error
    );
    return undefined;
  }
}

/**
 * Trouve un provider par son ID
 */
export async function getProviderById(
  providerId: number
): Promise<Provider | undefined> {
  try {
    const response = await fetch(`${API_BASE_URL}/providers/${providerId}`);
    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    const json = await response.json();
    return extractData<Provider>(json);
  } catch (error) {
    console.error("Erreur lors de la récupération du provider par ID:", error);
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
    // Les données job et country sont déjà incluses dans la réponse API
    const job = provider.job;
    const country = provider.country;
    const languages = provider.languages || [];
    return {
      ...provider,
      job,
      languages,
      country,
    } as Provider;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du provider par détails:",
      error
    );
    return undefined;
  }
}

/**
 * Génère les paramètres statiques pour les pages de providers
 */
export async function generateProviderStaticParams() {
  try {
    const providers = await getAllProviders();

    return providers.map((provider) => ({
      slug: provider.slug,
    }));
  } catch (error) {
    console.error(
      "Erreur lors de la génération des paramètres statiques:",
      error
    );
    return [];
  }
}
