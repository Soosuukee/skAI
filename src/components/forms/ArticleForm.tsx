"use client";

import React, { useRef, useState } from "react";
import {
  Column,
  Input,
  Textarea,
  CustomButton,
  Text,
  Card,
  Flex,
  Checkbox,
  DateInput,
} from "@/once-ui/components";
import { Article } from "@/app/types/article";
import {
  formatLocalDateYYYYMMDD,
  parseYYYYMMDDToLocalDate,
} from "@/app/utils/date";

export type ArticleFormValues = Omit<
  Article,
  "articleId" | "sections" | "tags" | "articleCover" | "providerId"
> & {
  articleCoverFile?: File | null;
  sectionsDraft?: SectionDraft[];
};

interface ArticleFormProps {
  initialValues?: Partial<ArticleFormValues>;
  onSubmit: (values: ArticleFormValues) => Promise<void> | void;
  submittingLabel?: string;
  submitLabel?: string;
}

const defaultValues: ArticleFormValues = {
  languageId: 1,
  title: "",
  slug: "",
  publishedAt: "",
  summary: "",
  isPublished: false,
  isFeatured: false,
  articleCoverFile: null,
};

type ContentImageDraft = { url: string };
type ContentDraft = { content: string; images: ContentImageDraft[] };
type SectionDraft = { title: string; contents: ContentDraft[] };

export default function ArticleForm({
  initialValues,
  onSubmit,
  submittingLabel = "Enregistrement...",
  submitLabel = "Enregistrer",
}: ArticleFormProps) {
  const [values, setValues] = useState<ArticleFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const [sections, setSections] = useState<SectionDraft[]>([
    { title: "", contents: [{ content: "", images: [] }] },
  ]);
  const [newImage, setNewImage] = useState<{ url: string }>({ url: "" });

  const handleChange = (field: keyof ArticleFormValues, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
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
      if (!values.publishedAt) {
        setError("Veuillez renseigner la date de publication");
        return;
      }
      const payload: ArticleFormValues = {
        ...values,
        // Always generate slug from title (user cannot edit slug)
        slug: values.title
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        summary: values.summary || "",
        sectionsDraft: sections,
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

          <Flex gap="8" wrap>
            <DateInput
              id="publishedAt"
              label="Date de publication"
              value={parseYYYYMMDDToLocalDate(values.publishedAt)}
              onChange={(d: Date) =>
                handleChange("publishedAt", formatLocalDateYYYYMMDD(d))
              }
              floatingPlacement="right-start"
              monthYearSelector
            />
          </Flex>
          {/* Sections */}
          <Column gap="12">
            <Text variant="heading-strong-s">Sections</Text>
            {sections.map((section, si) => (
              <Card key={si} style={{ padding: 16 }}>
                <Column gap="12">
                  <Input
                    id={`section-title-${si}`}
                    label={`Titre de la section ${si + 1}`}
                    value={section.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSections((prev) =>
                        prev.map((s, i) =>
                          i === si ? { ...s, title: e.target.value } : s
                        )
                      )
                    }
                  />
                  {section.contents.map((content, ci) => (
                    <Card key={ci} style={{ padding: 12 }}>
                      <Column gap="8">
                        <Textarea
                          id={`section-${si}-content-${ci}`}
                          label={`Contenu ${ci + 1}`}
                          value={content.content}
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) =>
                            setSections((prev) =>
                              prev.map((s, i) =>
                                i !== si
                                  ? s
                                  : {
                                      ...s,
                                      contents: s.contents.map((c, j) =>
                                        j === ci
                                          ? { ...c, content: e.target.value }
                                          : c
                                      ),
                                    }
                              )
                            )
                          }
                        />
                        {/* Images for this content block */}
                        <Column gap="4">
                          {content.images.length > 0 && (
                            <Column gap="4">
                              {content.images.map((img, ii) => (
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
                                      setSections((prev) =>
                                        prev.map((s, i) =>
                                          i !== si
                                            ? s
                                            : {
                                                ...s,
                                                contents: s.contents.map(
                                                  (c, j) =>
                                                    j !== ci
                                                      ? c
                                                      : {
                                                          ...c,
                                                          images:
                                                            c.images.filter(
                                                              (_img, idx) =>
                                                                idx !== ii
                                                            ),
                                                        }
                                                ),
                                              }
                                        )
                                      );
                                    }}
                                  >
                                    Supprimer
                                  </CustomButton>
                                </Flex>
                              ))}
                            </Column>
                          )}
                          <Flex gap="8">
                            <Input
                              id={`section-${si}-content-${ci}-image-url`}
                              label="URL image"
                              value={newImage.url}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => setNewImage({ url: e.target.value })}
                            />
                            <CustomButton
                              variant="secondary"
                              onClick={(e: any) => {
                                e.preventDefault();
                                if (!newImage.url.trim()) return;
                                setSections((prev) =>
                                  prev.map((s, i) =>
                                    i !== si
                                      ? s
                                      : {
                                          ...s,
                                          contents: s.contents.map((c, j) =>
                                            j !== ci
                                              ? c
                                              : {
                                                  ...c,
                                                  images: [
                                                    ...c.images,
                                                    {
                                                      url: newImage.url.trim(),
                                                    },
                                                  ],
                                                }
                                          ),
                                        }
                                  )
                                );
                                setNewImage({ url: "" });
                              }}
                            >
                              Ajouter image
                            </CustomButton>
                          </Flex>
                        </Column>
                      </Column>
                    </Card>
                  ))}
                  <CustomButton
                    variant="secondary"
                    onClick={(e: any) => {
                      e.preventDefault();
                      setSections((prev) =>
                        prev.map((s, i) =>
                          i === si
                            ? {
                                ...s,
                                contents: [
                                  ...s.contents,
                                  { content: "", images: [] },
                                ],
                              }
                            : s
                        )
                      );
                    }}
                  >
                    Ajouter un bloc de contenu
                  </CustomButton>
                </Column>
              </Card>
            ))}
            <CustomButton
              onClick={(e: any) => {
                e.preventDefault();
                setSections((prev) => [
                  ...prev,
                  { title: "", contents: [{ content: "", images: [] }] },
                ]);
              }}
            >
              Ajouter une section
            </CustomButton>
          </Column>
          <Column gap="8">
            <Textarea
              id="summary"
              label="Résumé"
              value={values.summary}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("summary", e.target.value)
              }
            />
          </Column>
          <Flex gap="16" wrap>
            <Checkbox
              id="isPublished"
              label="Publié"
              checked={Boolean(values.isPublished)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("isPublished", e.target.checked)
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

          <Column gap="8">
            <input
              ref={coverInputRef}
              id="articleCoverFile"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(
                  "articleCoverFile",
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
            {values.articleCoverFile && (
              <Text variant="body-default-s" color="neutral-medium">
                {values.articleCoverFile.name}
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
            onClick={() => {}}
            aria-disabled={loading}
          >
            {loading ? submittingLabel : submitLabel}
          </CustomButton>
        </Column>
      </form>
    </Card>
  );
}
