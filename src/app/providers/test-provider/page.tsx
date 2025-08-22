"use client";

import React from "react";
import { Column, Heading, Text, Button, Flex } from "@/once-ui/components";

export default function TestProviderPage() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Heading as="h1" variant="display-strong-l">
        Page de test - Provider
      </Heading>

      <Text variant="body-default-l" color="neutral-medium">
        Cette page simule la page principale d'un provider. Vous devriez voir la
        navbar avec les liens : Portfolio, À propos, Services, Blog.
      </Text>

      <Flex gap="m" horizontal="center">
        <Button href="/providers/test-provider/about" variant="primary">
          Page À propos
        </Button>
        <Button href="/providers/test-provider/service" variant="secondary">
          Page Services
        </Button>
        <Button href="/providers/test-provider/blog" variant="tertiary">
          Page Blog
        </Button>
      </Flex>

      <Text variant="body-default-s" color="neutral-medium">
        Naviguez vers ces pages pour tester la navbar provider.
      </Text>
    </Column>
  );
}
