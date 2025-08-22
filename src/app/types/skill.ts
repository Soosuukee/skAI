export interface Skill {
  skillId: number;        // Identifiant unique de la compétence
  name: string;           // Nom de la compétence
  category?: string;      // Catégorie de la compétence (optionnelle)
  description?: string;   // Description détaillée (optionnelle)
}



export interface ProviderSkill {
  providerSkillId: number;  // Identifiant unique de la relation provider-skill
  providerId: number;       // Référence au provider
  skillId: number;          // Référence à la compétence
  yearsOfExperience?: number; // Années d'expérience (optionnelle)
  certified?: boolean;      // Si la compétence est certifiée (optionnelle)
  certificationDate?: Date; // Date de certification (optionnelle)
}
