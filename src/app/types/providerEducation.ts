export interface ProviderEducation {
  educationId: number;        // Identifiant unique de la formation
  providerId: number;         // Référence au provider
  diplomaTitle: string;       // Titre du diplôme
  institutionName: string;    // Nom de l'institution
  description: string;        // Description de la formation
  startDate: Date;           // Date de début
  endDate?: Date;            // Date de fin (optionnelle si en cours)
  educationImage?: string;   // Logo de l'institution ou autre image (optionnelle)
  grade?: string;            // Note/mention obtenue (optionnelle)
  fieldOfStudy?: string;     // Domaine d'étude (optionnelle)
}
