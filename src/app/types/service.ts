export interface Service {
  serviceId: number;          // Identifiant unique du service
  providerId: number;         // Référence au prestataire
  title: string;              // Titre du service
  createdAt: Date;            // Date de création
  minPrice: number | null;    // Prix minimum (peut être null)
  maxPrice: number | null;    // Prix maximum (peut être null)
  estimatedDuration: string;  // Durée estimée (en texte, ex: "2 heures", "3-5 jours")
}

// Interface étendue pour l'affichage avec slug calculé
export interface ServiceWithSlug extends Service {
  slug: string;               // Slug calculé à partir du titre
}
