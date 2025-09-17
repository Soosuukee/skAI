"use client";

import React from "react";
import { Heading, RevealFx, Column, Text } from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { useProviderBasic, useProviderArticles } from "@/app/hooks/providers";
import { ProviderArticles } from "@/components/blog/ProviderArticles";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderBlogPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderBlogPage({ params }: ProviderBlogPageProps) {
  const resolvedParams = React.use(params);

  // Utiliser les hooks spécialisés - seulement provider et articles pour cette page
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useProviderBasic(resolvedParams.slug);
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
  } = useProviderArticles(resolvedParams.slug);

  // Calculer les états globaux
  const loading = providerLoading || articlesLoading;
  const error = providerError || articlesError;

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
        path={`/providers/${provider.slug}/blog`}
        title={`Les articles écrits par ${provider.firstName}`}
        description={`Read what ${provider.firstName} ${provider.lastName} has been up to recently`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${provider.firstName} ${provider.lastName} - Blog`
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
            Les articles écrits par {provider.firstName}
          </Heading>
        </CustomRevealFx>
        <RevealFx translateY={4} fillWidth delay={0.2}>
          <Text variant="body-default-l" color="neutral-medium">
            Découvrez les derniers articles et réflexions de{" "}
            {provider.firstName} {provider.lastName} sur l'IA, la technologie et
            l'innovation.
          </Text>
        </RevealFx>
      </Column>

      {/* Liste des articles */}
      <ProviderArticles articles={articles} providerSlug={provider.slug} />
    </Column>
  );
}
