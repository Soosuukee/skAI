"use client";

import React from "react";
import { Column, Flex, Heading, SmartImage, Text } from "@/once-ui/components";
import { Experience } from "@/app/types/experience";

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

interface ProviderExperiencesProps {
  experiences: Experience[];
  makeAbsolute: (url?: string) => string | undefined;
}

export function ProviderExperiences({
  experiences,
  makeAbsolute,
}: ProviderExperiencesProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  // Debug pour voir les dates reçues
  console.log("=== DEBUG EXPERIENCES ===");
  experiences.forEach((exp, index) => {
    console.log(`Expérience ${index}:`, {
      companyName: exp.companyName,
      startDate: exp.startDate,
      endDate: exp.endDate,
      startDateType: typeof exp.startDate,
      endDateType: typeof exp.endDate,
    });
  });
  console.log("=== END DEBUG ===");

  return (
    <>
      <Heading
        as="h2"
        id="Expérience professionnelle"
        variant="display-strong-s"
        marginBottom="m"
      >
        Mon expérience professionnelle
      </Heading>
      <Column fillWidth gap="l" marginBottom="40">
        {experiences.map((experience, index) => (
          <Column
            key={`${experience.companyName}-${experience.title}-${index}`}
            fillWidth
          >
            <Flex
              fillWidth
              horizontal="space-between"
              vertical="end"
              marginBottom="4"
            >
              <Text id={experience.companyName} variant="heading-strong-l">
                {experience.companyName}
              </Text>
              <Text variant="heading-default-xs" onBackground="neutral-weak">
                {formatDateToMonthYear(experience.startDate)} -{" "}
                {experience.endDate
                  ? formatDateToMonthYear(experience.endDate)
                  : "Présent"}
              </Text>
            </Flex>
            <Text
              variant="body-default-s"
              onBackground="brand-weak"
              marginBottom="m"
            >
              {experience.title}
            </Text>
            <Column as="ul" gap="16">
              {experience.firstTask && (
                <Text as="li" variant="body-default-m">
                  {experience.firstTask}
                </Text>
              )}
              {experience.secondTask && (
                <Text as="li" variant="body-default-m">
                  {experience.secondTask}
                </Text>
              )}
              {experience.thirdTask && (
                <Text as="li" variant="body-default-m">
                  {experience.thirdTask}
                </Text>
              )}
            </Column>
            {experience.companyLogo && (
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
                    alt={experience.companyName}
                    src={makeAbsolute(experience.companyLogo) || ""}
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
