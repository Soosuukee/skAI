"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Fade,
  Flex,
  Line,
  ToggleButton,
  SmartLink,
  Button,
  Text,
} from "@/once-ui/components";
import styles from "@/components/Header.module.scss";

import { routes, display } from "@/app/resources";
import { person, about, blog, service } from "@/app/resources/content";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/app/contexts/AuthContext";
import { LoginButton } from "./auth/LoginButton";
import { UserMenu } from "./auth/UserMenu";
import { JoinButton } from "./auth/JoinButton";

type TimeDisplayProps = {
  timeZone: string;
  locale?: string; // Optionally allow locale, defaulting to 'en-GB'
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

export default TimeDisplay;

type HeaderProps = {
  showLogo?: boolean;
};

export const Header = ({ showLogo = true }: HeaderProps) => {
  const pathname = usePathname() ?? "";
  const { user, isLoading } = useAuth();

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
          {showLogo && (
            <SmartLink href="/" unstyled>
              <img
                src="/trademark/Modern-_skAi_-Typography-Design.svg"
                alt="Logo"
                style={{ height: "4rem", width: "auto", filter: "invert(1)" }}
              />
            </SmartLink>
          )}
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
              {routes["/"] && (
                <ToggleButton
                  prefixIcon="home"
                  href="/"
                  selected={pathname === "/"}
                />
              )}
              <Line background="neutral-alpha-medium" vert maxHeight="24" />
              {routes["/about"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="person"
                    href="/about"
                    label={about.label}
                    selected={pathname === "/about"}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="person"
                    href="/about"
                    selected={pathname === "/about"}
                  />
                </>
              )}
              {routes["/service"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="grid"
                    href={service.path}
                    label={service.label}
                    selected={pathname.startsWith(service.path)}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="grid"
                    href={service.path}
                    selected={pathname.startsWith(service.path)}
                  />
                </>
              )}
              {routes["/blog"] && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="book"
                    href="/blog"
                    label={blog.label}
                    selected={pathname.startsWith("/blog")}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="book"
                    href="/blog"
                    selected={pathname.startsWith("/blog")}
                  />
                </>
              )}
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

            {/* Indicateur de statut de connexion */}
            <Flex gap="8" vertical="center">
              {!isLoading && (
                <>
                  {user ? (
                    <Flex gap="4" vertical="center">
                      <Flex
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--success-high)",
                          boxShadow: "0 0 6px var(--success-high)",
                        }}
                      />
                      <Text variant="body-default-xs" color="success">
                        Connecté
                      </Text>
                    </Flex>
                  ) : (
                    <Flex gap="4" vertical="center">
                      <Flex
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--neutral-medium)",
                        }}
                      />
                      <Text variant="body-default-xs" color="neutral-medium">
                        Non connecté
                      </Text>
                    </Flex>
                  )}
                </>
              )}
            </Flex>

            {/* Section authentification */}
            {!isLoading && (
              <>
                {user ? (
                  <UserMenu />
                ) : (
                  <Flex gap="8" vertical="center">
                    <JoinButton variant="tertiary" size="s" />
                    <LoginButton />
                  </Flex>
                )}
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
