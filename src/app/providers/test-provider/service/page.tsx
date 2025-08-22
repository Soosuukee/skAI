"use client";

import React from "react";
import { Column, Heading, Text, Button } from "@/once-ui/components";

export default function TestProviderServicePage() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Heading as="h1" variant="display-strong-l">
        Services - Provider Test
      </Heading>

      <Text variant="body-default-l" color="neutral-medium">
        Cette page simule la section "Services" d'un provider. Vous devriez voir
        "Services" sélectionné dans la navbar.
      </Text>

      <Button href="/providers/test-provider" variant="primary">
        Retour au Portfolio
      </Button>
    </Column>
  );
}
