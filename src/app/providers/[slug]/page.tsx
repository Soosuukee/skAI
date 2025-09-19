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
import { ProviderHomeServiceCard } from "@/components/service/ProviderHomeServiceCard";
import { ProviderHomeArticleCard } from "@/components/blog/ProviderHomeArticleCard";
import {
  useProviderBasic,
  useProviderArticles,
  useProviderServices,
} from "@/app/hooks/providers";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const resolvedParams = React.use(params);

  // Utiliser les hooks spécialisés - provider, articles et services pour cette page
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
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useProviderServices(resolvedParams.slug);

  // Calculer les états globaux
  const loading = providerLoading || articlesLoading || servicesLoading;
  const error = providerError || articlesError || servicesError;

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

  // Récupère les 2 derniers articles de blog
  const articlesArray = articles || [];
  const blogList = articlesArray.slice(0, 2);

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
              Bienvenue sur le portfolio de {provider.firstName}{" "}
              {provider.lastName}
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
                  src={makeAbsolute(provider.avatar)}
                  size="m"
                />
                À propos
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
            Les services proposés par {provider.firstName}
          </Heading>
        </CustomRevealFx>

        {services.length > 0 ? (
          <>
            <Grid columns="2" mobileColumns="1" fillWidth gap="l">
              {services.slice(0, 2).map((service, idx) => (
                <ProviderHomeServiceCard
                  key={service.id}
                  service={service}
                  providerSlug={provider.slug}
                  index={idx}
                />
              ))}
            </Grid>
            <SmartLink
              href={servicePath}
              style={{
                display: "block",
                marginTop: "1rem",
                color: "var(--brand)",
              }}
            >
              Voir toutes les prestations de {provider.firstName}
            </SmartLink>
          </>
        ) : (
          <>
            <RevealFx translateY={4} fillWidth delay={0.2}>
              <Text variant="body-default-l" color="neutral-medium">
                {provider.firstName} n'a pas encore de services publiés.
              </Text>
            </RevealFx>
            <SmartLink
              href={servicePath}
              style={{
                display: "block",
                marginTop: "1rem",
                color: "var(--brand)",
              }}
            >
              Voir la page des services
            </SmartLink>
          </>
        )}
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
      <Grid columns="2" mobileColumns="1" fillWidth marginBottom="12" gap="l">
        {blogList.map((article, idx) => (
          <ProviderHomeArticleCard
            key={article.slug}
            article={article}
            providerSlug={provider.slug}
            index={idx}
          />
        ))}
      </Grid>
      <SmartLink
        href={blogPath}
        style={{ display: "block", marginTop: "1rem", color: "var(--brand)" }}
      >
        Voir plus d'articles de {provider.firstName}
      </SmartLink>
    </Column>
  );
}
