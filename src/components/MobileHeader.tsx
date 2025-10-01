"use client";

import React, { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import {
  Flex,
  Button,
  SmartLink,
  Text,
  IconButton,
} from "@/once-ui/components";
import { JoinButton } from "@/components/auth/JoinButton";
import { LoginButton } from "@/components/auth/LoginButton";

export default function MobileHeader() {
  const { user, isLoading, logout } = useAuth() as any;
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (isLoading) return null;

  const isProvider = user
    ? String(user.role).toLowerCase() === "provider"
    : false;

  return (
    <>
      {/* Burger button - mobile only, top-right */}
      <Flex
        className="s-flex-show"
        position="fixed"
        top="12"
        right="12"
        zIndex={10}
      >
        <Button
          variant="secondary"
          prefixIcon="menu"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        />
      </Flex>

      {/* Overlay */}
      {open && (
        <div
          className="s-flex-show"
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 9999,
          }}
        />
      )}

      {/* Slide-in panel from left */}
      <Flex
        className="s-flex-show"
        position="fixed"
        top="0"
        left="0"
        background="surface"
        borderRight="neutral-alpha-medium"
        padding="16"
        direction="column"
        gap="12"
        style={{
          height: "100%",
          width: "80vw",
          maxWidth: 320,
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.2s ease",
          zIndex: 10000,
          boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
        }}
      >
        <Flex horizontal="start">
          <IconButton
            variant="secondary"
            icon="close"
            onClick={() => setOpen(false)}
          />
        </Flex>
        {user ? (
          <>
            <SmartLink href="/me" onClick={() => setOpen(false)}>
              <Text variant="heading-strong-m">Mon profil</Text>
            </SmartLink>
            <SmartLink href="/me/service" onClick={() => setOpen(false)}>
              <Text variant="heading-strong-m">Mes services</Text>
            </SmartLink>
            <SmartLink href="/me/article" onClick={() => setOpen(false)}>
              <Text variant="heading-strong-m">Mes articles</Text>
            </SmartLink>
            {isProvider && (
              <>
                <SmartLink
                  href="/servicecreation"
                  onClick={() => setOpen(false)}
                >
                  <Text variant="heading-strong-m">Créer un service</Text>
                </SmartLink>
                <SmartLink
                  href="/articlecreation"
                  onClick={() => setOpen(false)}
                >
                  <Text variant="heading-strong-m">Créer un article</Text>
                </SmartLink>
              </>
            )}
            <Flex style={{ marginTop: "auto" }} direction="column" gap="8">
              <SmartLink href="/me/settings" onClick={() => setOpen(false)}>
                <Text variant="heading-strong-m">Paramètres</Text>
              </SmartLink>
              <Button
                variant="secondary"
                onClick={() => {
                  logout?.();
                  setOpen(false);
                  router.push("/");
                }}
              >
                Se déconnecter
              </Button>
            </Flex>
          </>
        ) : (
          <>
            <JoinButton variant="tertiary" size="s" />
            <LoginButton />
          </>
        )}
      </Flex>
    </>
  );
}
