"use client";

import React from "react";
import { Column, Heading, Text, RevealFx } from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import { ServiceContent as ServiceContentType } from "@/app/utils/serviceContentUtils";
import { MDXRemote } from "next-mdx-remote/rsc";
import styles from "./ServiceContent.module.scss";

interface ServiceContentProps {
  serviceContent: ServiceContentType;
}

const formatPrice = (minPrice: number | null, maxPrice: number | null) => {
  if (minPrice === null && maxPrice === null) {
    return "Sur devis";
  }
  if (minPrice === maxPrice) {
    return `${minPrice?.toLocaleString()}€`;
  }
  return `${minPrice?.toLocaleString()}€ - ${maxPrice?.toLocaleString()}€`;
};

export const ServiceContent: React.FC<ServiceContentProps> = ({
  serviceContent,
}) => {
  return (
    <Column gap="xl" fillWidth>
      {/* Header avec prix */}
      <CustomRevealFx translateY={4} delay={0.1} fillWidth>
        <Column gap="m" fillWidth>
          <Heading as="h1" variant="display-strong-l">
            {serviceContent.title}
          </Heading>
          <Text variant="body-default-l" color="neutral-medium">
            {serviceContent.summary}
          </Text>
          <Text variant="body-default-s" color="neutral-medium">
            Service créé le{" "}
            {new Date(serviceContent.publishedAt).toLocaleDateString("fr-FR")}
          </Text>
        </Column>
      </CustomRevealFx>

      {/* Contenu MDX */}
      <RevealFx translateY={4} fillWidth delay={0.2}>
        <Column gap="l" fillWidth>
          <div className={styles["service-content"]}>
            <MDXRemote source={serviceContent.content} />
          </div>
        </Column>
      </RevealFx>

      {/* Informations de contact */}
      <RevealFx translateY={4} fillWidth delay={0.3}>
        <Column
          gap="m"
          fillWidth
          padding="l"
          border="neutral-alpha-medium"
          radius="l"
        >
          <Heading as="h3" variant="display-strong-s">
            Informations de contact
          </Heading>
          <Text variant="body-default-l" color="neutral-medium">
            Pour plus d'informations sur ce service ou pour demander un devis
            personnalisé, n'hésitez pas à nous contacter directement.
          </Text>
        </Column>
      </RevealFx>
    </Column>
  );
};
