"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Fade,
  Flex,
  Line,
  ToggleButton,
  SmartLink,
} from "@/once-ui/components";
import styles from "@/components/Header.module.scss";

import { routes, display } from "@/app/resources";
import { person, about, blog, service } from "@/app/resources/content";
import { ThemeToggle } from "./ThemeToggle";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string;
};

const TimeDisplay: React.FC<TimeDisplayProps> = ({
  timeZone,
  locale = "en-GB",
}) => {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const timeString = new Intl.DateTimeFormat(locale, options).format(now);
      setCurrentTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [timeZone, locale]);

  return <>{currentTime}</>;
};

export const ProviderHeader = () => {
  const pathname = usePathname() ?? "";

  // Extraire le slug du provider depuis le pathname
  const pathSegments = pathname.split("/");
  const providerSlug = pathSegments[2]; // /providers/[slug]/...

  // Chemins dynamiques pour le provider
  const homePath = `/providers/${providerSlug}`;
  const aboutPath = `/providers/${providerSlug}/about`;
  const servicePath = `/providers/${providerSlug}/service`;
  const blogPath = `/providers/${providerSlug}/blog`;

  return (
    <>
      <Fade hide="s" fillWidth position="fixed" height="80" zIndex={9} />
      <Fade
        show="s"
        fillWidth
        position="fixed"
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Flex
        fitHeight
        position="unset"
        className={styles.position}
        as="header"
        zIndex={9}
        fillWidth
        padding="8"
        horizontal="center"
        data-border="rounded"
      >
        <Flex
          paddingLeft="12"
          fillWidth
          vertical="center"
          textVariant="body-default-s"
          gap="8"
        >
          <SmartLink href="/" unstyled>
            <img
              src="/trademark/Modern-_skAi_-Typography-Design.svg"
              alt="Logo"
              style={{ height: "4rem", width: "auto", filter: "invert(1)" }}
            />
          </SmartLink>
          {display.location && <Flex hide="s">{person.location}</Flex>}
        </Flex>
        <Flex fillWidth horizontal="center">
          <Flex
            background="surface"
            border="neutral-alpha-medium"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
            zIndex={1}
          >
            <Flex gap="4" vertical="center" textVariant="body-default-s">
              <ToggleButton
                prefixIcon="home"
                href={homePath}
                label="Portfolio"
                selected={pathname === homePath}
              />
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="person"
                href={aboutPath}
                label="À propos"
                selected={pathname === aboutPath}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="person"
                href={aboutPath}
                selected={pathname === aboutPath}
              />
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="grid"
                href={servicePath}
                label="Services"
                selected={pathname === servicePath}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="grid"
                href={servicePath}
                selected={pathname === servicePath}
              />
              <ToggleButton
                className="s-flex-hide"
                prefixIcon="book"
                href={blogPath}
                label="Blog"
                selected={pathname === blogPath}
              />
              <ToggleButton
                className="s-flex-show"
                prefixIcon="book"
                href={blogPath}
                selected={pathname === blogPath}
              />
              {display.themeSwitcher && (
                <>
                  <Line background="neutral-alpha-medium" vert maxHeight="24" />
                  <ThemeToggle />
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex hide="s">
              {display.time && <TimeDisplay timeZone={person.location} />}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
