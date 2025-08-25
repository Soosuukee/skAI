import { ServiceSection, ServiceSectionWithContentAndImages } from './serviceSection';

export interface Service {
  serviceId: number;          // Identifiant unique du service
  providerId: number;         // Référence au prestataire
  title: string;              // Titre du service
  description: string;        // Description du service
  slug: string;               // Slug du service
  isActive: boolean;          // Si le service est actif
  isFeatured: boolean;        // Si le service est mis en avant
  minPrice: number | null;    // Prix minimum (peut être null)
  maxPrice: number | null;    // Prix maximum (peut être null)
  estimatedDuration: string;  // Durée estimée (en texte, ex: "2 heures", "3-5 jours")
  availability: string;       // Disponibilité pour ce service
  responseTime: string;       // Temps de réponse pour ce service
  rating?: number;            // Note spécifique pour ce service
  reviewCount?: number;       // Nombre d'avis pour ce service
  completedProjects?: number; // Nombre de projets terminés pour ce service
  createdAt: string;          // Date de création (format ISO)
  updatedAt?: string;         // Date de dernière modification (format ISO)
}

// Interface étendue pour l'affichage avec slug calculé
export interface ServiceWithSlug extends Service {
  slug: string;               // Slug calculé à partir du titre
}

// Interface étendue pour l'affichage avec sections de contenu
export interface ServiceWithSections extends Service {
  sections: ServiceSection[]; // Sections de contenu associées au service
}

// Interface étendue pour l'affichage complet avec sections, contenus et images
export interface ServiceWithFullContent extends Service {
  sections: ServiceSectionWithContentAndImages[]; // Sections avec contenus et images
}
