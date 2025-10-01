"use client";

import React, { useState } from "react";
import {
  Column,
  Flex,
  Heading,
  Text,
  Button,
  SmartImage,
  Input,
} from "@/once-ui/components";
import { Dialog } from "@/once-ui/components";
import type { Service } from "@/app/types/service";
import { getApiBaseUrl } from "@/app/utils/api";

interface MeServiceCardProps {
  service: Service;
  providerSlug: string;
  onDeleted?: (serviceId: number) => void;
}

export const MeServiceCard: React.FC<MeServiceCardProps> = ({
  service,
  providerSlug,
  onDeleted,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = getApiBaseUrl();
  const serviceLink = `/providers/${providerSlug}/service/${service.slug}`;

  const makeAbsolute = (url?: string) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    try {
      const origin = new URL(apiBaseUrl).origin;
      return url.startsWith("/")
        ? `${origin}${url}`
        : `${apiBaseUrl.replace(/\/$/, "")}/${url}`;
    } catch {
      return url;
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : undefined;
      const res = await fetch(
        `${apiBaseUrl}/providers/${providerSlug}/services/${service.slug}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: "include",
          body: JSON.stringify({ password }),
        }
      );

      if (!res.ok) {
        let data: any = null;
        try {
          data = await res.json();
        } catch {}
        throw new Error(
          data?.message || `Suppression impossible (${res.status})`
        );
      }

      if (onDeleted) onDeleted(service.id);
      setIsConfirmOpen(false);
      setPassword("");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Erreur lors de la suppression"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Column
      padding="l"
      border="neutral-alpha-medium"
      radius="m"
      gap="m"
      style={{ width: "100%" }}
    >
      {makeAbsolute(service.cover) ? (
        <SmartImage
          src={makeAbsolute(service.cover) as string}
          alt={`Image de couverture - ${service.title}`}
          radius="s"
          style={{
            objectFit: "cover",
            aspectRatio: "16/9",
            width: "100%",
            maxHeight: "200px",
          }}
        />
      ) : null}

      <Column gap="s">
        <Heading as="h3" variant="display-strong-s">
          {service.title}
        </Heading>
        {service.summary && (
          <Text variant="body-default-m" onBackground="neutral-weak">
            {service.summary}
          </Text>
        )}
      </Column>

      <Flex gap="8" horizontal="end">
        <Button href={serviceLink} variant="secondary">
          Voir
        </Button>
        <Button
          variant="primary"
          href={`/me/service/${service.slug}/edit`}
          style={{
            background: "var(--warning-solid-medium)",
            borderColor: "var(--warning-solid-medium)",
            color: "var(--warning-on-solid-strong)",
          }}
        >
          Modifier
        </Button>
        <Button
          variant="primary"
          onClick={() => setIsConfirmOpen(true)}
          style={{
            background: "var(--danger-solid-medium)",
            borderColor: "var(--danger-solid-medium)",
            color: "var(--danger-on-solid-strong)",
          }}
        >
          Supprimer
        </Button>
      </Flex>

      <Dialog
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPassword("");
          setError(null);
        }}
        title="Supprimer le service"
        description="Cette action est irréversible. Pour continuer, entrez votre mot de passe."
        base
      >
        <Column gap="12">
          <Input
            id={`confirm-password-${service.id}`}
            type="password"
            label="Mot de passe"
            value={password}
            onChange={(e: any) => setPassword(e.target.value)}
          />
          {error && <Text color="error">{error}</Text>}
          <Flex horizontal="end" gap="8">
            <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleDelete}
              disabled={isDeleting || password.length < 8}
              style={{
                background: "var(--danger-solid-medium)",
                borderColor: "var(--danger-solid-medium)",
                color: "var(--danger-on-solid-strong)",
              }}
            >
              {isDeleting ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </Flex>
        </Column>
      </Dialog>
    </Column>
  );
};
