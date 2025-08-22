export interface Article {
  articleId: number;           // Identifiant unique de l'article
  providerId: number;          // Référence au prestataire
  title: string;               // Titre de l'article
  summary: string;             // Résumé de l'article
  publishedAt: string;         // Date de publication (format ISO)
  articleCover: string;        // URL de l'image de couverture
  tag: string;                 // Tag/catégorie de l'article
  language: string;            // Langue de l'article
  isPublished: boolean;        // Si l'article est publié
  isFeatured: boolean;         // Si l'article est mis en avant
  viewCount: number;           // Nombre de vues
  likeCount: number;           // Nombre de likes
  commentCount: number;        // Nombre de commentaires
  shareCount: number;          // Nombre de partages
  seoScore?: number;           // Score SEO (optionnel)
  updatedAt?: string;          // Date de dernière modification (format ISO)
}

// Interface étendue pour l'affichage avec propriétés calculées
export interface ArticleWithMetadata extends Article {
  readingTime?: number;        // Temps de lecture estimé en minutes
  wordCount?: number;          // Nombre de mots
  excerpt?: string;            // Extrait pour les aperçus
  formattedDate?: string;      // Date formatée pour l'affichage
}

// Interface pour les options de filtrage des articles
export interface ArticleFilters {
  providerId?: number;
  tag?: string;
  language?: string;
  publishedAfter?: string;
  publishedBefore?: string;
  search?: string;
}

// Interface pour le tri des articles
export interface ArticleSortOptions {
  field: 'publishedAt' | 'title' | 'tag';
  direction: 'asc' | 'desc';
}
