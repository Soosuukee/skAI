"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Column,
  Flex,
  Input,
  Textarea,
  Button,
  Text,
  Select,
  Avatar,
  Dialog,
} from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";
import { useFiltersData } from "@/app/hooks/useFiltersData";
import { getApiBaseUrl } from "@/app/utils/api";

interface MeProfileFormProps {
  labels?: {
    photoTitle?: string;
    profileTitle?: string;
    emailTitle?: string;
    passwordTitle?: string;
  };
}

export default function MeProfileForm({ labels }: MeProfileFormProps) {
  const { user, logout } = useAuth() as any;
  const {
    languages,
    languagesLoading,
    jobs,
    jobsLoading,
    countries,
    countriesLoading,
  } = useFiltersData();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [jobSlug, setJobSlug] = useState("");
  const [countrySlug, setCountrySlug] = useState("");
  const [languageSlugs, setLanguageSlugs] = useState<string[]>([]);

  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [deleteAccountPassword, setDeleteAccountPassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isDeleteAvatarOpen, setIsDeleteAvatarOpen] = useState(false);
  const [deleteAvatarPassword, setDeleteAvatarPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Optionnel: préremplir depuis user si dispo
    // On ne connaît pas ici la forme exacte du user, on reste conservateur
    if (user) {
      setFirstName((user as any).firstName || "");
      setLastName((user as any).lastName || "");
      setBio((user as any).bio || (user as any).description || "");
      setJobSlug((user as any).job?.slug || "");
      setCountrySlug(
        (user as any).country?.slug || (user as any).location?.slug || ""
      );
      setLanguageSlugs(
        ((user as any).languages || [])
          .map((l: any) => l.slug || l.code)
          .filter(Boolean)
      );
      const bd = (user as any).birthDate || (user as any).birth_date;
      if (bd) setBirthDate(String(bd).slice(0, 10));
      const directAvatar =
        (user as any)?.profilePicture || (user as any)?.avatar || "";
      setAvatarUrl(directAvatar);
      setAvatarPreview("");
    }
  }, [user]);

  const apiBase = getApiBaseUrl();
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("authToken") || undefined
      : undefined;

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const makeAbsolute = (url?: string) => {
    if (!url) return undefined;
    if (/^https?:\/\//i.test(url)) return url;
    try {
      const origin = new URL(apiBase).origin;
      return url.startsWith("/") ? `${origin}${url}` : `${origin}/${url}`;
    } catch {
      return url;
    }
  };

  const patchProfile = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/auth/complete-provider-profile`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          bio,
          birthDate,
          jobSlug,
          countrySlug,
          languageSlugs,
        }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      setMessage("Profil mis à jour.");
    } catch (e: any) {
      setError(e?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const changeEmail = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/auth/change-email`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({
          newEmail,
          currentPassword: currentPasswordForEmail,
        }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      setMessage("Email mis à jour (vérifiez la confirmation si nécessaire).");
      setNewEmail("");
      setCurrentPasswordForEmail("");
    } catch (e: any) {
      setError(e?.message || "Erreur lors du changement d'email");
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/auth/change-password`, {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      setMessage("Mot de passe mis à jour.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setError(e?.message || "Erreur lors du changement de mot de passe");
    } finally {
      setSaving(false);
    }
  };

  const deleteAvatar = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/auth/avatar`, {
        method: "DELETE",
        headers,
        credentials: "include",
        body: JSON.stringify({
          currentPassword: deleteAvatarPassword || currentPassword,
        }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      setMessage("Avatar supprimé.");
      setAvatarUrl("");
    } catch (e: any) {
      setError(e?.message || "Erreur lors de la suppression de l'avatar");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/auth/account`, {
        method: "DELETE",
        headers,
        credentials: "include",
        body: JSON.stringify({
          currentPassword: deleteAccountPassword || currentPassword,
        }),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      // Déconnecter et rediriger après suppression
      try {
        logout?.();
      } catch {}
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        window.location.href = "/";
      }
      setMessage("Compte supprimé.");
    } catch (e: any) {
      setError(e?.message || "Erreur lors de la suppression du compte");
    } finally {
      setSaving(false);
    }
  };

  const updateAvatar = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      let res: Response;
      if (avatarFile) {
        const fd = new FormData();
        // API expects exact field name `profile_image`
        fd.append("profile_image", avatarFile);
        res = await fetch(`${apiBase}/auth/avatar`, {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          credentials: "include",
          body: fd,
        } as any);
      } else {
        res = await fetch(`${apiBase}/auth/complete-provider-profile`, {
          method: "PATCH",
          headers,
          credentials: "include",
          body: JSON.stringify({ avatar: avatarUrl }),
        });
      }
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      // Try to read the new profile picture URL from response
      try {
        const data = await res.json();
        const newUrl =
          data?.data?.profile_picture_url ||
          data?.profile_picture_url ||
          data?.profilePicture ||
          data?.avatar;
        if (newUrl) setAvatarUrl(newUrl);
      } catch {}
      setMessage("Photo de profil mise à jour.");
    } catch (e: any) {
      setError(e?.message || "Erreur lors de la mise à jour de l'avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Column gap="24" fillWidth style={{ width: "85%", marginInline: "auto" }}>
      {message && <Text color="primary">{message}</Text>}
      {error && <Text color="error">{error}</Text>}

      {/* Photo de profil */}
      <Column
        id="photo"
        padding="l"
        border="neutral-alpha-medium"
        radius="m"
        gap="m"
      >
        <Text variant="heading-strong-s">
          {labels?.photoTitle || "Photo de profil"}
        </Text>
        <Flex gap="12" vertical="center" wrap mobileDirection="column">
          <Avatar
            src={
              makeAbsolute(avatarPreview || avatarUrl) || "/images/avatar.jpg"
            }
            size="xl"
          />
          <input
            ref={avatarInputRef}
            id="avatarFile"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file =
                e.target.files && e.target.files[0] ? e.target.files[0] : null;
              setAvatarFile(file);
              if (file) {
                const url = URL.createObjectURL(file);
                setAvatarPreview(url);
              } else {
                setAvatarPreview("");
              }
            }}
          />
          <Button
            variant="secondary"
            onClick={() => avatarInputRef.current?.click()}
          >
            Choisir une photo
          </Button>
        </Flex>
        <Flex horizontal="end" gap="8">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteAvatarOpen(true)}
            disabled={saving}
          >
            Supprimer la photo
          </Button>
          <Button
            variant="primary"
            onClick={updateAvatar}
            disabled={saving || (!avatarFile && !avatarUrl)}
          >
            Mettre à jour
          </Button>
        </Flex>
      </Column>

      {/* Profil public */}
      <Column
        id="profile"
        padding="l"
        border="neutral-alpha-medium"
        radius="m"
        gap="m"
      >
        <Text variant="heading-strong-s">
          {labels?.profileTitle || "Mes informations"}
        </Text>
        <Flex gap="8" wrap mobileDirection="column">
          <Input
            id="firstName"
            label="Prénom"
            value={firstName}
            onChange={(e: any) => setFirstName(e.target.value)}
          />
          <Input
            id="lastName"
            label="Nom"
            value={lastName}
            onChange={(e: any) => setLastName(e.target.value)}
          />
        </Flex>
        <Textarea
          id="bio"
          label="Bio"
          value={bio}
          onChange={(e: any) => setBio(e.target.value)}
        />
        <Input
          id="birthDate"
          type="date"
          label="Date de naissance"
          value={birthDate}
          onChange={(e: any) => setBirthDate(e.target.value)}
        />

        <Flex gap="8" wrap mobileDirection="column">
          <Select
            id="job"
            label="Métier"
            value={jobSlug}
            onSelect={(v: string) => setJobSlug(v)}
            options={
              jobsLoading
                ? []
                : jobs.map((j) => ({ label: j.title, value: j.slug }))
            }
            searchable
          />
          <Select
            id="country"
            label="Pays"
            value={countrySlug}
            onSelect={(v: string) => setCountrySlug(v)}
            options={
              countriesLoading
                ? []
                : countries.map((c) => ({ label: c.name, value: c.slug }))
            }
            searchable
          />
        </Flex>

        <Select
          id="languages"
          label="Langues"
          value={languageSlugs[0] || ""}
          onSelect={(v: string) => setLanguageSlugs([v])}
          options={
            languagesLoading
              ? []
              : languages.map((l) => ({ label: l.name, value: l.slug }))
          }
          searchable
        />

        <Flex horizontal="end" gap="8">
          <Button variant="primary" onClick={patchProfile} disabled={saving}>
            Sauvegarder
          </Button>
        </Flex>
      </Column>

      {/* Email */}
      <Column
        id="email"
        padding="l"
        border="neutral-alpha-medium"
        radius="m"
        gap="m"
      >
        <Text variant="heading-strong-s">
          {labels?.emailTitle || "Changer l'adresse mail"}
        </Text>
        <Flex gap="8" wrap mobileDirection="column">
          <Input
            id="newEmail"
            label="Nouvel email"
            value={newEmail}
            onChange={(e: any) => setNewEmail(e.target.value)}
          />
          <Input
            id="currentPasswordForEmail"
            type="password"
            label="Mot de passe actuel"
            value={currentPasswordForEmail}
            onChange={(e: any) => setCurrentPasswordForEmail(e.target.value)}
          />
        </Flex>
        <Flex horizontal="end">
          <Button
            variant="primary"
            onClick={changeEmail}
            disabled={saving || !newEmail || !currentPasswordForEmail}
          >
            Changer l'email
          </Button>
        </Flex>
      </Column>

      {/* Mot de passe */}
      <Column
        id="password"
        padding="l"
        border="neutral-alpha-medium"
        radius="m"
        gap="m"
      >
        <Text variant="heading-strong-s">
          {labels?.passwordTitle || "Modifier le mot de passe"}
        </Text>
        <Flex gap="8" wrap mobileDirection="column">
          <Input
            id="currentPassword"
            type="password"
            label="Mot de passe actuel"
            value={currentPassword}
            onChange={(e: any) => setCurrentPassword(e.target.value)}
          />
          <Input
            id="newPassword"
            type="password"
            label="Nouveau mot de passe"
            value={newPassword}
            onChange={(e: any) => setNewPassword(e.target.value)}
          />
        </Flex>
        <Flex horizontal="end">
          <Button
            variant="primary"
            onClick={changePassword}
            disabled={saving || !currentPassword || !newPassword}
          >
            Changer le mot de passe
          </Button>
        </Flex>
      </Column>

      {/* Danger zone: only button opening dialog */}
      <Column id="danger" gap="m">
        <Flex horizontal="end">
          <Button
            variant="primary"
            onClick={() => setIsDeleteAccountOpen(true)}
            style={{
              background: "var(--danger-solid-medium)",
              borderColor: "var(--danger-solid-medium)",
              color: "var(--danger-on-solid-strong)",
            }}
          >
            Supprimer mon compte
          </Button>
        </Flex>
      </Column>

      {/* Dialog suppression avatar */}
      <Dialog
        isOpen={isDeleteAvatarOpen}
        onClose={() => {
          setIsDeleteAvatarOpen(false);
          setDeleteAvatarPassword("");
        }}
        title="Supprimer la photo de profil"
        description="Entrez votre mot de passe pour confirmer."
        base
      >
        <Column gap="12">
          <Input
            id="pwd-del-avatar"
            type="password"
            label="Mot de passe"
            value={deleteAvatarPassword}
            onChange={(e: any) => setDeleteAvatarPassword(e.target.value)}
          />
          <Flex horizontal="end" gap="8">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteAvatarOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                await deleteAvatar();
                setIsDeleteAvatarOpen(false);
              }}
              disabled={!deleteAvatarPassword}
              style={{
                background: "var(--danger-solid-medium)",
                borderColor: "var(--danger-solid-medium)",
                color: "var(--danger-on-solid-strong)",
              }}
            >
              Supprimer
            </Button>
          </Flex>
        </Column>
      </Dialog>

      {/* Dialog suppression compte */}
      <Dialog
        isOpen={isDeleteAccountOpen}
        onClose={() => {
          setIsDeleteAccountOpen(false);
          setDeleteAccountPassword("");
        }}
        title="Supprimer le compte"
        description="Cette action est irréversible. Entrez votre mot de passe pour confirmer."
        base
      >
        <Column gap="12">
          <Input
            id="pwd-del-account"
            type="password"
            label="Mot de passe"
            value={deleteAccountPassword}
            onChange={(e: any) => setDeleteAccountPassword(e.target.value)}
          />
          <Flex horizontal="end" gap="8">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteAccountOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={async () => {
                setIsDeletingAccount(true);
                await deleteAccount();
                setIsDeletingAccount(false);
                setIsDeleteAccountOpen(false);
              }}
              disabled={!deleteAccountPassword || isDeletingAccount}
              style={{
                background: "var(--danger-solid-medium)",
                borderColor: "var(--danger-solid-medium)",
                color: "var(--danger-on-solid-strong)",
              }}
            >
              {isDeletingAccount
                ? "Suppression..."
                : "Supprimer définitivement"}
            </Button>
          </Flex>
        </Column>
      </Dialog>
    </Column>
  );
}
