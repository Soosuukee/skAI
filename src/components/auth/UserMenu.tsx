"use client";

import React, { useState } from "react";
import {
  Flex,
  Text,
  Avatar,
  Button,
  DropdownMenu,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from "@/once-ui/components";
import { getUserWithProvider } from "@/app/utils/userUtils";
import { useAuth } from "@/app/contexts/AuthContext";

export function UserMenu() {
  const { user, logout } = useAuth();

  if (!user) return null;
  const [isOpen, setIsOpen] = useState(false);

  // Récupérer les informations du prestataire si applicable
  const userWithProvider = getUserWithProvider(user.user_id);
  const displayName = userWithProvider?.provider
    ? `${userWithProvider.provider.firstName} ${userWithProvider.provider.lastName}`
    : user.email.split("@")[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger asChild>
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
        >
          <Avatar
            src={userWithProvider?.provider?.avatar || "/images/avatar.jpg"}
            size="s"
          />
          <Text variant="body-default-s" style={{ fontWeight: "500" }}>
            {displayName}
          </Text>
        </Button>
      </DropdownTrigger>

      <DropdownContent>
        <DropdownItem>
          <Text variant="body-default-s">Mon profil</Text>
        </DropdownItem>

        {user.role === "provider" && (
          <DropdownItem>
            <Text variant="body-default-s">Mes services</Text>
          </DropdownItem>
        )}

        {user.role === "client" && (
          <DropdownItem>
            <Text variant="body-default-s">Mes demandes</Text>
          </DropdownItem>
        )}

        {user.role === "admin" && (
          <DropdownItem>
            <Text variant="body-default-s">Administration</Text>
          </DropdownItem>
        )}

        <DropdownSeparator />

        <DropdownItem onClick={logout}>
          <Text variant="body-default-s" color="error">
            Se déconnecter
          </Text>
        </DropdownItem>
      </DropdownContent>
    </DropdownMenu>
  );
}
