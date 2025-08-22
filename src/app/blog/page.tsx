import { Column, Heading } from "@/once-ui/components";

import { CustomRevealFx } from "@/components/CustomRevealFx";
import { Posts } from "@/components/blog/Posts";
import { baseURL } from "@/app/resources";
import { blog, person } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default function Blog() {
  return (
    <>
      <Column maxWidth="s">
        <Schema
          as="blog"
          baseURL={baseURL}
          title={blog.title}
          description={blog.description}
          path={blog.path}
          image={`${baseURL}/og?title=${encodeURIComponent(blog.title)}`}
          author={{
            name: person.name,
            url: `${baseURL}/blog`,
            image: `${baseURL}${person.avatar}`,
          }}
        />
        <CustomRevealFx translateY={4} fillWidth delay={0.1}>
          <Heading marginBottom="l" variant="display-strong-s">
            {blog.title}
          </Heading>
        </CustomRevealFx>
        <Column fillWidth flex={1}>
          <CustomRevealFx translateY={4} fillWidth delay={0.2}>
            <Posts range={[1, 1]} thumbnail direction="column" />
          </CustomRevealFx>
          <CustomRevealFx translateY={4} fillWidth delay={0.3}>
            <Posts range={[2, 3]} thumbnail />
          </CustomRevealFx>
          <CustomRevealFx translateY={4} fillWidth delay={0.4}>
            <Posts range={[4]} thumbnail />
          </CustomRevealFx>
        </Column>
      </Column>
    </>
  );
}
