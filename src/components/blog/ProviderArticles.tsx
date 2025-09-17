"use client";

import React from "react";
import { Column, Heading, Text, RevealFx, Grid } from "@/once-ui/components";
import type { Article } from "@/app/types/article";
import { ArticleCard } from "./ArticleCard";

interface ProviderArticlesProps {
  articles: Article[];
  providerSlug: string;
}

export const ProviderArticles: React.FC<ProviderArticlesProps> = ({
  articles,
  providerSlug,
}) => {
  if (articles.length === 0) {
    return (
      <RevealFx translateY={4} fillWidth delay={0.3}>
        <Column gap="16" horizontal="center" paddingY="48">
          <Heading as="h2" variant="display-strong-s">
            Aucun article disponible
          </Heading>
          <Text variant="body-default-l" color="neutral-medium">
            Ce provider n'a pas encore d'articles publiés.
          </Text>
        </Column>
      </RevealFx>
    );
  }

  return (
    <Grid columns="2" mobileColumns="1" fillWidth gap="l">
      {articles.map((article, index) => (
        <ArticleCard
          key={`${providerSlug}-${article.articleId}-${index}`}
          article={article}
          providerSlug={providerSlug}
          index={index}
        />
      ))}
    </Grid>
  );
};
