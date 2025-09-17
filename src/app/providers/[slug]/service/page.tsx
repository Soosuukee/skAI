"use client";

import React from "react";
import { Column } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";
import { useProviderBasic, useProviderServices } from "@/app/hooks/providers";
import { ProviderServices } from "@/components/service/ProviderServices";
import { RevealFx, Heading } from "@/once-ui/components";

interface ProviderServicePageProps {
  params: Promise<{ slug: string }>;
}

function ProviderServiceContent({
  provider,
  services,
  providerSlug,
}: {
  provider: any;
  services: any[];
  providerSlug: string;
}) {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}/service`}
        title={`Services de ${provider.firstName} ${provider.lastName}`}
        description={`Découvrez les services professionnels de ${provider.firstName} ${provider.lastName}`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${provider.firstName} ${provider.lastName} - Services`
        )}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}/providers/${provider.slug}/about`,
          image: `${baseURL}${provider.avatar}`,
        }}
      />
      <RevealFx
        fillWidth
        horizontal="start"
        paddingTop="16"
        paddingBottom="32"
        paddingLeft="12"
      >
        <Heading as="h1" marginBottom="16" variant="display-strong-s">
          Services de {provider.firstName} {provider.lastName}
        </Heading>
        <ProviderServices services={services} providerSlug={providerSlug} />
      </RevealFx>
    </Column>
  );
}

export default function ProviderServicePage({
  params,
}: ProviderServicePageProps) {
  const resolvedParams = React.use(params);
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useProviderBasic(resolvedParams.slug);
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useProviderServices(resolvedParams.slug);

  if (providerLoading || servicesLoading) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Chargement...</Heading>
      </Column>
    );
  }

  if (providerError || !provider) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Erreur: {providerError || "Provider non trouvé"}</Heading>
      </Column>
    );
  }

  if (servicesError) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Erreur lors du chargement des services</Heading>
      </Column>
    );
  }

  return (
    <ProviderServiceContent
      provider={provider}
      services={services}
      providerSlug={resolvedParams.slug}
    />
  );
}
