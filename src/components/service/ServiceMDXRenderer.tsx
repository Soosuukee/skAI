import React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { Service } from "@/app/types/service";
import { Service as ServiceComponents } from "./ServiceComponents";
import { ServiceProvider } from "./ServiceContext";

interface ServiceMDXRendererProps {
  service: Service;
  provider: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
  };
}

export async function ServiceMDXRenderer({
  service,
  provider,
}: ServiceMDXRendererProps) {
  // MDX piloté par composants: aucune donnée hardcodée ici
  // Le contenu reste éditorial, les valeurs viennent des composants Service.*
  const mdxSource = `# <Service.Title />

## Aperçu du service
<Service.Summary />

## Tarification
<Service.Price />

## Détails du service
<Service.Section title="Description complète">
Ce service offre une solution complète pour répondre à vos besoins spécifiques.
Notre approche combine expertise technique et innovation pour vous garantir des résultats optimaux.
</Service.Section>
`;

  try {
    // Compiler le MDX avec les variables
    const { content } = await compileMDX({
      source: mdxSource,
      components: { ...mdxComponents, Service: ServiceComponents },
    });

    return (
      <ServiceProvider data={{ service, provider }}>{content}</ServiceProvider>
    );
  } catch (error) {
    console.error("Erreur lors de la compilation MDX:", error);
    return <p>Erreur lors du chargement du contenu du service.</p>;
  }
}
