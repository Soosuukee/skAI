/**
 * Service de slugification pour convertir les titres en slugs URL-friendly
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, '') // Supprime les diacritiques
    .replace(/[^a-z0-9\s-]/g, '') // Garde seulement lettres, chiffres, espaces et tirets
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/-+/g, '-') // Remplace les tirets multiples par un seul
    .trim() // Supprime les espaces en début/fin
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}

/**
 * Trouve un service par son slug
 */
export function findServiceBySlug<T extends { title: string }>(
  services: T[],
  slug: string
): T | undefined {
  return services.find(service => slugify(service.title) === slug);
}

/**
 * Génère un slug unique pour un service
 */
export function generateUniqueSlug<T extends { title: string }>(
  services: T[],
  title: string
): string {
  const baseSlug = slugify(title);
  let uniqueSlug = baseSlug;
  let counter = 1;

  // Vérifie si le slug existe déjà
  while (services.some(service => slugify(service.title) === uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}
