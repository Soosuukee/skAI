"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Fade,
  Flex,
  Line,
  ToggleButton,
  SmartLink,
  Button,
  Text,
} from "@/once-ui/components";
import styles from "@/components/Header.module.scss";

import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/app/contexts/AuthContext";
import { LoginButton } from "./auth/LoginButton";
import { UserMenu } from "./auth/UserMenu";
import { JoinButton } from "./auth/JoinButton";
import { useProviderBasic } from "@/app/hooks/providers";
import { useProviderSlug } from "@/app/hooks/useNavigationContext";

type ProviderHeaderProps = {
  showLogo?: boolean;
};

export const ProviderHeader = ({ showLogo = true }: ProviderHeaderProps) => {
  const pathname = usePathname() ?? "";
  const { user, isLoading } = useAuth();
  const providerSlug = useProviderSlug();
  const { provider } = useProviderBasic(providerSlug || "");

  if (!providerSlug) {
    return null;
  }

  const baseProviderPath = `/providers/${providerSlug}`;

  return (
    <>
      <Fade hide="s" fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        show="s"
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Flex
        fitHeight
        position="unset"
        className={styles.position}
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
      >
        <Flex
          paddingLeft="12"
          fillWidth
          vertical="center"
          textVariant="body-default-s"
          gap="8"
        >
          {showLogo && (
            <SmartLink href="/" unstyled>
              <img
                src="/trademark/Modern-_skAi_-Typography-Design.svg"
                alt="Logo"
                style={{ height: "4rem", width: "auto", filter: "invert(1)" }}
              />
            </SmartLink>
          )}
          {provider && (
            <Flex hide="s">
              <Text variant="body-default-s" color="neutral-medium">
                {provider.firstName} {provider.lastName}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex fillWidth horizontal="center">
          <Flex
            background="surface"
            border="neutral-alpha-medium"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Flex gap="4" vertical="center" textVariant="body-default-s">
              {/* Portfolio (page principale du provider) */}
              <ToggleButton
                prefixIcon="home"
                href={baseProviderPath}
                label="Portfolio"
                selected={pathname === baseProviderPath}
              />
              <Line background="neutral-alpha-medium" vert maxHeight="24" />

              {/* À propos */}
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="person"
                href={`${baseProviderPath}/about`}
                label="À propos"
                selected={pathname === `${baseProviderPath}/about`}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="person"
                href={`${baseProviderPath}/about`}
                selected={pathname === `${baseProviderPath}/about`}
              />

              {/* Services */}
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="grid"
                href={`${baseProviderPath}/service`}
                label="Services"
                selected={pathname.startsWith(`${baseProviderPath}/service`)}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="grid"
                href={`${baseProviderPath}/service`}
                selected={pathname.startsWith(`${baseProviderPath}/service`)}
              />

              {/* Blog */}
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="book"
                href={`${baseProviderPath}/blog`}
                label="Blog"
                selected={pathname.startsWith(`${baseProviderPath}/blog`)}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="book"
                href={`${baseProviderPath}/blog`}
                selected={pathname.startsWith(`${baseProviderPath}/blog`)}
              />

              {/* Toggle thème */}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              <ThemeToggle />
            </Flex>
          </Flex>
        </Flex>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            {/* Section authentification */}
            {!isLoading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <Flex gap="8" vertical="center">
                    <JoinButton variant="tertiary" size="s" />
                    <LoginButton />
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
