"use client";

import React, { useRef, useState } from "react";
import {
  Column,
  Input,
  Textarea,
  Button,
  CustomButton,
  Text,
  Card,
  Flex,
  DateInput,
} from "@/once-ui/components";
import { Experience } from "@/app/types/experience";
import {
  formatLocalDateYYYYMMDD,
  parseYYYYMMDDToLocalDate,
} from "@/app/utils/date";

// Reuse backend Experience type for form values (omit backend-only fields)
export type ExperienceFormValues = Omit<
  Experience,
  "id" | "providerId" | "companyLogo"
> & {
  experienceImageFile?: File | null;
};

interface ExperienceFormProps {
  initialValues?: Partial<ExperienceFormValues>;
  onSubmit: (values: ExperienceFormValues) => Promise<void> | void;
  submittingLabel?: string;
  submitLabel?: string;
}

const defaultValues: ExperienceFormValues = {
  title: "",
  companyName: "",
  firstTask: "",
  secondTask: undefined,
  thirdTask: undefined,
  startedAt: "",
  endedAt: undefined,
  experienceImageFile: null,
};

export default function ExperienceForm({
  initialValues,
  onSubmit,
  submittingLabel = "Enregistrement...",
  submitLabel = "Enregistrer",
}: ExperienceFormProps) {
  const [values, setValues] = useState<ExperienceFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: keyof ExperienceFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      if (
        !values.title ||
        !values.companyName ||
        !values.firstTask ||
        !values.startedAt
      ) {
        setError("Veuillez compléter les champs requis");
        return;
      }

      // Ensure endedAt is not before startedAt
      if (values.startedAt && values.endedAt) {
        const s = new Date(values.startedAt);
        const e = new Date(values.endedAt);
        if (e < s) {
          setError(
            "La date de fin ne peut pas être antérieure à la date de début"
          );
          return;
        }
      }

      await onSubmit({
        title: values.title,
        companyName: values.companyName,
        firstTask: values.firstTask,
        secondTask: values.secondTask || undefined,
        thirdTask: values.thirdTask || undefined,
        startedAt: values.startedAt,
        endedAt: values.endedAt || undefined,
        experienceImageFile: values.experienceImageFile || null,
      });
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "100%" }}>
      <form onSubmit={handleSubmit}>
        <Column gap="16" padding="24">
          <Column gap="8">
            <Input
              id="title"
              label="Titre du poste"
              value={values.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </Column>
          <Column gap="8">
            <Input
              id="companyName"
              label="Entreprise"
              value={values.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              required
            />
          </Column>
          <Column gap="8">
            <Textarea
              id="firstTask"
              label="Tâche principale"
              value={values.firstTask}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("firstTask", e.target.value)
              }
              required
            />
          </Column>
          <Flex gap="8" wrap>
            <Input
              id="secondTask"
              label="Tâche secondaire (optionnel)"
              value={values.secondTask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("secondTask", e.target.value)
              }
            />
            <Input
              id="thirdTask"
              label="Autre tâche (optionnel)"
              value={values.thirdTask}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("thirdTask", e.target.value)
              }
            />
          </Flex>
          <Flex gap="8" wrap>
            <DateInput
              id="startedAt"
              label="Date de début"
              value={parseYYYYMMDDToLocalDate(values.startedAt)}
              onChange={(d: Date) =>
                handleChange("startedAt", formatLocalDateYYYYMMDD(d))
              }
              floatingPlacement="right-start"
              monthYearSelector
            />
            <DateInput
              id="endedAt"
              label="Date de fin (optionnel)"
              value={parseYYYYMMDDToLocalDate(values.endedAt)}
              onChange={(d: Date) =>
                handleChange("endedAt", formatLocalDateYYYYMMDD(d))
              }
              floatingPlacement="right-start"
              monthYearSelector
              minDate={parseYYYYMMDDToLocalDate(values.startedAt)}
            />
          </Flex>
          <Column gap="8">
            <input
              ref={fileInputRef}
              id="experienceImageFile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "experienceImageFile",
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
            />
            <CustomButton
              variant="secondary"
              onClick={(e: any) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              Ajouter le logo d'entreprise (optionnel)
            </CustomButton>
            {values.experienceImageFile && (
              <Text variant="body-default-s" color="neutral-medium">
                {values.experienceImageFile.name}
              </Text>
            )}
          </Column>

          {error && (
            <Text variant="body-default-s" color="error">
              {error}
            </Text>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? submittingLabel : submitLabel}
          </Button>
        </Column>
      </form>
    </Card>
  );
}
