"use client";

import React from "react";
import { Column, Heading, Card, Text } from "@/once-ui/components";
import { ServiceForm } from "@/components";

export default function ServiceCreationPage() {
  const handleSubmit = async (values: any) => {
    console.log("Service payload:", values);
    // Placeholder: no API call yet. Visual rendering only.
  };

  return (
    <Column gap="24" style={{ maxWidth: "1200px", width: "100%" }}>
      <Heading variant="display-strong-m">Créer un service</Heading>
      <Text color="neutral-medium">
        Prévisualisation du formulaire de création de service.
      </Text>
      <ServiceForm
        onSubmit={handleSubmit}
        submitLabel="Prévisualiser"
        submittingLabel="..."
      />
    </Column>
  );
}
