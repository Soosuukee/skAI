export interface Experience {
  experienceId: number;       // Identifiant unique de l'expérience
  jobTitle: string;           // Titre du poste
  companyName: string;        // Nom de l'entreprise
  description: string;        // Description du poste
  task1?: string;             // Première tâche principale
  task2?: string;             // Deuxième tâche principale
  startDate: string;          // Date de début (format ISO)
  endDate?: string;           // Date de fin (format ISO, null si en cours)
  experienceImage?: string;   // Logo de l'entreprise
}
