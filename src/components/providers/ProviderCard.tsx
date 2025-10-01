"use client";

import React from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  Avatar,
  Tag,
  SmartLink,
} from "@/once-ui/components";
import { CustomRevealFx } from "@/components/CustomRevealFx";
import type { Provider } from "@/app/types/provider";
import type { Language } from "@/app/types/language";

interface ProviderCardProps {
  provider: Provider;
  index?: number;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  index = 0,
}) => {
  const jobTitle = provider.job?.title;
  const countryName = provider.country?.name;
  const avatarSrc =
    (provider as any).avatar || provider.profilePicture || undefined;

  return (
    <CustomRevealFx
      translateY={4}
      delay={0.1 * (index + 1)}
      fillWidth
      style={{ width: "100%" }}
    >
      <SmartLink
        href={`/providers/${provider.slug}`}
        style={{
          textDecoration: "none",
          color: "inherit",
          display: "block",
          width: "100%",
        }}
      >
        <Column
          gap="20"
          padding="32"
          style={{
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "0.75rem",
            background: "var(--surface)",
            transition: "all 0.2s ease",
            cursor: "pointer",
            height: "320px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            boxSizing: "border-box",
          }}
          className="hover:shadow-lg hover:border-neutral-alpha-strong"
        >
          {/* Desktop: original row layout (avatar left, info right) */}
          <Flex gap="16" vertical="center" className="s-flex-hide">
            <Avatar
              src={avatarSrc}
              size="xl"
              style={{ flexShrink: 0 }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Column gap="4">
              <Heading as="h3" variant="heading-strong-l">
                {provider.firstName} {provider.lastName}
              </Heading>
              {jobTitle && (
                <Text variant="body-default-s" color="neutral-medium">
                  {jobTitle}
                </Text>
              )}
              {countryName && (
                <Text variant="body-default-s" color="neutral-medium">
                  📍 {countryName}
                </Text>
              )}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {provider.languages?.map((lang: Language) => (
                  <Tag key={lang.name} variant="brand" size="s">
                    {lang.name}
                  </Tag>
                ))}
              </div>
            </Column>
          </Flex>

          {/* Mobile: avatar top centered, smaller size */}
          <Column className="s-flex-show" gap="12" align="center">
            <Avatar
              src={avatarSrc}
              size="l"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <Heading as="h3" variant="heading-strong-l" align="center">
              {provider.firstName} {provider.lastName}
            </Heading>
            {jobTitle && (
              <Text
                variant="body-default-s"
                color="neutral-medium"
                align="center"
              >
                {jobTitle}
              </Text>
            )}
            {countryName && (
              <Text
                variant="body-default-s"
                color="neutral-medium"
                align="center"
              >
                📍 {countryName}
              </Text>
            )}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              {provider.languages?.map((lang: Language) => (
                <Tag key={lang.name} variant="brand" size="s">
                  {lang.name}
                </Tag>
              ))}
            </div>
          </Column>

          <Text
            variant="body-default-s"
            style={{
              color: "var(--brand)",
              fontWeight: 500,
              marginTop: "auto",
            }}
            align="center"
          >
            Voir le profil complet →
          </Text>
        </Column>
      </SmartLink>
    </CustomRevealFx>
  );
};

export default ProviderCard;
