"use client";

import React from "react";
import {
  Heading,
  RevealFx,
  Column,
  Text,
  Flex,
  Avatar,
  SmartLink,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { useProvider } from "@/app/hooks/useProvider";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";
import { getServicesByProvider } from "@/app/utils/serviceUtils";

interface ProviderServiceDetailPageProps {
  params: Promise<{ slug: string; serviceSlug: string }>;
}

export default function ProviderServiceDetailPage({
  params,
}: ProviderServiceDetailPageProps) {
  const resolvedParams = React.use(params);
  const { provider, loading, error } = useProvider(resolvedParams.slug);

  // Récupérer les services du prestataire
  const services = getServicesByProvider(resolvedParams.slug);
  const currentService = services.find(
    (service) => service.slug === resolvedParams.serviceSlug
  );

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

  if (!currentService) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Service non trouvé</Heading>
        <Text>Le service demandé n'existe pas pour ce prestataire.</Text>
      </Column>
    );
  }

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}/service/${currentService.slug}`}
        title={currentService.title}
        description={`Service ${currentService.title} proposé par ${provider.firstName} ${provider.lastName}`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          currentService.title
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
            {currentService.title}
          </Heading>
        </CustomRevealFx>
        <RevealFx translateY={4} fillWidth delay={0.2}>
          <Flex gap="12" vertical="center">
            <Avatar src={provider.avatar} size="m" />
            <Text variant="body-default-l" color="neutral-medium">
              Proposé par{" "}
              <strong>
                {provider.firstName} {provider.lastName}
              </strong>
            </Text>
          </Flex>
        </RevealFx>
      </Column>

      {/* Contenu du service */}
      <RevealFx translateY={4} fillWidth delay={0.3}>
        <Column gap="24" fillWidth>
          {/* Image du service */}
          <div
            style={{
              width: "100%",
              height: "300px",
              background: "var(--neutral-alpha-low)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--neutral-alpha-medium)",
              fontSize: "3rem",
            }}
          >
            📋
          </div>

          {/* Description */}
          <Column gap="16">
            <Heading variant="heading-strong-m">Description du service</Heading>
            <Text variant="body-default-l" color="neutral-high">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </Text>
          </Column>

          {/* Prix */}
          {currentService.min_price && currentService.max_price && (
            <Column gap="16">
              <Heading variant="heading-strong-m">Tarification</Heading>
              <Text variant="body-default-l" color="neutral-high">
                Prix :{" "}
                {currentService.min_price === currentService.max_price
                  ? `${currentService.min_price}€`
                  : `${currentService.min_price}€ - ${currentService.max_price}€`}
              </Text>
            </Column>
          )}

          {/* Bouton de contact */}
          <Flex horizontal="center" paddingY="24">
            <SmartLink
              href={`/providers/${provider.slug}`}
              style={{
                padding: "12px 24px",
                borderRadius: "8px",
                background: "var(--brand)",
                color: "var(--brand-on-background)",
                textDecoration: "none",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Contacter {provider.firstName}
            </SmartLink>
          </Flex>
        </Column>
      </RevealFx>
    </Column>
  );
}
