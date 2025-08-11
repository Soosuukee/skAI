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
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";
import providersData from "@/data/providers.json";

export default function ProvidersPage() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
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

        <Grid columns="2" mobileColumns="1" fillWidth gap="16">
          {providersData.map((provider, idx) => (
            <CustomRevealFx
              key={provider.slug}
              translateY={4}
              delay={0.1 * (idx + 1)}
              fillWidth
            >
              <SmartLink
                href={`/providers/${provider.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Column
                  gap="16"
                  padding="24"
                  style={{
                    border: "1px solid var(--neutral-alpha-medium)",
                    borderRadius: "0.5rem",
                    background: "var(--surface)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  className="hover:shadow-lg hover:border-neutral-alpha-strong"
                >
                  {/* Avatar et infos de base */}
                  <Flex gap="16" vertical="center">
                    <Avatar
                      src={provider.avatar}
                      size="xl"
                      style={{ flexShrink: 0 }}
                    />
                    <Column gap="4">
                      <Heading as="h3" variant="heading-strong-l">
                        {provider.firstName} {provider.lastName}
                      </Heading>
                      <Text variant="body-default-s" color="neutral-medium">
                        {provider.role}
                      </Text>
                      <Text variant="body-default-s" color="neutral-medium">
                        📍 {provider.location}
                      </Text>
                    </Column>
                  </Flex>

                  {/* Langues parlées */}
                  {provider.languages && provider.languages.length > 0 && (
                    <Column gap="8">
                      <Text variant="body-default-s" color="neutral-medium">
                        Langues parlées :
                      </Text>
                      <Flex gap="8" wrap>
                        {provider.languages.map((language, langIdx) => (
                          <Text
                            key={langIdx}
                            variant="body-default-s"
                            style={{
                              background: "var(--neutral-alpha-weak)",
                              padding: "0.25rem 0.5rem",
                              borderRadius: "0.25rem",
                              fontSize: "0.75rem",
                            }}
                          >
                            {language}
                          </Text>
                        ))}
                      </Flex>
                    </Column>
                  )}

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
          ))}
        </Grid>
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
