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
  role: string;               // Rôle/titre professionnel actuel
  job: string;                // Métier principal
  email: string;              // Email de contact
  avatar: string;             // Chemin vers l'avatar
  location: string;           // Fuseau horaire/zone géographique
  languages: number[];        // IDs des langues parlées
  bio?: string;               // Biographie (optionnelle)
  summary?: string;           // Résumé professionnel
  hourlyRate?: number;        // Tarif horaire (optionnel)
  availability?: string;      // Disponibilité (optionnel)
  timezone?: string;          // Fuseau horaire (optionnel)
  website?: string;           // Site web personnel (optionnel)
  isActive: boolean;          // Si le prestataire est actif
  isVerified: boolean;        // Si le profil est vérifié
  rating?: number;            // Note moyenne (optionnel)
  reviewCount?: number;       // Nombre d'avis (optionnel)
  completedProjects?: number; // Nombre de projets terminés (optionnel)
  responseTime?: string;      // Temps de réponse moyen (optionnel)
  createdAt: string;          // Date de création (format ISO)
  updatedAt?: string;         // Date de dernière modification (format ISO)
}

// Interface étendue avec toutes les relations
export interface ProviderWithDetails extends Provider {
  skills: number[];           // IDs des compétences
  languages: number[];        // IDs des langues parlées
  experiences: Experience[];  // Expériences professionnelles
  education: Education[];     // Formation/éducation
  socialLinks: SocialLink[];  // Liens sociaux
  services: Service[];        // Services proposés
  articles: Article[];        // Articles publiés
  jobDetails: Job;            // Détails du métier
}

// Interface pour l'affichage complet du profil
export interface ProviderProfile extends ProviderWithDetails {
  locationDetails: Location;  // Détails de la localisation
  skillDetails: Skill[];      // Détails des compétences
  averageRating: number;      // Note moyenne calculée
  totalReviews: number;       // Nombre total d'avis
  responseRate: number;       // Taux de réponse (%)
  completionRate: number;     // Taux de réussite (%)
}

// Interface pour les options de filtrage des prestataires
export interface ProviderFilters {
  skills?: number[];          // IDs des compétences recherchées
  location?: string;          // Zone géographique
  languages?: string[];       // Langues requises
  hourlyRate?: {              // Fourchette de tarif
    min?: number;
    max?: number;
  };
  availability?: string;      // Disponibilité requise
  rating?: number;            // Note minimum
  isVerified?: boolean;       // Profil vérifié uniquement
  isActive?: boolean;         // Prestataires actifs uniquement
  search?: string;            // Recherche textuelle
}

// Interface pour le tri des prestataires
export interface ProviderSortOptions {
  field: 'rating' | 'hourlyRate' | 'completedProjects' | 'responseTime' | 'createdAt';
  direction: 'asc' | 'desc';
}

// Interface pour les statistiques des prestataires
export interface ProviderStats {
  totalProviders: number;     // Nombre total de prestataires
  activeProviders: number;    // Nombre de prestataires actifs
  verifiedProviders: number;  // Nombre de prestataires vérifiés
  averageRating: number;      // Note moyenne globale
  topSkills: string[];        // Compétences les plus populaires
  topLocations: string[];     // Localisations les plus populaires
}
