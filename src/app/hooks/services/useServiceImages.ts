import { useMemo } from 'react';
import { 
  getAllServiceImages, 
  getServiceImages, 
  getServiceImageById,
  filterServiceImages,
  groupServiceImagesByService,
  getServiceCoverImage,
  getAllServiceCoverImages
} from '../../utils/serviceImageUtils';
import { ServiceImage, ServiceImageFilters } from '../../types/serviceImage';

/**
 * Hook pour récupérer toutes les images de service
 */
export const useAllServiceImages = () => {
  return useMemo(() => getAllServiceImages(), []);
};

/**
 * Hook pour récupérer les images d'un service spécifique
 */
export const useServiceImages = (serviceId: number) => {
  return useMemo(() => getServiceImages(serviceId), [serviceId]);
};

/**
 * Hook pour récupérer une image spécifique par son ID
 */
export const useServiceImageById = (imageId: number) => {
  return useMemo(() => getServiceImageById(imageId), [imageId]);
};

/**
 * Hook pour filtrer les images selon les critères fournis
 */
export const useFilteredServiceImages = (filters: ServiceImageFilters) => {
  return useMemo(() => filterServiceImages(filters), [filters]);
};

/**
 * Hook pour grouper les images par service
 */
export const useGroupedServiceImages = () => {
  return useMemo(() => groupServiceImagesByService(), []);
};

/**
 * Hook pour récupérer l'image de couverture d'un service
 */
export const useServiceCoverImage = (serviceId: number) => {
  const image = useMemo(() => getServiceCoverImage(serviceId), [serviceId]);
  
  return {
    coverImage: image ? {
      src: image.url,
      alt: `Image de couverture du service ${serviceId}`,
      width: 400,
      height: 225
    } : undefined,
    loading: false,
    error: null
  };
};

/**
 * Hook pour récupérer toutes les images de couverture
 */
export const useAllServiceCoverImages = () => {
  return useMemo(() => getAllServiceCoverImages(), []);
};

/**
 * Hook pour récupérer les images d'un service avec gestion d'état de chargement
 */
export const useServiceImagesWithState = (serviceId: number) => {
  const images = useServiceImages(serviceId);
  
  return {
    images,
    isLoading: false, // Les données sont statiques pour l'instant
    error: null,
    isEmpty: images.length === 0
  };
};
