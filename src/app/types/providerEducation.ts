// Interface pour l'éducation/formation
export interface ProviderEducation {
  diplomaId: number;          // Identifiant unique du diplôme
  providerId: number;         // Référence au prestataire
  diplomaTitle: string;       // Titre du diplôme
  institutionName: string;    // Nom de l'institution
  description: string;        // Description de la formation
  startDate: string;          // Date de début (format ISO)
  endDate?: string;           // Date de fin (format ISO, null si en cours)
  diplomaImageUrl?: string;   // Logo de l'institution
}

// Interface étendue avec métadonnées
export interface ProviderEducationWithMetadata extends ProviderEducation {
  duration?: string;          // Durée calculée (ex: "3 ans")
  isCurrent?: boolean;        // Si la formation est en cours
  institutionLogo?: string;   // Logo de l'institution
  institutionWebsite?: string; // Site web de l'institution
  location?: string;          // Localisation de l'institution
  level?: 'Bac' | 'Bac+2' | 'Bac+3' | 'Bac+4' | 'Bac+5' | 'Doctorat' | 'Formation continue';
  grade?: string;             // Mention obtenue
  accreditation?: string;     // Organisme d'accréditation
}

// Interface pour les options de filtrage de l'éducation
export interface ProviderEducationFilters {
  institutionName?: string;
  diplomaTitle?: string;
  level?: string;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
  providerId?: number;
}

// Interface pour le tri de l'éducation
export interface ProviderEducationSortOptions {
  field: 'startDate' | 'endDate' | 'diplomaTitle' | 'institutionName' | 'level';
  direction: 'asc' | 'desc';
}
