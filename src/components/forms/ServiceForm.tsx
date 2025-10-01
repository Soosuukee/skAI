"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Column,
  Input,
  Textarea,
  Button,
  CustomButton,
  Text,
  Flex,
  Checkbox,
  IconButton,
} from "@/once-ui/components";
import { ContentTags } from "@/components/ContentTags";
import { Service } from "@/app/types/service";

export type ServiceFormValues = Omit<
  Service,
  "id" | "providerId" | "createdAt"
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
  texts?: ServiceFormTexts;
}

interface ServiceFormTexts {
  priceHelp?: string;
  describeHeading?: string;
  tagsHeading?: string;
}

const defaultTexts: Required<ServiceFormTexts> = {
  priceHelp: "Renseignez un prix min/max ou laissez vide.",
  describeHeading: "Décrivez votre service",
  tagsHeading: "Tags",
};

const defaultValues: ServiceFormValues = {
  title: "",
  summary: "",
  slug: "",
  isActive: true,
  isFeatured: false,
  minPrice: null as any,
  maxPrice: null as any,
  sections: [],
  tags: [],
  subtitle: "",
  coverImageFile: null,
  onQuote: false,
};

export default function ServiceForm({
  initialValues,
  onSubmit,
  submittingLabel = "Enregistrement...",
  submitLabel = "Enregistrer",
  texts,
}: ServiceFormProps) {
  const t = { ...defaultTexts, ...(texts || {}) };
  const [values, setValues] = useState<ServiceFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [sections, setSections] = useState<SectionDraft[]>([
    { title: "", content: "", images: [] },
  ]);
  const [tagSlugs, setTagSlugs] = useState<string[]>([]);
  const [newImage, setNewImage] = useState<SectionImageDraft>({
    url: "",
    title: "",
  });
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (field: keyof ServiceFormValues, value: any) => {
    if (field === "minPrice" || field === "maxPrice") {
      const v = value as string;
      const normalized =
        v === "" || v === null || v === undefined ? null : Number(v);
      setValues((prev) => ({
        ...prev,
        [field]: isNaN(normalized as number) ? null : (normalized as any),
      }));
      return;
    }
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  // Hydrate form when initialValues change (edit mode)
  useEffect(() => {
    if (initialValues) {
      setValues((prev) => ({
        ...prev,
        ...initialValues,
        minPrice: (initialValues as any).onQuote
          ? null
          : initialValues.minPrice ?? null,
        maxPrice: (initialValues as any).onQuote
          ? null
          : initialValues.maxPrice ?? null,
      }));

      // Map API sections (with contents[]) to local drafts
      const apiSections: any[] = (initialValues as any).sections || [];
      if (apiSections.length > 0) {
        const mapped = apiSections.map((s) => {
          const contents: any[] = s.contents || s.content || [];
          const text = Array.isArray(contents)
            ? contents
                .map((c) => c?.content)
                .filter(Boolean)
                .join("\n\n")
            : "";
          const imgs = Array.isArray(contents)
            ? contents.flatMap((c) =>
                (c?.images || []).map((im: any) => ({ url: im?.url || im }))
              )
            : [];
          return { title: s.title || "", content: text, images: imgs };
        });
        setSections(mapped);
      }
    }
  }, [initialValues]);

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
      if (!values.title || values.title.trim().length < 3) {
        setError("Veuillez renseigner le titre");
        return;
      }
      if (!sections[0]?.title || !sections[0]?.content) {
        setError(
          "Veuillez renseigner le titre et la description de la première section"
        );
        return;
      }
      const minP = values.onQuote ? null : values.minPrice ?? null;
      const maxP = values.onQuote ? null : values.maxPrice ?? null;
      if (minP !== null && minP < 0) {
        setError("Le prix minimum ne peut pas être négatif");
        return;
      }
      if (maxP !== null && maxP < 0) {
        setError("Le prix maximum ne peut pas être négatif");
        return;
      }
      if (minP !== null && maxP !== null && maxP < minP) {
        setError("Le prix maximum doit être supérieur ou égal au prix minimum");
        return;
      }
      // Transformer les sections locales (title, content, images[]) vers le format API
      const mappedSections = sections.map((s) => ({
        title: s.title,
        contents: s.content
          ? [
              {
                content: s.content,
                images: (s.images || []).map((im) => ({ url: im.url })),
              },
            ]
          : [],
      }));

      const payload: ServiceFormValues = {
        ...values,
        minPrice: values.onQuote ? null : minP === null ? null : Number(minP),
        maxPrice: values.onQuote ? null : maxP === null ? null : Number(maxP),
        summary: values.summary || "",
        sections: mappedSections as any,
        // Exposer les tags sélectionnés côté payload si besoin
        tags: (values as any).tags ?? tagSlugs,
      };
      await onSubmit(payload);
    } catch (err: any) {
      setError(err?.message || "Erreur lors de la soumission");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: "85%", marginInline: "auto" }}
    >
      <Column gap="16" padding="24" fillWidth>
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
            label="Résumé"
            placeholder=""
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
            accept=".png,.jpg,.jpeg,.webp,.avif"
            style={{ display: "none" }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(
                "coverImageFile",
                e.target.files && e.target.files[0] ? e.target.files[0] : null
              )
            }
          />
          <CustomButton
            variant="secondary"
            onClick={(e: any) => {
              e.preventDefault();
              coverInputRef.current?.click();
            }}
          >
            Choisir une image de couverture
          </CustomButton>
          {values.coverImageFile && (
            <Text variant="body-default-s" color="neutral-medium">
              {values.coverImageFile.name}
            </Text>
          )}
        </Column>
        {/* Champ slug supprimé de l'UI */}
        {!values.onQuote && (
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
        )}
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
            {t.priceHelp}
          </Text>
        )}
        {/* Champ durée estimée retiré (non dans l'interface Service) */}
        <Flex gap="16" wrap>
          <Checkbox
            id="isActive"
            label="Rendre le service actif"
            checked={Boolean(values.isActive)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("isActive", e.target.checked)
            }
          />
          <Checkbox
            id="isFeatured"
            label="Le mettre en avant"
            checked={Boolean(values.isFeatured)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleChange("isFeatured", e.target.checked)
            }
          />
        </Flex>

        <Column gap="12">
          <Text variant="heading-strong-s">{t.describeHeading}</Text>
          {sections.map((section, index) => (
            <Column
              key={index}
              border="neutral-alpha-medium"
              radius="m"
              style={{ padding: 16 }}
            >
              <Flex horizontal="space-between" vertical="center">
                <Text variant="label-default-m">Section {index + 1}</Text>
                <IconButton
                  icon="close"
                  variant="tertiary"
                  tooltip="Supprimer la section"
                  onClick={(e: any) => {
                    e.preventDefault();
                    setSections((prev) => {
                      const next = prev.filter((_, i) => i !== index);
                      return next.length > 0
                        ? next
                        : [{ title: "", content: "", images: [] }];
                    });
                  }}
                />
              </Flex>
              <Column gap="12">
                <Input
                  id={`section-title-${index}`}
                  label="Donner un titre à votre section"
                  value={section.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateSectionTitle(index, e.target.value)
                  }
                />
                <Column gap="8">
                  <Textarea
                    id={`section-content-${index}`}
                    label="Paragraphe"
                    value={section.content}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      updateSectionContent(index, e.target.value)
                    }
                    required={index === 0}
                  />
                </Column>
                <Column gap="8">
                  <input
                    id={`section-image-file-${index}`}
                    type="file"
                    accept=".png,.jpg,.jpeg,.webp,.avif"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files && e.target.files[0];
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setNewImage({ url });
                        // ajouter directement l'image à la section
                        setSections((prev) =>
                          prev.map((s, i) =>
                            i === index
                              ? { ...s, images: [...s.images, { url }] }
                              : s
                          )
                        );
                      }
                    }}
                  />
                  {section.images.length > 0 && (
                    <Column gap="4">
                      {section.images.map((img, ii) => (
                        <Flex
                          key={ii}
                          horizontal="space-between"
                          vertical="center"
                        >
                          <Text>{img.url}</Text>
                          <CustomButton
                            variant="secondary"
                            onClick={(e: any) => {
                              e.preventDefault();
                              removeImageFromSection(index, ii);
                            }}
                          >
                            Supprimer
                          </CustomButton>
                        </Flex>
                      ))}
                    </Column>
                  )}
                </Column>
              </Column>
            </Column>
          ))}
          <CustomButton
            onClick={(e: any) => {
              e.preventDefault();
              addSection();
            }}
          >
            Ajouter une section ?
          </CustomButton>
        </Column>

        {/* Tags */}
        <Column gap="8">
          <Text variant="heading-strong-s">{t.tagsHeading}</Text>
          <ContentTags selected={tagSlugs} onChange={setTagSlugs} />
        </Column>

        {error && (
          <Text variant="body-default-s" color="error">
            {error}
          </Text>
        )}

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? submittingLabel : submitLabel}
        </Button>
      </Column>
    </form>
  );
}
