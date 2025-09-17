"use client";

import React from "react";
import { Column, Heading, Text, RevealFx } from "@/once-ui/components";
import type { Service } from "@/app/types/service";
import { ServiceCard } from "./ServiceCard";

interface ProviderServicesProps {
  services: Service[];
  providerSlug: string;
}

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
    <Column gap="l" fillWidth>
      {services.map((service, index) => (
        <ServiceCard
          key={`${providerSlug}-${service.id}-${index}`}
          service={service}
          providerSlug={providerSlug}
          index={index}
        />
      ))}
    </Column>
  );
};
