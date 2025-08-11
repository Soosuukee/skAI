"use client";

import React from "react";
import { Heading, RevealFx, Column, Text } from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { useProvider } from "@/app/hooks/useProvider";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderServicePageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderServicePage({
  params,
}: ProviderServicePageProps) {
  const resolvedParams = React.use(params);
  const { provider, loading, error } = useProvider(resolvedParams.slug);

  if (loading) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Chargement...</Heading>
      </Column>
    );
  }

  if (error || !provider) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Erreur: {error || "Provider non trouvé"}</Heading>
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

      {/* Contenu temporaire */}
      <RevealFx translateY={4} fillWidth delay={0.3}>
        <Column gap="16" horizontal="center" paddingY="48">
          <Heading as="h2" variant="display-strong-s">
            Services en cours de développement
          </Heading>
          <Text variant="body-default-l" color="neutral-medium">
            Les services de {provider.firstName} seront bientôt disponibles de
            manière dynamique.
          </Text>
        </Column>
      </RevealFx>
    </Column>
  );
}
