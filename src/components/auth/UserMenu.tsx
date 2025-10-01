"use client";

import React, { useState, useRef, useEffect } from "react";
import { Flex, Text, Avatar, Button, SmartLink } from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  if (!user) return null;

  // Normaliser id/role si l'API renvoie id & type
  const normalizedRole = (user as any)?.role ?? (user as any)?.type;
  // Identifiants utiles exposés par l'API externe
  const normalizedUserId = (user as any)?.id ?? (user as any)?.user_id;

  const makeAbsolute = (url?: string) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api/v1";
      const origin = new URL(apiBase).origin;
      return url.startsWith("/")
        ? `${origin}${url}`
        : `${apiBase.replace(/\/$/, "")}/${url}`;
    } catch {
      return url;
    }
  };

  let displayName = user.email?.split("@")[0] || "";
  let avatarSrc: string | undefined = "/images/avatar.jpg";

  // 1) Préférer les champs directement renvoyés par l'API externe si présents
  const role = normalizedRole;
  const directFirst = (user as any)?.firstName || (user as any)?.firstname;
  const directLast = (user as any)?.lastName || (user as any)?.lastname;
  const directAvatar = (user as any)?.profilePicture || (user as any)?.avatar;

  if (
    (role === "client" || role === "provider" || role === "admin") &&
    (directFirst || directLast || directAvatar)
  ) {
    displayName =
      `${directFirst ?? ""} ${directLast ?? ""}`.trim() || displayName;
    avatarSrc = makeAbsolute(directAvatar) || avatarSrc;
  }

  // Pas de fallback local: si l'API ne fournit pas de nom, on garde l'email tronqué

  // Fermer le menu si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleProfileClick = () => {
    setIsOpen(false);
    router.push("/me");
  };

  const handleRequestsClick = () => {
    setIsOpen(false);
    router.push("/ask");
  };

  const handleLogoutClick = () => {
    setIsOpen(false);
    logout();
    // Recharger la page après la déconnexion
    window.location.reload();
  };

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <Button
        variant="tertiary"
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          background: "transparent",
          border: "1px solid var(--neutral-alpha-medium)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--neutral-high)",
          fontSize: "0.9rem",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.borderColor = "var(--neutral-medium)";
          e.currentTarget.style.background = "var(--neutral-alpha-weak)";
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.currentTarget.style.borderColor = "var(--neutral-alpha-medium)";
          e.currentTarget.style.background = "transparent";
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Avatar src={avatarSrc} size="s" />
        <Text variant="body-default-s" style={{ fontWeight: "500" }}>
          {displayName}
        </Text>
      </Button>

      {/* Overlay and right drawer */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.3)",
              zIndex: 9999,
            }}
          />
          <Flex
            position="fixed"
            top="0"
            right="0"
            background="surface"
            borderLeft="neutral-alpha-medium"
            padding="16"
            direction="column"
            gap="12"
            style={{
              height: "100%",
              width: "80vw",
              maxWidth: 320,
              transform: isOpen ? "translateX(0)" : "translateX(100%)",
              transition: "transform 0.2s ease",
              zIndex: 10000,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}
          >
            <SmartLink href="/me" onClick={() => setIsOpen(false)}>
              <Text variant="heading-strong-m">Mon profil</Text>
            </SmartLink>
            <SmartLink href="/servicecreation" onClick={() => setIsOpen(false)}>
              <Text variant="heading-strong-m">Créer un service</Text>
            </SmartLink>
            <SmartLink href="/articlecreation" onClick={() => setIsOpen(false)}>
              <Text variant="heading-strong-m">Créer un article</Text>
            </SmartLink>
            <SmartLink href="/ask" onClick={() => setIsOpen(false)}>
              <Text variant="heading-strong-m">Mes demandes</Text>
            </SmartLink>
            <Button
              variant="secondary"
              onClick={handleLogoutClick}
              style={{ marginTop: "auto" }}
            >
              Se déconnecter
            </Button>
          </Flex>
        </>
      )}
    </div>
  );
}
