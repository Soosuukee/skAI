export interface Job {
  jobId: number;             // Identifiant unique du métier/poste
  title: string;             // Titre du métier/poste
}

// Interface étendue pour l'affichage avec des propriétés calculées
export interface JobWithMetadata extends Job {
  description?: string;      // Description détaillée du métier
  category?: string;         // Catégorie du métier (IA, ML, DevOps, etc.)
  level?: 'junior' | 'senior' | 'expert' | 'lead'; // Niveau d'expérience
  isActive?: boolean;        // Si le métier est actif/visible
}

// Interface pour grouper les métiers par catégorie
export interface JobsGroup {
  category: string;
  jobs: Job[];
}

// Interface pour les options de filtrage des métiers
export interface JobFilters {
  category?: string;
  level?: string;
  isActive?: boolean;
  search?: string;
}

// Interface pour le tri des métiers
export interface JobSortOptions {
  field: 'title' | 'category' | 'level';
  direction: 'asc' | 'desc';
}

// Types de catégories de métiers
export type JobCategory = 
  | "Intelligence Artificielle"
  | "Machine Learning"
  | "Data Science"
  | "Développement"
  | "DevOps"
  | "Infrastructure"
  | "Consulting"
  | "Recherche"
  | "Management"
  | "Autre";
