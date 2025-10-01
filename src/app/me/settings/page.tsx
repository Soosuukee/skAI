"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Column, Heading, Text, Flex } from "@/once-ui/components";
import MeProfileForm from "@/components/me/MeProfileForm";
import SettingsMenu from "@/components/me/SettingsMenu";

export default function MeSettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth() as any;

  useEffect(() => {
    if (!loading && !user) router.push("/join");
  }, [loading, user, router]);

  if (loading) {
    return (
      <Column padding="24" horizontal="center">
        <Text>Chargement…</Text>
      </Column>
    );
  }

  if (!user) return null;

  return (
    <Column gap="24" padding="24" fillWidth>
      <Heading variant="display-strong-m">Mes paramètres</Heading>
      <Flex gap="24" fillWidth mobileDirection="column">
        <SettingsMenu />
        <Column
          style={{
            flex: 1,
            borderLeft: "1px solid var(--neutral-alpha-medium)",
            paddingLeft: 24,
          }}
        >
          <MeProfileForm
            labels={{
              photoTitle: "Photo",
              profileTitle: "Mes informations",
              emailTitle: "Changer l’adresse mail",
              passwordTitle: "Modifier le mot de passe",
            }}
          />
        </Column>
      </Flex>
    </Column>
  );
}
