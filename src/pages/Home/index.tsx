import React from "react";
import {
  Box,
  Image,
  Container,
  Text,
  HStack,
  Center,
  Button,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import mountain3 from "../../assets/images/mountain3.jpg";
import brandLogo from "../../assets/images/z-squared-logo-brand-green.png";
import Featured from "./Featured";
import { Helmet } from "react-helmet";

const Home: React.FC = () => {
  const nav = useNavigate();
  return (
    <>
        <Helmet>
          <title>Home</title>
        </Helmet>
        <Container
          maxW={{ base: "100%", md: "container.lg" }}
          h="100%"
        >
          <Center
            flexDirection="column"
            h="100vh"
            alignItems="flex-start"
          >
            <HStack>
              <Image src={brandLogo} height="15vh" />
            </HStack>
            <Text
              fontWeight="extrabold"
              fontSize={{ base: "6xl", md: "8xl" }}
              fontFamily="heading"
              color="brand.light.500"
              variant="blackOutline"
            >
              Z Squared
            </Text>
            <Text
              color="brand.light.500"
              variant="blackOutline"
            >
              Creed, corporations and culture are just some
              of the topics we delve into
            </Text>
            <HStack mt="3">
              <Button
                colorScheme="brand.green"
                size={{ base: "md", md: "lg" }}
                onClick={() => nav("/articles")}
              >
                Articles
              </Button>
              <Button
                colorScheme="brand.light"
                size={{ base: "md", md: "lg" }}
                variant="outline"
                _hover={{
                  color: "brand.dark.900",
                  bg: "brand.light.500",
                }}
                onClick={() => nav("/about")}
              >
                About us
              </Button>
            </HStack>
          </Center>
        </Container>
      <Featured />
    </>
  );
};

export default Home;
