import React from "react";
import { Column, Heading, Flex, SmartLink } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { Meta } from "@/once-ui/modules";

export async function generateMetadata() {
  return Meta.generate({
    title: "skAi - Platform",
    description: "Welcome to skAi platform",
    baseURL: baseURL,
    path: "/",
  });
}

export default function RootPage() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
      <Column maxWidth="s" horizontal="center">
        <Heading wrap="balance" variant="display-strong-l" marginBottom="16">
          Welcome to skAi Platform
        </Heading>
        <Heading variant="body-default-l" marginBottom="24">
          This is the main landing page. Provider profiles will be accessible
          here.
        </Heading>
        <Flex gap="12" horizontal="center">
          <SmartLink
            href="/providers"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              background: "var(--brand)",
              border: "1px solid var(--brand)",
              textDecoration: "none",
              color: "var(--brand-on-background)",
            }}
          >
            Voir la liste des prestataires
          </SmartLink>
        </Flex>
      </Column>
    </Column>
  );
}
