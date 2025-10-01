import ProvidersPageClient from "../ProvidersPageClient";
import { Meta } from "@/once-ui/modules";
import { getProviderAllBySlug } from "@/app/utils/providerUtils";
import { getApiBaseUrl } from "@/app/utils/api";

interface ProviderPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProviderAllBySlug(slug);
  if (!provider) return {};

  const apiBase = getApiBaseUrl();
  const makeAbsolute = (url?: string | null) => {
    if (!url) return undefined;
    if (/^https?:\/\//.test(url)) return url;
    try {
      const origin = new URL(apiBase).origin;
      return url.startsWith("/") ? `${origin}${url}` : `${apiBase}/${url}`;
    } catch {
      return url || undefined;
    }
  };

  return Meta.generate({
    title: `Profil de ${provider.firstName} ${provider.lastName}`,
    description: `Découvrez le profil de ${provider.firstName} ${provider.lastName}.`,
    baseURL: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    path: `/providers/${slug}`,
    image:
      makeAbsolute((provider as any).profilePicture) || "/images/avatar.jpg",
  });
}

export default async function ProviderPage({ params }: ProviderPageProps) {
  const { slug } = await params;
  return <ProvidersPageClient slug={slug} />;
}
