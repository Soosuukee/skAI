"use client";

import React, { useState } from "react";
import { Column, Heading, Text, Button, Flex } from "@/once-ui/components";
import { ArticleForm } from "@/components";
import { ArticleRenderer } from "@/components/blog/ArticleRenderer";

export default function ArticleCreationPage() {
  const handleFormSubmit = async (values: any) => {
    console.log("Article payload:", values);
    alert("Article créé ! Vérifiez la console pour voir les données.");
  };

  return (
    <Column gap="24" fillWidth style={{ width: "85%", marginInline: "auto" }}>
      <Heading variant="display-strong-m">Créer un article</Heading>
      <Text color="neutral-medium">
        Remplissez le formulaire pour créer votre article.
      </Text>
      <ArticleForm
        onSubmit={handleFormSubmit}
        submitLabel="Soumettre"
        submittingLabel="..."
      />
    </Column>
  );
}
