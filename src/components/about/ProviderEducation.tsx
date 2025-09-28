"use client";

import React from "react";
import { Column, Flex, Heading, SmartImage, Text } from "@/once-ui/components";
import { Education } from "@/app/types/education";

// Fonction utilitaire pour formater les dates en mois/année
const formatDateToMonthYear = (dateString: string): string => {
  // Vérifier si la date est valide
  if (!dateString || dateString.trim() === "") {
    return "Date non disponible";
  }

  const date = new Date(dateString);

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    console.warn("Date invalide:", dateString);
    return "Date invalide";
  }

  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

interface ProviderEducationProps {
  educations: Education[];
  makeAbsolute: (url?: string) => string | undefined;
}

export function ProviderEducation({
  educations,
  makeAbsolute,
}: ProviderEducationProps) {
  if (!educations || educations.length === 0) {
    return null;
  }

  return (
    <>
      <Heading
        as="h2"
        id="Études et Formation"
        variant="display-strong-s"
        marginBottom="m"
      >
        Études et Formation
      </Heading>
      <Column fillWidth gap="l" marginBottom="40">
        {educations.map((education, index) => (
          <Column
            key={`${education.institutionName}-${education.id}-${index}`}
            fillWidth
            gap="4"
          >
            <Text variant="heading-strong-xl">{education.title}</Text>
            <Text id={education.institutionName} variant="label-default-l">
              {education.institutionName}
            </Text>
            <Text variant="heading-default-xs" onBackground="brand-strong">
              {formatDateToMonthYear(education.startDate)} -{" "}
              {education.endDate
                ? formatDateToMonthYear(education.endDate)
                : "En cours"}
            </Text>
            <Text variant="heading-default-xs" onBackground="neutral-weak">
              {education.description}
            </Text>
            {education.institutionImage && (
              <Flex fillWidth paddingTop="m" paddingLeft="40" wrap>
                <Flex
                  border="neutral-medium"
                  radius="m"
                  minWidth={20}
                  height={10}
                  overflow="hidden"
                  style={{ objectFit: "contain" }}
                >
                  <SmartImage
                    enlarge
                    radius="m"
                    sizes="60"
                    alt={education.institutionName}
                    src={makeAbsolute(education.institutionImage) || ""}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Flex>
              </Flex>
            )}
          </Column>
        ))}
      </Column>
    </>
  );
}
