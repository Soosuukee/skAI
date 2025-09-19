"use client";

import React, { useState } from "react";
import { Column, Heading, Text, Button, Flex } from "@/once-ui/components";
import { ArticleForm } from "@/components";
import { ArticleRenderer } from "@/components/blog/ArticleRenderer";

export default function ArticleCreationPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [liveFormData, setLiveFormData] = useState<any>({
    title: "",
    summary: "",
    publishedAt: "",
    sections: [{ title: "", contents: [{ content: "", images: [] }] }],
    isPublished: false,
    isFeatured: false,
    articleCoverFile: null,
  });

  const handleFormSubmit = async (values: any) => {
    console.log("Article payload:", values);
    alert("Article créé ! Vérifiez la console pour voir les données.");
  };

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  // Fonction pour générer le MDX à partir des données du formulaire
  const generateMDX = (data: any) => {
    let mdx = "";

    // Titre principal
    if (data.title) {
      mdx += `# ${data.title}\n\n`;
    }

    // Résumé
    if (data.summary) {
      mdx += `${data.summary}\n\n`;
    }

    // Sections
    if (data.sections && data.sections.length > 0) {
      data.sections.forEach((section: any) => {
        if (section.title) {
          mdx += `## ${section.title}\n\n`;
        }

        if (section.contents && section.contents.length > 0) {
          section.contents.forEach((content: any) => {
            if (content.content) {
              mdx += `${content.content}\n\n`;
            }

            // Images
            if (content.images && content.images.length > 0) {
              content.images.forEach((image: any) => {
                if (image.url) {
                  mdx += `![Image](${image.url})\n\n`;
                }
              });
            }
          });
        }
      });
    }

    return mdx;
  };

  const mdxString = generateMDX(liveFormData);

  return (
    <Column maxWidth="l" gap="xl" horizontal="center" paddingY="24">
      <Column gap="m">
        <Heading variant="display-strong-m">Créer un article</Heading>
        <Text color="neutral-medium">
          Remplissez le formulaire pour créer votre article avec aperçu MDX en
          temps réel.
        </Text>
      </Column>

      <Flex gap="l" fillWidth>
        {/* Formulaire à gauche */}
        <Column gap="m" style={{ flex: 1 }}>
          <Heading variant="display-strong-s">Formulaire</Heading>
          <ArticleForm
            onSubmit={handleFormSubmit}
            submitLabel="Créer l'article"
            submittingLabel="Création..."
            initialValues={liveFormData}
            onLiveUpdate={setLiveFormData}
          />
        </Column>

        {/* Aperçu MDX à droite */}
        <Column gap="m" style={{ flex: 1 }}>
          <Flex gap="m" vertical="center">
            <Heading variant="display-strong-s">Aperçu MDX</Heading>
            <Button
              variant={showPreview ? "primary" : "secondary"}
              size="s"
              onClick={handlePreview}
            >
              {showPreview ? "Masquer" : "Prévisualiser"}
            </Button>
          </Flex>

          {showPreview && (
            <>
              <Column
                padding="l"
                border="neutral-alpha-medium"
                radius="m"
                gap="m"
                style={{ minHeight: "400px" }}
              >
                <ArticleRenderer
                  title={liveFormData.title || "Titre de l'article"}
                  summary={liveFormData.summary || "Résumé de l'article..."}
                  cover={
                    liveFormData.articleCoverFile
                      ? URL.createObjectURL(liveFormData.articleCoverFile)
                      : ""
                  }
                  sections={liveFormData.sections || []}
                />
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
                    maxHeight: "200px",
                  }}
                >
                  {mdxString}
                </pre>
              </Column>
            </>
          )}
        </Column>
      </Flex>
    </Column>
  );
}
