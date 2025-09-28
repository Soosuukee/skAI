import React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/components/mdx";
import { Service } from "@/app/types/service";

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
  // Template MDX avec les variables du service
  const mdxSource = `---
title: "${service.title}"
summary: "${service.summary || service.description || ""}"
tag: "${service.tags?.[0]?.title || "Service"}"
minPrice: ${service.minPrice || 0}
maxPrice: ${service.maxPrice || 0}
createdAt: "${service.createdAt}"
providerName: "${provider.firstName} ${provider.lastName}"
providerEmail: "${provider.email || ""}"
providerPhone: "${provider.phone || ""}"
---

# {title}

## Aperçu du service

{summary}

## Détails du service

### Description complète

Ce service offre une solution complète pour répondre à vos besoins spécifiques. Notre approche combine expertise technique et innovation pour vous garantir des résultats optimaux.

### Ce qui est inclus

- **Analyse approfondie** de vos besoins
- **Solution personnalisée** adaptée à votre contexte
- **Accompagnement complet** tout au long du projet
- **Support technique** et formation si nécessaire
- **Suivi post-livraison** pour assurer la satisfaction

### Processus de travail

1. **Phase de découverte** - Compréhension de vos objectifs
2. **Phase de conception** - Élaboration de la solution
3. **Phase de développement** - Mise en œuvre technique
4. **Phase de test** - Validation et optimisation
5. **Phase de déploiement** - Livraison et formation

## Tarification

**Prix :** {minPrice}€ - {maxPrice}€

_Les prix peuvent varier selon la complexité du projet et les spécifications particulières._

## Technologies utilisées

- **Technologie 1** - Description de l'utilisation
- **Technologie 2** - Description de l'utilisation
- **Technologie 3** - Description de l'utilisation

## Cas d'usage

### Exemple 1 : [Nom du cas d'usage]

Description du cas d'usage et des résultats obtenus.

### Exemple 2 : [Nom du cas d'usage]

Description du cas d'usage et des résultats obtenus.

## FAQ

### Question fréquente 1 ?

Réponse détaillée à la question fréquente.

### Question fréquente 2 ?

Réponse détaillée à la question fréquente.

### Question fréquente 3 ?

Réponse détaillée à la question fréquente.

## Contact

Pour plus d'informations sur ce service ou pour discuter de votre projet, n'hésitez pas à me contacter.

**Email :** {providerEmail}
**Téléphone :** {providerPhone}

---

_Ce service est proposé par {providerName} - Expert en {tag}_`;

  try {
    // Compiler le MDX avec les variables
    const { content } = await compileMDX({
      source: mdxSource,
      components: mdxComponents,
      options: {
        parseFrontmatter: true,
      },
    });

    return content;
  } catch (error) {
    console.error("Erreur lors de la compilation MDX:", error);
    return <p>Erreur lors du chargement du contenu du service.</p>;
  }
}
