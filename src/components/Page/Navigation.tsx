import React from "react";
import LightLogov2 from "../../assets/images/z-squared-light-logo-removed.png";
import {
  HStack,
  Image,
  Link,
  Text,
  Container,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";

const NAVIGATION_OPTIONS = [
  "home",
  "about",
  "articles",
] as const;

export type NavigationOption =
  (typeof NAVIGATION_OPTIONS)[number];

export interface NavigationProps {
  active?: NavigationOption;
}

const Navigation: React.FC<NavigationProps> = ({
  active,
}) => {
  const logoSrc = LightLogov2;
  const greenFilter =
    "invert(45%) sepia(53%) saturate(548%) hue-rotate(116deg) brightness(90%) contrast(90%)";
  const capitalize = (str: string) => {
    return str[0].toUpperCase() + str.substring(1);
  };
  return (
    <Container maxW={{ base: "100%", md: "container.lg" }}>
      <HStack h="10vh" justify="space-between">
        <Link
          as={ReactLink}
          to="/"
          p="5"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Image
            src={logoSrc}
            h="5vh"
            filter={greenFilter}
          />
          <Text
            fontSize={{ base: "sm", md: "md" }}
            ml="3"
            fontFamily="heading"
            fontWeight="extrabold"
          >
            Z Squared
          </Text>
        </Link>
        <HStack px="10" spacing="4">
          {NAVIGATION_OPTIONS.map((option) => {
            return (
              <Link
                key={option}
                as={ReactLink}
                fontSize={{ base: "sm", md: "md" }}
                to={"/" + (option === "home" ? "" : option)}
                fontWeight={
                  active === option ? "bold" : "normal"
                }
                pos="relative"
                // color={active === option ? "brand.green.500" : "current"}
                _after={{
                  content: '" "',
                  pos: "absolute",
                  height: "2px",
                  width: "50%",
                  bg: "brand.green.500",
                  bottom: 0,
                  left: "50%",
                  transform: "translate(-50%)",
                  display:
                    active === option ? "block" : "none",
                  transition: "all ease-in .1s",
                }}
                _hover={{
                  fontWeight: "bold",
                  transition: "all ease-in .1s",
                }}
                transition="all ease-in .1s"
              >
                {capitalize(option)}
              </Link>
            );
          })}
          <ColorModeSwitcher />
        </HStack>
      </HStack>
    </Container>
  );
};

export default Navigation;
