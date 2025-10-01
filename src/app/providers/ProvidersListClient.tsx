"use client";

import React from "react";
import { Heading, RevealFx, Column, Flex, Tag } from "@/once-ui/components";
import { Schema } from "@/once-ui/modules";
import { useProviders } from "@/app/hooks/useProviders";
import { ProviderCard } from "@/components/providers/ProviderCard";
import styles from "./ProvidersGrid.module.scss";

interface ProvidersListClientProps {
  title: string;
  description: string;
  baseURL: string;
}

export default function ProvidersListClient({
  title,
  description,
  baseURL,
}: ProvidersListClientProps) {
  const { providers: providersData, loading, error } = useProviders();

  if (loading) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
        <Heading>Chargement des experts...</Heading>
      </Column>
    );
  }

  if (error) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
        <Heading color="error">Erreur: {error}</Heading>
      </Column>
    );
  }

  return (
    <Column
      fillWidth
      gap="xl"
      horizontal="center"
      paddingX="32"
      style={{ maxWidth: "80vw" }}
    >
      <Schema
        as="webPage"
        baseURL={baseURL}
        path="/providers"
        title={title}
        description={description}
        image={`${baseURL}/og?title=${encodeURIComponent(title)}`}
      />

      <Column fillWidth paddingY="16" gap="m">
        <RevealFx translateY={4} fillWidth delay={0.1}>
          <Heading as="h1" variant="display-strong-s">
            {title}
          </Heading>
        </RevealFx>
        <Flex gap="8" wrap border="neutral-alpha-medium" radius="m" padding="8">
          <Tag size="s" variant="neutral">
            Filtres à venir
          </Tag>
        </Flex>
      </Column>

      <Column fillWidth gap="l">
        <div className={styles.grid}>
          {providersData.map((provider, idx) => (
            <ProviderCard
              key={provider.slug}
              provider={provider as any}
              index={idx}
            />
          ))}
        </div>
      </Column>
    </Column>
  );
}
