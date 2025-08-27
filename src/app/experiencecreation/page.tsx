"use client";

import React from "react";
import { Column, Heading, Text } from "@/once-ui/components";
import { ExperienceForm } from "@/components";

export default function ExperienceCreationPage() {
  const handleSubmit = async (values: any) => {
    console.log("Experience payload:", values);
  };

  return (
    <Column maxWidth="m" gap="24">
      <Heading variant="display-strong-m">Créer une expérience</Heading>
      <Text color="neutral-medium">
        Prévisualisation du formulaire d'expérience.
      </Text>
      <ExperienceForm
        onSubmit={handleSubmit}
        submitLabel="Prévisualiser"
        submittingLabel="..."
      />
    </Column>
  );
}
