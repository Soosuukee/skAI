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

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "provider":
        return "Prestataire";
      case "client":
        return "Client";
      case "admin":
        return "Administrateur";
      default:
        return role;
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger asChild>
        <Button
          variant="tertiary"
          style={{
            padding: "8px 12px",
            borderRadius: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "var(--neutral-high)",
            fontSize: "0.9rem",
          }}
        >
          <Avatar
            src={userWithProvider?.provider?.avatar || "/images/avatar.jpg"}
            size="s"
          />
          <Flex vertical="start" gap="2">
            <Text variant="body-default-s" style={{ fontWeight: "500" }}>
              Bonjour {displayName}
            </Text>
            <Text variant="body-default-xs" color="neutral-medium">
              {getRoleLabel(user.role)}
            </Text>
          </Flex>
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
