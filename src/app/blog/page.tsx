"use client";

import { Column, Heading } from "@/once-ui/components";

import { CustomRevealFx } from "@/components/CustomRevealFx";
import { Posts } from "@/components/blog/Posts";
import { Meta, Schema } from "@/once-ui/modules";

export default function Blog() {
  // Utiliser une URL relative ou par défaut
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  const pageTitle = "Articles";
  const pageDescription = "Dernières publications";

  return (
    <>
      <Column maxWidth="s">
        <Schema
          as="blog"
          baseURL={baseURL}
          title={pageTitle}
          description={pageDescription}
          path="/blog"
          author={{ name: "", url: "/blog", image: "/images/avatar.jpg" }}
        />
        <CustomRevealFx translateY={4} fillWidth delay={0.1}>
          <Heading marginBottom="l" variant="display-strong-s">
            {pageTitle}
          </Heading>
        </CustomRevealFx>
        <Column fillWidth flex={1}>
          <CustomRevealFx translateY={4} fillWidth delay={0.2}>
            <Posts thumbnail />
          </CustomRevealFx>
        </Column>
      </Column>
    </>
  );
}
