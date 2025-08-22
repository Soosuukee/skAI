"use client";

import React from "react";
import { Column, Heading, Text, Button } from "@/once-ui/components";

export default function TestProviderAboutPage() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Heading as="h1" variant="display-strong-l">
        À propos - Provider Test
      </Heading>

      <Text variant="body-default-l" color="neutral-medium">
        Cette page simule la section "À propos" d'un provider. Vous devriez voir
        "À propos" sélectionné dans la navbar.
      </Text>

      <Button href="/providers/test-provider" variant="primary">
        Retour au Portfolio
      </Button>
    </Column>
  );
}
