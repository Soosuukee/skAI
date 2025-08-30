import { Column } from "@/once-ui/components";

import { service } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import { AllServices } from "@/components/service/AllServices";
import { RevealFx } from "@/once-ui/components";
import { Heading } from "@/once-ui/components";

export async function generateMetadata() {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return Meta.generate({
    title: service.title,
    description: service.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(service.title)}`,
    path: service.path,
  });
}

function ServiceContent() {
  const baseURL =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return (
    <Column maxWidth="m">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={service.path}
        title={service.title}
        description={service.description}
        image={`${baseURL}/og?title=${encodeURIComponent(service.title)}`}
        author={{ name: "", url: baseURL, image: "/images/avatar.jpg" }}
      />
      <RevealFx
        fillWidth
        horizontal="start"
        paddingTop="16"
        paddingBottom="32"
        paddingLeft="12"
      >
        <AllServices />
      </RevealFx>
    </Column>
  );
}

export default function Service() {
  return (
    <>
      <ServiceContent />
    </>
  );
}
