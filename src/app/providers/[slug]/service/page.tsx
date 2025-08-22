"use client";

import React from "react";
import { Heading, RevealFx, Column, Text } from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { useProvider } from "@/app/hooks/useProvider";
import { useProviderServices } from "@/app/hooks/useProviderServices";
import { ProviderServices } from "@/components/service/ProviderServices";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderServicePageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderServicePage({
  params,
}: ProviderServicePageProps) {
  const resolvedParams = React.use(params);
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useProvider(resolvedParams.slug);
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useProviderServices(resolvedParams.slug);

  if (providerLoading || servicesLoading) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Chargement...</Heading>
      </Column>
    );
  }

  if (providerError || !provider) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Erreur: {providerError || "Provider non trouvé"}</Heading>
      </Column>
    );
  }

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}/service`}
        title="Mes Services"
        description="Nous aidons les entreprises à passer de l'idée au produit"
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${provider.firstName} ${provider.lastName} - Services`
        )}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}/providers/${provider.slug}/about`,
          image: `${baseURL}${provider.avatar}`,
        }}
      />

      {/* Header */}
      <Column fillWidth paddingY="24" gap="m">
        <CustomRevealFx translateY={4} delay={0.1} fillWidth>
          <Heading wrap="balance" variant="display-strong-l">
            Mes Services
          </Heading>
        </CustomRevealFx>
        <RevealFx translateY={4} fillWidth delay={0.2}>
          <Text variant="body-default-l" color="neutral-medium">
            Nous aidons les entreprises à passer de l'idée au produit
          </Text>
        </RevealFx>
      </Column>

      {/* Liste des services */}
      <ProviderServices
        services={services}
        providerSlug={resolvedParams.slug}
      />
    </Column>
  );
}
