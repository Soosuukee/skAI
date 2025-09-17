export interface Provider {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string | null;
  joinedAt: string;
  slug: string;
  jobId?: number;
  countryId?: number;
  languages?: string[];
  city: string;
  state?: string | null;
  postalCode?: string | null;
  address?: string | null;
  role: "provider";

  job?: string;
  country?: string;
  hardSkills?: string[];
  softSkills?: string[];
}

export interface ProviderFilters {
  skills?: number[];
  location?: string; // Zone géographique
  languages?: string[]; // Langues requises
  search?: string; // Recherche textuelle
}

// Interface pour le tri des prestataires
export interface ProviderSortOptions {
  field: "firstName" | "lastName" | "location" | "createdAt";
  direction: "asc" | "desc";
}

// Interface pour les statistiques des prestataires
export interface ProviderStats {
  totalProviders: number; // Nombre total de prestataires
  topSkills: string[]; // Compétences les plus populaires
  topLocations: string[]; // Localisations les plus populaires
}
