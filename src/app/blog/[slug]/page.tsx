import { notFound } from "next/navigation";
import BrandSetter from "@/components/BrandSetter";

import {
  AvatarGroup,
  Button,
  Column,
  Heading,
  HeadingNav,
  Icon,
  Row,
  Text,
} from "@/once-ui/components";
import { about, blog, person, baseURL } from "@/app/resources";
import { formatDate } from "@/app/utils/formatDate";
import ScrollToHash from "@/components/ScrollToHash";
import { Metadata } from "next";
import { Meta, Schema } from "@/once-ui/modules";
import {
  getArticleBySlug,
  getArticleSlugs,
  Article,
} from "@/app/utils/articleUtils";
import ArticleContent from "@/components/blog/ArticleContent";

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = getArticleSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const article = getArticleBySlug(slugPath);

  if (!article) return {};

  return Meta.generate({
    title: article.title,
    description: article.summary,
    baseURL: baseURL,
    image: article.image
      ? `${baseURL}${article.image}`
      : `${baseURL}/og?title=${article.title}`,
    path: `${blog.path}/${article.slug}`,
  });
}

export default async function Blog({
  params,
}: {
  params: Promise<{ slug: string | string[] }>;
}) {
  const routeParams = await params;
  const slugPath = Array.isArray(routeParams.slug)
    ? routeParams.slug.join("/")
    : routeParams.slug || "";

  const article = getArticleBySlug(slugPath);

  if (!article) {
    notFound();
  }

  return (
    <>
      <BrandSetter brand="green" />
      <Row fillWidth>
        <Row maxWidth={12} hide="m" />
        <Row fillWidth horizontal="center">
          <Column as="section" maxWidth="xs" gap="l">
            <Schema
              as="blogPosting"
              baseURL={baseURL}
              path={`${blog.path}/${article.slug}`}
              title={article.title}
              description={article.summary}
              datePublished={article.published_at}
              dateModified={article.published_at}
              image={`${baseURL}/og?title=${encodeURIComponent(article.title)}`}
              author={{
                name: person.name,
                url: `${baseURL}${about.path}`,
                image: `${baseURL}${person.avatar}`,
              }}
            />
            <Button
              data-border="rounded"
              href="/blog"
              weight="default"
              variant="tertiary"
              size="s"
              prefixIcon="chevronLeft"
            >
              Posts
            </Button>
            <Heading variant="display-strong-s">{article.title}</Heading>
            <Row gap="12" vertical="center">
              <Text variant="body-default-s" onBackground="neutral-weak">
                {article.published_at && formatDate(article.published_at)}
              </Text>
              {article.tag && (
                <Text variant="label-default-s" onBackground="neutral-weak">
                  {article.tag}
                </Text>
              )}
            </Row>
            <Column as="article" fillWidth>
              <ArticleContent sections={article.content.sections} />
            </Column>
            <ScrollToHash />
          </Column>
        </Row>
        <Column
          maxWidth={12}
          paddingLeft="40"
          fitHeight
          position="sticky"
          top="80"
          gap="16"
          hide="m"
        >
          <Row
            gap="12"
            paddingLeft="2"
            vertical="center"
            onBackground="neutral-medium"
            textVariant="label-default-s"
          ></Row>
          <HeadingNav fitHeight />
        </Column>
      </Row>
    </>
  );
}
