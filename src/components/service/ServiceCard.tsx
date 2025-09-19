"use client";

import React from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  SmartLink,
  SmartImage,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import type { Service } from "@/app/types/service";

interface ServiceCardProps {
  service: Service;
  providerSlug: string;
  index?: number; // Pour l'animation décalée
}

// Fonction pour convertir les URLs relatives en URLs absolues de l'API
const makeAbsolute = (url?: string) => {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  try {
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
    const origin = new URL(apiBase).origin;
    return url.startsWith("/")
      ? `${origin}${url}`
      : `${apiBase.replace(/\/$/, "")}/${url}`;
  } catch {
    return url;
  }
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  providerSlug,
  index = 0,
}) => {
  const serviceLink = `/providers/${providerSlug}/service/${service.id}`;

  return (
    <CustomRevealFx translateY={4} delay={0.1 * (index + 1)} fillWidth>
      <Column
        padding="l"
        border="neutral-alpha-medium"
        radius="m"
        gap="m"
        style={{
          height: "100%",
          transition: "transform 0.2s ease",
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = serviceLink)}
      >
        {/* Image de couverture */}
        {service.cover ? (
          <SmartImage
            src={makeAbsolute(service.cover) as string}
            alt={`Image de couverture - ${service.title}`}
            width={300}
            height={169}
            radius="s"
            style={{
              objectFit: "cover",
              aspectRatio: "16/9",
              width: "100%",
              maxHeight: "200px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            <Text color="neutral-medium">Pas d'image de couverture</Text>
          </div>
        )}

        {/* Contenu textuel */}
        <Column gap="s" style={{ flex: 1 }}>
          <Heading as="h3" variant="display-strong-s">
            {service.title}
          </Heading>
          <Text
            variant="body-default-m"
            color="neutral-medium"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {service.summary}
          </Text>
        </Column>

        {/* Lien "En savoir plus" */}
        <Flex horizontal="end" fillWidth>
          <SmartLink href={serviceLink} style={{ textDecoration: "none" }}>
            <Text variant="body-default-s" color="primary">
              En savoir plus →
            </Text>
          </SmartLink>
        </Flex>
      </Column>
    </CustomRevealFx>
  );
};
