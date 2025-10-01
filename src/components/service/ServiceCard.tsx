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
  const serviceLink = `/providers/${providerSlug}/service/${service.slug}`;

  return (
    <CustomRevealFx translateY={4} delay={0.1 * (index + 1)} fillWidth>
      <SmartLink href={serviceLink} style={{ textDecoration: "none" }}>
        <Flex
          className="s-flex-hide"
          border="neutral-alpha-medium"
          radius="m"
          overflow="hidden"
          style={{ height: 220, cursor: "pointer" }}
        >
          {service.cover ? (
            <Flex style={{ flex: "0 0 35%", maxWidth: "35%" }}>
              <SmartImage
                src={makeAbsolute(service.cover) as string}
                alt={`Image de couverture - ${service.title}`}
                aspectRatio="16/9"
                style={{ width: "100%", height: "220px", objectFit: "cover" }}
              />
            </Flex>
          ) : (
            <Flex
              style={{
                flex: "0 0 35%",
                maxWidth: "35%",
                height: "220px",
                background: "#f0f0f0",
              }}
              vertical="center"
              horizontal="center"
            >
              <Text color="neutral-medium">Pas d'image</Text>
            </Flex>
          )}

          <Flex flex="1" padding="16" direction="column" gap="8">
            <Heading as="h3" variant="display-strong-s" style={{ margin: 0 }}>
              {service.title}
            </Heading>
            <Text
              variant="body-default-m"
              color="neutral-medium"
              style={{ flexGrow: 1 }}
            >
              {service.summary}
            </Text>
            <Flex horizontal="space-between" vertical="center">
              <Text variant="body-default-s" color="neutral-strong">
                {service.minPrice != null
                  ? `À partir de ${service.minPrice}€`
                  : "Tarif sur devis"}
              </Text>
              <Text variant="body-default-s" color="primary">
                En savoir plus →
              </Text>
            </Flex>
          </Flex>
        </Flex>

        <Column
          className="s-flex-show"
          border="neutral-alpha-medium"
          radius="m"
          overflow="hidden"
          gap="0"
          style={{ cursor: "pointer" }}
        >
          {service.cover ? (
            <SmartImage
              src={makeAbsolute(service.cover) as string}
              alt={`Image de couverture - ${service.title}`}
              aspectRatio="16/9"
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />
          ) : (
            <Flex
              style={{ width: "100%", height: "180px", background: "#f0f0f0" }}
              vertical="center"
              horizontal="center"
            >
              <Text color="neutral-medium">Pas d'image</Text>
            </Flex>
          )}
          <Column padding="16" gap="8">
            <Heading as="h3" variant="display-strong-s" style={{ margin: 0 }}>
              {service.title}
            </Heading>
            <Flex horizontal="space-between" vertical="center">
              <Text variant="body-default-s" color="neutral-strong">
                {service.minPrice != null
                  ? `À partir de ${service.minPrice}€`
                  : "Tarif sur devis"}
              </Text>
              <Text variant="body-default-s" color="primary">
                Consulter le service →
              </Text>
            </Flex>
          </Column>
        </Column>
      </SmartLink>
    </CustomRevealFx>
  );
};
