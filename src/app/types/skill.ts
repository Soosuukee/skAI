export interface Skill {
  skillId: number;        // Identifiant unique de la compétence
  name: string;           // Nom de la compétence
  category?: string;      // Catégorie de la compétence (optionnelle)
  description?: string;   // Description détaillée (optionnelle)
}
