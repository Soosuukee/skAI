"use client";

import React, { useState, useEffect } from "react";
import { getSortedArticles } from "@/app/utils/articleUtils";
import { Article } from "@/app/types/article";
import { Grid, Text, Column } from "@/once-ui/components";
import Post from "./Post";

interface PostsProps {
  range?: [number] | [number, number];
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
}

// Interface pour les articles avec les informations du provider
interface ArticleWithProvider extends Article {
  provider?: {
    slug: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

export function Posts({
  range,
  columns = "1",
  thumbnail = false,
  direction,
}: PostsProps) {
  const [articlesWithProviders, setArticlesWithProviders] = useState<
    ArticleWithProvider[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticlesWithProviders() {
      try {
        setLoading(true);
        const articles = await getSortedArticles();

        // Récupérer les providers pour chaque article
        const articlesWithProviders: ArticleWithProvider[] = await Promise.all(
          articles.map(async (article) => {
            try {
              const providerResponse = await fetch(
                `/api/providers/id/${article.providerId}`
              );
              if (providerResponse.ok) {
                const provider = await providerResponse.json();
                return {
                  ...article,
                  provider: {
                    slug: provider.slug,
                    firstName: provider.firstName,
                    lastName: provider.lastName,
                    avatar: provider.avatar,
                  },
                };
              }
              return article as ArticleWithProvider;
            } catch (error) {
              console.error(
                `Erreur lors de la récupération du provider pour l'article ${article.slug}:`,
                error
              );
              return article as ArticleWithProvider;
            }
          })
        );

        setArticlesWithProviders(articlesWithProviders);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchArticlesWithProviders();
  }, []);

  if (loading) {
    return (
      <Column fillWidth gap="l" horizontal="center" paddingY="24">
        <Text>Chargement des articles...</Text>
      </Column>
    );
  }

  if (error) {
    return (
      <Column fillWidth gap="l" horizontal="center" paddingY="24">
        <Text color="error">Erreur: {error}</Text>
      </Column>
    );
  }

  const displayedArticles = range
    ? articlesWithProviders.slice(
        range[0] - 1,
        range.length === 2 ? range[1] : articlesWithProviders.length
      )
    : articlesWithProviders;

  return (
    <>
      {displayedArticles.length > 0 && (
        <Grid
          columns={columns}
          mobileColumns="1"
          fillWidth
          marginBottom="40"
          gap="12"
        >
          {displayedArticles.map((article) => (
            <Post
              key={article.slug}
              article={article}
              thumbnail={thumbnail}
              direction={direction}
              providerSlug={article.provider?.slug}
              authorName={
                article.provider
                  ? `${article.provider.firstName} ${article.provider.lastName}`
                  : undefined
              }
              providerAvatar={article.provider?.avatar}
            />
          ))}
        </Grid>
      )}
    </>
  );
}
