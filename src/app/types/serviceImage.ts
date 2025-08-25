export interface ServiceImage {
  imageId: number;           // Identifiant unique de l'image
  serviceId: number;         // Référence au service
  title: string;             // Titre de l'image
  url: string;               // URL de l'image
}

// Interface étendue pour l'affichage avec des propriétés calculées
export interface ServiceImageWithMetadata extends ServiceImage {
  alt?: string;              // Texte alternatif pour l'accessibilité
  width?: number;            // Largeur de l'image
  height?: number;           // Hauteur de l'image
  description?: string;      // Description optionnelle de l'image
}

// Interface pour les options de filtrage des images
export interface ServiceImageFilters {
  serviceId?: number;
  title?: string;
}
