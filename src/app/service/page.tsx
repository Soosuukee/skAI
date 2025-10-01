import { Column } from "@/once-ui/components";

import { service } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
// import { AllServices } from "@/components/service/AllServices";
import ServiceList from "@/components/service/ServiceList";
import { getAllServicesWithProviders } from "@/app/utils/serviceUtils";
import { RevealFx } from "@/once-ui/components";
import { Heading } from "@/once-ui/components";

export async function generateMetadata() {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return Meta.generate({
    title: "Services proposés par skAi",
    description:
      "Découvrez l'ensemble des services proposés par nos prestataires IA.",
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(service.title)}`,
    path: service.path,
  });
}

async function ServiceContent() {
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const services = await getAllServicesWithProviders();
  const normalized = services.map((s: any) => ({
    id: s.id ?? s.serviceId,
    providerId: s.provider?.id ?? s.providerId,
    createdAt: s.createdAt ?? s.created_at ?? new Date().toISOString(),
    maxPrice: s.maxPrice ?? s.max_price ?? null,
    minPrice: s.minPrice ?? s.min_price ?? null,
    isActive: Boolean(s.isActive ?? s.is_active ?? true),
    isFeatured: Boolean(s.isFeatured ?? s.is_featured ?? false),
    cover: s.cover,
    title: s.title,
    summary: s.summary,
    slug: s.slug,
    providerSlug: s.provider?.slug ?? s.providerSlug ?? "",
  }));

  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={service.path}
        title={service.title}
        description={service.description}
        image={`${baseURL}/og?title=${encodeURIComponent(service.title)}`}
        author={{ name: "", url: baseURL, image: "/images/avatar.jpg" }}
      />
      <RevealFx
        fillWidth
        horizontal="start"
        paddingTop="16"
        paddingBottom="32"
        paddingLeft="12"
      >
        <ServiceList services={normalized as any} />
      </RevealFx>
    </Column>
  );
}

export default function Service() {
  return (
    <>
      <ServiceContent />
    </>
  );
}
