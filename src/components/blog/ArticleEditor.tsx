"use client";

import React, { useState } from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  Button,
  Input,
  Textarea,
} from "@/once-ui/components";
import { ArticleVisualizer } from "./ArticleVisualizer";
import type { Article } from "@/app/types/article";

interface ArticleEditorProps {
  providerSlug: string;
  onSave?: (article: Article) => void;
  onPreview?: (markdown: string) => void;
  initialData?: {
    title: string;
    summary: string;
    cover?: string;
    content: string;
    tags?: string[];
  };
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  providerSlug,
  onSave,
  onPreview,
  initialData,
}) => {
  const [articleData, setArticleData] = useState({
    title: initialData?.title || "",
    summary: initialData?.summary || "",
    cover: initialData?.cover || "",
    content: initialData?.content || "",
    tags: initialData?.tags || [],
  });

  const [tagsInput, setTagsInput] = useState(
    initialData?.tags?.join(", ") || ""
  );

  const handleInputChange = (field: string, value: string) => {
    setArticleData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setArticleData((prev) => ({
      ...prev,
      tags,
    }));
  };

  const handleSave = (article: Article) => {
    if (onSave) {
      onSave(article);
    }
  };

  const handlePreview = (markdown: string) => {
    if (onPreview) {
      onPreview(markdown);
    }
  };

  return (
    <Column gap="xl" fillWidth>
      {/* En-tête */}
      <Column gap="m">
        <Heading as="h1" variant="display-strong-l">
          Rédacteur d'article
        </Heading>
        <Text variant="body-default-l" color="neutral-medium">
          Rédigez votre article avec l'aperçu en temps réel
        </Text>
      </Column>

      {/* Formulaire de rédaction */}
      <Column padding="l" border="neutral-alpha-medium" radius="m" gap="l">
        <Heading as="h2" variant="display-strong-s">
          Informations de l'article
        </Heading>

        <Column gap="m">
          {/* Titre */}
          <Column gap="s">
            <Text variant="label-default-m">Titre de l'article</Text>
            <Input
              value={articleData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Entrez le titre de votre article..."
              style={{ width: "100%" }}
            />
          </Column>

          {/* Résumé */}
          <Column gap="s">
            <Text variant="label-default-m">Résumé</Text>
            <Textarea
              value={articleData.summary}
              onChange={(e) => handleInputChange("summary", e.target.value)}
              placeholder="Résumé de votre article..."
              rows={3}
              style={{ width: "100%" }}
            />
          </Column>

          {/* Image de couverture */}
          <Column gap="s">
            <Text variant="label-default-m">URL de l'image de couverture</Text>
            <Input
              value={articleData.cover}
              onChange={(e) => handleInputChange("cover", e.target.value)}
              placeholder="/images/articles/mon-article.jpg"
              style={{ width: "100%" }}
            />
          </Column>

          {/* Tags */}
          <Column gap="s">
            <Text variant="label-default-m">
              Tags (séparés par des virgules)
            </Text>
            <Input
              value={tagsInput}
              onChange={(e) => handleTagsChange(e.target.value)}
              placeholder="IA, technologie, innovation"
              style={{ width: "100%" }}
            />
          </Column>
        </Column>
      </Column>

      {/* Contenu markdown */}
      <Column padding="l" border="neutral-alpha-medium" radius="m" gap="l">
        <Heading as="h2" variant="display-strong-s">
          Contenu de l'article
        </Heading>

        <Column gap="s">
          <Text variant="label-default-m">
            Rédigez votre article en Markdown
          </Text>
          <Text variant="body-default-s" color="neutral-medium">
            Utilisez la syntaxe Markdown pour formater votre contenu. Exemples :
            **gras**, *italique*, # Titre, ## Sous-titre, [lien](url)
          </Text>
          <Textarea
            value={articleData.content}
            onChange={(e) => handleInputChange("content", e.target.value)}
            placeholder={`# Mon article

## Introduction

Rédigez votre article ici en utilisant la **syntaxe Markdown**.

### Exemples de formatage

- **Texte en gras**
- *Texte en italique*
- [Liens](https://example.com)
- \`Code inline\`

\`\`\`
Code block
\`\`\``}
            rows={15}
            style={{
              width: "100%",
              fontFamily: "monospace",
              fontSize: "14px",
            }}
          />
        </Column>
      </Column>

      {/* Visualiseur */}
      <ArticleVisualizer
        articleData={articleData}
        providerSlug={providerSlug}
        onSave={handleSave}
        onPreview={handlePreview}
      />
    </Column>
  );
};
