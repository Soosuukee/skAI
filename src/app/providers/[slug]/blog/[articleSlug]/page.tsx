import React from "react";
import {
  Heading,
  RevealFx,
  Column,
  Text,
  SmartImage,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import ArticleContent from "@/components/blog/ArticleContent";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";
import { formatDate } from "@/app/utils/formatDate";
import { getAllArticles, getArticleBySlug } from "@/app/utils/articleUtils";
import providersData from "@/data/providers.json";
import { notFound } from "next/navigation";

interface ProviderArticlePageProps {
  params: Promise<{ slug: string; articleSlug: string }>;
}

// Fonction pour générer les paramètres statiques
export async function generateStaticParams() {
  const articles = getAllArticles();
  const params: { slug: string; articleSlug: string }[] = [];

  articles.forEach((article) => {
    const provider = providersData.find((p) => p.id === article.provider_id);
    if (provider) {
      params.push({
        slug: provider.slug,
        articleSlug: article.slug,
      });
    }
  });

  return params;
}

export default async function ProviderArticlePage({
  params,
}: ProviderArticlePageProps) {
  const { slug, articleSlug } = await params;

  // Trouver le provider
  const provider = providersData.find((p) => p.slug === slug);
  if (!provider) {
    notFound();
  }

  // Trouver l'article
  const article = getArticleBySlug(articleSlug);
  if (!article || article.provider_id !== provider.id) {
    notFound();
  }

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}/blog/${article.slug}`}
        title={article.title}
        description={article.summary}
        image={`${baseURL}${article.image}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}/providers/${provider.slug}/about`,
          image: `${baseURL}${provider.avatar}`,
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
              {formatDate(article.published_at, false)}
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
      {article.image && (
        <RevealFx translateY={4} fillWidth delay={0.4}>
          <SmartImage
            src={article.image}
            alt={`Couverture de l'article: ${article.title}`}
            aspectRatio="16 / 9"
            radius="l"
          />
        </RevealFx>
      )}

      {/* Contenu de l'article */}
      <Column as="article" fillWidth>
        <ArticleContent sections={article.content.sections} />
      </Column>

      {/* Footer avec lien retour */}
      <RevealFx translateY={4} fillWidth delay={0.5}>
        <Column gap="16" horizontal="center" paddingY="32">
          <Text variant="body-default-s" color="neutral-medium">
            ←{" "}
            <a
              href={`/providers/${provider.slug}/blog`}
              style={{ color: "var(--brand)" }}
            >
              Retour aux articles de {provider.firstName}
            </a>
          </Text>
        </Column>
      </RevealFx>
    </Column>
  );
}
