"use client";

import React from "react";
import { Column, Text, Heading, Badge } from "@/once-ui/components";
import { formatPrice } from "@/app/utils/priceUtils";
import { Service } from "@/app/types/service";

interface ServiceDetailRendererProps {
  service: Service;
  provider: {
    firstName: string;
    lastName: string;
  };
}

export const ServiceDetailRenderer: React.FC<ServiceDetailRendererProps> = ({
  service,
  provider,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Column gap="xl" fillWidth>
      {/* Aperçu du service */}
      <Column gap="m">
        <Heading as="h2" variant="display-strong-m">
          Aperçu du service
        </Heading>
        <Text variant="body-default-l" color="neutral-medium">
          {service.description}
        </Text>
      </Column>

      {/* Détails du service */}
      <Column gap="m">
        <Heading as="h2" variant="display-strong-m">
          Détails du service
        </Heading>

        <Column gap="l">
          <div>
            <Heading as="h3" variant="display-strong-s">
              Description complète
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              Ce service offre une solution complète pour répondre à vos besoins
              spécifiques. Notre approche combine expertise technique et
              innovation pour vous garantir des résultats optimaux.
            </Text>
          </div>

          <div>
            <Heading as="h3" variant="display-strong-s">
              Ce qui est inclus
            </Heading>
            <Column gap="s">
              <Text variant="body-default-l">
                • <strong>Analyse approfondie</strong> de vos besoins
              </Text>
              <Text variant="body-default-l">
                • <strong>Solution personnalisée</strong> adaptée à votre
                contexte
              </Text>
              <Text variant="body-default-l">
                • <strong>Accompagnement complet</strong> tout au long du projet
              </Text>
              <Text variant="body-default-l">
                • <strong>Support technique</strong> et formation si nécessaire
              </Text>
              <Text variant="body-default-l">
                • <strong>Suivi post-livraison</strong> pour assurer la
                satisfaction
              </Text>
            </Column>
          </div>

          <div>
            <Heading as="h3" variant="display-strong-s">
              Processus de travail
            </Heading>
            <Column gap="s">
              <Text variant="body-default-l">
                1. <strong>Phase de découverte</strong> - Compréhension de vos
                objectifs
              </Text>
              <Text variant="body-default-l">
                2. <strong>Phase de conception</strong> - Élaboration de la
                solution
              </Text>
              <Text variant="body-default-l">
                3. <strong>Phase de développement</strong> - Mise en œuvre
                technique
              </Text>
              <Text variant="body-default-l">
                4. <strong>Phase de test</strong> - Validation et optimisation
              </Text>
              <Text variant="body-default-l">
                5. <strong>Phase de déploiement</strong> - Livraison et
                formation
              </Text>
            </Column>
          </div>
        </Column>
      </Column>

      {/* Tarification */}
      <Column gap="m">
        <Heading as="h2" variant="display-strong-m">
          Tarification
        </Heading>
        <Column gap="s">
          <Text variant="body-default-l">
            <strong>Prix :</strong>{" "}
            {formatPrice(service.minPrice, service.maxPrice)}
          </Text>
          <Text variant="body-default-s" color="neutral-medium">
            Les prix peuvent varier selon la complexité du projet et les
            spécifications particulières.
          </Text>
        </Column>
      </Column>

      {/* Technologies utilisées */}
      <Column gap="m">
        <Heading as="h2" variant="display-strong-m">
          Technologies utilisées
        </Heading>
        <Column gap="s">
          <Text variant="body-default-l">
            • <strong>Technologie 1</strong> - Description de l'utilisation
          </Text>
          <Text variant="body-default-l">
            • <strong>Technologie 2</strong> - Description de l'utilisation
          </Text>
          <Text variant="body-default-l">
            • <strong>Technologie 3</strong> - Description de l'utilisation
          </Text>
        </Column>
      </Column>

      {/* Cas d'usage */}
      <Column gap="m">
        <Heading as="h2" variant="display-strong-m">
          Cas d'usage
        </Heading>
        <Column gap="l">
          <div>
            <Heading as="h3" variant="display-strong-s">
              Exemple 1 : [Nom du cas d'usage]
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              Description du cas d'usage et des résultats obtenus.
            </Text>
          </div>
          <div>
            <Heading as="h3" variant="display-strong-s">
              Exemple 2 : [Nom du cas d'usage]
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              Description du cas d'usage et des résultats obtenus.
            </Text>
          </div>
        </Column>
      </Column>

      {/* FAQ */}
      <Column gap="m">
        <Heading as="h2" variant="display-strong-m">
          FAQ
        </Heading>
        <Column gap="l">
          <div>
            <Heading as="h3" variant="display-strong-s">
              Question fréquente 1 ?
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              Réponse détaillée à la question fréquente.
            </Text>
          </div>
          <div>
            <Heading as="h3" variant="display-strong-s">
              Question fréquente 2 ?
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              Réponse détaillée à la question fréquente.
            </Text>
          </div>
          <div>
            <Heading as="h3" variant="display-strong-s">
              Question fréquente 3 ?
            </Heading>
            <Text variant="body-default-l" color="neutral-medium">
              Réponse détaillée à la question fréquente.
            </Text>
          </div>
        </Column>
      </Column>

      {/* Contact */}
      <Column gap="m">
        <Heading as="h2" variant="display-strong-m">
          Contact
        </Heading>
        <Text variant="body-default-l" color="neutral-medium">
          Pour plus d'informations sur ce service ou pour discuter de votre
          projet, n'hésitez pas à me contacter.
        </Text>
      </Column>

      {/* Footer */}
      <Text
        variant="body-default-s"
        color="neutral-medium"
        style={{ fontStyle: "italic" }}
      >
        Ce service est proposé par {provider.firstName} {provider.lastName} -
        Expert en {service.title}
      </Text>
    </Column>
  );
};
