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
      <Column maxWidth="s" horizontal="center" gap="8">
        <Heading
          wrap="balance"
          variant="display-strong-l"
          style={{ marginBottom: "16" }}
        >
          Bienvenue sur
        </Heading>

        <img
          src="/trademark/Modern-_skAi_-Typography-Design.svg"
          alt="Logo skAi"
          style={{
            height: "15rem",
            width: "auto",
            filter: "invert(1)",
            marginBottom: "-1rem",
          }}
        />

        <Heading
          wrap="balance"
          variant="body-default-l"
          marginBottom="16"
          style={{ textAlign: "center", lineHeight: "1.6" }}
        >
          Votre plateforme de mise en relation de prestataires spécialisés dans
          l'intelligence artificielle et vous
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
              fontWeight: "600",
              fontSize: "1rem",
            }}
          >
            Voir les prestataires
          </SmartLink>
        </Flex>
      </Column>
    </Column>
  );
}
