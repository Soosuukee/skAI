import { Location } from './location';
import { Skill } from './skill';
import { Job } from './job';
import { SocialLink } from './socialLink';
import { Service } from './service';
import { Article } from './article';
import { Experience } from './experience';
import { Education } from './education';
import { Language } from './language';

export interface Provider {
  providerId: number;         // Identifiant unique du prestataire
  slug: string;               // Slug pour l'URL
  firstName: string;          // Prénom
  lastName: string;           // Nom de famille
  email: string;              // Email de contact
  avatar: string;             // Chemin vers l'avatar
  location: Location;           // Localisation géographique
  createdAt: string;          // Date de création (format ISO)
}

// Interface étendue avec toutes les relations
export interface ProviderWithDetails extends Provider {
  skills: Skill[];           // IDs des compétences
  experiences: Experience[];  // Expériences professionnelles
  education: Education[];     // Formation/éducation
  socialLinks: SocialLink[];  // Liens sociaux
  services: Service[];        // Services proposés
  articles: Article[];        // Articles publiés
  job: Job;            // Détails du métier
  languages: Language[];        // Langues parlées
}

// Interface pour l'affichage complet du profil
// (Supprimé) ProviderProfile: non utilisé et non souhaité

// Interface pour les options de filtrage des prestataires
export interface ProviderFilters {
  skills?: number[];          // IDs des compétences recherchées
  location?: string;          // Zone géographique
  languages?: string[];       // Langues requises
  search?: string;            // Recherche textuelle
}

// Interface pour le tri des prestataires
export interface ProviderSortOptions {
  field: 'firstName' | 'lastName' | 'location' | 'createdAt';
  direction: 'asc' | 'desc';
}

// Interface pour les statistiques des prestataires
export interface ProviderStats {
  totalProviders: number;     // Nombre total de prestataires
  topSkills: string[];        // Compétences les plus populaires
  topLocations: string[];     // Localisations les plus populaires
}
