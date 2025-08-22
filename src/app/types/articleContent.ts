export interface ArticleContent {
  articleContentId: number;    // Identifiant unique du contenu d'article
  articleSectionId: number;    // Référence à la section d'article
  content: string;         // Type de contenu (paragraph, code, image, etc.)
}

// Interface étendue pour l'affichage avec des propriétés calculées
export interface ArticleContentWithMetadata extends ArticleContent {
  order?: number;              // Ordre d'affichage du contenu
  metadata?: Record<string, any>; // Métadonnées spécifiques au type de contenu
}

// Interface pour grouper le contenu par section
export interface ArticleContentGroup {
  articleSectionId: number;
  contents: ArticleContent[];
}

// Interface pour les options de filtrage du contenu
export interface ArticleContentFilters {
  articleSectionId?: number;
  content?: string;
}
