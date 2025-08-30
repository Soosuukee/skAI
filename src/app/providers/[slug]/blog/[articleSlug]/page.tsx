import React from "react";
import {
  Heading,
  RevealFx,
  Column,
  Text,
  SmartImage,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";

import { Meta, Schema } from "@/once-ui/modules";
import { formatDate } from "@/app/utils/formatDate";
import { getArticleBySlug } from "@/app/utils/articleUtils";
import { notFound } from "next/navigation";

interface ProviderArticlePageProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

export default async function ProviderArticlePage({
  params,
}: ProviderArticlePageProps) {
  const { slug, articleSlug } = await params;
  console.log("Debug - Slug:", slug, "ArticleSlug:", articleSlug);

  // Récupérer l'article depuis l'API
  const article = await getArticleBySlug(articleSlug);
  console.log("Debug - Article trouvé:", article ? "Oui" : "Non");
  if (!article) {
    notFound();
  }

  // Récupérer le provider depuis l'API
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const providerResponse = await fetch(
    `${baseUrl}/api/providers/id/${article.providerId}`
  );
  console.log("Debug - Provider response status:", providerResponse.status);
  if (!providerResponse.ok) {
    notFound();
  }
  const provider = await providerResponse.json();
  console.log("Debug - Provider slug:", provider.slug, "Expected slug:", slug);

  // Vérifier que l'article appartient bien au provider
  if (provider.slug !== slug) {
    console.log("Debug - Slug mismatch, calling notFound()");
    notFound();
  }

  // Utiliser une URL dynamique pour baseURL
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}/blog/${article.slug}`}
        title={article.title}
        description={article.summary}
        image={article.articleCover}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `/providers/${provider.slug}/about`,
          image: provider.avatar,
        }}
      />

      {/* Header de l'article */}
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
            {article.tag && (
              <Text variant="body-default-s" color="neutral-medium">
                Tag: {article.tag}
              </Text>
            )}
          </Column>
        </RevealFx>
      </Column>

      {/* Image de couverture */}
      {article.articleCover && (
        <RevealFx translateY={4} fillWidth delay={0.4}>
          <SmartImage
            src={article.articleCover}
            alt={`Couverture de l'article: ${article.title}`}
            aspectRatio="16 / 9"
            radius="l"
          />
        </RevealFx>
      )}

      {/* Contenu de l'article */}
      <Column as="article" fillWidth>
        {article.section?.map((section: any, index: number) => {
          const delay = (index + 1) * 0.1;

          switch (section.type) {
            case "heading":
              return (
                <RevealFx key={index} translateY={4} delay={delay}>
                  <Heading
                    variant={
                      section.level === 1
                        ? "display-strong-s"
                        : "heading-strong-l"
                    }
                    marginBottom="m"
                    marginTop={section.level === 1 ? "0" : "xl"}
                  >
                    {section.content}
                  </Heading>
                </RevealFx>
              );

            case "paragraph":
              return (
                <RevealFx key={index} translateY={4} delay={delay}>
                  <Text variant="body-default-l" marginBottom="m">
                    {section.content}
                  </Text>
                </RevealFx>
              );

            case "list":
              return (
                <RevealFx key={index} translateY={4} delay={delay}>
                  <ul style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
                    {section.items?.map((item: string, itemIndex: number) => (
                      <li key={itemIndex} style={{ marginBottom: "0.5rem" }}>
                        <Text variant="body-default-l">{item}</Text>
                      </li>
                    ))}
                  </ul>
                </RevealFx>
              );

            case "image":
              return (
                <RevealFx key={index} translateY={4} delay={delay}>
                  <SmartImage
                    src={section.src || ""}
                    alt={section.alt || ""}
                    aspectRatio={section.aspectRatio || "16/9"}
                    radius="l"
                    marginBottom="16"
                  />
                </RevealFx>
              );

            default:
              return (
                <RevealFx key={index} translateY={4} delay={delay}>
                  <Text variant="body-default-l" marginBottom="m">
                    {section.content}
                  </Text>
                </RevealFx>
              );
          }
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
