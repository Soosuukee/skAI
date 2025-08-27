"use client";

import React from "react";
import {
  Card,
  Column,
  Flex,
  Heading,
  Text,
  Button,
  Badge,
  RevealFx,
} from "@/once-ui/components";
import type { Service } from "@/app/types/service";
import { CustomRevealFx } from "@/components/CustomRevealFx";

interface ProviderServicesProps {
  services: Service[];
  providerSlug: string;
}

const formatPrice = (minPrice: number | null, maxPrice: number | null) => {
  if (minPrice === null && maxPrice === null) {
    return "Sur devis";
  }
  if (minPrice === maxPrice) {
    return `${minPrice?.toLocaleString()}€`;
  }
  return `${minPrice?.toLocaleString()}€ - ${maxPrice?.toLocaleString()}€`;
};

export const ProviderServices: React.FC<ProviderServicesProps> = ({
  services,
  providerSlug,
}) => {
  if (services.length === 0) {
    return (
      <RevealFx translateY={4} fillWidth delay={0.3}>
        <Column gap="16" horizontal="center" paddingY="48">
          <Heading as="h2" variant="display-strong-s">
            Aucun service disponible
          </Heading>
          <Text variant="body-default-l" color="neutral-medium">
            Ce provider n'a pas encore de services publiés.
          </Text>
        </Column>
      </RevealFx>
    );
  }

  return (
    <Column gap="xl" fillWidth>
      <CustomRevealFx translateY={4} delay={0.3} fillWidth>
        <Heading as="h2" variant="display-strong-m">
          Services disponibles ({services.length})
        </Heading>
      </CustomRevealFx>

      <Flex gap="l" wrap horizontal="center">
        {services.map((service, index) => (
          <RevealFx
            key={service.serviceId}
            translateY={4}
            delay={0.4 + index * 0.1}
          >
            <Card
              as="article"
              maxWidth={400}
              padding="l"
              gap="m"
              border="neutral-alpha-medium"
              shadow="m"
            >
              <Column gap="m">
                <Flex vertical="center" gap="m">
                  <Heading as="h3" variant="display-strong-s">
                    {service.title}
                  </Heading>
                  <Badge>
                    {formatPrice(service.minPrice, service.maxPrice)}
                  </Badge>
                </Flex>

                <Text variant="body-default-s" color="neutral-medium">
                  Service créé le{" "}
                  {new Date(service.createdAt).toLocaleDateString("fr-FR")}
                </Text>

                <Flex gap="s" horizontal="end">
                  <Button
                    href={`/providers/${providerSlug}/service/${service.serviceId}`}
                    variant="primary"
                    size="s"
                  >
                    Voir les détails
                  </Button>
                </Flex>
              </Column>
            </Card>
          </RevealFx>
        ))}
      </Flex>
    </Column>
  );
};
