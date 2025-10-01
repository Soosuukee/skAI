"use client";

import React from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  SmartLink,
  SmartImage,
  Button,
  Input,
  Dialog,
} from "@/once-ui/components";
import type { Article } from "@/app/types/article";
import { getApiBaseUrl } from "@/app/utils/api";

interface MeArticleCardProps {
  article: Article;
  providerSlug: string;
  index?: number;
  onDeleted?: (articleId: number) => void;
}

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

export const MeArticleCard: React.FC<MeArticleCardProps> = ({
  article,
  providerSlug,
  onDeleted,
}) => {
  const articleLink = `/providers/${providerSlug}/blog/${article.slug}`;
  const apiBaseUrl = getApiBaseUrl();

  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : undefined;
      const res = await fetch(
        `${apiBaseUrl}/providers/${providerSlug}/articles/${article.slug}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ password }),
        }
      );
      if (!res.ok) {
        let data: any = null;
        try {
          data = await res.json();
        } catch {}
        throw new Error(
          data?.message || `Suppression impossible (${res.status})`
        );
      }
      if (onDeleted) onDeleted(article.articleId);
      setIsConfirmOpen(false);
      setPassword("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur lors de la suppression"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Column gap="m" style={{ width: "100%" }}>
      {/* Desktop / tablet layout: cover left, content right */}
      <Flex
        className="s-flex-hide"
        direction="row"
        overflow="hidden"
        radius="m"
        border="neutral-alpha-medium"
        gap="0"
        mobileDirection="column"
        style={{ width: "100%", minHeight: "200px" }}
      >
        {/* Cover on the left */}
        {article.cover ? (
          <Flex
            style={{ flex: "0 0 35%", maxWidth: "35%", minHeight: "200px" }}
          >
            <SmartImage
              src={makeAbsolute(article.cover) || ""}
              alt={`Image de couverture - ${article.title}`}
              aspectRatio="16/9"
              style={{ width: "100%", height: "200px", objectFit: "cover" }}
            />
          </Flex>
        ) : (
          <Flex
            style={{
              flex: "0 0 35%",
              maxWidth: "35%",
              minHeight: "200px",
              background: "#f0f0f0",
            }}
            vertical="center"
            horizontal="center"
          >
            <Text color="neutral-medium">Pas d'image</Text>
          </Flex>
        )}

        {/* Content on the right */}
        <Flex flex="1" padding="16" direction="column" gap="8">
          <SmartLink
            href={articleLink}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Heading as="h3" variant="display-strong-xs" style={{ margin: 0 }}>
              {article.title}
            </Heading>
          </SmartLink>
          {article.summary && (
            <Text variant="body-default-s" color="neutral-medium">
              {article.summary}
            </Text>
          )}
          {/* Only publication date */}
          {article.publishedAt && (
            <Text variant="body-default-xs" color="neutral-strong">
              {article.publishedAt}
            </Text>
          )}
        </Flex>
      </Flex>

      {/* Desktop actions */}
      <Flex className="s-flex-hide" gap="8" horizontal="end">
        <Button href={articleLink} variant="secondary">
          Voir
        </Button>
        <Button
          variant="primary"
          href={`/me/article/${article.slug}/edit`}
          style={{
            background: "var(--warning-solid-medium)",
            borderColor: "var(--warning-solid-medium)",
            color: "var(--warning-on-solid-strong)",
          }}
        >
          Modifier
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsConfirmOpen(true)}
          style={{
            background: "var(--danger-solid-medium)",
            borderColor: "var(--danger-solid-medium)",
            color: "var(--danger-on-solid-strong)",
          }}
        >
          Supprimer
        </Button>
      </Flex>

      {/* Mobile layout: match MeServiceCard visually (cover on top), plus date under title */}
      <Column
        className="s-flex-show"
        padding="l"
        border="neutral-alpha-medium"
        radius="m"
        gap="m"
        style={{ width: "100%" }}
      >
        {makeAbsolute(article.cover) ? (
          <SmartImage
            src={makeAbsolute(article.cover) as string}
            alt={`Image de couverture - ${article.title}`}
            radius="s"
            style={{
              objectFit: "cover",
              aspectRatio: "16/9",
              width: "100%",
              maxHeight: "200px",
            }}
          />
        ) : null}

        <Column gap="s">
          <Heading as="h3" variant="display-strong-s">
            {article.title}
          </Heading>
          {article.publishedAt && (
            <Text variant="body-default-xs" color="neutral-strong">
              {article.publishedAt}
            </Text>
          )}
          {article.summary && (
            <Text variant="body-default-m" onBackground="neutral-weak">
              {article.summary}
            </Text>
          )}
        </Column>

        {/* Mobile actions inside card */}
        <Flex gap="8" horizontal="end">
          <Button href={articleLink} variant="secondary">
            Voir
          </Button>
          <Button
            variant="primary"
            href={`/me/article/${article.slug}/edit`}
            style={{
              background: "var(--warning-solid-medium)",
              borderColor: "var(--warning-solid-medium)",
              color: "var(--warning-on-solid-strong)",
            }}
          >
            Modifier
          </Button>
          <Button
            variant="primary"
            onClick={() => setIsConfirmOpen(true)}
            style={{
              background: "var(--danger-solid-medium)",
              borderColor: "var(--danger-solid-medium)",
              color: "var(--danger-on-solid-strong)",
            }}
          >
            Supprimer
          </Button>
        </Flex>
      </Column>

      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPassword("");
          setError(null);
        }}
        title={"Supprimer l'article"}
        description="Cette action est irréversible. Pour continuer, entrez votre mot de passe."
        base
      >
        <Column gap="12">
          <Input
            id={`confirm-password-${article.articleId}`}
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          {error && <Text color="error">{error}</Text>}
          <Flex horizontal="end" gap="8">
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              disabled={isDeleting || password.length < 8}
              style={{
                background: "var(--danger-solid-medium)",
                borderColor: "var(--danger-solid-medium)",
                color: "var(--danger-on-solid-strong)",
              }}
            >
              {isDeleting ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </Flex>
        </Column>
      </Dialog>
    </Column>
  );
};

export default MeArticleCard;
