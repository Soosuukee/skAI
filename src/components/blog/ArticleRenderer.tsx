"use client";

import React, { useState, useMemo } from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  SmartImage,
  Input,
  Textarea,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";

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

// Composant simple pour le rendu MDX en temps réel
export const ArticleRenderer: React.FC<{
  title?: string;
  summary?: string;
  cover?: string;
  sections?: Array<{
    title: string;
    contents: Array<{
      content: string;
      images: Array<{ url: string }>;
    }>;
  }>;
}> = ({
  title = "Titre de l'article",
  summary = "Résumé de l'article...",
  cover = "",
  sections = [],
}) => {
  return (
    <Column gap="l" fillWidth>
      {/* En-tête de l'article */}
      <CustomRevealFx translateY={4} delay={0.1} fillWidth>
        <Column padding="l" border="neutral-alpha-medium" radius="m" gap="m">
          {/* Image de couverture */}
          {cover && (
            <SmartImage
              src={makeAbsolute(cover) || ""}
              alt={`Image de couverture - ${title}`}
              width={600}
              height={338}
              radius="s"
              style={{
                objectFit: "cover",
                aspectRatio: "16/9",
                width: "100%",
                maxHeight: "400px",
              }}
            />
          )}

          {/* Titre et résumé */}
          <Column gap="s">
            <Heading as="h1" variant="display-strong-l">
              {title}
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              {summary}
            </Text>
          </Column>
        </Column>
      </CustomRevealFx>

      {/* Contenu de l'article - Sections du formulaire */}
      {sections.map((section, sectionIndex) => (
        <CustomRevealFx
          key={sectionIndex}
          translateY={4}
          delay={0.2 + sectionIndex * 0.1}
          fillWidth
        >
          <Column padding="l" border="neutral-alpha-medium" radius="m" gap="m">
            {/* Titre de section */}
            {section.title && (
              <Heading as="h2" variant="display-strong-m">
                {section.title}
              </Heading>
            )}

            {/* Contenu de la section */}
            {section.contents.map((content, contentIndex) => (
              <div key={contentIndex}>
                {/* Texte du contenu */}
                {content.content && (
                  <Text variant="body-default-l" marginY="m">
                    {content.content}
                  </Text>
                )}

                {/* Images du contenu */}
                {content.images.map((image, imageIndex) => (
                  <SmartImage
                    key={imageIndex}
                    src={makeAbsolute(image.url) || ""}
                    alt={`Image ${imageIndex + 1}`}
                    width={600}
                    height={400}
                    radius="m"
                    style={{
                      width: "100%",
                      maxWidth: "100%",
                      height: "auto",
                      margin: "16px 0",
                    }}
                  />
                ))}
              </div>
            ))}
          </Column>
        </CustomRevealFx>
      ))}
    </Column>
  );
};

// Composant de test simple avec formulaire + aperçu en temps réel
export const SimpleMDXPreview: React.FC = () => {
  const [title, setTitle] = useState("Mon titre d'article");
  const [subtitle, setSubtitle] = useState("Mon sous-titre");
  const [text, setText] = useState(
    "Voici le contenu de mon article. Il sera rendu en temps réel !"
  );

  // Génération du MDX string en temps réel
  const mdxString = useMemo(() => {
    return `# ${title}\n\n## ${subtitle}\n\n${text}`;
  }, [title, subtitle, text]);

  return (
    <Column maxWidth="l" gap="xl" horizontal="center" paddingY="24">
      <Heading variant="display-strong-m">Test MDX en temps réel</Heading>

      <Flex gap="l" fillWidth>
        {/* Formulaire à gauche */}
        <Column gap="m" style={{ flex: 1 }}>
          <Heading variant="display-strong-s">Formulaire</Heading>

          <Column gap="s">
            <Text variant="label-default-m">Titre</Text>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entrez votre titre..."
              style={{ width: "100%" }}
            />
          </Column>

          <Column gap="s">
            <Text variant="label-default-m">Sous-titre</Text>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Entrez votre sous-titre..."
              style={{ width: "100%" }}
            />
          </Column>

          <Column gap="s">
            <Text variant="label-default-m">Contenu</Text>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Entrez votre contenu..."
              rows={6}
              style={{ width: "100%" }}
            />
          </Column>
        </Column>

        {/* Aperçu MDX à droite */}
        <Column gap="m" style={{ flex: 1 }}>
          <Heading variant="display-strong-s">Aperçu MDX</Heading>

          <Column
            padding="l"
            border="neutral-alpha-medium"
            radius="m"
            gap="m"
            style={{ minHeight: "200px" }}
          >
            {/* Rendu simple du titre, sous-titre et du texte */}
            <Heading as="h1" variant="display-strong-l">
              {title}
            </Heading>
            <Heading as="h2" variant="display-strong-m">
              {subtitle}
            </Heading>
            <Text variant="body-default-l">{text}</Text>
          </Column>

          {/* Code MDX généré */}
          <Column gap="s">
            <Text variant="label-default-m">Code MDX généré :</Text>
            <pre
              style={{
                backgroundColor: "var(--neutral-alpha-light)",
                padding: "12px",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "monospace",
                overflow: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              {mdxString}
            </pre>
          </Column>
        </Column>
      </Flex>
    </Column>
  );
};

export default ArticleRenderer;
