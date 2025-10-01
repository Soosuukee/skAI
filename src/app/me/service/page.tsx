"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useProviderServices } from "@/app/hooks/providers";
import { ProviderHomeServiceCard } from "@/components/service/ProviderHomeServiceCard";
import { MeServiceCard } from "@/components/me/MeServiceCard";
import { MeMenu } from "@/components/me/MeMenu";
import { Column, Heading, Text, Button, Flex } from "@/once-ui/components";

export default function MeServicesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/join");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <Column padding="24" horizontal="center">
        <Text>Chargement...</Text>
      </Column>
    );
  }

  if (!user) return null;

  if (user.role !== "provider") {
    return (
      <Column gap="12" padding="24" horizontal="center">
        <Heading as="h2" variant="display-strong-s">
          Accès réservé
        </Heading>
        <Text onBackground="neutral-weak">
          Cette page est réservée aux prestataires (providers).
        </Text>
        <Button variant="secondary" href="/me">
          Retour à mon profil
        </Button>
      </Column>
    );
  }

  const providerSlug = (user as any).slug || "";
  const { services, loading, error } = useProviderServices(providerSlug);

  return (
    <Column gap="16" padding="24" fillWidth>
      <Flex gap="24" fillWidth mobileDirection="column">
        <MeMenu />
        <Column gap="16" style={{ flex: 1 }}>
          <Heading as="h1" variant="display-strong-m">
            Mes services
          </Heading>

          {loading && <Text>Chargement des services…</Text>}
          {error && <Text color="error">Erreur: {error}</Text>}
          {!loading && !error && services.length === 0 && (
            <Text onBackground="neutral-weak">
              Aucun service pour l'instant.
            </Text>
          )}

          <Column gap="l">
            {services.map((service, idx) => (
              <MeServiceCard
                key={service.id}
                service={service}
                providerSlug={providerSlug}
                onDeleted={() => window.location.reload()}
              />
            ))}
          </Column>

          <Button variant="secondary" href="/me">
            Retour à mon profil
          </Button>
        </Column>
      </Flex>
    </Column>
  );
}
