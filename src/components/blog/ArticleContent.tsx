import React from "react";
import {
  Heading,
  Text,
  SmartImage,
  SmartLink,
  RevealFx,
} from "@/once-ui/components";
import { CodeBlock } from "@/once-ui/modules/code/CodeBlock";
import { ArticleSection } from "@/app/utils/articleUtils";

interface ArticleContentProps {
  sections: ArticleSection[];
}

export default function ArticleContent({ sections }: ArticleContentProps) {
  const renderLink = (item: string | { text: string; url: string }) => {
    if (typeof item === "string") {
      return <SmartLink href="#">{item}</SmartLink>;
    } else {
      return <SmartLink href={item.url || "#"}>{item.text}</SmartLink>;
    }
  };

  const renderSection = (section: ArticleSection, index: number) => {
    const delay = (index + 1) * 0.1;

    switch (section.type) {
      case "heading":
        return (
          <RevealFx key={index} translateY={4} delay={delay}>
            <Heading
              variant={
                section.level === 1 ? "display-strong-s" : "heading-strong-l"
              }
              marginBottom="m"
              marginTop={section.level === 1 ? "0" : "xl"}
            >
              {section.content}
            </Heading>
          </RevealFx>
        );

      case "paragraph":
        return (
          <RevealFx key={index} translateY={4} delay={delay}>
            <Text variant="body-default-l" marginBottom="m">
              {section.content}
            </Text>
          </RevealFx>
        );

      case "code":
        return (
          <RevealFx key={index} translateY={4} delay={delay}>
            <CodeBlock
              marginBottom="16"
              codeInstances={[
                {
                  code: section.content || "",
                  language: section.language || "text",
                  label: section.language || "Code",
                },
              ]}
            />
          </RevealFx>
        );

      case "list":
        return (
          <RevealFx key={index} translateY={4} delay={delay}>
            <ul style={{ marginBottom: "1rem", paddingLeft: "1.5rem" }}>
              {section.items?.map((item, itemIndex) => (
                <li key={itemIndex} style={{ marginBottom: "0.5rem" }}>
                  {typeof item === "string" ? (
                    <Text variant="body-default-l">{item}</Text>
                  ) : "text" in item && "url" in item ? (
                    <Text variant="body-default-l">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.text}
                      </a>
                    </Text>
                  ) : null}
                </li>
              ))}
            </ul>
          </RevealFx>
        );

      case "image":
        return (
          <RevealFx key={index} translateY={4} delay={delay}>
            <SmartImage
              src={section.src || ""}
              alt={section.alt || ""}
              aspectRatio={section.aspectRatio || "16/9"}
              radius="l"
              marginBottom="l"
            />
          </RevealFx>
        );

      case "links":
        return (
          <RevealFx key={index} translateY={4} delay={delay}>
            <div style={{ marginBottom: "1rem" }}>
              {section.items?.map((item, itemIndex) => (
                <div key={itemIndex} style={{ marginBottom: "0.5rem" }}>
                  {renderLink(item)}
                </div>
              ))}
            </div>
          </RevealFx>
        );

      default:
        return null;
    }
  };

  return (
    <div>{sections.map((section, index) => renderSection(section, index))}</div>
  );
}
