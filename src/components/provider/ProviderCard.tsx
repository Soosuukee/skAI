"use client";

import { Card, Flex, Avatar, Heading, Text, Chip } from "@/once-ui/components";
import { Provider } from "@/app/resources/providers";

interface ProviderCardProps {
  provider: Provider;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    <Card padding="12" radius="l" gap="12" vertical="center">
      <Avatar src={provider.avatar} size="l" />
      <Flex direction="column" gap="4">
        <Heading as="h3" variant="heading-strong-s">
          {provider.name}
        </Heading>
        <Text variant="body-default-s" onBackground="neutral-medium">
          {provider.profession} – {provider.country}
        </Text>
        <Flex gap="4" wrap>
          {provider.technologies.map((tech) => (
            <Chip key={tech} label={tech} selected={false} />
          ))}
        </Flex>
      </Flex>
    </Card>
  );
};
