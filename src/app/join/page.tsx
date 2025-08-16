"use client";

import React, { useState } from "react";
import {
  Column,
  Input,
  Button,
  Text,
  Heading,
  Card,
} from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "client", // "client" ou "provider"
    company: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const router = useRouter();

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation basique
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      // Ici vous pouvez ajouter l'appel API pour l'inscription
      // const response = await fetch("/api/register", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData)
      // });

      // Pour l'instant, on simule un succès
      setTimeout(() => {
        setLoading(false);
        router.push("/?message=inscription-success");
      }, 1000);
    } catch (error) {
      setError("Erreur lors de l'inscription");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Card style={{ maxWidth: "500px", width: "100%" }}>
        <Column gap="24" padding="32">
          <Column gap="8" style={{ textAlign: "center" }}>
            <Heading variant="display-strong-m">Nous rejoindre</Heading>
            <Text variant="body-default-m" color="neutral-medium">
              Créez votre compte pour accéder à nos services
            </Text>
          </Column>

          <form onSubmit={handleSubmit}>
            <Column gap="16">
              <Column gap="16">
                <Column gap="8">
                  <Input
                    id="firstName"
                    label="Prénom"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </Column>

                <Column gap="8">
                  <Input
                    id="lastName"
                    label="Nom"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </Column>

                <Column gap="8">
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </Column>

                <Column gap="8">
                  <Input
                    id="password"
                    label="Mot de passe"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    required
                  />
                </Column>

                <Column gap="8">
                  <Input
                    id="confirmPassword"
                    label="Confirmer le mot de passe"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    required
                  />
                </Column>

                <Column gap="8">
                  <select
                    value={formData.userType}
                    onChange={(e) =>
                      handleInputChange("userType", e.target.value)
                    }
                    style={{
                      padding: "12px",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "14px",
                      backgroundColor: "white",
                    }}
                  >
                    <option value="client">Client</option>
                    <option value="provider">Prestataire de services</option>
                  </select>
                </Column>

                {formData.userType === "provider" && (
                  <Column gap="8">
                    <Input
                      id="company"
                      label="Nom de l'entreprise"
                      value={formData.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      required
                    />
                  </Column>
                )}
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
                {loading ? "Création du compte..." : "Créer mon compte"}
              </Button>

              <Text
                variant="body-default-s"
                color="neutral-medium"
                style={{ textAlign: "center" }}
              >
                Déjà un compte ?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/?login=true")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  Se connecter
                </button>
              </Text>
            </Column>
          </form>
        </Column>
      </Card>
    </div>
  );
}
