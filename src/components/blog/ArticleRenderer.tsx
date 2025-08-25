"use client";

import React, { useState, useEffect } from "react";
import {
  Heading,
  Text,
  SmartImage,
  Column,
  RevealFx,
  Flex,
  Tag,
} from "@/once-ui/components";
import { formatDate } from "@/app/utils/formatDate";
import { useRouter, usePathname } from "next/navigation";
import { Article } from "@/app/types/article";
import { Provider } from "@/app/types/provider";

export function ArticleRenderer() {
  const [article, setArticle] = useState<Article | null>(null);
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function fetchArticleData() {
      // Extraire les paramètres depuis l'URL
      const urlParams = new URLSearchParams(window.location.search);
      const articleSlug = urlParams.get("slug");
      const providerSlug = urlParams.get("provider");

      console.log("Debug - articleSlug:", articleSlug);
      console.log("Debug - providerSlug:", providerSlug);

      if (!articleSlug) {
        setError("Slug de l'article manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log(
          "Debug - Fetching article from:",
          `/api/articles/${articleSlug}`
        );
        // Récupérer l'article depuis l'API
        const articleResponse = await fetch(`/api/articles/${articleSlug}`);
        if (!articleResponse.ok) {
          throw new Error("Article non trouvé");
        }
        const articleData: Article = await articleResponse.json();
        setArticle(articleData);

        console.log("Debug - Article data:", articleData);

        // Récupérer le provider depuis l'API
        try {
          // Utiliser le providerId de l'article pour récupérer le provider
          console.log("Debug - Article providerId:", articleData.providerId);
          console.log(
            "Debug - Fetching provider from:",
            `/api/providers/id/${articleData.providerId}`
          );

          const providerResponse = await fetch(
            `/api/providers/id/${articleData.providerId}`
          );
          if (providerResponse.ok) {
            const providerData: Provider = await providerResponse.json();
            setProvider(providerData);
            console.log("Debug - Provider data:", providerData);
          } else {
            console.warn(
              `Provider non trouvé pour l'ID: ${articleData.providerId}`
            );
          }
        } catch (providerError) {
          console.error(
            "Erreur lors de la récupération du provider:",
            providerError
          );
          // On continue sans le provider si il y a une erreur
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchArticleData();
  }, [pathname]);

  if (loading) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
        <Text>Chargement de l'article...</Text>
      </Column>
    );
  }

  if (error || !article) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
        <Text color="error">Erreur: {error || "Article non trouvé"}</Text>
      </Column>
    );
  }

  const renderSection = (section: any, index: number) => {
    const delay = (index + 1) * 0.1;

    switch (section.type) {
      case "heading":
        return (
          <RevealFx key={index} translateY={4} delay={delay}>
            <Heading
              variant={
                section.level === 1 ? "display-strong-s" : "heading-strong-l"
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
  };

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      {/* Header de l'article */}
      <Column fillWidth paddingY="24" gap="m">
        <RevealFx translateY={4} delay={0.1} fillWidth>
          <Heading wrap="balance" variant="display-strong-l">
            {article.title}
          </Heading>
        </RevealFx>

        <RevealFx translateY={4} fillWidth delay={0.2}>
          <Text variant="body-default-l" color="neutral-medium">
            {article.summary}
          </Text>
        </RevealFx>

        <RevealFx translateY={4} fillWidth delay={0.3}>
          <Flex gap="16" vertical="center">
            {provider && (
              <Text variant="body-default-s" color="neutral-medium">
                Par {provider.firstName} {provider.lastName}
              </Text>
            )}
            <Text variant="body-default-s" color="neutral-medium">
              {formatDate(article.publishedAt, false)}
            </Text>
            {article.tag && <Tag label={article.tag} variant="neutral" />}
          </Flex>
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
        {article.section?.map((section, index) =>
          renderSection(section, index)
        )}
      </Column>

      {/* Footer */}
      <RevealFx translateY={4} fillWidth delay={0.5}>
        <Column gap="16" horizontal="center" paddingY="32">
          <Text variant="body-default-l" color="neutral-medium">
            {provider &&
              `Retour au blog de ${provider.firstName} ${provider.lastName}`}
          </Text>
        </Column>
      </RevealFx>
    </Column>
  );
}
