import React from "react";
import {
  Heading,
  RevealFx,
  Column,
  Text,
  SmartImage,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";

import { Meta } from "@/once-ui/modules";
import { formatDate } from "@/app/utils/formatDate";
import { getArticleDetailForProvider } from "@/app/utils/articleUtils";
import { notFound } from "next/navigation";

interface ProviderArticlePageProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[]; articleSlug: string | string[] }>;
}) {
  const routeParams = await params;
  const providerSlug = Array.isArray(routeParams.slug)
    ? routeParams.slug[0]
    : routeParams.slug;
  const articleSlug = Array.isArray(routeParams.articleSlug)
    ? routeParams.articleSlug[0]
    : routeParams.articleSlug;

  const result = await getArticleDetailForProvider(providerSlug, articleSlug);
  if (!result) return {};
  const { article } = result;

  return Meta.generate({
    title: article.title,
    description: article.summary,
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    path: `/providers/${routeParams.slug}/blog/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    image: article.cover,
  });
}

export default async function ProviderArticlePage({
  params,
}: ProviderArticlePageProps) {
  const { slug, articleSlug } = await params;
  const result = await getArticleDetailForProvider(slug, articleSlug);
  if (!result) notFound();
  const { provider, article } = result!;

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Column fillWidth paddingY="24" gap="m">
        <CustomRevealFx translateY={4} delay={0.1} fillWidth>
          <Heading wrap="balance" variant="display-strong-l">
            {article.title}
          </Heading>
        </CustomRevealFx>
        <RevealFx translateY={4} fillWidth delay={0.2}>
          <Text variant="body-default-l" color="neutral-medium">
            {article.summary}
          </Text>
        </RevealFx>
        <RevealFx translateY={4} fillWidth delay={0.3}>
          <Column gap="8">
            <Text variant="body-default-s" color="neutral-medium">
              Par {provider.firstName} {provider.lastName} •{" "}
              {formatDate(article.publishedAt, false)}
            </Text>
            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <Text variant="body-default-s" color="neutral-medium">
                Tags: {article.tags.map((t: any) => t?.name ?? t).join(", ")}
              </Text>
            )}
          </Column>
        </RevealFx>
      </Column>

      {/* Image de couverture */}
      {article.cover && (
        <RevealFx translateY={4} fillWidth delay={0.4}>
          <SmartImage
            src={article.cover}
            alt={`Couverture de l'article: ${article.title}`}
            aspectRatio="16 / 9"
            radius="l"
          />
        </RevealFx>
      )}

      {/* Contenu de l'article */}
      <Column as="article" fillWidth>
        {article.sections?.map((section: any, index: number) => {
          const delay = (index + 1) * 0.1;

          return (
            <RevealFx
              key={section.articleSectionId ?? index}
              translateY={4}
              delay={delay}
            >
              <Column gap="s">
                {section.title && (
                  <Heading as="h2" variant="display-strong-s" marginBottom="m">
                    {section.title}
                  </Heading>
                )}
                {Array.isArray(section.content) &&
                  section.content.map((content: any, cIdx: number) => (
                    <Column key={content.articleContentId ?? cIdx} gap="s">
                      {content.content && (
                        <Text variant="body-default-l" marginBottom="m">
                          {content.content}
                        </Text>
                      )}
                      {Array.isArray(content.images) &&
                        content.images.map((img: any, iIdx: number) => (
                          <SmartImage
                            key={img.articleImageId ?? iIdx}
                            src={img.url}
                            alt={section.title || article.title}
                            aspectRatio="16/9"
                            radius="l"
                            marginBottom="16"
                          />
                        ))}
                    </Column>
                  ))}
              </Column>
            </RevealFx>
          );
        })}
      </Column>

      {/* Footer avec lien retour */}
      <RevealFx translateY={4} fillWidth delay={0.5}>
        <Column gap="16" horizontal="center" paddingY="32">
          <Text variant="body-default-l" color="neutral-medium">
            Retour au blog de {provider.firstName} {provider.lastName}
          </Text>
        </Column>
      </RevealFx>
    </Column>
  );
}
