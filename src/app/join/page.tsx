"use client";

import React, { useMemo, useState } from "react";
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
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    verificationCode: "",
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

    try {
      if (step === 1) {
        // validations basiques: prénom, nom, email
        if (!formData.firstName || !formData.lastName || !formData.email) {
          setError("Veuillez renseigner prénom, nom et email");
          return;
        }
        const emailRegex = /.+@.+\..+/;
        if (!emailRegex.test(formData.email)) {
          setError("Adresse email invalide");
          return;
        }
        setStep(2);
        return;
      }

      if (step === 2) {
        if (formData.verificationCode.trim() !== "1234") {
          setError("Code de vérification invalide");
          return;
        }
        // Email vérifié, on passe à l'étape suivante (à définir)
        setStep(3);
        return;
      }

      // Étape 3: en attente de tes instructions pour les étapes suivantes
    } finally {
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
              {step === 1 && (
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
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      required
                    />
                  </Column>
                </Column>
              )}

              {step === 2 && (
                <Column gap="16">
                  <Column gap="8">
                    <Input
                      id="verificationCode"
                      label="Code de vérification"
                      placeholder="Entrez le code reçu (1234)"
                      value={formData.verificationCode}
                      onChange={(e) =>
                        handleInputChange("verificationCode", e.target.value)
                      }
                      required
                    />
                  </Column>
                </Column>
              )}

              {step === 3 && (
                <Column gap="16">
                  <Text
                    variant="body-default-m"
                    color="neutral-medium"
                    style={{ textAlign: "center" }}
                  >
                    Email vérifié. Prochaine étape à définir.
                  </Text>
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

              {step !== 2 && (
                <Text
                  variant="body-default-s"
                  color="neutral-medium"
                  style={{ textAlign: "center" }}
                ></Text>
              )}
            </Column>
          </form>
        </Column>
      </Card>
    </div>
  );
}
