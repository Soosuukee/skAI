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

interface ArticleCardProps {
  article: Article;
  providerSlug: string;
  index?: number; // Pour l'animation décalée
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

export const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  providerSlug,
  index = 0,
}) => {
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
        {/* Image de couverture */}
        {article.cover ? (
          <SmartImage
            src={makeAbsolute(article.cover) || ""}
            alt={`Image de couverture - ${article.title}`}
            width={300}
            height={169}
            radius="s"
            style={{
              objectFit: "cover",
              aspectRatio: "16/9",
              width: "100%",
              maxHeight: "200px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "200px",
              backgroundColor: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
            }}
          >
            <Text color="neutral-medium">Pas d'image de couverture</Text>
          </div>
        )}

        {/* Contenu textuel */}
        <Column gap="s" style={{ flex: 1 }}>
          <Heading as="h3" variant="display-strong-s">
            {article.title}
          </Heading>
          <Text variant="body-default-m" color="neutral-medium">
            {article.summary}
          </Text>
        </Column>

        {/* Lien "En savoir plus" */}
        <Flex horizontal="end" fillWidth>
          <SmartLink href={articleLink} style={{ textDecoration: "none" }}>
            <Text variant="body-default-s" color="primary">
              En savoir plus →
            </Text>
          </SmartLink>
        </Flex>
      </Column>
    </CustomRevealFx>
  );
};
