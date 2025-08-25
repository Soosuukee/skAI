import { ArticleContent } from './articleContent';

export interface ArticleSection {
  articleSectionId: number;    // Identifiant unique de la section d'article
  articleId: number;           // Référence à l'article
  title: string;
  content: ArticleContent [];
  // Titre de la section
}

// Interface étendue pour l'affichage avec des propriétés calculées
export interface ArticleSectionWithMetadata extends ArticleSection {
  order?: number;              // Ordre d'affichage de la section
  slug?: string;               // Slug de la section pour la navigation
  isVisible?: boolean;         // Si la section doit être visible
}

// Interface pour grouper les sections par article
export interface ArticleSectionsGroup {
  articleId: number;
  sections: ArticleSection[];
}

// Interface pour les options de filtrage des sections
export interface ArticleSectionFilters {
  articleId?: number;
  title?: string;
}
