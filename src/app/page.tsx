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
            href="/home"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              background: "var(--surface)",
              border: "1px solid var(--neutral-alpha-medium)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            Go to Home
          </SmartLink>
          <SmartLink
            href="/providers/jensen-huang"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              background: "var(--brand)",
              border: "1px solid var(--brand)",
              textDecoration: "none",
              color: "var(--brand-on-background)",
            }}
          >
            View Jensen's Profile
          </SmartLink>
        </Flex>
      </Column>
    </Column>
  );
}
