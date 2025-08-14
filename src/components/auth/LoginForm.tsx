"use client";

import React, { useState } from "react";
import { Column, Input, Button, Text, Dialog } from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";

interface LoginFormProps {
  onClose: () => void;
}

export function LoginForm({ onClose }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      onClose();
    } else {
      setError(result.message || "Erreur de connexion");
    }

    setLoading(false);
  };

  return (
    <Dialog isOpen={true} onClose={onClose} title="Connexion">
      <form onSubmit={handleSubmit}>
        <Column gap="16" paddingY="16">
          <Column gap="8">
            <Input id="email" label="Email" type="email" required />
          </Column>

          <Column gap="8">
            <Input
              id="password"
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Column>

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
    </Dialog>
  );
}
