"use client";

import {
  Column,
  Flex,
  Heading,
  SmartImage,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";
import styles from "./Posts.module.scss";
import { formatDate } from "@/app/utils/formatDate";
import { Article } from "@/app/types/article";

interface PostProps {
  article: Article;
  thumbnail: boolean;
  direction?: "row" | "column";
  providerSlug?: string; // Nouveau prop pour l'URL dynamique
  authorName?: string; // Nom complet de l'auteur
  providerAvatar?: string; // Avatar du provider
}

export default function Post({
  article,
  thumbnail,
  direction,
  providerSlug,
  authorName,
  providerAvatar,
}: PostProps) {
  // URL dynamique basée sur le provider ou URL globale
  const articleUrl = providerSlug
    ? `/providers/${providerSlug}/blog/${article.slug}`
    : `/blog/${article.slug}`;

  return (
    <SmartLink
      fillWidth
      unstyled
      style={{ borderRadius: "var(--radius-l)" }}
      key={article.slug}
      href={articleUrl}
    >
      <Flex
        position="relative"
        transition="micro-medium"
        direction={direction}
        radius="l"
        className={styles.hover}
        mobileDirection="column"
        fillWidth
      >
        {article.articleCover && thumbnail && (
          <SmartImage
            fillWidth
            priority
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 640px"
            border="neutral-alpha-weak"
            cursor="interactive"
            radius="l"
            src={article.articleCover}
            alt={"Thumbnail of " + article.title}
            aspectRatio="16 / 9"
          />
        )}
        <Column
          position="relative"
          fillWidth
          gap="4"
          padding="24"
          vertical="center"
        >
          <Heading as="h2" variant="heading-strong-l" wrap="balance">
            {article.title}
          </Heading>
          <Text variant="label-default-s" onBackground="neutral-weak">
            {formatDate(article.publishedAt, false)}
          </Text>
          {(authorName || (article as any).language) && (
            <Flex gap="8" vertical="center">
              {providerAvatar && (
                <SmartImage
                  src={providerAvatar}
                  alt={authorName || "Auteur"}
                  height={2}
                  aspectRatio="1 / 1"
                  radius="full"
                />
              )}
              <Text variant="label-default-s" onBackground="neutral-weak">
                {authorName ? `par ${authorName}` : ""}
                {authorName && (article as any).language ? " — " : ""}
                {(article as any).language
                  ? `${(article as any).language}`
                  : ""}
              </Text>
            </Flex>
          )}
          {(article as any).tag && (
            <Tag
              className="mt-12"
              label={(article as any).tag}
              variant="neutral"
            />
          )}
        </Column>
      </Flex>
    </SmartLink>
  );
}
