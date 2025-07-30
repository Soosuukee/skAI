import { Column } from "@/once-ui/components";
import BrandSetter from "@/components/BrandSetter";
import { baseURL } from "@/app/resources";
import { about, person, service } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { Services } from "@/components/service/Services";
import { RevealFx } from "@/once-ui/components";
import { Heading } from "@/once-ui/components";

export async function generateMetadata() {
  return Meta.generate({
    title: service.title,
    description: service.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(service.title)}`,
    path: service.path,
  });
}

function ServiceContent() {
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={service.path}
        title={service.title}
        description={service.description}
        image={`${baseURL}/og?title=${encodeURIComponent(service.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <RevealFx
        fillWidth
        horizontal="start"
        paddingTop="16"
        paddingBottom="32"
        paddingLeft="12"
      >
        <Heading as="h1" marginBottom="16" variant="display-strong-s">
          {service.title}
        </Heading>
        <Services />
      </RevealFx>
    </Column>
  );
}

export default function Service() {
  return (
    <>
      <BrandSetter brand="red" />
      <ServiceContent />
    </>
  );
}
