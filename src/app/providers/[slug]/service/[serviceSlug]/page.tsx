"use client";

import React from "react";
import {
  Heading,
  Column,
  Text,
  Button,
  RevealFx,
  Flex,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { ServiceContent } from "@/components/service/ServiceContent";
import { useProvider } from "@/app/hooks/useProvider";
import { useProviderServices } from "@/app/hooks/useProviderServices";
import { formatPrice } from "@/app/utils/priceUtils";
import { Meta, Schema } from "@/once-ui/modules";
import { ServiceDetailRenderer } from "@/components/service/ServiceDetailRenderer";

interface ProviderServiceDetailPageProps {
  params: Promise<{ slug: string; serviceSlug: string }>;
}

export default function ProviderServiceDetailPage({
  params,
}: ProviderServiceDetailPageProps) {
  const resolvedParams = React.use(params);
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const {
    provider,
    loading: providerLoading,
    error: providerError,
  } = useProvider(resolvedParams.slug);
  const {
    services,
    loading: servicesLoading,
    error: servicesError,
  } = useProviderServices(resolvedParams.slug);

  // Le service est maintenant chargé directement via le hook useProviderServices

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

  const slugParamRaw = resolvedParams.serviceSlug || "";
  const slugParam = decodeURIComponent(slugParamRaw);

  const toSlug = (value?: string) => {
    if (!value) return "";
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const service = services.find((s: any) => {
    const idMatch =
      (s.id != null && String(s.id) === slugParamRaw) ||
      (s.serviceId != null && String(s.serviceId) === slugParamRaw);
    if (idMatch) return true;
    const serviceSlug = (s.slug as string) || toSlug(s.title as string);
    return toSlug(slugParam) === serviceSlug;
  });

  if (!service) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center">
        <Heading>Service non trouvé</Heading>
        <Text variant="body-default-l" color="neutral-medium">
          Le service demandé n'existe pas.
        </Text>
        <Button
          href={`/providers/${resolvedParams.slug}/service`}
          variant="primary"
        >
          Retour aux services
        </Button>
      </Column>
    );
  }

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}/service/${
          service.slug || service.id
        }`}
        title={`${service.title} - ${provider.firstName} ${provider.lastName}`}
        description={`Service ${service.title} proposé par ${provider.firstName} ${provider.lastName}`}
        image={`${baseURL}/og?title=${encodeURIComponent(
          `${service.title} - ${provider.firstName} ${provider.lastName}`
        )}`}
        author={{
          name: `${provider.firstName} ${provider.lastName}`,
          url: `${baseURL}/providers/${provider.slug}/about`,
          image: `${baseURL}${provider.avatar}`,
        }}
      />

      {/* Contenu du service */}
      <RevealFx translateY={4} fillWidth delay={0.3}>
        <Column gap="l" fillWidth>
          <Heading as="h2" variant="display-strong-m">
            {service.title}
          </Heading>
          {Array.isArray((service as any).tags) && (
            <Text variant="body-default-l" color="neutral-medium">
              Tags :{" "}
              {(service as any).tags.map((t: any) => t.title || t).join(", ")}
            </Text>
          )}
          <Text variant="body-default-l">
            Prix :{" "}
            {formatPrice(service.minPrice ?? null, service.maxPrice ?? null)}
          </Text>
          <Text variant="body-default-l" color="neutral-medium">
            {service.summary}
          </Text>

          {/* Contenu détaillé du service */}
          <div className="mt-8">
            <ServiceDetailRenderer service={service} provider={provider} />
          </div>
        </Column>
      </RevealFx>

      {/* Actions */}
      <RevealFx translateY={4} fillWidth delay={0.4}>
        <Flex gap="m" horizontal="center">
          <Button
            href={`/providers/${resolvedParams.slug}/service`}
            variant="secondary"
          >
            Retour aux services
          </Button>
          <Button
            href={`/providers/${resolvedParams.slug}/about`}
            variant="primary"
          >
            Contacter {provider.firstName}
          </Button>
        </Flex>
      </RevealFx>
    </Column>
  );
}
