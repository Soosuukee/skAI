"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useProviderServices } from "@/app/hooks/providers";
import { Column, Heading, Text, Button } from "@/once-ui/components";
import ServiceForm, { ServiceFormValues } from "@/components/forms/ServiceForm";
import { getApiBaseUrl } from "@/app/utils/api";

interface EditServicePageProps {
  params: Promise<{ slug: string }>;
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const routeParams = React.use(params);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const providerSlug =
    user?.role === "provider" ? (user as any).slug || "" : "";
  const { services, loading, error } = useProviderServices(providerSlug);

  const service = services.find((s) => s.slug === routeParams.slug);

  React.useEffect(() => {
    if (!isLoading && !user) router.push("/join");
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <Column padding="24" horizontal="center">
        <Text>Chargement…</Text>
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
        <Text onBackground="neutral-weak">Page réservée aux prestataires.</Text>
        <Button variant="secondary" href="/me">
          Retour à mon profil
        </Button>
      </Column>
    );
  }

  const initialValues: ServiceFormValues | undefined = service
    ? {
        title: service.title,
        summary: service.summary || "",
        slug: service.slug,
        isActive: service.isActive,
        isFeatured: service.isFeatured,
        minPrice: service.minPrice ?? null,
        maxPrice: service.maxPrice ?? null,
        sections: service.sections || [],
        tags: service.tags || [],
        subtitle: "",
        coverImageFile: null,
        onQuote: service.minPrice == null && service.maxPrice == null,
      }
    : undefined;

  const handleUpdate = async (values: ServiceFormValues) => {
    const apiBase = getApiBaseUrl();
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("authToken")
        : undefined;
    await fetch(
      `${apiBase}/providers/${providerSlug}/services/${service?.slug}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(values),
      }
    );
  };

  return (
    <Column
      gap="16"
      padding="24"
      fillWidth
      style={{ width: "85%", marginInline: "auto" }}
    >
      <Heading as="h1" variant="display-strong-m">
        Modifier le service
      </Heading>
      {loading && <Text>Chargement du service…</Text>}
      {error && <Text color="error">Erreur: {error}</Text>}
      {!loading && !service && <Text color="error">Service introuvable.</Text>}
      {service && initialValues && (
        <ServiceForm
          onSubmit={handleUpdate}
          initialValues={initialValues}
          submitLabel="Soumettre"
          submittingLabel="..."
          texts={{
            priceHelp: "Modifier le coût du service",
            describeHeading: "Modifier la description du service",
            tagsHeading: "Modifier les tags du service",
          }}
        />
      )}
      <Button variant="secondary" href="/me/service">
        Retour
      </Button>
    </Column>
  );
}
