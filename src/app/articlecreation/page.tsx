"use client";

import React from "react";
import { Column, Heading, Text } from "@/once-ui/components";
import { ArticleForm } from "@/components";

export default function ArticleCreationPage() {
  const handleSubmit = async (values: any) => {
    console.log("Article payload:", values);
  };

  return (
    <Column maxWidth="m" gap="24">
      <Heading variant="display-strong-m">Créer un article</Heading>
      <Text color="neutral-medium">
        Prévisualisation du formulaire d'article.
      </Text>
      <ArticleForm
        onSubmit={handleSubmit}
        submitLabel="Prévisualiser"
        submittingLabel="..."
      />
    </Column>
  );
}
