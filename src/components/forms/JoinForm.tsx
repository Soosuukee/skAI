"use client";

import React from "react";
import {
  Column,
  Input,
  Button,
  Text,
  Heading,
  Card,
  Select,
  Avatar,
  DatePicker,
  Flex,
  Chip,
  Textarea,
} from "@/once-ui/components";
import { useAuth } from "@/app/contexts/AuthContext";
import { getApiBaseUrl } from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { useFiltersData } from "@/app/hooks/useFiltersData";

export default function JoinForm() {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [formData, setFormData] = React.useState({
    userType: "provider" as "provider" | "customer",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Step 2
    birthDate: null as Date | null,
    avatarFile: null as File | null,
    address: "",
    city: "",
    state: "",
    postalCode: "",
    // Step 3 (provider only)
    jobSlug: "",
    countrySlug: "",
    languageSlugs: [] as string[],
    description: "",
    hardSkillSlugs: [] as string[],
    softSkillSlugs: [] as string[],
  });
  const [languageSelectValue, setLanguageSelectValue] = React.useState("");
  const [hardSkillSelectValue, setHardSkillSelectValue] = React.useState("");
  const [softSkillSelectValue, setSoftSkillSelectValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const { user, login } = useAuth();
  const router = useRouter();
  const {
    jobs,
    jobsLoading,
    countries,
    countriesLoading,
    languages,
    languagesLoading,
  } = useFiltersData();

  // Load hard and soft skills lists
  const [hardSkills, setHardSkills] = React.useState<
    Array<{ title: string; slug: string }>
  >([]);
  const [softSkills, setSoftSkills] = React.useState<
    Array<{ title: string; slug: string }>
  >([]);
  React.useEffect(() => {
    const loadSkills = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const [hsRes, ssRes] = await Promise.all([
          fetch(`${baseUrl}/hard-skills`),
          fetch(`${baseUrl}/soft-skills`),
        ]);
        const parse = async (res: Response) => {
          if (!res.ok) return [] as Array<{ title: string; slug: string }>;
          const json = await res.json().catch(() => ({} as any));
          const arr = Array.isArray(json)
            ? json
            : Array.isArray(json?.data)
            ? json.data
            : [];
          return arr.map((i: any) => ({
            title: i.title ?? i.name ?? String(i.slug || i.id),
            slug: i.slug ?? String(i.id),
          }));
        };
        const [hs, ss] = await Promise.all([parse(hsRes), parse(ssRes)]);
        setHardSkills(hs);
        setSoftSkills(ss);
      } catch {}
    };
    loadSkills();
  }, []);

  const date18YearsAgo = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setFullYear(d.getFullYear() - 18);
    return d;
  }, []);

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Ne pas rediriger automatiquement après connexion pour permettre le wizard multi-étapes

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContinue = async () => {
    setLoading(true);
    setError("");

    try {
      if (step === 1) {
        if (
          !formData.userType ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setError("Veuillez renseigner tous les champs obligatoires");
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

        // Vérifier que les mots de passe correspondent
        if (formData.password !== formData.confirmPassword) {
          setError("Les mots de passe ne correspondent pas");
          return;
        }
        // Pas d'appel API ici: on continue simplement si tout est valide
        setStep(2);
        return;
      }

      if (step === 2) {
        // Step 2: date de naissance uniquement
        if (!formData.birthDate) {
          setError("Veuillez renseigner votre date de naissance");
          return;
        }
        const birth = new Date(formData.birthDate);
        if (birth > date18YearsAgo) {
          setError("Vous devez avoir au moins 18 ans pour vous inscrire");
          return;
        }
        setStep(3);
        return;
      }

      if (step === 3) {
        // Step 3: coordonnées + pays
        if (
          !formData.countrySlug ||
          !formData.address.trim() ||
          !formData.city.trim() ||
          !formData.state.trim() ||
          !formData.postalCode.trim()
        ) {
          setError(
            "Veuillez renseigner le pays, l'adresse, la ville, l'état/région et le code postal"
          );
          return;
        }
        setStep(4);
        return;
      }

      if (step === 4) {
        // Step 4: job/langues/skills/description (multi pour langues, hard/soft skills)
        if (formData.userType === "provider" && !formData.jobSlug) {
          setError("Veuillez sélectionner votre métier");
          return;
        }
        if (formData.languageSlugs.length === 0) {
          setError("Veuillez sélectionner au moins une langue");
          return;
        }
        if (!formData.description.trim()) {
          setError("Veuillez renseigner une description");
          return;
        }
        setStep(5);
        return;
      }

      if (step === 5) {
        // Step 5: photo (optionnelle) → récap
        setStep(6);
        return;
      }

      if (step === 6) {
        // Validation finale + envoi
        if (
          !formData.userType ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.password ||
          !formData.confirmPassword ||
          !formData.birthDate ||
          !formData.address.trim() ||
          !formData.city.trim() ||
          !formData.state.trim() ||
          !formData.postalCode.trim() ||
          !formData.countrySlug ||
          formData.languageSlugs.length === 0 ||
          !formData.description.trim() ||
          (formData.userType === "provider" && !formData.jobSlug)
        ) {
          setError(
            "Tous les champs sont obligatoires (sauf la photo de profil)"
          );
          return;
        }

        const baseUrl = getApiBaseUrl();

        // 1) Register
        const registerUrl = `${baseUrl}/auth/register`;
        const registerRes = await fetch(registerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userType: formData.userType,
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
          }),
        });
        if (!registerRes.ok) {
          const data = await registerRes.json().catch(() => null);
          setError(data?.message || "Inscription impossible");
          return;
        }

        // 2) Login
        const loginResult = await login(formData.email, formData.password);
        if (!loginResult.success) {
          setError(loginResult.message || "Connexion automatique impossible");
          return;
        }

        // 3) Avatar (optionnel)
        const token = localStorage.getItem("authToken") || "";
        if (formData.avatarFile) {
          const fd = new FormData();
          fd.append("profile_image", formData.avatarFile);
          const avatarRes = await fetch(`${baseUrl}/auth/avatar`, {
            method: "POST",
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            body: fd,
          });
          if (!avatarRes.ok) {
            const data = await avatarRes.json().catch(() => null);
            setError(
              data?.message || "Échec de l'upload de la photo de profil"
            );
            return;
          }
          // Persister l'URL renvoyée si disponible pour affichage immédiat
          try {
            const data = await avatarRes.json();
            const newUrl =
              data?.data?.profile_picture_url ||
              data?.profile_picture_url ||
              data?.profilePicture ||
              data?.avatar;
            if (newUrl && typeof window !== "undefined") {
              const cached = localStorage.getItem("authUser");
              if (cached) {
                const u = JSON.parse(cached);
                u.profilePicture = newUrl;
                localStorage.setItem("authUser", JSON.stringify(u));
              }
            }
          } catch {}
        }

        // 4) Complete profile
        const payload: any = {
          birthDate: new Date(formData.birthDate).toISOString().slice(0, 10),
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          postalCode: formData.postalCode.trim(),
          countrySlug: formData.countrySlug,
          description: formData.description.trim(),
          languageSlugs: formData.languageSlugs,
        };
        if (formData.userType === "provider") {
          payload.jobSlug = formData.jobSlug;
          payload.hardSkillSlugs = formData.hardSkillSlugs;
          payload.softSkillSlugs = formData.softSkillSlugs;
        }
        const endpoint =
          formData.userType === "provider"
            ? "/auth/complete-provider-profile"
            : "/auth/complete-client-profile";
        const completeRes = await fetch(`${baseUrl}${endpoint}`, {
          method: "PATCH",
          headers: token
            ? {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              }
            : { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!completeRes.ok) {
          const data = await completeRes.json().catch(() => null);
          setError(data?.message || "Impossible de compléter le profil");
          return;
        }

        router.push("/me");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: "640px", width: "100%" }}>
      <Column gap="24" padding="32">
        <Column gap="8" style={{ textAlign: "center" }}>
          <Heading variant="display-strong-m">Nous rejoindre</Heading>
          <Text variant="body-default-m" color="neutral-medium">
            Créez votre compte pour accéder à nos services
          </Text>
        </Column>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
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
              </Column>
            )}

            {step === 2 && (
              <Column gap="16">
                <Heading variant="heading-strong-s">
                  Informations personnelles
                </Heading>
                <Column gap="8">
                  <Text variant="label-default-m">Date de naissance</Text>
                  <DatePicker
                    value={formData.birthDate || undefined}
                    onChange={(date: Date) =>
                      setFormData((p) => ({ ...p, birthDate: date }))
                    }
                    maxDate={today}
                    monthYearSelector
                    size="m"
                    style={{ width: "100%" }}
                  />
                </Column>
              </Column>
            )}

            {step === 3 && (
              <Column gap="16">
                <Heading variant="heading-strong-s">Coordonnées</Heading>
                <Column gap="8">
                  <Input
                    id="address"
                    label="Adresse"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, address: e.target.value }))
                    }
                    required
                  />
                </Column>
                <Flex gap="8" wrap>
                  <Column gap="8" style={{ flex: 1 }}>
                    <Input
                      id="city"
                      label="Ville"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, city: e.target.value }))
                      }
                      required
                    />
                  </Column>
                  <Column gap="8" style={{ flex: 1 }}>
                    <Input
                      id="state"
                      label="État / Région"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData((p) => ({ ...p, state: e.target.value }))
                      }
                      required
                    />
                  </Column>
                </Flex>
                <Column gap="8">
                  <Input
                    id="postalCode"
                    label="Code postal"
                    value={formData.postalCode}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, postalCode: e.target.value }))
                    }
                    required
                  />
                </Column>
                <Heading variant="heading-strong-s">Pays</Heading>
                <Select
                  id="country"
                  label="Pays"
                  value={
                    formData.countrySlug
                      ? countries.find((c) => c.slug === formData.countrySlug)
                          ?.name || formData.countrySlug
                      : ""
                  }
                  onSelect={(v: string) =>
                    setFormData((p) => ({ ...p, countrySlug: v }))
                  }
                  options={
                    countriesLoading
                      ? []
                      : countries.map((c) => ({ label: c.name, value: c.slug }))
                  }
                  searchable
                />
              </Column>
            )}

            {step === 4 && (
              <Column gap="16">
                <Heading variant="heading-strong-s">
                  Métier et compétences
                </Heading>
                {formData.userType === "provider" && (
                  <Select
                    id="job"
                    label="Métier"
                    value={
                      formData.jobSlug
                        ? jobs.find((j) => j.slug === formData.jobSlug)
                            ?.title || formData.jobSlug
                        : ""
                    }
                    onSelect={(v: string) =>
                      setFormData((p) => ({ ...p, jobSlug: v }))
                    }
                    options={
                      jobsLoading
                        ? []
                        : jobs.map((j) => ({ label: j.title, value: j.slug }))
                    }
                    searchable
                  />
                )}
                <Textarea
                  id="description"
                  label="Description"
                  value={formData.description}
                  onChange={(e: any) =>
                    setFormData((p) => ({ ...p, description: e.target.value }))
                  }
                />
                <Select
                  id="hardSkills"
                  label="Compétences techniques (Hard skills) – sélection multiple"
                  value={hardSkillSelectValue}
                  onSelect={(v: string) => {
                    setHardSkillSelectValue("");
                    setFormData((p) => ({
                      ...p,
                      hardSkillSlugs: p.hardSkillSlugs.includes(v)
                        ? p.hardSkillSlugs
                        : [...p.hardSkillSlugs, v],
                    }));
                  }}
                  options={hardSkills.map((s) => ({
                    label: s.title,
                    value: s.slug,
                  }))}
                  searchable
                />
                {formData.hardSkillSlugs.length > 0 && (
                  <Flex wrap gap="8">
                    {formData.hardSkillSlugs.map((slug) => {
                      const label =
                        hardSkills.find((s) => s.slug === slug)?.title || slug;
                      return (
                        <Chip
                          key={slug}
                          label={label}
                          onRemove={() =>
                            setFormData((p) => ({
                              ...p,
                              hardSkillSlugs: p.hardSkillSlugs.filter(
                                (s) => s !== slug
                              ),
                            }))
                          }
                        />
                      );
                    })}
                  </Flex>
                )}
                <Select
                  id="softSkills"
                  label="Compétences humaines (Soft skills) – sélection multiple"
                  value={softSkillSelectValue}
                  onSelect={(v: string) => {
                    setSoftSkillSelectValue("");
                    setFormData((p) => ({
                      ...p,
                      softSkillSlugs: p.softSkillSlugs.includes(v)
                        ? p.softSkillSlugs
                        : [...p.softSkillSlugs, v],
                    }));
                  }}
                  options={softSkills.map((s) => ({
                    label: s.title,
                    value: s.slug,
                  }))}
                  searchable
                />
                {formData.softSkillSlugs.length > 0 && (
                  <Flex wrap gap="8">
                    {formData.softSkillSlugs.map((slug) => {
                      const label =
                        softSkills.find((s) => s.slug === slug)?.title || slug;
                      return (
                        <Chip
                          key={slug}
                          label={label}
                          onRemove={() =>
                            setFormData((p) => ({
                              ...p,
                              softSkillSlugs: p.softSkillSlugs.filter(
                                (s) => s !== slug
                              ),
                            }))
                          }
                        />
                      );
                    })}
                  </Flex>
                )}
                <Select
                  id="languages"
                  label="Langues parlées (sélection multiple)"
                  value={languageSelectValue}
                  onSelect={(v: string) => {
                    setLanguageSelectValue("");
                    setFormData((p) => ({
                      ...p,
                      languageSlugs: p.languageSlugs.includes(v)
                        ? p.languageSlugs
                        : [...p.languageSlugs, v],
                    }));
                  }}
                  options={
                    languagesLoading
                      ? []
                      : languages.map((l) => ({ label: l.name, value: l.slug }))
                  }
                  searchable
                />
                {formData.languageSlugs.length > 0 && (
                  <Flex wrap gap="8">
                    {formData.languageSlugs.map((slug) => {
                      const label =
                        languages.find((l) => l.slug === slug)?.name || slug;
                      return (
                        <Chip
                          key={slug}
                          label={label}
                          onRemove={() =>
                            setFormData((p) => ({
                              ...p,
                              languageSlugs: p.languageSlugs.filter(
                                (s) => s !== slug
                              ),
                            }))
                          }
                        />
                      );
                    })}
                  </Flex>
                )}
              </Column>
            )}

            {step === 5 && (
              <Column gap="16">
                <Heading variant="heading-strong-s">Photo de profil</Heading>
                <Text variant="body-default-s" color="neutral-medium">
                  Optionnelle (vous pourrez la changer plus tard).
                </Text>
                <Flex gap="12" wrap mobileDirection="column" vertical="center">
                  <Avatar
                    src={
                      formData.avatarFile
                        ? URL.createObjectURL(formData.avatarFile)
                        : "/images/avatar.jpg"
                    }
                    size="xl"
                  />
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const f =
                        e.target.files && e.target.files[0]
                          ? e.target.files[0]
                          : null;
                      setFormData((p) => ({ ...p, avatarFile: f }));
                    }}
                  />
                </Flex>
              </Column>
            )}

            {step === 6 && (
              <Column gap="12">
                <Heading variant="heading-strong-s">Récapitulatif</Heading>
                <Text>
                  Type:{" "}
                  {formData.userType === "provider" ? "Prestataire" : "Client"}
                </Text>
                <Text>Prénom: {formData.firstName}</Text>
                <Text>Nom: {formData.lastName}</Text>
                <Text>Email: {formData.email}</Text>
                <Text>Adresse: {formData.address}</Text>
                <Text>Ville: {formData.city}</Text>
                <Text>État / Région: {formData.state}</Text>
                <Text>Code postal: {formData.postalCode}</Text>
                {formData.birthDate && (
                  <Text>
                    Date de naissance:{" "}
                    {new Date(formData.birthDate).toLocaleDateString("fr-FR")}
                  </Text>
                )}
                {formData.countrySlug && (
                  <Text>
                    Pays:{" "}
                    {countries.find((c) => c.slug === formData.countrySlug)
                      ?.name || formData.countrySlug}
                  </Text>
                )}
                {formData.userType === "provider" && formData.jobSlug && (
                  <Text>
                    Métier:{" "}
                    {jobs.find((j) => j.slug === formData.jobSlug)?.title ||
                      formData.jobSlug}
                  </Text>
                )}
                {formData.languageSlugs.length > 0 && (
                  <Text>
                    Langues:{" "}
                    {formData.languageSlugs
                      .map(
                        (s) => languages.find((l) => l.slug === s)?.name || s
                      )
                      .join(", ")}
                  </Text>
                )}
                {formData.description && (
                  <Text>Description: {formData.description}</Text>
                )}
              </Column>
            )}

            {error && (
              <Text variant="body-default-s" color="error">
                {error}
              </Text>
            )}

            <Flex horizontal="space-between">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep((s) => (s > 1 ? ((s - 1) as any) : s))}
                >
                  Précédent
                </Button>
              ) : (
                <span />
              )}
              <Button type="button" disabled={loading} onClick={handleContinue}>
                {loading
                  ? "Veuillez patienter..."
                  : step === 6
                  ? "Terminer"
                  : "Continuer"}
              </Button>
            </Flex>
          </Column>
        </form>
      </Column>
    </Card>
  );
}
