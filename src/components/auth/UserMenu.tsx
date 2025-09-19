"use client";

import React, { useState, useRef, useEffect } from "react";
import { Flex, Text, Avatar, Button } from "@/once-ui/components";
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

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "4px",
            background: "var(--surface)",
            border: "1px solid var(--neutral-alpha-medium)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            minWidth: "160px",
          }}
        >
          <Flex direction="column" padding="4">
            <Button
              variant="tertiary"
              style={{
                justifyContent: "flex-start",
                padding: "8px 12px",
                borderRadius: "4px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = "var(--neutral-alpha-weak)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = "transparent";
              }}
              onClick={handleProfileClick}
            >
              <Text variant="body-default-s">Mon profil</Text>
            </Button>

            <Button
              variant="tertiary"
              style={{
                justifyContent: "flex-start",
                padding: "8px 12px",
                borderRadius: "4px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = "var(--neutral-alpha-weak)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = "transparent";
              }}
              onClick={handleRequestsClick}
            >
              <Text variant="body-default-s">Mes demandes</Text>
            </Button>

            <Button
              variant="tertiary"
              style={{
                justifyContent: "flex-start",
                padding: "8px 12px",
                borderRadius: "4px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = "var(--neutral-alpha-weak)";
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.currentTarget.style.background = "transparent";
              }}
              onClick={handleLogoutClick}
            >
              <Text variant="body-default-s" color="error">
                Se déconnecter
              </Text>
            </Button>
          </Flex>
        </div>
      )}
    </div>
  );
}
