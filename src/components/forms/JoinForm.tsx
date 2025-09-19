"use client";

import React from "react";
import {
  Column,
  Input,
  Button,
  Text,
  Heading,
  Card,
} from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";
import { getApiBaseUrl } from "@/app/utils/api";
import { useRouter } from "next/navigation";

export default function JoinForm() {
  const [step, setStep] = React.useState<1 | 2 | 3>(1);
  const [formData, setFormData] = React.useState({
    userType: "provider" as "provider" | "customer",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { user, login } = useAuth();
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

    try {
      if (step === 1) {
        if (
          !formData.userType ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.password
        ) {
          setError(
            "Veuillez renseigner le type de compte, prénom, nom, email et mot de passe"
          );
          return;
        }

        const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+$/;
        if (!nameRegex.test(formData.firstName.trim())) {
          setError(
            "Le prénom ne doit contenir que des lettres (sans chiffres ni caractères spéciaux)"
          );
          return;
        }
        if (!nameRegex.test(formData.lastName.trim())) {
          setError(
            "Le nom ne doit contenir que des lettres (sans chiffres ni caractères spéciaux)"
          );
          return;
        }
        const emailRegex = /.+@.+\..+/;
        if (!emailRegex.test(formData.email)) {
          setError("Adresse email invalide");
          return;
        }
        const passwordRegex = /^.{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setError("Le mot de passe doit contenir au moins 8 caractères");
          return;
        }
        const baseUrl = getApiBaseUrl();
        const registerUrl = `${baseUrl}/auth/register`;
        const res = await fetch(registerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userType: formData.userType,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
          credentials: "include",
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.message || "Inscription impossible");
          return;
        }

        const loginResult = await login(formData.email, formData.password);
        if (!loginResult.success) {
          setError(loginResult.message || "Connexion automatique impossible");
          return;
        }
        router.push("/");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
            {step === 1 && (
              <Column gap="16">
                <Column gap="8">
                  <Text variant="label-default-m">Type de compte</Text>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button
                      type="button"
                      variant={
                        formData.userType === "provider"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => handleInputChange("userType", "provider")}
                    >
                      Prestataire
                    </Button>
                    <Button
                      type="button"
                      variant={
                        formData.userType === "customer"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => handleInputChange("userType", "customer")}
                    >
                      Client
                    </Button>
                  </div>
                </Column>
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
              </Column>
            )}

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
              {loading ? "Veuillez patienter..." : "Continuer"}
            </Button>
          </Column>
        </form>
      </Column>
    </Card>
  );
}
