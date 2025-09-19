"use client";

import React from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  SmartLink,
  SmartImage,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import type { Article } from "@/app/types/article";

interface ProviderHomeArticleCardProps {
  article: Article;
  providerSlug: string;
  index?: number;
}

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

export const ProviderHomeArticleCard: React.FC<
  ProviderHomeArticleCardProps
> = ({ article, providerSlug, index = 0 }) => {
  const articleLink = `/providers/${providerSlug}/blog/${article.slug}`;

  return (
    <CustomRevealFx translateY={4} delay={0.1 * (index + 1)} fillWidth>
      <Column
        padding="l"
        border="neutral-alpha-medium"
        radius="m"
        gap="m"
        style={{
          height: "100%",
          transition: "transform 0.2s ease",
          cursor: "pointer",
        }}
        onClick={() => (window.location.href = articleLink || "#")}
      >
        {/* Image de couverture - plus petite pour la page d'accueil */}
        {article.cover ? (
          <SmartImage
            src={makeAbsolute(article.cover) || ""}
            alt={`Image de couverture - ${article.title}`}
            width={250}
            height={141}
            radius="s"
            style={{
              objectFit: "cover",
              aspectRatio: "16/9",
              width: "100%",
              maxHeight: "150px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "150px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            <Text color="neutral-medium">Pas d'image</Text>
          </div>
        )}

        {/* Contenu textuel - plus compact */}
        <Column gap="s" style={{ flex: 1 }}>
          <Heading as="h3" variant="display-strong-xs">
            {article.title}
          </Heading>
          <Text variant="body-default-s" color="neutral-medium" lines={2}>
            {article.summary}
          </Text>
        </Column>

        {/* Lien "En savoir plus" */}
        <Flex horizontal="end" fillWidth>
          <SmartLink href={articleLink} style={{ textDecoration: "none" }}>
            <Text variant="body-default-xs" color="primary">
              En savoir plus →
            </Text>
          </SmartLink>
        </Flex>
      </Column>
    </CustomRevealFx>
  );
};



