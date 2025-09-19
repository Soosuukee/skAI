"use client";

import React, { useState, useEffect } from "react";
import { getSortedArticles } from "@/app/utils/articleUtils";
import { Article } from "@/app/types/article";
import { Grid, Text, Column } from "@/once-ui/components";
import Post from "./Post";
import { getApiBaseUrl } from "@/app/utils/api";
import { getAllProviders } from "@/app/utils/providerUtils";
import type { Provider } from "@/app/types/provider";

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
        const apiBaseUrl = getApiBaseUrl();

        // Fetch all providers once, then map by id
        const providers: Provider[] = await getAllProviders();
        const providersById = new Map<number, Provider>(
          providers.map((p) => [p.id, p])
        );

        // Récupérer les providers pour chaque article
        const articlesWithProviders: ArticleWithProvider[] = await Promise.all(
          articles.map(async (article) => {
            const p = providersById.get(article.providerId);
            if (!p) return article as ArticleWithProvider;
            // Optionally construct an avatar URL if needed
            let avatar: string | undefined = undefined;
            const profilePicture = (p as any).profilePicture as
              | string
              | undefined;
            if (profilePicture) {
              if (/^https?:\/\//.test(profilePicture)) {
                avatar = profilePicture;
              } else {
                try {
                  const origin = new URL(apiBaseUrl).origin;
                  avatar = profilePicture.startsWith("/")
                    ? `${origin}${profilePicture}`
                    : `${apiBaseUrl}${
                        profilePicture.startsWith("/") ? "" : "/"
                      }${profilePicture}`;
                } catch {
                  avatar = profilePicture;
                }
              }
            }

            return {
              ...article,
              provider: {
                slug: p.slug,
                firstName: p.firstName,
                lastName: p.lastName,
                avatar,
              },
            } as ArticleWithProvider;
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

  const displayedArticles = (() => {
    if (!range) return articlesWithProviders;
    const start = range[0] - 1;
    const end = range.length === 2 ? range[1] : start + 1;
    return articlesWithProviders.slice(start, end);
  })();

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
              key={`${article.provider?.slug}-${article.slug}`}
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
