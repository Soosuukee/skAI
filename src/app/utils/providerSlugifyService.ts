/**
 * Service de slugification pour les providers
 * Génère des slugs à partir du prénom et nom
 */

export function slugifyProvider(firstName: string, lastName: string): string {
  const fullName = `${firstName} ${lastName}`;
  return fullName
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
 * Génère un slug unique pour un provider en vérifiant les doublons
 */
export function generateUniqueProviderSlug<T extends { firstName: string; lastName: string }>(
  providers: T[],
  firstName: string,
  lastName: string
): string {
  const baseSlug = slugifyProvider(firstName, lastName);
  let uniqueSlug = baseSlug;
  let counter = 1;

  // Vérifie si le slug existe déjà
  while (providers.some(provider => 
    slugifyProvider(provider.firstName, provider.lastName) === uniqueSlug
  )) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

/**
 * Trouve un provider par son slug
 */
export function findProviderBySlug<T extends { firstName: string; lastName: string }>(
  providers: T[],
  slug: string
): T | undefined {
  return providers.find(provider => 
    slugifyProvider(provider.firstName, provider.lastName) === slug
  );
}


