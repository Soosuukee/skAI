export interface ArticleImage {
  articleImageId: number;      // Identifiant unique de l'image d'article
  articleContentId: number;    // Référence au contenu d'article
  imageUrl: string;            // URL de l'image
  altText: string;             // Texte alternatif pour l'accessibilité
  caption?: string;            // Légende optionnelle de l'image
  aspectRatio?: string;        // Ratio d'aspect (ex: "16/9", "4/3")
  order?: number;              // Ordre d'affichage dans le contenu
}

// Interface étendue pour l'affichage avec des propriétés calculées
export interface ArticleImageWithMetadata extends ArticleImage {
  width?: number;              // Largeur de l'image
  height?: number;             // Hauteur de l'image
  thumbnailUrl?: string;       // URL de la miniature
}

// Interface pour les options de filtrage des images d'articles
export interface ArticleImageFilters {
  articleContentId?: number;
  hasCaption?: boolean;
}
