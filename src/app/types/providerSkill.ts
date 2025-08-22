// Interface pour les compétences du prestataire
export interface ProviderSkill {
  providerSkillId: number;    // Identifiant unique de la compétence
  providerId: number;         // Référence au prestataire
  skillId: number;            // Référence à la compétence
  yearsOfExperience: number;  // Années d'expérience
  certified: boolean;         // Si la compétence est certifiée
  certificationDate?: string; // Date de certification (format ISO)
}

// Interface étendue avec métadonnées
export interface ProviderSkillWithMetadata extends ProviderSkill {
  skillName?: string;         // Nom de la compétence
  skillCategory?: string;     // Catégorie de la compétence
  skillIcon?: string;         // Icône de la compétence
}

// Interface pour les options de filtrage des compétences
export interface ProviderSkillFilters {
  certified?: boolean;
  minYearsOfExperience?: number;
  skillId?: number;
  providerId?: number;
}

// Interface pour le tri des compétences
export interface ProviderSkillSortOptions {
  field: 'yearsOfExperience' | 'certificationDate';
  direction: 'asc' | 'desc';
}
