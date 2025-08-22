import { Language } from '@/app/types/language';
import languages from '@/data/languages.json';

/**
 * Récupère toutes les langues
 */
export function getAllLanguages(): Language[] {
  return languages as Language[];
}

/**
 * Trouve une langue par son ID
 */
export function getLanguageById(languageId: number): Language | undefined {
  return (languages as Language[]).find(language => language.languageId === languageId);
}

/**
 * Trouve une langue par son nom
 */
export function getLanguageByName(name: string): Language | undefined {
  return (languages as Language[]).find(language => 
    language.name.toLowerCase() === name.toLowerCase()
  );
}
