import { Flex, SmartLink, Text } from "@/once-ui/components";
import { person } from "@/app/resources/content";
import styles from "./Footer.module.scss";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Flex
      as="footer"
      fillWidth
      padding="8"
      horizontal="center"
      mobileDirection="column"
    >
      <Flex
        className={styles.mobile}
        maxWidth="m"
        paddingY="8"
        paddingX="16"
        gap="16"
        horizontal="space-between"
        vertical="center"
      >
        <Text variant="body-default-s" onBackground="neutral-strong">
          <Text paddingX="4">{person.name}</Text>
          <Text onBackground="neutral-weak">
            {/* Usage of this template requires attribution. Please don't remove the link to Once UI. */}
            / skAi Powered by{" "}
            <SmartLink href="https://services.ceo/">Services CEO</SmartLink>
          </Text>
        </Text>
      </Flex>
      <Flex height="80" show="s"></Flex>
    </Flex>
  );
};
