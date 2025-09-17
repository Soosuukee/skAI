"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Column,
  Text,
  Avatar,
  Button,
  Input,
  Flex,
} from "@/once-ui/components";
import { getApiBaseUrl } from "@/app/utils/api";
// Removed explicit Provider import; using discriminated union from AuthContext

export default function MePage() {
  // Même logique que UserMenu pour la gestion des URLs
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
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Même logique que UserMenu pour l'avatar
  let avatarSrc: string = "/images/avatar.jpg";
  const directAvatar = (user as any)?.profilePicture || (user as any)?.avatar;
  if (directAvatar) {
    avatarSrc = makeAbsolute(directAvatar) || avatarSrc;
  }

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/join");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <Column horizontal="center" paddingY="24">
        <Text>Chargement du profil...</Text>
      </Column>
    );
  }

  if (!user) {
    return null;
  }

  const [showPwdForm, setShowPwdForm] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pwdError, setPwdError] = React.useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = React.useState<string | null>(null);
  const [pwdLoading, setPwdLoading] = React.useState(false);

  const handlePasswordUpdate = async () => {
    setPwdError(null);
    setPwdSuccess(null);
    const passwordRegex = /^.{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPwdError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("Les deux mots de passe ne correspondent pas");
      return;
    }

    try {
      setPwdLoading(true);
      const baseUrl = getApiBaseUrl();
      const isProvider = String(user.role).toLowerCase() === "provider";
      const id =
        (user as any).id || (user as any).userId || (user as any).user_id;
      const target = `${baseUrl}/${
        isProvider ? "providers" : "clients"
      }/${id}/password`;

      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("authToken")
          : undefined;
      const res = await fetch(target, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ password: newPassword }),
      });

      if (!res.ok) {
        let data: any = null;
        try {
          data = await res.json();
        } catch {}
        setPwdError(data?.message || "Échec de la mise à jour du mot de passe");
        return;
      }

      setPwdSuccess("Mot de passe mis à jour avec succès");
      setNewPassword("");
      setConfirmPassword("");
      setShowPwdForm(false);
    } catch (e) {
      setPwdError("Erreur réseau lors de la mise à jour");
    } finally {
      setPwdLoading(false);
    }
  };

  return (
    <Column gap="16" padding="24" style={{ maxWidth: "480px" }}>
      <Avatar src={avatarSrc} size="xl" style={{ alignSelf: "center" }} />
      <Text variant="heading-strong-m" style={{ textAlign: "center" }}>
        {(user.firstName || (user as any).first_name) &&
        (user.lastName || (user as any).last_name)
          ? `${user.firstName || (user as any).first_name} ${
              user.lastName || (user as any).last_name
            }`
          : user.email}
      </Text>
      <Text>Email: {user.email}</Text>
      <Text>Role: {user.role}</Text>
      {user.role === "provider" && (user as any).job && (
        <Text>Job: {(user as any).job}</Text>
      )}
      {(user as any).country && <Text>Country: {(user as any).country}</Text>}
      {user.role === "provider" &&
        (user as any).hardSkills &&
        (user as any).hardSkills.length > 0 && (
          <Text>Hard Skills: {(user as any).hardSkills.join(", ")}</Text>
        )}
      {user.role === "provider" &&
        (user as any).softSkills &&
        (user as any).softSkills.length > 0 && (
          <Text>Soft Skills: {(user as any).softSkills.join(", ")}</Text>
        )}
      <Flex gap="8">
        <Button
          variant="secondary"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          Se déconnecter
        </Button>
        <Button variant="primary" onClick={() => setShowPwdForm((v) => !v)}>
          {showPwdForm ? "Annuler" : "Changer mon mot de passe"}
        </Button>
      </Flex>

      {showPwdForm && (
        <Column gap="12" padding="12" border="neutral-alpha-medium" radius="m">
          <Text variant="heading-strong-s">Mettre à jour le mot de passe</Text>
          <Input
            id="newPassword"
            label="Nouveau mot de passe"
            type="password"
            value={newPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewPassword(e.target.value)
            }
          />
          <Input
            id="confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
          {pwdError && <Text color="error">{pwdError}</Text>}
          {pwdSuccess && <Text color="positive">{pwdSuccess}</Text>}
          <Button
            variant="primary"
            disabled={pwdLoading}
            onClick={handlePasswordUpdate}
          >
            {pwdLoading ? "Mise à jour..." : "Enregistrer"}
          </Button>
          <Text variant="body-default-xs" color="neutral-medium">
            Endpoint ciblé:{" "}
            {String(user.role).toLowerCase() === "provider"
              ? "/api/v1/providers/{id}/password"
              : "/api/v1/clients/{id}/password"}
          </Text>
        </Column>
      )}
    </Column>
  );
}
