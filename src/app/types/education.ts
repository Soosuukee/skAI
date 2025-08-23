export interface Education {
  diplomaId: number;          // Identifiant unique du diplôme
  diplomaTitle: string;       // Titre du diplôme
  institutionName: string;    // Nom de l'institution
  description: string;        // Description de la formation
  startDate: string;          // Date de début (format ISO)
  endDate?: string;           // Date de fin (format ISO, null si en cours)
  diplomaImageUrl?: string;   // Logo de l'institution
}
