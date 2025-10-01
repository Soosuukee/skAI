"use client";

import React from "react";
import {
  Column,
  Text,
  DropdownWrapper,
  Input,
  Option,
  Flex,
} from "@/once-ui/components";
import { useTags } from "@/app/hooks/services/useTags";

interface ContentTagsProps {
  selected: string[]; // slugs or titles
  onChange: (next: string[]) => void;
  label?: string;
}

export const ContentTags: React.FC<ContentTagsProps> = ({
  selected,
  onChange,
  label = "Tags",
}) => {
  const { tags, loading, error } = useTags();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((o) => o.value);
    onChange(values);
  };

  return (
    <Column gap="8">
      <Text variant="heading-strong-s">{label}</Text>
      {loading && <Text onBackground="neutral-weak">Chargement des tags…</Text>}
      {error && <Text color="error">{error}</Text>}
      {!loading && !error && (
        <DropdownWrapper
          trigger={
            <Input
              labelAsPlaceholder
              label="Sélectionner des tags"
              value={selected.join(", ")}
              readOnly
            />
          }
          dropdown={
            <Flex direction="column" padding="4" gap="2">
              {tags.map((t) => {
                const value = t.title;
                const isChecked = selected.includes(value);
                return (
                  <Option
                    key={value}
                    value={value}
                    label={value}
                    selected={isChecked}
                    onClick={() => {
                      const set = new Set(selected);
                      if (set.has(value)) set.delete(value);
                      else set.add(value);
                      onChange(Array.from(set));
                    }}
                  />
                );
              })}
            </Flex>
          }
        />
      )}
      {/* Native multiple select invisible pour gestion clavier/lecture, garde multi-sélection */}
      {!loading && !error && (
        <select
          multiple
          value={selected}
          onChange={handleChange}
          style={{
            position: "absolute",
            opacity: 0,
            pointerEvents: "none",
            height: 0,
          }}
        >
          {tags.map((t) => (
            <option key={t.title} value={t.title}>
              {t.title}
            </option>
          ))}
        </select>
      )}
    </Column>
  );
};
