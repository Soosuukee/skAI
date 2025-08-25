import { ServiceContent, ServiceContentWithImages } from './serviceContent';

export interface ServiceSection {
  sectionId: number;         // Identifiant unique de la section
  serviceId: number;         // Référence au service
  title: string;             // Titre de la section
  description?: string;      // Description optionnelle de la section
  order: number;             // Ordre d'affichage de la section
  isActive: boolean;         // Si la section est active
  sectionType: 'overview' | 'features' | 'process' | 'pricing' | 'testimonials' | 'faq' | 'gallery' | 'contact'; // Type de section
  createdAt: string;         // Date de création (format ISO)
  updatedAt?: string;        // Date de dernière modification (format ISO)
}

// Interface étendue pour l'affichage avec contenus et images
export interface ServiceSectionWithContentAndImages extends ServiceSection {
  contents: ServiceContentWithImages[]; // Contenus avec images associées
}

// Interface pour les options de filtrage des sections
export interface ServiceSectionFilters {
  serviceId?: number;
  sectionType?: string;
  isActive?: boolean;
}
