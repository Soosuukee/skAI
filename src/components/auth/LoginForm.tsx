"use client";

import React, { useState, useEffect } from "react";
import { Column, Input, Button, Text, Flex } from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";

interface LoginFormProps {
  onClose: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"provider" | "client" | "admin">(
    "client"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  // Gestion de la fermeture avec la touche Échap
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden"; // Empêche le scroll

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password, userType);

    if (result.success) {
      onClose();
    } else {
      setError(result.message || "Erreur de connexion");
    }

    setLoading(false);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Email change:", e.target.value);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Password change:", e.target.value);
    setPassword(e.target.value);
  };

  const cycleUserType = (e?: React.MouseEvent<HTMLButtonElement>) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setUserType((prev) =>
      prev === "client" ? "provider" : prev === "provider" ? "admin" : "client"
    );
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Ferme seulement si on clique sur l'overlay, pas sur le contenu
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Flex
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      background="overlay"
      center
      zIndex={10}
      onClick={handleOverlayClick}
    >
      <Flex
        background="surface"
        border="neutral-medium"
        radius="l"
        shadow="xl"
        padding="24"
        direction="column"
        style={{ maxWidth: "400px", width: "100%", margin: "20px" }}
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture quand on clique sur le contenu
      >
        <Flex horizontal="space-between" vertical="center" marginBottom="16">
          <Text variant="heading-strong-l">Connexion</Text>
          <Button
            variant="tertiary"
            size="s"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            ✕
          </Button>
        </Flex>

        <form onSubmit={handleSubmit}>
          <Column gap="16">
            <Column gap="8">
              <Input
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </Column>

            <Column gap="8">
              <Input
                id="password"
                label="Mot de passe"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </Column>

            <Flex gap="8" vertical="center">
              <Text variant="body-default-s" color="neutral-medium">
                Type d'utilisateur:
              </Text>
              <Button
                type="button"
                variant="secondary"
                size="s"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
                  cycleUserType(e)
                }
              >
                {userType}
              </Button>
            </Flex>

            {error && (
              <Text variant="body-default-s" color="error">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              disabled={loading}
              style={{ marginTop: "16px" }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>

            <Text
              variant="body-default-s"
              color="neutral-medium"
              style={{ textAlign: "center", marginTop: "8px" }}
            >
              Comptes de test :<br />
              <strong>Prestataire :</strong> jensen.huang@nvidia.com
              <br />
              <strong>Client :</strong> client1@example.com
              <br />
              <strong>Mot de passe :</strong> test123
            </Text>
          </Column>
        </form>
      </Flex>
    </Flex>
  );
}
