"use client";

import React from "react";
import {
  Heading,
  Flex,
  Avatar,
  RevealFx,
  Column,
  SmartLink,
  Grid,
  Text,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import Post from "@/components/blog/Post";
import { useProvider } from "@/app/hooks/useProvider";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const resolvedParams = React.use(params);
  const { provider, social, about, articles, loading, error } = useProvider(
    resolvedParams.slug
  );

  // Récupère les 2 derniers articles de blog
  const blogList = articles.slice(0, 2);

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

  // Chemins dynamiques
  const homePath = `/providers/${provider.slug}`;
  const aboutPath = `/providers/${provider.slug}/about`;
  const servicePath = `/providers/${provider.slug}/service`;
  const blogPath = `/providers/${provider.slug}/blog`;

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={homePath}
        title={`Bienvenue sur le Portfolio de ${provider.firstName} ${provider.lastName}`}
        description={`Ce portfolio presente mon travail en tant que ${provider.role}`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${provider.firstName} ${provider.lastName}`
        )}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}${aboutPath}`,
          image: `${baseURL}${provider.avatar}`,
        }}
      />
      <Column fillWidth paddingY="24" gap="m">
        <Column maxWidth="s">
          <RevealFx
            translateY="4"
            fillWidth
            horizontal="start"
            paddingBottom="16"
          >
            <Heading wrap="balance" variant="display-strong-l">
              Le moteur de l'IA nouvelle génération
            </Heading>
          </RevealFx>
          <RevealFx
            paddingTop="12"
            delay={0.4}
            horizontal="start"
            paddingLeft="12"
          >
            <a
              id="about"
              href={aboutPath}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                background: "var(--surface)",
                border: "1px solid var(--neutral-alpha-medium)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Flex gap="8" vertical="center">
                <Avatar
                  style={{ marginLeft: "-0.75rem", marginRight: "0.25rem" }}
                  src={provider.avatar}
                  size="m"
                />
                A propos
              </Flex>
            </a>
          </RevealFx>
        </Column>
      </Column>
      {/* Section services */}
      <Column fillWidth gap="l">
        <CustomRevealFx translateY={4} delay={0.1} fillWidth>
          <Heading
            as="h2"
            marginTop="32"
            marginBottom="16"
            variant="display-strong-s"
          >
            Les services proposée par {provider.firstName}
          </Heading>
        </CustomRevealFx>
        {/* Pour l'instant, on affiche un message car les services ne sont pas encore dynamiques */}
        <RevealFx translateY={4} fillWidth delay={0.2}>
          <Text variant="body-default-l">
            Les services seront bientôt disponibles de manière dynamique.
          </Text>
        </RevealFx>
        <SmartLink
          href={servicePath}
          style={{ display: "block", marginTop: "1rem", color: "var(--brand)" }}
        >
          Voir toutes les prestations de {provider.firstName}
        </SmartLink>
      </Column>
      {/* Section blogs */}
      <RevealFx translateY={4} fillWidth delay={0.6}>
        <Heading
          as="h2"
          marginTop="32"
          marginBottom="16"
          variant="display-strong-s"
        >
          Derniers articles
        </Heading>
      </RevealFx>
      {/* Articles récents */}
      <Grid columns="2" mobileColumns="1" fillWidth marginBottom="12" gap="12">
        {blogList.map((post, idx) => (
          <CustomRevealFx
            key={post.slug}
            translateY={4}
            delay={0.1 * (idx + 1)}
            fillWidth
          >
            <Post
              article={post}
              thumbnail={true}
              direction="column"
              providerSlug={provider.slug}
            />
          </CustomRevealFx>
        ))}
      </Grid>
      <SmartLink
        href={blogPath}
        style={{ display: "block", marginTop: "1rem", color: "var(--brand)" }}
      >
        Voir plus d'article de {provider.firstName}
      </SmartLink>
    </Column>
  );
}
