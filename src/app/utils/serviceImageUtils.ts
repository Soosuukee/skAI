import serviceImagesData from '@/data/serviceImages.json';
import { ServiceImage, ServiceImageFilters } from '../types/serviceImage';

// Type local pour grouper les images par service
interface ServiceImagesGroup {
  serviceId: number;
  images: ServiceImage[];
}

/**
 * Récupère toutes les images de service
 */
export const getAllServiceImages = (): ServiceImage[] => {
  return serviceImagesData.map(image => ({
    id: image.serviceImageId,
    serviceContentId: image.serviceContentId,
    url: image.imageUrl
  }));
};

/**
 * Récupère les images d'un service spécifique
 */
export const getServiceImages = (serviceId: number): ServiceImage[] => {
  return getAllServiceImages().filter(image => image.serviceContentId === serviceId);
};

/**
 * Récupère une image spécifique par son ID
 */
export const getServiceImageById = (imageId: number): ServiceImage | undefined => {
  return getAllServiceImages().find(image => image.id === imageId);
};

/**
 * Filtre les images selon les critères fournis
 */
export const filterServiceImages = (filters: ServiceImageFilters): ServiceImage[] => {
  let images = getAllServiceImages();

  if (filters.serviceContentId !== undefined) {
    images = images.filter(image => image.serviceContentId === filters.serviceContentId);
  }

  return images;
};

/**
 * Groupe les images par service
 */
export const groupServiceImagesByService = (): ServiceImagesGroup[] => {
  const images = getAllServiceImages();
  const grouped: { [key: number]: ServiceImage[] } = {};

  images.forEach(image => {
    if (!grouped[image.serviceContentId]) {
      grouped[image.serviceContentId] = [];
    }
    grouped[image.serviceContentId].push(image);
  });

  return Object.entries(grouped).map(([serviceContentId, images]) => ({
    serviceId: parseInt(serviceContentId),
    images
  }));
};

/**
 * Récupère la première image d'un service (généralement l'image de couverture)
 */
export const getServiceCoverImage = (serviceId: number): ServiceImage | undefined => {
  const serviceImages = getServiceImages(serviceId);
  // Cherche d'abord une image avec "cover" dans l'URL, sinon prend la première
  return serviceImages.find(image => image.url.includes('cover')) || serviceImages[0];
};

/**
 * Récupère les images de couverture pour tous les services
 */
export const getAllServiceCoverImages = (): ServiceImage[] => {
  const allImages = getAllServiceImages();
  const coverImages: ServiceImage[] = [];
  const processedServices = new Set<number>();

  allImages.forEach(image => {
    if (image.url.includes('cover') && !processedServices.has(image.serviceContentId)) {
      coverImages.push(image);
      processedServices.add(image.serviceContentId);
    }
  });

  return coverImages;
};
