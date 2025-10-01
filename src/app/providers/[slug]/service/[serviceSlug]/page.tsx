import { notFound } from "next/navigation";
import {
  Heading,
  Column,
  Text,
  Button,
  RevealFx,
  Flex,
  SmartImage,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
// Render service details directly in TSX instead of MDX
import { getServiceDetailForProvider } from "@/app/utils/serviceUtils";
import { Meta } from "@/once-ui/modules";

interface ProviderServiceDetailPageProps {
  params: Promise<{ slug: string; serviceSlug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[]; serviceSlug: string | string[] }>;
}) {
  const routeParams = await params;
  const providerSlug = Array.isArray(routeParams.slug)
    ? routeParams.slug[0]
    : routeParams.slug;
  const serviceSlug = Array.isArray(routeParams.serviceSlug)
    ? routeParams.serviceSlug[0]
    : routeParams.serviceSlug;

  const serviceData = await getServiceDetailForProvider(
    providerSlug,
    serviceSlug
  );
  if (!serviceData) return {};

  const { provider, service } = serviceData;

  return Meta.generate({
    title: `${service.title} - ${provider.firstName} ${provider.lastName}`,
    description: service.summary,
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    path: `/providers/${provider.slug}/service/${service.slug ?? service.id}`,
    image: service.cover,
  });
}

export default async function ProviderServiceDetailPage({
  params,
}: ProviderServiceDetailPageProps) {
  const { slug, serviceSlug } = await params;
  const data = await getServiceDetailForProvider(slug, serviceSlug);

  if (!data) {
    notFound();
  }

  const { provider, service } = data;
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <CustomRevealFx translateY={4} delay={0.1} fillWidth>
        <Heading as="h1" variant="display-strong-l">
          {service.title}
        </Heading>
      </CustomRevealFx>

      <RevealFx translateY={4} fillWidth delay={0.2}>
        <Text variant="body-default-l" color="neutral-medium">
          {service.summary}
        </Text>
      </RevealFx>

      <RevealFx translateY={4} fillWidth delay={0.3}>
        <Flex gap="m" horizontal="center">
          <Button
            href={`/providers/${provider.slug}/service`}
            variant="secondary"
          >
            Retour aux services proposés par {provider.firstName}
          </Button>
          <Button href={`/providers/${provider.slug}/about`} variant="primary">
            Contacter {provider.firstName}
          </Button>
        </Flex>
      </RevealFx>

      {/* Direct TSX rendering for service details */}
      <Column gap="l" fillWidth>
        <Heading as="h2" variant="display-strong-m">
          Détails du service
        </Heading>
        {service.cover && (
          <SmartImage
            src={service.cover}
            alt={service.title}
            radius="l"
            aspectRatio="16 / 9"
            marginBottom="16"
          />
        )}
        {Array.isArray(service.sections) &&
          service.sections.map((section: any, sIdx: number) => (
            <Column key={section.id ?? sIdx} gap="s">
              {section.title && (
                <Heading as="h3" variant="heading-strong-l">
                  {section.title}
                </Heading>
              )}
              {Array.isArray(section.contents) &&
                section.contents.map((content: any, cIdx: number) => (
                  <Column key={content.id ?? cIdx} gap="s">
                    {content.content && (
                      <Text variant="body-default-l">{content.content}</Text>
                    )}
                    {Array.isArray(content.images) &&
                      content.images.map((img: any, iIdx: number) => (
                        <SmartImage
                          key={img.id ?? iIdx}
                          src={img.url}
                          alt={section.title || service.title}
                          aspectRatio="16 / 9"
                          radius="l"
                          marginBottom="16"
                        />
                      ))}
                  </Column>
                ))}
            </Column>
          ))}
      </Column>
    </Column>
  );
}
