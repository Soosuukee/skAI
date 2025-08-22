import { Location } from './location';

export interface Provider {
  providerId: number;         // Identifiant unique du provider
  firstName: string;          // Prénom
  lastName: string;           // Nom de famille
  email: string;              // Email de contact
  role: string;               // Rôle/titre professionnel
  locationId: number;         // Référence à la location/pays
  avatar: string;             // Chemin vers l'avatar
  bio?: string;               // Biographie (optionnelle)
  skills?: string[];          // Compétences (optionnelles)
  experience?: string;        // Années d'expérience (optionnel)
  languages?: string[];       // Langues parlées (optionnelles)
  socialLinks?: {             // Liens sociaux (optionnels)
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  createdAt: Date;            // Date de création du profil
  updatedAt?: Date;           // Date de dernière modification (optionnel)
}

// Interface étendue pour l'affichage avec slug calculé
export interface ProviderWithSlug extends Provider {
  slug: string;               // Slug calculé à partir du nom
}

// Interface étendue avec location complète
export interface ProviderWithLocation extends ProviderWithSlug {
  location: Location;         // Objet location complet
}
