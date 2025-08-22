import { ProviderExperience } from '@/app/types/providerExperience';
import experiences from '@/data/providerExperiences.json';

/**
 * Transforme les données JSON vers le format ProviderExperience
 */
function transformExperienceData(jsonExperience: any): ProviderExperience {
  return {
    experienceId: jsonExperience.experienceId,
    providerId: jsonExperience.providerId,
    jobTitle: jsonExperience.jobTitle,
    companyName: jsonExperience.companyName,
    description: jsonExperience.description,
    task1: jsonExperience.task1,
    task2: jsonExperience.task2,
    startDate: new Date(jsonExperience.startDate),
    endDate: jsonExperience.endDate ? new Date(jsonExperience.endDate) : undefined,
    experienceImage: jsonExperience.experienceImage
  };
}

/**
 * Récupère toutes les expériences
 */
export function getAllExperiences(): ProviderExperience[] {
  return experiences.map(transformExperienceData);
}

/**
 * Récupère les expériences d'un provider spécifique
 */
export function getExperiencesByProvider(providerId: number): ProviderExperience[] {
  const allExperiences = getAllExperiences();
  return allExperiences.filter(experience => experience.providerId === providerId);
}

/**
 * Trouve une expérience par son ID
 */
export function getExperienceById(experienceId: number): ProviderExperience | undefined {
  const allExperiences = getAllExperiences();
  return allExperiences.find(experience => experience.experienceId === experienceId);
}

/**
 * Trouve une expérience par provider et ID
 */
export function getExperienceByProviderAndId(providerId: number, experienceId: number): ProviderExperience | undefined {
  const providerExperiences = getExperiencesByProvider(providerId);
  return providerExperiences.find(experience => experience.experienceId === experienceId);
}

/**
 * Calcule la durée d'une expérience en mois
 */
export function calculateExperienceDuration(startDate: Date, endDate?: Date): number {
  const end = endDate || new Date();
  const diffTime = Math.abs(end.getTime() - startDate.getTime());
  const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44)); // Moyenne de jours par mois
  return diffMonths;
}

/**
 * Formate la durée d'une expérience en texte lisible
 */
export function formatExperienceDuration(startDate: Date, endDate?: Date): string {
  const months = calculateExperienceDuration(startDate, endDate);
  
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
