import { ProviderEducation } from '@/app/types/providerEducation';
import education from '@/data/providerScholarships.json';

/**
 * Transforme les données JSON vers le format ProviderEducation
 */
function transformEducationData(jsonEducation: any): ProviderEducation {
  return {
    educationId: jsonEducation.diploma_id,
    providerId: jsonEducation.provider_id,
    diplomaTitle: jsonEducation.diploma_title,
    institutionName: jsonEducation.institution_name,
    description: jsonEducation.description,
    startDate: new Date(jsonEducation.start_date),
    endDate: jsonEducation.end_date ? new Date(jsonEducation.end_date) : undefined,
    educationImage: jsonEducation.diploma_image_url,
    grade: undefined, // À ajouter plus tard si nécessaire
    fieldOfStudy: undefined // À ajouter plus tard si nécessaire
  };
}

/**
 * Récupère toutes les formations
 */
export function getAllEducation(): ProviderEducation[] {
  return education.map(transformEducationData);
}

/**
 * Récupère les formations d'un provider spécifique
 */
export function getEducationByProvider(providerId: number): ProviderEducation[] {
  const allEducation = getAllEducation();
  return allEducation.filter(edu => edu.providerId === providerId);
}

/**
 * Trouve une formation par son ID
 */
export function getEducationById(educationId: number): ProviderEducation | undefined {
  const allEducation = getAllEducation();
  return allEducation.find(edu => edu.educationId === educationId);
}

/**
 * Trouve une formation par provider et ID
 */
export function getEducationByProviderAndId(providerId: number, educationId: number): ProviderEducation | undefined {
  const providerEducation = getEducationByProvider(providerId);
  return providerEducation.find(edu => edu.educationId === educationId);
}

/**
 * Calcule la durée d'une formation en mois
 */
export function calculateEducationDuration(startDate: Date, endDate?: Date): number {
  const end = endDate || new Date();
  const diffTime = Math.abs(end.getTime() - startDate.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Moyenne de jours par mois
  return diffMonths;
}

/**
 * Formate la durée d'une formation en texte lisible
 */
export function formatEducationDuration(startDate: Date, endDate?: Date): string {
  const months = calculateEducationDuration(startDate, endDate);
  
  if (months < 12) {
    return `${months} mois`;
  }
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (remainingMonths === 0) {
    return `${years} an${years > 1 ? 's' : ''}`;
  }
  
  return `${years} an${years > 1 ? 's' : ''} et ${remainingMonths} mois`;
}

/**
 * Vérifie si une formation est en cours
 */
export function isEducationInProgress(endDate?: Date): boolean {
  return !endDate || endDate > new Date();
}
