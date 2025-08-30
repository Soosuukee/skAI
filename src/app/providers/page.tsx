"use client";

import React from "react";
import {
  Heading,
  RevealFx,
  Column,
  Grid,
  Text,
  SmartImage,
  SmartLink,
  Avatar,
  Flex,
  Tag,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";
import { useProviders } from "@/app/hooks/useProviders";

export default function ProvidersPage() {
  const { providers: providersData, loading, error } = useProviders();

  if (loading) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
        <Text>Chargement des experts...</Text>
      </Column>
    );
  }

  if (error) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
        <Text color="error">Erreur: {error}</Text>
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
        title="Nos Experts IA - Découvrez nos spécialistes"
        description="Rencontrez notre équipe d'experts en intelligence artificielle, machine learning et développement de solutions innovantes."
        image={`${baseURL}/og?title=${encodeURIComponent("Nos Experts IA")}`}
      />

      {/* Header */}
      <Column fillWidth paddingY="24" gap="m">
        <CustomRevealFx translateY={4} delay={0.1} fillWidth>
          <Heading wrap="balance" variant="display-strong-l">
            Nos Experts IA
          </Heading>
        </CustomRevealFx>
        <RevealFx translateY={4} fillWidth delay={0.2}>
          <Text variant="body-default-l" color="neutral-medium">
            Découvrez notre équipe d'experts en intelligence artificielle,
            machine learning et développement de solutions innovantes.
          </Text>
        </RevealFx>
      </Column>

      {/* Liste des providers */}
      <Column fillWidth gap="l">
        <RevealFx translateY={4} fillWidth delay={0.3}>
          <Heading as="h2" variant="display-strong-s">
            Tous nos experts ({providersData.length})
          </Heading>
        </RevealFx>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "24px",
            width: "100%",
            alignItems: "stretch",
          }}
        >
          {providersData.map((provider, idx) => {
            return (
              <CustomRevealFx
                key={provider.slug}
                translateY={4}
                delay={0.1 * (idx + 1)}
                fillWidth
                style={{ width: "100%" }}
              >
                <SmartLink
                  href={`/providers/${provider.slug}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                    width: "100%",
                  }}
                >
                  <Column
                    gap="20"
                    padding="32"
                    style={{
                      border: "1px solid var(--neutral-alpha-medium)",
                      borderRadius: "0.75rem",
                      background: "var(--surface)",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      height: "320px",
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      boxSizing: "border-box",
                    }}
                    className="hover:shadow-lg hover:border-neutral-alpha-strong"
                  >
                    {/* Avatar et infos de base */}
                    <Flex gap="16" vertical="center">
                      <Avatar
                        src={
                          provider.avatar ||
                          (provider.profilePicture
                            ? provider.profilePicture.startsWith("http")
                              ? provider.profilePicture
                              : `${
                                  process.env.NEXT_PUBLIC_API_BASE_URL ||
                                  "http://localhost:8080/api/v1"
                                }${provider.profilePicture}`
                            : undefined)
                        }
                        size="xl"
                        style={{ flexShrink: 0 }}
                      />
                      <Column gap="4">
                        <Heading as="h3" variant="heading-strong-l">
                          {provider.firstName} {provider.lastName}
                        </Heading>
                        {provider.job && (
                          <Text variant="body-default-s" color="neutral-medium">
                            {provider.job.title}
                          </Text>
                        )}
                        <Text variant="body-default-s" color="neutral-medium">
                          📍 {String(provider.country?.name)}
                        </Text>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                            marginTop: 8,
                          }}
                        >
                          {provider.languages?.map((language) => (
                            <Tag key={language.id} variant="brand" size="s">
                              {language.name}
                            </Tag>
                          ))}
                        </div>
                      </Column>
                    </Flex>

                    {/* Lien vers le profil */}
                    <Text
                      variant="body-default-s"
                      style={{
                        color: "var(--brand)",
                        fontWeight: "500",
                        marginTop: "auto",
                      }}
                    >
                      Voir le profil complet →
                    </Text>
                  </Column>
                </SmartLink>
              </CustomRevealFx>
            );
          })}
        </div>
      </Column>

      {/* Footer */}
      <RevealFx translateY={4} fillWidth delay={0.4}>
        <Column gap="16" horizontal="center" paddingY="32">
          <Text variant="body-default-l" color="neutral-medium">
            Vous cherchez un expert spécifique ? Contactez-nous pour discuter de
            vos besoins.
          </Text>
        </Column>
      </RevealFx>
    </Column>
  );
}
