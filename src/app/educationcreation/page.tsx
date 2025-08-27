"use client";

import React from "react";
import { Column, Heading, Text } from "@/once-ui/components";
import { EducationForm } from "@/components";

export default function EducationCreationPage() {
  const handleSubmit = async (values: any) => {
    console.log("Education payload:", values);
  };

  return (
    <Column maxWidth="m" gap="24">
      <Heading variant="display-strong-m">Ajouter un diplôme</Heading>
      <Text color="neutral-medium">
        Prévisualisation du formulaire diplôme.
      </Text>
      <EducationForm
        onSubmit={handleSubmit}
        submitLabel="Prévisualiser"
        submittingLabel="..."
      />
    </Column>
  );
}
