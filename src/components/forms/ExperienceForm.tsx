"use client";

import React, { useRef, useState } from "react";
import {
  Column,
  Input,
  Textarea,
  Button,
  Text,
  Card,
  Flex,
  DateInput,
} from "@/once-ui/components";
import { Experience } from "@/app/types/experience";

export type ExperienceFormValues = Omit<
  Experience,
  "experienceId" | "experienceImage"
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
  jobTitle: "",
  companyName: "",
  description: "",
  task1: "",
  task2: "",
  startDate: "",
  endDate: "",
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
        !values.jobTitle ||
        !values.companyName ||
        !values.description ||
        !values.startDate
      ) {
        setError("Veuillez compléter les champs requis");
        return;
      }
      await onSubmit({
        jobTitle: values.jobTitle,
        companyName: values.companyName,
        description: values.description,
        task1: values.task1 || undefined,
        task2: values.task2 || undefined,
        startDate: values.startDate,
        endDate: values.endDate || undefined,
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
              id="jobTitle"
              label="Titre du poste"
              value={values.jobTitle}
              onChange={(e) => handleChange("jobTitle", e.target.value)}
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
              id="description"
              label="Description"
              value={values.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("description", e.target.value)
              }
              required
            />
          </Column>
          <Flex gap="8" wrap>
            <Input
              id="task1"
              label="Tâche principale 1 (optionnel)"
              value={values.task1}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("task1", e.target.value)
              }
            />
            <Input
              id="task2"
              label="Tâche principale 2 (optionnel)"
              value={values.task2}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("task2", e.target.value)
              }
            />
          </Flex>
          <Flex gap="8" wrap>
            <DateInput
              id="startDate"
              label="Date de début"
              value={values.startDate ? new Date(values.startDate) : undefined}
              onChange={(d: Date) =>
                handleChange("startDate", d.toISOString().split("T")[0])
              }
              floatingPlacement="right-start"
            />
            <DateInput
              id="endDate"
              label="Date de fin (optionnel)"
              value={values.endDate ? new Date(values.endDate) : undefined}
              onChange={(d: Date) =>
                handleChange("endDate", d.toISOString().split("T")[0])
              }
              floatingPlacement="right-start"
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
            <Button
              variant="secondary"
              onClick={(e: any) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              Ajouter le logo d'entreprise (optionnel)
            </Button>
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
