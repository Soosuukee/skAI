"use client";

import { useState, useEffect } from "react";
import servicesData from "@/data/services.json";
import providersData from "@/data/providers.json";
import { Service } from "@/app/types/service";

// Interface pour les données JSON brutes
interface ServiceData {
  serviceId: number;
  providerId: number;
  title: string;
  summary: string;
  createdAt: string;
  serviceCover: string;
  tag: string;
  language: string;
  isActive: boolean;
  isFeatured: boolean;
  minPrice: number | null;
  maxPrice: number | null;
}

export const useProviderServices = (providerSlug: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = () => {
      try {
        setLoading(true);
        setError(null);

        // Trouver le provider par son slug
        const provider = providersData.find(p => p.slug === providerSlug);
        
        if (!provider) {
          throw new Error("Provider non trouvé");
        }

        // Filtrer les services pour ce provider et les transformer
        const providerServices = (servicesData as ServiceData[])
          .filter((service) => service.providerId === provider.provider_id)
          .map((serviceData): Service => ({
            serviceId: serviceData.serviceId,
            providerId: serviceData.providerId,
            title: serviceData.title,
            description: serviceData.summary, // Utiliser summary comme description
            slug: serviceData.title.toLowerCase().replace(/\s+/g, '-'), // Générer un slug
            isActive: serviceData.isActive,
            isFeatured: serviceData.isFeatured,
            minPrice: serviceData.minPrice,
            maxPrice: serviceData.maxPrice,
            estimatedDuration: "À définir", // Valeur par défaut
            availability: "Disponible", // Valeur par défaut
            responseTime: "24h", // Valeur par défaut
            createdAt: serviceData.createdAt,
            updatedAt: serviceData.createdAt // Utiliser createdAt comme updatedAt
          }));

        setServices(providerServices);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur lors du chargement des services");
      } finally {
        setLoading(false);
      }
    };

    if (providerSlug) {
      fetchServices();
    }
  }, [providerSlug]);

  return { services, loading, error };
};
