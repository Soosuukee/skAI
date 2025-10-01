"use client";

import React from "react";
import {
  Avatar,
  Button,
  Column,
  Flex,
  Heading,
  Icon,
  IconButton,
  SmartImage,
  Tag,
  Text,
  RevealFx,
} from "@/once-ui/components";

import { baseURL } from "@/app/resources";
import TableOfContents from "@/components/about/TableOfContents";
import { ProviderExperiences } from "@/components/about/ProviderExperiences";
import { ProviderEducation } from "@/components/about/ProviderEducation";
import { ProviderSkills } from "@/components/about/ProviderSkills";
import styles from "@/components/about/about.module.scss";
import {
  useProvider,
  useProviderExperience,
  useProviderEducation,
  useProviderArticles,
} from "@/app/hooks/providers";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderAboutPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderAboutPage({ params }: ProviderAboutPageProps) {
  const resolvedParams = React.use(params);

  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useProvider(resolvedParams.slug);

  console.log("=== ABOUT PAGE DEBUG ===");
  console.log("Slug reçu:", resolvedParams.slug);
  console.log("Provider dans about:", provider);
  console.log("Provider type:", typeof provider);
  console.log("Provider est null?", provider === null);
  console.log("Provider est undefined?", provider === undefined);
  console.log("Loading:", providerLoading);
  console.log("Error:", providerError);
  if (provider) {
    console.log("Provider firstName:", provider.firstName);
    console.log("Provider lastName:", provider.lastName);
  }
  console.log("=== END ABOUT DEBUG ===");
  const {
    experiences,
    loading: experiencesLoading,
    error: experiencesError,
  } = useProviderExperience(resolvedParams.slug);
  const {
    educations,
    loading: educationsLoading,
    error: educationsError,
  } = useProviderEducation(resolvedParams.slug);
  const {
    articles,
    loading: articlesLoading,
    error: articlesError,
  } = useProviderArticles(resolvedParams.slug);

  // Calculer les états globaux
  const loading =
    providerLoading ||
    experiencesLoading ||
    educationsLoading ||
    articlesLoading;
  const error =
    providerError || experiencesError || educationsError || articlesError;

  // Configuration simple pour l'affichage
  const about = provider
    ? {
        intro: {
          display: true,
          title: "Introduction",
          description:
            provider.description ||
            `${provider.firstName} ${
              provider.lastName
            } est un professionnel passionné par l'innovation technologique. Spécialisé dans ${
              provider.job?.title || "l'intelligence artificielle"
            }, il/elle combine expertise technique et vision stratégique pour créer des solutions intelligentes qui transforment les industries. Avec une approche centrée sur l'utilisateur et une expertise approfondie dans les technologies émergentes, ${
              provider.firstName
            } s'efforce de développer des solutions qui répondent aux défis complexes du monde moderne.`,
        },
        work: {
          display: true,
          title: "Expérience professionnelle",
        },
        studies: {
          display: true,
          title: "Études et Formation",
        },
        technical: {
          display: true,
          title: "Mes Technologies et Compétences",
        },
        calendar: {
          display: false,
          link: "#",
        },
        tableOfContent: {
          display: true,
        },
        avatar: {
          display: true,
        },
      }
    : null;

  // Social links vides pour l'instant
  const social: any[] = [];

  // Fonction simple pour les URLs d'images
  const makeAbsolute = (url?: string) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    const apiBase =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
    const origin = new URL(apiBase).origin;
    return url.startsWith("/") ? `${origin}${url}` : `${origin}${url}`;
  };

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

  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}/about`}
        title={`À propos de ${provider.firstName} ${provider.lastName}`}
        description={`En savoir plus sur ${provider.firstName} ${provider.lastName}, ${provider.role}.`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `À propos de ${provider.firstName} ${provider.lastName}`
        )}`}
      />

      <RevealFx translateY={4} fillWidth delay={0.1}>
        <Heading variant="display-strong-l">
          À propos de {provider.firstName} {provider.lastName}
        </Heading>
      </RevealFx>
      <RevealFx fillWidth speed="medium" translateY={4}>
        <Flex fillWidth mobileDirection="column" horizontal="center">
          {about.avatar.display && (
            <Column
              className={styles.avatar}
              position="sticky"
              minWidth="160"
              paddingX="l"
              paddingBottom="xl"
              gap="m"
              flex={3}
              horizontal="center"
            >
              <Avatar
                src={makeAbsolute(provider.profilePicture || undefined) || ""}
                size="xl"
              />
              <Flex gap="8" vertical="center">
                <Icon onBackground="accent-weak" name="globe" />
                {provider.country?.name}
              </Flex>
              {provider.languages && provider.languages.length > 0 && (
                <Flex wrap gap="8">
                  {provider.languages.map((language: any, index: number) => (
                    <Tag key={language.id || language.name || index} size="l">
                      {language.name || language}
                    </Tag>
                  ))}
                </Flex>
              )}
              <Button
                href={`/providers/${provider.slug}/service`}
                variant="primary"
              >
                Mes Services
              </Button>
            </Column>
          )}
          <Column className={styles.blockAlign} flex={9} maxWidth={40}>
            <Column
              id={about.intro.title}
              fillWidth
              minHeight="160"
              vertical="center"
              marginBottom="32"
            >
              {about.calendar.display && (
                <Flex
                  fitWidth
                  border="brand-alpha-medium"
                  className={styles.blockAlign}
                  style={{
                    backdropFilter: "blur(var(--static-space-1))",
                  }}
                  background="brand-alpha-weak"
                  radius="full"
                  padding="4"
                  gap="8"
                  marginBottom="m"
                  vertical="center"
                >
                  <Icon
                    paddingLeft="12"
                    name="calendar"
                    onBackground="brand-weak"
                  />
                  <Flex paddingX="8">Schedule a call</Flex>
                  <IconButton
                    href={about.calendar.link}
                    data-border="rounded"
                    variant="secondary"
                    icon="chevronRight"
                  />
                </Flex>
              )}
              <Heading className={styles.textAlign} variant="display-strong-xl">
                {provider.firstName} {provider.lastName}
              </Heading>
              <Text
                className={styles.textAlign}
                variant="display-default-xs"
                onBackground="neutral-weak"
              >
                {provider.job?.title || "Expert IA"}
              </Text>
              {social.length > 0 && (
                <Flex
                  className={styles.blockAlign}
                  paddingTop="20"
                  paddingBottom="8"
                  gap="8"
                  wrap
                  horizontal="center"
                  fitWidth
                  data-border="rounded"
                >
                  {social.map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Button
                            className="s-flex-hide"
                            key={item.name}
                            href={item.link}
                            prefixIcon={item.icon}
                            label={item.name}
                            size="s"
                            variant="secondary"
                          />
                          <IconButton
                            className="s-flex-show"
                            size="l"
                            key={`${item.name}-icon`}
                            href={item.link}
                            icon={item.icon}
                            variant="secondary"
                          />
                        </React.Fragment>
                      )
                  )}
                </Flex>
              )}
            </Column>

            {about.intro.display && (
              <Column
                textVariant="body-default-l"
                fillWidth
                gap="m"
                marginBottom="xl"
              >
                {about.intro.description}
              </Column>
            )}

            {about.work.display && (
              <ProviderExperiences
                experiences={experiences}
                makeAbsolute={makeAbsolute}
              />
            )}

            {about.studies.display && (
              <ProviderEducation
                educations={educations}
                makeAbsolute={makeAbsolute}
              />
            )}

            {about.technical.display && (
              <ProviderSkills
                hardSkills={provider.hardSkills || []}
                softSkills={provider.softSkills || []}
              />
            )}
          </Column>
        </Flex>
      </RevealFx>
    </Column>
  );
}

function About({
  provider,
  social,
  about,
  makeAbsolute,
  experiences,
  educations,
}: {
  provider: any;
  social: any[];
  about: any;
  makeAbsolute: (url?: string) => string | undefined;
  experiences: any[];
  educations: any[];
}) {
  const structure = [
    {
      title: about.intro.title,
      display: about.intro.display,
      items: [],
    },
    {
      title: about.work.title,
      display: about.work.display,
      items: experiences.map((exp: any) => exp.companyName),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: educations.map((edu: any) => edu.institutionName),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: [
        ...(provider.hardSkills?.length > 0 ? ["Compétences Techniques"] : []),
        ...(provider.softSkills?.length > 0
          ? ["Compétences Comportementales"]
          : []),
      ],
    },
  ];

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={`A propos de ${provider.firstName} ${provider.lastName}`}
        description={`Rencontrez ${provider.firstName} ${
          provider.lastName
        }, expert IA de ${provider.country?.name ?? ""}`}
        path={`/providers/${provider.slug}/about`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${provider.firstName} ${provider.lastName}`
        )}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}/providers/${provider.slug}/about`,
          image:
            makeAbsolute(provider.profilePicture || undefined) ||
            (provider.profilePicture
              ? `${baseURL}${provider.profilePicture}`
              : undefined),
        }}
      />
      {about.tableOfContent.display && (
        <Column
          left="0"
          style={{ top: "50%", transform: "translateY(-50%)" }}
          position="fixed"
          paddingLeft="24"
          gap="32"
          hide="s"
        >
          <TableOfContents structure={structure} about={about} />
        </Column>
      )}
      <RevealFx fillWidth speed="medium" translateY={4}>
        <Flex fillWidth mobileDirection="column" horizontal="center">
          {about.avatar.display && (
            <Column
              className={styles.avatar}
              position="sticky"
              minWidth="160"
              paddingX="l"
              paddingBottom="xl"
              gap="m"
              flex={3}
              horizontal="center"
            >
              <Avatar
                src={makeAbsolute(provider.profilePicture || undefined) || ""}
                size="xl"
              />
              <Flex gap="8" vertical="center">
                <Icon onBackground="accent-weak" name="globe" />
                {provider.country?.name}
              </Flex>
              {provider.languages && provider.languages.length > 0 && (
                <Flex wrap gap="8">
                  {provider.languages.map((language: any, index: number) => (
                    <Tag key={language.id || language.name || index} size="l">
                      {language.name || language}
                    </Tag>
                  ))}
                </Flex>
              )}
              <Button
                href={`/providers/${provider.slug}/service`}
                variant="primary"
              >
                Mes Services
              </Button>
            </Column>
          )}
          <Column className={styles.blockAlign} flex={9} maxWidth={40}>
            <Column
              id={about.intro.title}
              fillWidth
              minHeight="160"
              vertical="center"
              marginBottom="32"
            >
              {about.calendar.display && (
                <Flex
                  fitWidth
                  border="brand-alpha-medium"
                  className={styles.blockAlign}
                  style={{
                    backdropFilter: "blur(var(--static-space-1))",
                  }}
                  background="brand-alpha-weak"
                  radius="full"
                  padding="4"
                  gap="8"
                  marginBottom="m"
                  vertical="center"
                >
                  <Icon
                    paddingLeft="12"
                    name="calendar"
                    onBackground="brand-weak"
                  />
                  <Flex paddingX="8">Schedule a call</Flex>
                  <IconButton
                    href={about.calendar.link}
                    data-border="rounded"
                    variant="secondary"
                    icon="chevronRight"
                  />
                </Flex>
              )}
              <Heading className={styles.textAlign} variant="display-strong-xl">
                {provider.firstName} {provider.lastName}
              </Heading>
              <Text
                className={styles.textAlign}
                variant="display-default-xs"
                onBackground="neutral-weak"
              >
                {provider.job?.title || "Expert IA"}
              </Text>
              {social.length > 0 && (
                <Flex
                  className={styles.blockAlign}
                  paddingTop="20"
                  paddingBottom="8"
                  gap="8"
                  wrap
                  horizontal="center"
                  fitWidth
                  data-border="rounded"
                >
                  {social.map(
                    (item) =>
                      item.link && (
                        <React.Fragment key={item.name}>
                          <Button
                            className="s-flex-hide"
                            key={item.name}
                            href={item.link}
                            prefixIcon={item.icon}
                            label={item.name}
                            size="s"
                            variant="secondary"
                          />
                          <IconButton
                            className="s-flex-show"
                            size="l"
                            key={`${item.name}-icon`}
                            href={item.link}
                            icon={item.icon}
                            variant="secondary"
                          />
                        </React.Fragment>
                      )
                  )}
                </Flex>
              )}
            </Column>

            {about.intro.display && (
              <Column
                textVariant="body-default-l"
                fillWidth
                gap="m"
                marginBottom="xl"
              >
                {about.intro.description}
              </Column>
            )}

            {about.work.display && (
              <ProviderExperiences
                experiences={experiences}
                makeAbsolute={makeAbsolute}
              />
            )}

            {about.studies.display && (
              <ProviderEducation
                educations={educations}
                makeAbsolute={makeAbsolute}
              />
            )}

            {about.technical.display && (
              <ProviderSkills
                hardSkills={provider.hardSkills || []}
                softSkills={provider.softSkills || []}
              />
            )}
          </Column>
        </Flex>
      </RevealFx>
    </Column>
  );
}
