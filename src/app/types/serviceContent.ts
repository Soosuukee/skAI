import { ServiceImage } from './serviceImage';

export interface ServiceContent {
  contentId: number;         // Identifiant unique du contenu
  serviceId: number;         // Référence au service
  title: string;             // Titre du contenu
  subtitle?: string;         // Sous-titre optionnel
  content: string;           // Contenu principal (peut être du texte, HTML, etc.)
  contentType: 'text' | 'html' | 'markdown' | 'rich'; // Type de contenu
  order: number;             // Ordre d'affichage du contenu
  isActive: boolean;         // Si le contenu est actif
  createdAt: string;         // Date de création (format ISO)
  updatedAt?: string;        // Date de dernière modification (format ISO)
}

// Interface étendue pour l'affichage avec images associées
export interface ServiceContentWithImages extends ServiceContent {
  images: ServiceImage[];    // Images associées à ce contenu
}

// Interface pour les options de filtrage des contenus
export interface ServiceContentFilters {
  serviceId?: number;
  contentType?: string;
  isActive?: boolean;
}
