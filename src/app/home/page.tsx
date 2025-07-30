import React from "react";

import { Column, Heading, Text } from "@/once-ui/components";
import { ProviderMarketplace } from "@/components/provider/ProviderMarketplace";
import { Meta } from "@/once-ui/modules";
import { baseURL } from "@/app/resources";

// Métadonnées temporaires en lorem
export async function generateMetadata() {
  return Meta.generate({
    title: "Marketplace skAI",
    description:
      "Trouvez des experts IA, filtrés par métier, pays et technologies.",
    baseURL: baseURL,
    path: "/",
  });
}

export default function Home() {
  return (
    <Column maxWidth="l" gap="xl" horizontal="center">
      <Column gap="s" fillWidth paddingY="32" horizontal="center">
        <Heading variant="display-strong-l" wrap="balance">
          skAI Marketplace
        </Heading>
        <Text
          variant="body-default-m"
          onBackground="neutral-medium"
          align="center"
        >
          Recherchez parmi nos experts (contenu fictif pour l'instant).
        </Text>
      </Column>
      <ProviderMarketplace />
    </Column>
  );
}
