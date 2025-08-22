export interface ProviderExperience {
  experienceId: number;       // Identifiant unique de l'expérience
  providerId: number;         // Référence au provider
  jobTitle: string;           // Titre du poste
  companyName: string;        // Nom de l'entreprise
  description: string;        // Description principale (obligatoire)
  task1?: string;            // Première tâche (optionnelle)
  task2?: string;            // Deuxième tâche (optionnelle)
  startDate: Date;           // Date de début
  endDate?: Date;            // Date de fin (optionnelle si en cours)
  experienceImage?: string;  // Logo de l'entreprise ou autre image (optionnelle)
}
