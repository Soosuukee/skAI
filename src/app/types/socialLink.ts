export interface SocialLink {
  socialLinkId: number;      // Identifiant unique du lien social
  providerId: number;        // Référence au prestataire
  network: string;           // Nom du réseau social (GitHub, LinkedIn, X, etc.)
  url: string;               // URL du profil/lien social
}

// Interface étendue pour l'affichage avec des propriétés calculées
export interface SocialLinkWithMetadata extends SocialLink {
  icon?: string;             // Icône associée au réseau social
  displayName?: string;      // Nom d'affichage personnalisé
  isActive?: boolean;        // Si le lien est actif/visible
}

// Interface pour grouper les liens sociaux par prestataire
export interface SocialLinksGroup {
  providerId: number;
  socialLinks: SocialLink[];
}

// Interface pour les options de filtrage des liens sociaux
export interface SocialLinkFilters {
  providerId?: number;
  network?: string;
  isActive?: boolean;
}

// Types de réseaux sociaux supportés
export type SocialNetwork = 
  | "GitHub" 
  | "X"
