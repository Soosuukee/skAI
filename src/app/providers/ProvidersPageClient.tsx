import {
  Column,
  Heading,
  RevealFx,
  Flex,
  Tag,
  Grid,
  Text,
} from "@/once-ui/components";
import { Schema } from "@/once-ui/modules";
import { getProviderAllBySlug } from "@/app/utils/providerUtils";
import { getServicesByProviderSlug } from "@/app/utils/serviceUtils";
import { getArticlesByProviderSlug } from "@/app/utils/articleUtils";
import { ProviderHomeServiceCard } from "@/components/service/ProviderHomeServiceCard";
import { ProviderHomeArticleCard } from "@/components/blog/ProviderHomeArticleCard";

interface ProvidersPageClientProps {
  slug: string;
}

export default async function ProvidersPageClient({
  slug,
}: ProvidersPageClientProps) {
  const provider = await getProviderAllBySlug(slug);
  if (!provider) {
    return (
      <Column maxWidth="m" gap="xl" horizontal="center" paddingY="24">
        <Heading>Provider non trouvé</Heading>
      </Column>
    );
  }

  const services = await getServicesByProviderSlug(provider.slug);
  const articles = await getArticlesByProviderSlug(provider.slug);
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const servicesPath = `/providers/${provider.slug}/service`;
  const articlesPath = `/providers/${provider.slug}/blog`;

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={`/providers/${provider.slug}`}
        title={`Profil de ${provider.firstName} ${provider.lastName}`}
        description={`Découvrez le profil de ${provider.firstName} ${provider.lastName}.`}
      />

      <Column fillWidth paddingY="24" gap="m">
        <RevealFx
          translateY="4"
          fillWidth
          horizontal="start"
          paddingBottom="16"
        >
          <Heading wrap="balance" variant="display-strong-l">
            Profil de {provider.firstName} {provider.lastName}
          </Heading>
        </RevealFx>
        <Flex gap="8" wrap>
          <Tag size="s" variant="neutral">
            {provider.role}
          </Tag>
          {provider.languages?.map((language) => (
            <Tag key={language.slug} size="s" variant="neutral">
              {language.name}
            </Tag>
          ))}
        </Flex>
      </Column>

      <Column fillWidth gap="l">
        <RevealFx translateY={4} delay={0.1} fillWidth>
          <Heading
            as="h2"
            marginTop="32"
            marginBottom="16"
            variant="display-strong-s"
          >
            Services proposés par {provider.firstName}
          </Heading>
        </RevealFx>
        {services.length > 0 ? (
          <Grid columns="2" mobileColumns="1" fillWidth gap="l">
            {services.map((service, idx) => (
              <ProviderHomeServiceCard
                key={service.slug ?? service.id}
                service={service as any}
                providerSlug={provider.slug}
                index={idx}
              />
            ))}
          </Grid>
        ) : (
          <Text variant="body-default-l" color="neutral-medium">
            {provider.firstName} n'a pas encore de services publiés.
          </Text>
        )}
        <Flex horizontal="end" paddingTop="8">
          <Text as="a" href={servicesPath} style={{ color: "var(--brand)" }}>
            Voir toutes les prestations
          </Text>
        </Flex>
      </Column>

      <RevealFx translateY={4} delay={0.3} fillWidth>
        <Heading
          as="h2"
          marginTop="32"
          marginBottom="16"
          variant="display-strong-s"
        >
          Articles rédigés par {provider.firstName}
        </Heading>
      </RevealFx>
      {articles.length > 0 ? (
        <Grid columns="2" mobileColumns="1" fillWidth marginBottom="12" gap="l">
          {articles.map((article, idx) => (
            <ProviderHomeArticleCard
              key={article.slug}
              article={article as any}
              providerSlug={provider.slug}
              index={idx}
            />
          ))}
        </Grid>
      ) : (
        <Text variant="body-default-l" color="neutral-medium">
          {provider.firstName} n'a pas encore publié d'articles.
        </Text>
      )}
      <Flex horizontal="end" paddingTop="8" paddingBottom="24">
        <Text as="a" href={articlesPath} style={{ color: "var(--brand)" }}>
          Voir plus d'articles
        </Text>
      </Flex>
    </Column>
  );
}
