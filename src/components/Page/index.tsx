import React from "react";
import { Container, Box } from "@chakra-ui/react";
import Navigation, { NavigationOption } from "./Navigation";
import Footer from "./Footer";

export interface PageProps {
  children: React.ReactNode;
  navigationOption?: NavigationOption;
  fullWidth?: boolean;
}

const Page: React.FC<PageProps> = ({
  children,
  navigationOption,
  fullWidth,
}) => {
  return (
    <>
      <Box
        height="10px"
        width="100vw"
        pos="absolute"
        top="0"
        right="50%"
        transform="translateX(50%)"
        bg="brand.green.500"
      />
      <Box
        height="10px"
        width="100vw"
        pos="absolute"
        bottom="0"
        right="50%"
        transform="translateX(50%)"
        bg="brand.green.500"
      />
      <Navigation active={navigationOption} />
      <Container
        maxW={
          fullWidth
            ? "100%"
            : { base: "100%", md: "container.lg" }
        }
        minHeight="100vh"
        pos="relative"
        padding={0}
      >
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Page;
