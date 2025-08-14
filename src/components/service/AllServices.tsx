"use client";

import { Column, Flex, Heading, SmartLink, Avatar } from "@/once-ui/components";
import { getAllServicesWithProviders } from "@/app/utils/serviceUtils";
import styles from "./Services.module.scss";

export function AllServices() {
  const servicesWithProviders = getAllServicesWithProviders();

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      <Heading variant="display-strong-m" marginBottom="16">
        Services proposés par nos prestataires
      </Heading>

      {servicesWithProviders.map((service) => (
        <div key={service.service_id} className={styles.service}>
          <Flex
            background="surface"
            border="neutral-alpha-medium"
            radius="m-4"
            padding="16"
            gap="16"
            vertical="center"
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s ease-in-out",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Image du service (placeholder pour l'instant) */}
            <div
              style={{
                width: "120px",
                height: "80px",
                background: "var(--neutral-alpha-low)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--neutral-alpha-medium)",
              }}
            >
              📋
            </div>

            {/* Contenu du service */}
            <Flex vertical="start" flex={1} gap="8">
              <Heading variant="heading-strong-s" marginBottom="4">
                {service.title}
              </Heading>

              <p
                style={{
                  color: "var(--neutral-alpha-high)",
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  marginBottom: "8",
                }}
              >
                Description courte du service - Lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                labore et dolore magna aliqua.
              </p>

              {/* Informations du prestataire */}
              <Flex gap="8" vertical="center">
                <Avatar src={service.provider.avatar} size="s" />
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--neutral-alpha-medium)",
                  }}
                >
                  par{" "}
                  <strong>
                    {service.provider.firstName} {service.provider.lastName}
                  </strong>
                </span>
              </Flex>
            </Flex>

            {/* Lien vers le service */}
            <SmartLink
              href={`/providers/${service.provider.slug}/service/${service.slug}`}
              style={{
                padding: "8px 16px",
                borderRadius: "6px",
                background: "var(--brand)",
                color: "var(--brand-on-background)",
                textDecoration: "none",
                fontSize: "0.9rem",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              Voir le service
            </SmartLink>
          </Flex>
        </div>
      ))}
    </Column>
  );
}
