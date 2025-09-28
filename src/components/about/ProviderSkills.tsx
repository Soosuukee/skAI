"use client";

import React from "react";
import { Column, Flex, Heading, Text } from "@/once-ui/components";
import { SoftSkill } from "@/app/types/softskill";
import { HardSkill } from "@/app/types/hardskill";

interface ProviderSkillsProps {
  hardSkills: HardSkill[];
  softSkills: SoftSkill[];
}

export function ProviderSkills({
  hardSkills,
  softSkills,
}: ProviderSkillsProps) {
  if (
    (!hardSkills || hardSkills.length === 0) &&
    (!softSkills || softSkills.length === 0)
  ) {
    return null;
  }

  return (
    <>
      <Heading
        as="h2"
        id="Mes Technologies et Compétences"
        variant="display-strong-s"
        marginBottom="40"
      >
        Mes Technologies et Compétences
      </Heading>
      <Column fillWidth gap="l">
        {hardSkills && hardSkills.length > 0 && (
          <Column fillWidth gap="m">
            <Text variant="heading-strong-l">Hard Skills</Text>
            <Column as="ul" gap="s" paddingLeft="m">
              {hardSkills.map((skill, index) => (
                <Text
                  key={`hard-${skill.id || index}`}
                  as="li"
                  variant="body-default-m"
                  onBackground="neutral-weak"
                >
                  {skill.title}
                </Text>
              ))}
            </Column>
          </Column>
        )}

        {softSkills && softSkills.length > 0 && (
          <Column fillWidth gap="m">
            <Text variant="heading-strong-l">Soft Skills</Text>
            <Column as="ul" gap="s" paddingLeft="m">
              {softSkills.map((skill, index) => (
                <Text
                  key={`soft-${skill.id || index}`}
                  as="li"
                  variant="body-default-m"
                  onBackground="neutral-weak"
                >
                  {skill.title}
                </Text>
              ))}
            </Column>
          </Column>
        )}
      </Column>
    </>
  );
}
