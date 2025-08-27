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
  Checkbox,
} from "@/once-ui/components";
import { Service } from "@/app/types/service";

export type ServiceFormValues = Omit<
  Service,
  "serviceId" | "providerId" | "createdAt" | "updatedAt"
> & {
  providerId?: number;
  subtitle?: string;
  coverImageFile?: File | null;
  onQuote?: boolean;
};

type SectionImageDraft = { url: string; title?: string };
type SectionDraft = {
  title: string;
  content: string; // wysiwyg/plaintext with line breaks
  images: SectionImageDraft[];
};

interface ServiceFormProps {
  initialValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => Promise<void> | void;
  submittingLabel?: string;
  submitLabel?: string;
}

const defaultValues: ServiceFormValues = {
  title: "",
  description: "",
  slug: "",
  isActive: true,
  isFeatured: false,
  minPrice: 0,
  maxPrice: 0,
  estimatedDuration: "",
  availability: "",
  responseTime: "",
  rating: undefined,
  reviewCount: undefined,
  completedProjects: undefined,
  subtitle: "",
  coverImageFile: null,
  onQuote: false,
};

export default function ServiceForm({
  initialValues,
  onSubmit,
  submittingLabel = "Enregistrement...",
  submitLabel = "Enregistrer",
}: ServiceFormProps) {
  const [values, setValues] = useState<ServiceFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [sections, setSections] = useState<SectionDraft[]>([
    { title: "", content: "", images: [] },
  ]);
  const [newImage, setNewImage] = useState<SectionImageDraft>({
    url: "",
    title: "",
  });
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: keyof ServiceFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = () => {
    setSections((prev) => [...prev, { title: "", content: "", images: [] }]);
  };

  const updateSectionTitle = (index: number, title: string) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, title } : s))
    );
  };

  const updateSectionContent = (index: number, content: string) => {
    setSections((prev) =>
      prev.map((s, i) => (i === index ? { ...s, content } : s))
    );
  };

  const addImageToSection = (index: number) => {
    if (!newImage.url.trim()) return;
    setSections((prev) =>
      prev.map((s, i) =>
        i === index
          ? {
              ...s,
              images: [
                ...s.images,
                {
                  url: newImage.url.trim(),
                  title: newImage.title?.trim() || undefined,
                },
              ],
            }
          : s
      )
    );
    setNewImage({ url: "", title: "" });
  };

  const removeImageFromSection = (sectionIndex: number, imageIndex: number) => {
    setSections((prev) =>
      prev.map((s, i) =>
        i === sectionIndex
          ? { ...s, images: s.images.filter((_, ii) => ii !== imageIndex) }
          : s
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    try {
      if (!values.title) {
        setError("Veuillez renseigner le titre");
        return;
      }
      if (!sections[0]?.title || !sections[0]?.content) {
        setError(
          "Veuillez renseigner le titre et la description de la première section"
        );
        return;
      }
      const payload: ServiceFormValues = {
        ...values,
        minPrice:
          values.minPrice === null || values.minPrice === undefined
            ? null
            : Number(values.minPrice),
        maxPrice:
          values.maxPrice === null || values.maxPrice === undefined
            ? null
            : Number(values.maxPrice),
      };
      await onSubmit(payload);
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
              label="Titre"
              value={values.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("title", e.target.value)
              }
              required
            />
          </Column>
          <Column gap="8">
            <Input
              id="subtitle"
              label="Sous-titre (résumé)"
              value={values.subtitle || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("subtitle", e.target.value)
              }
            />
          </Column>
          <Column gap="8">
            <input
              ref={coverInputRef}
              id="coverImageFile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "coverImageFile",
                  e.target.files && e.target.files[0] ? e.target.files[0] : null
                )
              }
            />
            <Button
              variant="secondary"
              onClick={(e: any) => {
                e.preventDefault();
                coverInputRef.current?.click();
              }}
            >
              Choisir une image de couverture
            </Button>
            {values.coverImageFile && (
              <Text variant="body-default-s" color="neutral-medium">
                {values.coverImageFile.name}
              </Text>
            )}
          </Column>
          {/* Champ slug supprimé de l'UI */}
          <Flex gap="16" wrap>
            <Column gap="8">
              <Input
                id="minPrice"
                label="Prix min (optionnel)"
                type="number"
                value={values.minPrice ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("minPrice", e.target.value)
                }
              />
            </Column>
            <Column gap="8">
              <Input
                id="maxPrice"
                label="Prix max (optionnel)"
                type="number"
                value={values.maxPrice ?? ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("maxPrice", e.target.value)
                }
              />
            </Column>
          </Flex>
          <Flex gap="16" wrap>
            <Checkbox
              id="onQuote"
              label="Service sur devis"
              checked={Boolean(values.onQuote)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("onQuote", e.target.checked)
              }
            />
          </Flex>
          {!values.onQuote && (
            <Text variant="body-default-s" color="neutral-medium">
              Renseignez un prix min/max ou laissez vide.
            </Text>
          )}
          <Flex gap="16" wrap>
            <Input
              id="estimatedDuration"
              label="Durée estimée"
              value={values.estimatedDuration}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("estimatedDuration", e.target.value)
              }
            />
          </Flex>
          <Flex gap="16" wrap>
            <Checkbox
              id="isActive"
              label="Actif"
              checked={Boolean(values.isActive)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("isActive", e.target.checked)
              }
            />
            <Checkbox
              id="isFeatured"
              label="Mis en avant"
              checked={Boolean(values.isFeatured)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("isFeatured", e.target.checked)
              }
            />
          </Flex>

          <Column gap="12">
            <Text variant="heading-strong-s">Decrivez votre service</Text>
            {sections.map((section, index) => (
              <Card key={index} style={{ padding: 16 }}>
                <Column gap="12">
                  <Input
                    id={`section-title-${index}`}
                    label={`Titre de la section ${index + 1}`}
                    value={section.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSectionTitle(index, e.target.value)
                    }
                  />
                  <Column gap="8">
                    <Textarea
                      id={`section-content-${index}`}
                      label={
                        index === 0
                          ? "Description (obligatoire)"
                          : "Description"
                      }
                      value={section.content}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        updateSectionContent(index, e.target.value)
                      }
                      placeholder={
                        "Saisissez du texte. Les sauts de ligne seront conservés."
                      }
                      required={index === 0}
                    />
                  </Column>
                  <Column gap="8">
                    <Input
                      id={`section-image-title-${index}`}
                      label="Titre image (optionnel)"
                      value={newImage.title || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewImage((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                    {section.images.length > 0 && (
                      <Column gap="4">
                        {section.images.map((img, ii) => (
                          <Flex
                            key={ii}
                            horizontal="space-between"
                            vertical="center"
                          >
                            <Text>{img.title || img.url}</Text>
                            <Button
                              variant="secondary"
                              onClick={(e: any) => {
                                e.preventDefault();
                                removeImageFromSection(index, ii);
                              }}
                            >
                              Supprimer
                            </Button>
                          </Flex>
                        ))}
                      </Column>
                    )}
                  </Column>
                </Column>
              </Card>
            ))}
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                addSection();
              }}
            >
              Ajouter une section
            </Button>
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
