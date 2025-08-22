"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ServiceImage } from "@/app/types/serviceImage";
import { useServiceImages } from "@/app/hooks/useServiceImages";
import styles from "./ServiceImageGallery.module.scss";

interface ServiceImageGalleryProps {
  serviceId: number;
  className?: string;
  showTitle?: boolean;
  maxImages?: number;
}

export const ServiceImageGallery: React.FC<ServiceImageGalleryProps> = ({
  serviceId,
  className = "",
  showTitle = true,
  maxImages,
}) => {
  const images = useServiceImages(serviceId);
  const [selectedImage, setSelectedImage] = useState<ServiceImage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Limiter le nombre d'images affichées si maxImages est spécifié
  const displayImages = maxImages ? images.slice(0, maxImages) : images;

  const openModal = (image: ServiceImage) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  if (images.length === 0) {
    return (
      <div className={`${styles.emptyState} ${className}`}>
        <p>Aucune image disponible pour ce service</p>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.gallery} ${className}`}>
        {showTitle && (
          <h3 className={styles.galleryTitle}>
            Images du service ({images.length})
          </h3>
        )}

        <div className={styles.imageGrid}>
          {displayImages.map((image) => (
            <div
              key={image.imageId}
              className={styles.imageContainer}
              onClick={() => openModal(image)}
            >
              <Image
                src={image.url}
                alt={image.title}
                width={300}
                height={200}
                className={styles.image}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              {showTitle && (
                <div className={styles.imageTitle}>{image.title}</div>
              )}
            </div>
          ))}
        </div>

        {maxImages && images.length > maxImages && (
          <div className={styles.moreImages}>
            <p>+{images.length - maxImages} autres images</p>
          </div>
        )}
      </div>

      {/* Modal pour afficher l'image en plein écran */}
      {isModalOpen && selectedImage && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={closeModal}>
              ×
            </button>
            <Image
              src={selectedImage.url}
              alt={selectedImage.title}
              width={800}
              height={600}
              className={styles.modalImage}
            />
            <div className={styles.modalTitle}>{selectedImage.title}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceImageGallery;
