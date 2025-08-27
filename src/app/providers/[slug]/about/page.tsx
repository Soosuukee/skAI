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
import styles from "@/components/about/about.module.scss";
import { useProvider } from "@/app/hooks/useProvider";
import { Meta, Schema } from "@/once-ui/modules";

interface ProviderAboutPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProviderAboutPage({ params }: ProviderAboutPageProps) {
  const resolvedParams = React.use(params);
  const { provider, social, about, loading, error } = useProvider(
    resolvedParams.slug
  );

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
    <>
      <About provider={provider} social={social} about={about} />
    </>
  );
}

function About({
  provider,
  social,
  about,
}: {
  provider: any;
  social: any[];
  about: any;
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
      items: about.work.experiences.map(
        (experience: any) => experience.company
      ),
    },
    {
      title: about.studies.title,
      display: about.studies.display,
      items: about.studies.institutions.map(
        (institution: any) => institution.institutionName
      ),
    },
    {
      title: about.technical.title,
      display: about.technical.display,
      items: about.technical.skills.map((skill: any) => skill.title),
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
        }, expert IA de ${provider.location?.name ?? ""}`}
        path={`/providers/${provider.slug}/about`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${provider.firstName} ${provider.lastName}`
        )}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}/providers/${provider.slug}/about`,
          image: `${baseURL}${provider.avatar}`,
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
              <Avatar src={provider.avatar} size="xl" />
              <Flex gap="8" vertical="center">
                <Icon onBackground="accent-weak" name="globe" />
                {provider.location?.name}
              </Flex>
              {provider.languages && provider.languages.length > 0 && (
                <Flex wrap gap="8">
                  {provider.languages.map((language: any, index: number) => (
                    <Tag key={language.name || language} size="l">
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
              <>
                <Heading
                  as="h2"
                  id={about.work.title}
                  variant="display-strong-s"
                  marginBottom="m"
                >
                  {about.work.title}
                </Heading>
                <Column fillWidth gap="l" marginBottom="40">
                  {about.work.experiences.map(
                    (experience: any, index: number) => (
                      <Column
                        key={`${experience.company}-${experience.role}-${index}`}
                        fillWidth
                      >
                        <Flex
                          fillWidth
                          horizontal="space-between"
                          vertical="end"
                          marginBottom="4"
                        >
                          <Text
                            id={experience.company}
                            variant="heading-strong-l"
                          >
                            {experience.company}
                          </Text>
                          <Text
                            variant="heading-default-xs"
                            onBackground="neutral-weak"
                          >
                            {experience.timeframe}
                          </Text>
                        </Flex>
                        <Text
                          variant="body-default-s"
                          onBackground="brand-weak"
                          marginBottom="m"
                        >
                          {experience.role}
                        </Text>
                        <Column as="ul" gap="16">
                          {experience.achievements.map(
                            (achievement: string, index: number) => (
                              <Text
                                as="li"
                                variant="body-default-m"
                                key={`${experience.company}-${index}`}
                              >
                                {achievement}
                              </Text>
                            )
                          )}
                        </Column>
                        {experience.images && experience.images.length > 0 && (
                          <Flex fillWidth paddingTop="m" paddingLeft="40" wrap>
                            {experience.images.map(
                              (image: any, index: number) => (
                                <Flex
                                  key={index}
                                  border="neutral-medium"
                                  radius="m"
                                  minWidth={image.width}
                                  height={image.height}
                                >
                                  <SmartImage
                                    enlarge
                                    radius="m"
                                    sizes={image.width.toString()}
                                    alt={image.alt}
                                    src={image.src}
                                  />
                                </Flex>
                              )
                            )}
                          </Flex>
                        )}
                      </Column>
                    )
                  )}
                </Column>
              </>
            )}

            {about.studies.display && (
              <>
                <Heading
                  as="h2"
                  id={about.studies.title}
                  variant="display-strong-s"
                  marginBottom="m"
                >
                  {about.studies.title}
                </Heading>
                <Column fillWidth gap="l" marginBottom="40">
                  {about.studies.institutions.map(
                    (institution: any, index: number) => (
                      <Column
                        key={`${institution.institutionName}-${index}`}
                        fillWidth
                        gap="4"
                      >
                        <Text variant="heading-strong-xl">
                          {institution.degreeTitle}
                        </Text>
                        <Text
                          id={institution.institutionName}
                          variant="label-default-l"
                        >
                          {institution.institutionName}
                        </Text>
                        <Text
                          variant="heading-default-xs"
                          onBackground="brand-strong"
                        >
                          {institution.yearsAttended}
                        </Text>

                        <Text
                          variant="heading-default-xs"
                          onBackground="neutral-weak"
                        >
                          {institution.programDescription}
                        </Text>
                      </Column>
                    )
                  )}
                </Column>
              </>
            )}

            {about.technical.display && (
              <>
                <Heading
                  as="h2"
                  id={about.technical.title}
                  variant="display-strong-s"
                  marginBottom="40"
                >
                  {about.technical.title}
                </Heading>
                <Column fillWidth gap="l">
                  {about.technical.skills.map((skill: any, index: number) => (
                    <Column key={`${skill}-${index}`} fillWidth gap="4">
                      <Text variant="heading-strong-l">{skill.title}</Text>
                      <Text
                        variant="body-default-m"
                        onBackground="neutral-weak"
                      >
                        {skill.description}
                      </Text>
                      {skill.images && skill.images.length > 0 && (
                        <Flex fillWidth paddingTop="m" gap="12" wrap>
                          {skill.images.map((image: any, index: number) => (
                            <Flex
                              key={index}
                              border="neutral-medium"
                              radius="m"
                              minWidth={image.width}
                              height={image.height}
                            >
                              <SmartImage
                                enlarge
                                radius="m"
                                sizes={image.width.toString()}
                                alt={image.alt}
                                src={image.src}
                              />
                            </Flex>
                          ))}
                        </Flex>
                      )}
                    </Column>
                  ))}
                </Column>
              </>
            )}
          </Column>
        </Flex>
      </RevealFx>
    </Column>
  );
}
