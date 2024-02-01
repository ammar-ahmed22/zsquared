import React from "react";
import { useQuery } from "@apollo/client";
import {
  METADATA_QUERY,
  MetadataQuery,
} from "../../graphql/queries/Metadata";
import {
  VStack,
  Text,
  HStack,
  Image,
  Box,
  useColorModeValue,
  SimpleGrid,
  Container,
} from "@chakra-ui/react";
import Card from "../../components/Card";
import { formatDistance } from "date-fns";
import { Link as ReactLink } from "react-router-dom";

const Featured: React.FC = () => {
  const { data, loading, error } = useQuery<
    MetadataQuery.Response,
    MetadataQuery.Variables
  >(METADATA_QUERY, {
    variables: {
      featured: true,
      onlyPublished: true,
    },
  });

  React.useEffect(() => {
    if (!loading && data) {
      console.log(data.metadata);
    }
  }, [data, loading, error]);

  const accentColor = useColorModeValue(
    "brand.dark.200",
    "brand.light.700",
  );
  const cardBg = useColorModeValue(
    "rgba(255, 255, 255, 0.6)",
    "rgba(0, 0, 0, 0.6)",
  );

  return (
    <Container
      maxW={{ base: "100%", md: "container.lg" }}
      mt="5"
    >
      <VStack align="flex-start" p="5">
        {!loading && data && data.metadata.length > 0 && (
          <Text
            fontFamily="heading"
            fontSize="4xl"
            fontWeight="bold"
            color="brand.green.700"
          >
            Featured Posts:
          </Text>
        )}
        <SimpleGrid columns={{ base: 1, lg: 2 }}>
          {!loading &&
            data &&
            data.metadata.map((metadata, i) => {
              const date = new Date(metadata.publishDate);
              const now = new Date();
              const distance = formatDistance(date, now, {
                addSuffix: true,
              });
              return (
                <Card
                  w={{ base: "100%", lg: "60vh" }}
                  bg={cardBg}
                  backdropFilter="blur(10px)"
                  shadow="none"
                  to={`/articles/post/${metadata.slug}`}
                  as={ReactLink}
                >
                  <HStack
                    flexDir={"column"}
                    w="100%"
                    spacing={5}
                  >
                    <Image
                      src={metadata.image}
                      h="40vh"
                      w={{ base: "100%", lg: "60vh" }}
                      objectFit="cover"
                      flexShrink={0}
                      borderRadius="md"
                    />
                    <VStack w="100%" align="center">
                      <Box>
                        <Text
                          fontFamily="heading"
                          fontSize="4xl"
                          fontWeight="bold"
                        >
                          {metadata.name}
                        </Text>
                        <Text
                          color={accentColor}
                          fontSize="sm"
                        >
                          {distance}
                        </Text>
                        <Text
                          color={accentColor}
                          fontSize="sm"
                        >
                          By: {metadata.authors.join(", ")}
                        </Text>
                        <Text>
                          {metadata.description
                            .map((r) => r.plainText)
                            .join("")}
                        </Text>
                      </Box>
                    </VStack>
                  </HStack>
                </Card>
              );
            })}
        </SimpleGrid>
      </VStack>
    </Container>
  );
};

export default Featured;
