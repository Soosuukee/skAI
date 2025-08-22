import { Service, ServiceWithSlug } from '@/app/types/service';
import { slugify, findServiceBySlug } from './slugifyService';

// Données des services (à remplacer par votre vraie source de données)
const servicesData: Service[] = [
  {
    serviceId: 1,
    providerId: 1,
    title: "Programmes d'accélération startups IA",
    createdAt: new Date('2024-01-15'),
    minPrice: 5000,
    maxPrice: 25000,
    estimatedDuration: "3-6 mois"
  },
  {
    serviceId: 2,
    providerId: 1,
    title: "Conseil stratégique IA GPU",
    createdAt: new Date('2024-02-01'),
    minPrice: 2000,
    maxPrice: 15000,
    estimatedDuration: "2-4 semaines"
  },
  {
    serviceId: 3,
    providerId: 2,
    title: "Conférences et keynotes",
    createdAt: new Date('2024-01-20'),
    minPrice: 3000,
    maxPrice: 20000,
    estimatedDuration: "1-3 jours"
  },
  {
    serviceId: 4,
    providerId: 1,
    title: "Audit infrastructure GPU",
    createdAt: new Date('2024-03-01'),
    minPrice: null,
    maxPrice: null,
    estimatedDuration: "1-2 semaines"
  },
  {
    serviceId: 5,
    providerId: 2,
    title: "Formation équipes techniques",
    createdAt: new Date('2024-02-15'),
    minPrice: 1500,
    maxPrice: null,
    estimatedDuration: "2-5 jours"
  }
];

/**
 * Récupère tous les services avec leurs slugs calculés
 */
export function getAllServices(): ServiceWithSlug[] {
  return servicesData.map(service => ({
    ...service,
    slug: slugify(service.title)
  }));
}

/**
 * Récupère les services d'un provider spécifique
 */
export function getServicesByProvider(providerId: number): ServiceWithSlug[] {
  const allServices = getAllServices();
  return allServices.filter(service => service.providerId === providerId);
}

/**
 * Trouve un service par son slug
 */
export function getServiceBySlug(slug: string): ServiceWithSlug | undefined {
  const allServices = getAllServices();
  return allServices.find(service => service.slug === slug);
}

/**
 * Trouve un service par son slug pour un provider spécifique
 */
export function getServiceBySlugAndProvider(slug: string, providerId: number): ServiceWithSlug | undefined {
  const providerServices = getServicesByProvider(providerId);
  return providerServices.find(service => service.slug === slug);
}

/**
 * Génère les paramètres statiques pour les pages de services
 */
export function generateServiceStaticParams() {
  const allServices = getAllServices();
  
  return allServices.map(service => ({
    serviceSlug: service.slug,
    providerId: service.providerId.toString()
  }));
}
