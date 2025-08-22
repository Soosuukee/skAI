// Interface pour l'expérience professionnelle
export interface ProviderExperience {
  experienceId: number;       // Identifiant unique de l'expérience
  providerId: number;         // Référence au prestataire
  jobTitle: string;           // Titre du poste
  companyName: string;        // Nom de l'entreprise
  description: string;        // Description du poste
  task1?: string;             // Première tâche principale
  task2?: string;             // Deuxième tâche principale
  startDate: string;          // Date de début (format ISO)
  endDate?: string;           // Date de fin (format ISO, null si en cours)
  experienceImage?: string;   // Logo de l'entreprise
}

// Interface étendue avec métadonnées
export interface ProviderExperienceWithMetadata extends ProviderExperience {
  duration?: string;          // Durée calculée (ex: "2 ans 3 mois")
  isCurrent?: boolean;        // Si c'est le poste actuel
  companyLogo?: string;       // Logo de l'entreprise
  companyWebsite?: string;    // Site web de l'entreprise
  location?: string;          // Localisation du poste
  industry?: string;          // Secteur d'activité
}

// Interface pour les options de filtrage des expériences
export interface ProviderExperienceFilters {
  companyName?: string;
  jobTitle?: string;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
  providerId?: number;
}

// Interface pour le tri des expériences
export interface ProviderExperienceSortOptions {
  field: 'startDate' | 'endDate' | 'jobTitle' | 'companyName';
  direction: 'asc' | 'desc';
}
