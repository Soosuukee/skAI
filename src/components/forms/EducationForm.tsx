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
import { Education } from "@/app/types/education";
import {
  formatLocalDateYYYYMMDD,
  parseYYYYMMDDToLocalDate,
} from "@/app/utils/date";

export type EducationFormValues = Omit<
  Education,
  "id" | "providerId" | "institutionImage"
> & {
  diplomaImageFile?: File | null;
};

interface EducationFormProps {
  initialValues?: Partial<EducationFormValues>;
  onSubmit: (values: EducationFormValues) => Promise<void> | void;
  submittingLabel?: string;
  submitLabel?: string;
}

const defaultValues: EducationFormValues = {
  title: "",
  institutionName: "",
  description: "",
  startedAt: "",
  endedAt: "",
  diplomaImageFile: null,
};

export default function EducationForm({
  initialValues,
  onSubmit,
  submittingLabel = "Enregistrement...",
  submitLabel = "Enregistrer",
}: EducationFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [values, setValues] = useState<EducationFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: keyof EducationFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      if (
        !values.title ||
        !values.institutionName ||
        !values.description ||
        !values.startedAt
      ) {
        setError("Veuillez compléter les champs requis");
        return;
      }
      // Validate date order
      if (
        values.endedAt &&
        new Date(values.endedAt) < new Date(values.startedAt)
      ) {
        setError(
          "La date de fin ne peut pas être antérieure à la date de début"
        );
        return;
      }
      await onSubmit({
        title: values.title,
        institutionName: values.institutionName,
        description: values.description,
        startedAt: values.startedAt,
        endedAt: values.endedAt || undefined,
        diplomaImageFile: values.diplomaImageFile || null,
      });
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: "100%" }}>
      <form ref={formRef} onSubmit={handleSubmit}>
        <Column gap="16" padding="24">
          <Column gap="8">
            <Input
              id="title"
              label="Intitulé du diplôme"
              value={values.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("title", e.target.value)
              }
              required
            />
          </Column>
          <Column gap="8">
            <Input
              id="institutionName"
              label="Établissement"
              value={values.institutionName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("institutionName", e.target.value)
              }
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
              id="diplomaImageFile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "diplomaImageFile",
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
              Choisir un logo de diplôme (optionnel)
            </CustomButton>
            {values.diplomaImageFile && (
              <Text variant="body-default-s" color="neutral-medium">
                {values.diplomaImageFile.name}
              </Text>
            )}
          </Column>

          {error && (
            <Text variant="body-default-s" color="error">
              {error}
            </Text>
          )}

          <CustomButton
            role="button"
            onClick={(e: any) => {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }}
            aria-disabled={loading}
          >
            {loading ? submittingLabel : submitLabel}
          </CustomButton>
        </Column>
      </form>
    </Card>
  );
}
