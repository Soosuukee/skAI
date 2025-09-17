"use client";

import React, { useState, useEffect } from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  SmartImage,
  Tabs,
  Button,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import type { Article } from "@/app/types/article";

interface ArticleVisualizerProps {
  articleData: {
    title: string;
    summary: string;
    cover?: string;
    content: string; // Contenu markdown
    tags?: string[];
  };
  providerSlug: string;
  onSave?: (article: Article) => void;
  onPreview?: (markdown: string) => void;
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

// Composant pour rendre le markdown en HTML
const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    // Conversion basique markdown vers HTML
    let html = content
      // Titres
      .replace(
        /^### (.*$)/gim,
        '<h3 class="text-lg font-semibold mb-2">$1</h3>'
      )
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
      // Gras et italique
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      // Liens
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/gim,
        '<a href="$2" class="text-blue-600 hover:underline">$1</a>'
      )
      // Code inline
      .replace(
        /`([^`]+)`/gim,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>'
      )
      // Code blocks
      .replace(
        /```([^`]+)```/gim,
        '<pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>'
      )
      // Listes
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Paragraphes
      .replace(/\n\n/gim, '</p><p class="mb-4">')
      .replace(/^(?!<[h|l|p|s|c])(.*$)/gim, '<p class="mb-4">$1</p>');

    // Nettoyer les balises vides
    html = html.replace(/<p class="mb-4"><\/p>/gim, "");

    setHtmlContent(html);
  }, [content]);

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export const ArticleVisualizer: React.FC<ArticleVisualizerProps> = ({
  articleData,
  providerSlug,
  onSave,
  onPreview,
}) => {
  const [activeTab, setActiveTab] = useState<"preview" | "markdown">("preview");

  const handleSave = () => {
    if (onSave) {
      // Créer un objet Article complet
      const article: Article = {
        articleId: Date.now(), // ID temporaire
        providerId: 1, // À remplacer par l'ID du provider connecté
        languageId: 1,
        title: articleData.title,
        slug: articleData.title.toLowerCase().replace(/\s+/g, "-"),
        publishedAt: new Date().toISOString(),
        summary: articleData.summary,
        isPublished: false,
        isFeatured: false,
        cover: articleData.cover || "",
        tags:
          articleData.tags?.map((tag) => ({ id: Date.now(), name: tag })) || [],
        sections: [],
      };
      onSave(article);
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(articleData.content);
    }
  };

  return (
    <Column gap="l" fillWidth>
      {/* En-tête de l'article */}
      <CustomRevealFx translateY={4} delay={0.1} fillWidth>
        <Column padding="l" border="neutral-alpha-medium" radius="m" gap="m">
          {/* Image de couverture */}
          {articleData.cover ? (
            <SmartImage
              src={makeAbsolute(articleData.cover) || ""}
              alt={`Image de couverture - ${articleData.title}`}
              width={400}
              height={225}
              radius="s"
              style={{
                objectFit: "cover",
                aspectRatio: "16/9",
                width: "100%",
                maxHeight: "250px",
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
              <Text color="neutral-medium">Aucune image de couverture</Text>
            </div>
          )}

          {/* Titre et résumé */}
          <Column gap="s">
            <Heading as="h1" variant="display-strong-m">
              {articleData.title || "Titre de l'article"}
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              {articleData.summary || "Résumé de l'article..."}
            </Text>
          </Column>

          {/* Tags */}
          {articleData.tags && articleData.tags.length > 0 && (
            <Flex gap="s" wrap>
              {articleData.tags.map((tag, index) => (
                <Text
                  key={index}
                  variant="label-default-s"
                  style={{
                    backgroundColor: "var(--neutral-alpha-light)",
                    padding: "4px 8px",
                    borderRadius: "4px",
                  }}
                >
                  #{tag}
                </Text>
              ))}
            </Flex>
          )}
        </Column>
      </CustomRevealFx>

      {/* Contenu de l'article */}
      <CustomRevealFx translateY={4} delay={0.2} fillWidth>
        <Column padding="l" border="neutral-alpha-medium" radius="m" gap="m">
          {/* Onglets pour basculer entre preview et markdown */}
          <Flex gap="s">
            <Button
              variant={activeTab === "preview" ? "primary" : "secondary"}
              size="s"
              onClick={() => setActiveTab("preview")}
            >
              Aperçu
            </Button>
            <Button
              variant={activeTab === "markdown" ? "primary" : "secondary"}
              size="s"
              onClick={() => setActiveTab("markdown")}
            >
              Markdown
            </Button>
          </Flex>

          {/* Contenu selon l'onglet actif */}
          {activeTab === "preview" ? (
            <div style={{ minHeight: "300px" }}>
              {articleData.content ? (
                <MarkdownRenderer content={articleData.content} />
              ) : (
                <Text color="neutral-medium">
                  Commencez à rédiger votre article...
                </Text>
              )}
            </div>
          ) : (
            <pre
              style={{
                backgroundColor: "var(--neutral-alpha-light)",
                padding: "16px",
                borderRadius: "8px",
                overflow: "auto",
                minHeight: "300px",
                fontFamily: "monospace",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              {articleData.content ||
                "# Votre article en markdown\n\nCommencez à rédiger..."}
            </pre>
          )}
        </Column>
      </CustomRevealFx>

      {/* Actions */}
      <CustomRevealFx translateY={4} delay={0.3} fillWidth>
        <Flex gap="m" horizontal="end">
          <Button variant="secondary" size="m" onClick={handlePreview}>
            Prévisualiser
          </Button>
          <Button variant="primary" size="m" onClick={handleSave}>
            Sauvegarder
          </Button>
        </Flex>
      </CustomRevealFx>
    </Column>
  );
};
