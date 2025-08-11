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
  SmartImage,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { useProvider } from "@/app/hooks/useProvider";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderAboutPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderAboutPage({ params }: ProviderAboutPageProps) {
  const resolvedParams = React.use(params);
  const { provider, about, loading, error } = useProvider(resolvedParams.slug);

  if (loading) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Chargement...</Heading>
      </Column>
    );
  }

  if (error || !provider || !about) {
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
        path={`/providers/${provider.slug}/about`}
        title={`A propos de ${provider.firstName} ${provider.lastName}`}
        description={`Rencontrez ${provider.firstName} ${provider.lastName}, ${provider.role} de ${provider.location}`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${provider.firstName} ${provider.lastName}`
        )}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}/providers/${provider.slug}/about`,
          image: `${baseURL}${provider.avatar}`,
        }}
      />

      {/* Header avec avatar et intro */}
      <Column fillWidth paddingY="24" gap="m">
        <Flex gap="16" vertical="center" fillWidth>
          <Avatar src={provider.avatar} size="xl" />
          <Column>
            <Heading variant="display-strong-m">
              {provider.firstName} {provider.lastName}
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              {provider.role} • {provider.location}
            </Text>
          </Column>
        </Flex>

        {about.intro.display && (
          <RevealFx translateY={4} fillWidth delay={0.2}>
            <Text variant="body-default-l">{about.intro.description}</Text>
          </RevealFx>
        )}
      </Column>

      {/* Section Expérience professionnelle */}
      {about.work.display && (
        <Column fillWidth gap="l">
          <CustomRevealFx translateY={4} delay={0.1} fillWidth>
            <Heading as="h2" variant="display-strong-s">
              {about.work.title}
            </Heading>
          </CustomRevealFx>

          <Grid columns="1" fillWidth gap="16">
            {about.work.experiences.map((experience, idx) => (
              <CustomRevealFx
                key={idx}
                translateY={4}
                delay={0.1 * (idx + 1)}
                fillWidth
              >
                <Column
                  gap="12"
                  padding="16"
                  style={{
                    border: "1px solid var(--neutral-alpha-medium)",
                    borderRadius: "0.5rem",
                    background: "var(--surface)",
                  }}
                >
                  <Flex gap="12" vertical="center">
                    {experience.images?.[0] && (
                      <SmartImage
                        src={experience.images[0].src}
                        alt={experience.images[0].alt}
                        aspectRatio="16 / 9"
                        style={{
                          width: "80px",
                          height: "45px",
                          borderRadius: "0.25rem",
                        }}
                      />
                    )}
                    <Column>
                      <Heading as="h3" variant="heading-strong-s">
                        {experience.company}
                      </Heading>
                      <Text variant="body-default-s" color="neutral-medium">
                        {experience.timeframe} • {experience.role}
                      </Text>
                    </Column>
                  </Flex>

                  <Column gap="8">
                    {experience.achievements.map(
                      (achievement, achievementIdx) => (
                        <Text key={achievementIdx} variant="body-default-s">
                          • {achievement}
                        </Text>
                      )
                    )}
                  </Column>
                </Column>
              </CustomRevealFx>
            ))}
          </Grid>
        </Column>
      )}

      {/* Section Études */}
      {about.studies.display && (
        <Column fillWidth gap="l">
          <CustomRevealFx translateY={4} delay={0.1} fillWidth>
            <Heading as="h2" variant="display-strong-s">
              {about.studies.title}
            </Heading>
          </CustomRevealFx>

          <Grid columns="1" fillWidth gap="16">
            {about.studies.institutions.map((institution, idx) => (
              <CustomRevealFx
                key={idx}
                translateY={4}
                delay={0.1 * (idx + 1)}
                fillWidth
              >
                <Column
                  gap="8"
                  padding="16"
                  style={{
                    border: "1px solid var(--neutral-alpha-medium)",
                    borderRadius: "0.5rem",
                    background: "var(--surface)",
                  }}
                >
                  <Heading as="h3" variant="heading-strong-s">
                    {institution.degreeTitle}
                  </Heading>
                  <Text variant="body-default-s" color="neutral-medium">
                    {institution.institutionName} • {institution.yearsAttended}
                  </Text>
                  <Text variant="body-default-s">
                    {institution.programDescription}
                  </Text>
                </Column>
              </CustomRevealFx>
            ))}
          </Grid>
        </Column>
      )}

      {/* Section Technologies */}
      {about.technical.display && (
        <Column fillWidth gap="l">
          <CustomRevealFx translateY={4} delay={0.1} fillWidth>
            <Heading as="h2" variant="display-strong-s">
              {about.technical.title}
            </Heading>
          </CustomRevealFx>

          <Grid columns="2" mobileColumns="1" fillWidth gap="16">
            {about.technical.skills.map((skill, idx) => (
              <CustomRevealFx
                key={idx}
                translateY={4}
                delay={0.1 * (idx + 1)}
                fillWidth
              >
                <Column
                  gap="12"
                  padding="16"
                  style={{
                    border: "1px solid var(--neutral-alpha-medium)",
                    borderRadius: "0.5rem",
                    background: "var(--surface)",
                  }}
                >
                  {skill.images?.[0] && (
                    <SmartImage
                      src={skill.images[0].src}
                      alt={skill.images[0].alt}
                      aspectRatio="16 / 9"
                    />
                  )}
                  <Heading as="h3" variant="heading-strong-s">
                    {skill.title}
                  </Heading>
                  <Text variant="body-default-s">{skill.description}</Text>
                </Column>
              </CustomRevealFx>
            ))}
          </Grid>
        </Column>
      )}
    </Column>
  );
}
