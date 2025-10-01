"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useProviderArticles } from "@/app/hooks/providers";
import ArticleForm, { ArticleFormValues } from "@/components/forms/ArticleForm";
import { getApiBaseUrl } from "@/app/utils/api";
import {
  Column,
  Heading,
  Text,
  Button,
  Input,
  Flex,
} from "@/once-ui/components";

interface EditArticlePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditArticlePage({ params }: EditArticlePageProps) {
  const routeParams = React.use(params);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const providerSlug =
    user?.role === "provider" ? (user as any).slug || "" : "";
  const { articles, loading, error } = useProviderArticles(providerSlug);

  const article = articles.find((a: any) => a.slug === routeParams.slug);

  React.useEffect(() => {
    if (!isLoading && !user) router.push("/join");
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <Column padding="24" horizontal="center">
        <Text>Chargement…</Text>
      </Column>
    );
  }

  if (!user) return null;

  if (user.role !== "provider") {
    return (
      <Column gap="12" padding="24" horizontal="center">
        <Heading as="h2" variant="display-strong-s">
          Accès réservé
        </Heading>
        <Text onBackground="neutral-weak">Page réservée aux prestataires.</Text>
        <Button variant="secondary" href="/me">
          Retour à mon profil
        </Button>
      </Column>
    );
  }

  const initialValues: ArticleFormValues | undefined = article
    ? {
        languageId: article.languageId,
        title: article.title,
        slug: article.slug,
        publishedAt: article.publishedAt,
        summary: article.summary || "",
        isPublished: Boolean(article.isPublished),
        isFeatured: Boolean(article.isFeatured),
        cover: (article as any).cover || (article as any).articleCover || "",
        articleCoverFile: null,
        sectionsDraft: undefined,
      }
    : undefined;

  const handleUpdate = async (values: ArticleFormValues) => {
    const apiBase = getApiBaseUrl();
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : undefined;
    await fetch(
      `${apiBase}/providers/${providerSlug}/articles/${article?.slug}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(values),
      }
    );
  };

  return (
    <Column
      gap="16"
      padding="24"
      fillWidth
      style={{ width: "85%", marginInline: "auto" }}
    >
      <Heading as="h1" variant="display-strong-m">
        Modifier l'article
      </Heading>
      {loading && <Text>Chargement de l'article…</Text>}
      {error && <Text color="error">Erreur: {error}</Text>}
      {!loading && !article && <Text color="error">Article introuvable.</Text>}
      {article && initialValues && (
        <ArticleForm
          onSubmit={handleUpdate}
          initialValues={initialValues}
          submitLabel="Soumettre"
          submittingLabel="..."
        />
      )}
      <Button variant="secondary" href="/me/article">
        Retour
      </Button>
    </Column>
  );
}
