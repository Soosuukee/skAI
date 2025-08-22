'use client';

import React from 'react';
import Image from 'next/image';
import { ServiceImage as ServiceImageType } from '@/app/types/serviceImage';
import { useServiceImageById, useServiceCoverImage } from '@/app/hooks/useServiceImages';
import styles from './ServiceImage.module.scss';

interface ServiceImageProps {
  imageId?: number;
  serviceId?: number;
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  priority?: boolean;
  showTitle?: boolean;
  onClick?: (image: ServiceImageType) => void;
}

export const ServiceImage: React.FC<ServiceImageProps> = ({
  imageId,
  serviceId,
  className = '',
  width = 300,
  height = 200,
  alt,
  priority = false,
  showTitle = false,
  onClick
}) => {
  // Récupérer l'image par ID ou l'image de couverture du service
  const imageById = imageId ? useServiceImageById(imageId) : undefined;
  const coverImage = serviceId ? useServiceCoverImage(serviceId) : undefined;
  
  const image = imageById || coverImage;

  if (!image) {
    return (
      <div className={`${styles.placeholder} ${className}`}>
        <div className={styles.placeholderContent}>
          <span>Aucune image</span>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (onClick) {
      onClick(image);
    }
  };

  return (
    <div 
      className={`${styles.container} ${className} ${onClick ? styles.clickable : ''}`}
      onClick={handleClick}
    >
      <Image
        src={image.url}
        alt={alt || image.title}
        width={width}
        height={height}
        className={styles.image}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
      {showTitle && (
        <div className={styles.title}>
          {image.title}
        </div>
      )}
    </div>
  );
};

export default ServiceImage;
