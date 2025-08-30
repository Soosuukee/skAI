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
import { Education } from "@/app/types/education";

export type EducationFormValues = Omit<
  Education,
  "diplomaId" | "diplomaImageUrl"
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
  diplomaTitle: "",
  institutionName: "",
  description: "",
  startDate: "",
  endDate: "",
  diplomaImageFile: null,
};

export default function EducationForm({
  initialValues,
  onSubmit,
  submittingLabel = "Enregistrement...",
  submitLabel = "Enregistrer",
}: EducationFormProps) {
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
        !values.diplomaTitle ||
        !values.institutionName ||
        !values.description ||
        !values.startDate
      ) {
        setError("Veuillez compléter les champs requis");
        return;
      }
      await onSubmit({
        diplomaTitle: values.diplomaTitle,
        institutionName: values.institutionName,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate || undefined,
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
      <form onSubmit={handleSubmit}>
        <Column gap="16" padding="24">
          <Column gap="8">
            <Input
              id="diplomaTitle"
              label="Intitulé du diplôme"
              value={values.diplomaTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("diplomaTitle", e.target.value)
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
              id="startDate"
              label="Date de début"
              value={values.startDate ? new Date(values.startDate) : undefined}
              onChange={(d: Date) =>
                handleChange("startDate", d.toISOString().split("T")[0])
              }
              floatingPlacement="right-start"
              monthYearSelector
            />
            <DateInput
              id="endDate"
              label="Date de fin (optionnel)"
              value={values.endDate ? new Date(values.endDate) : undefined}
              onChange={(d: Date) =>
                handleChange("endDate", d.toISOString().split("T")[0])
              }
              floatingPlacement="right-start"
              monthYearSelector
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
            <Button
              variant="secondary"
              onClick={(e: any) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              Choisir un logo de diplôme (optionnel)
            </Button>
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

          <Button type="submit" disabled={loading}>
            {loading ? submittingLabel : submitLabel}
          </Button>
        </Column>
      </form>
    </Card>
  );
}
