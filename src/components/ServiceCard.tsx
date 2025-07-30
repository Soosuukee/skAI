import React from "react";
import Link from "next/link";
import { service } from "@/app/resources/content";
import { SmartImage, Flex } from "@/once-ui/components";

interface ServiceCardProps {
  slug: string;
  title: string;
  summary: string;
  image: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  slug,
  title,
  summary,
  image,
}) => {
  const href = `${service.path}/${slug}`;
  return (
    <Link href={href} style={{ textDecoration: "none", color: "inherit" }}>
      <Flex
        className="service-card"
        direction="row"
        overflow="hidden"
        radius="l"
        border="neutral-alpha-medium"
        style={{ margin: "1rem 0" }}
        mobileDirection="column"
      >
        {image && (
          <Flex style={{ flex: "0 0 35%" }}>
            <SmartImage src={image} alt={title} aspectRatio="16/9" />
          </Flex>
        )}
        <Flex flex="1" padding="16" direction="column" gap="8">
          <h3 style={{ margin: 0 }}>{title}</h3>
          <p style={{ color: "var(--neutral-weak)", margin: 0 }}>{summary}</p>
          <span style={{ color: "var(--brand)", fontWeight: 600 }}>
            En savoir plus
          </span>
        </Flex>
      </Flex>
    </Link>
  );
};
