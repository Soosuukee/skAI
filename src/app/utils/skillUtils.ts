import { Skill, SkillLevel, ProviderSkill } from '@/app/types/skill';
import skills from '@/data/skills.json';
import providerSkills from '@/data/providerSkills.json';

/**
 * Transforme les données JSON vers le format Skill
 */
function transformSkillData(jsonSkill: any): Skill {
  return {
    skillId: jsonSkill.skill_id,
    name: jsonSkill.name,
    category: undefined, // À ajouter plus tard si nécessaire
    description: undefined, // À ajouter plus tard si nécessaire
    level: undefined // À ajouter plus tard si nécessaire
  };
}

/**
 * Transforme les données JSON vers le format ProviderSkill
 */
function transformProviderSkillData(jsonProviderSkill: any): ProviderSkill {
  return {
    providerSkillId: jsonProviderSkill.providerSkillId,
    providerId: jsonProviderSkill.providerId,
    skillId: jsonProviderSkill.skillId,
    level: jsonProviderSkill.level as SkillLevel,
    yearsOfExperience: jsonProviderSkill.yearsOfExperience,
    certified: jsonProviderSkill.certified,
    certificationDate: jsonProviderSkill.certificationDate ? new Date(jsonProviderSkill.certificationDate) : undefined
  };
}

/**
 * Récupère toutes les compétences
 */
export function getAllSkills(): Skill[] {
  return skills.map(transformSkillData);
}

/**
 * Trouve une compétence par son ID
 */
export function getSkillById(skillId: number): Skill | undefined {
  const allSkills = getAllSkills();
  return allSkills.find(skill => skill.skillId === skillId);
}

/**
 * Trouve une compétence par son nom
 */
export function getSkillByName(name: string): Skill | undefined {
  const allSkills = getAllSkills();
  return allSkills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
}

/**
 * Recherche des compétences par mot-clé
 */
export function searchSkills(keyword: string): Skill[] {
  const allSkills = getAllSkills();
  return allSkills.filter(skill => 
    skill.name.toLowerCase().includes(keyword.toLowerCase())
  );
}

/**
 * Récupère les compétences par catégorie
 */
export function getSkillsByCategory(category: string): Skill[] {
  const allSkills = getAllSkills();
  return allSkills.filter(skill => skill.category === category);
}

/**
 * Récupère toutes les catégories de compétences
 */
export function getAllSkillCategories(): string[] {
  const allSkills = getAllSkills();
  const categories = allSkills
    .map(skill => skill.category)
    .filter((category): category is string => category !== undefined);
  return [...new Set(categories)]; // Supprime les doublons
}

/**
 * Récupère toutes les relations provider-skill
 */
export function getAllProviderSkills(): ProviderSkill[] {
  return providerSkills.map(transformProviderSkillData);
}

/**
 * Récupère les compétences d'un provider spécifique
 */
export function getProviderSkills(providerId: number): ProviderSkill[] {
  const allProviderSkills = getAllProviderSkills();
  return allProviderSkills.filter(ps => ps.providerId === providerId);
}

/**
 * Récupère les compétences d'un provider avec les détails des compétences
 */
export function getProviderSkillsWithDetails(providerId: number): (ProviderSkill & { skill: Skill })[] {
  const providerSkills = getProviderSkills(providerId);
  return providerSkills.map(ps => ({
    ...ps,
    skill: getSkillById(ps.skillId)!
  }));
}

/**
 * Trouve une relation provider-skill spécifique
 */
export function getProviderSkill(providerId: number, skillId: number): ProviderSkill | undefined {
  const allProviderSkills = getAllProviderSkills();
  return allProviderSkills.find(ps => ps.providerId === providerId && ps.skillId === skillId);
}

/**
 * Vérifie si un provider a une compétence spécifique
 */
export function hasProviderSkill(providerId: number, skillId: number): boolean {
  return getProviderSkill(providerId, skillId) !== undefined;
}

/**
 * Récupère les providers qui ont une compétence spécifique
 */
export function getProvidersWithSkill(skillId: number): number[] {
  const allProviderSkills = getAllProviderSkills();
  return allProviderSkills
    .filter(ps => ps.skillId === skillId)
    .map(ps => ps.providerId);
}

/**
 * Formate le niveau de compétence en texte
 */
export function formatSkillLevel(level: SkillLevel): string {
  return level;
}

/**
 * Calcule l'expérience totale d'un provider
 */
export function calculateTotalExperience(providerId: number): number {
  const providerSkills = getProviderSkills(providerId);
  const totalYears = providerSkills.reduce((sum, ps) => sum + (ps.yearsOfExperience || 0), 0);
  return totalYears;
}
