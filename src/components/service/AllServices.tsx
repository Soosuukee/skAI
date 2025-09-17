"use client";

import React, { useState, useEffect } from "react";
import {
  Column,
  Flex,
  Heading,
  SmartLink,
  Avatar,
  Text,
  SmartImage,
} from "@/once-ui/components";
import { getAllServicesWithProviders } from "@/app/utils/serviceUtils";
import styles from "./Services.module.scss";

export function AllServices() {
  const [servicesWithProviders, setServicesWithProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        setLoading(true);
        const services = await getAllServicesWithProviders();
        setServicesWithProviders(services);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (loading) {
    return (
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        <Text>Chargement des services...</Text>
      </Column>
    );
  }

  if (error) {
    return (
      <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
        <Text color="error">Erreur: {error}</Text>
      </Column>
    );
  }

  return (
    <Column fillWidth gap="xl" marginBottom="40" paddingX="l">
      <Heading variant="display-strong-m" marginBottom="16">
        Services proposés par nos prestataires
      </Heading>

      {servicesWithProviders.map((service) => (
        <div
          key={`${service.id ?? service.serviceId ?? service.slug}`}
          className={styles.service}
        >
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
            {/* Image de couverture du service */}
            {service.cover ? (
              <SmartImage
                src={service.cover}
                alt={service.title}
                height={6.625}
                radius="m"
                style={{ width: "160px", minWidth: "160px" }}
              />
            ) : (
              <div
                style={{
                  width: "160px",
                  height: "106px",
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
            )}

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
                {service.summary ||
                  "Description courte du service - Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
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
