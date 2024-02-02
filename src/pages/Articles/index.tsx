import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Image,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/client";
import { formatDistance } from "date-fns";
import type { IMetadata } from "@z-squared/types";
import {
  METADATA_QUERY,
  MetadataQuery,
  SEARCH_METADATA_QUERY,
  SearchMetadataQuery,
} from "../../graphql/queries/Metadata";
import {
  CATEGORIES_QUERY,
  CategoriesQuery,
} from "../../graphql/queries/Categories";
import Card from "../../components/Card";
import Search from "../../components/Search";
import { ArticlesSkeleton } from "./skeletons";
import { Helmet } from "react-helmet";

const Articles: React.FC = () => {
  const [getMetadata, metadataResponse] = useLazyQuery<
    MetadataQuery.Response,
    MetadataQuery.Variables
  >(METADATA_QUERY);
  const categoriesResponse =
    useQuery<CategoriesQuery.Response>(CATEGORIES_QUERY);
  const [search, searchResponse] = useLazyQuery<
    SearchMetadataQuery.Response,
    SearchMetadataQuery.Variables
  >(SEARCH_METADATA_QUERY);

  const [filterCategories, setFilterCategories] = useState<
    Set<string>
  >(new Set());
  const [metadata, setMetadata] = useState<IMetadata[]>();
  const [searchQuery, setSearchQuery] =
    useState<string>("");
  const [searching, setSearching] =
    useState<boolean>(false);

  useEffect(() => {
    if (!searching) {
      getMetadata({
        variables: {
          onlyPublished: true,
          ascending: false,
          categories: [...filterCategories.values()],
        },
      });
    }
  }, [filterCategories, getMetadata, searching]);

  useEffect(() => {
    if (metadataResponse.error) {
      console.log(metadataResponse.error);
    }

    if (metadataResponse.loading) {
      setMetadata(undefined);
    }

    if (
      metadataResponse.data &&
      !metadataResponse.loading
    ) {
      setMetadata(metadataResponse.data.metadata);
    }
  }, [metadataResponse]);

  useEffect(() => {
    if (searchResponse.error) {
      console.log(searchResponse.error);
    }

    if (searchResponse.loading) {
      setMetadata(undefined);
    }

    if (searchResponse.data && !searchResponse.loading) {
      setMetadata(searchResponse.data.searchMetadata);
    }
  }, [searchResponse]);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q !== "") {
      setSearching(true);
      setFilterCategories(new Set());
      search({
        variables: {
          query: q,
        },
      });
    } else {
      setSearching(false);
    }
  };

  const addFilterCategory = (category: string) => {
    setFilterCategories(
      (prev) => new Set(prev.add(category)),
    );
  };

  const removeFilterCategory = (category: string) => {
    setFilterCategories(
      (prev) =>
        new Set(
          [...prev.values()].filter((x) => x !== category),
        ),
    );
  };

  const accentColor = useColorModeValue(
    "brand.dark.200",
    "brand.light.700",
  );

  return (
    <Box w="100%" px="2" >
      <Helmet>
        <title>Articles</title>
      </Helmet>
      <VStack h="25vh" spacing="5" justify="center">
        <Heading
          fontFamily="heading"
          as="h1"
          textAlign="center"
          size={{ base: "xl", md: "3xl" }}
        >
          📝 <Text as="span">Articles</Text>
        </Heading>
        <Text align="center" fontSize={{ base: "lg", md: "2xl" }}>
          Corporations, creed, culture and everything in
          between.
        </Text>
      </VStack>
      <Search
        placeholder="Search for posts by name"
        onQueryChange={handleSearchChange}
      />
      <HStack my="2">
        {!searching &&
          !categoriesResponse.loading &&
          categoriesResponse.data &&
          categoriesResponse.data.categories
            .filter((c) => !filterCategories.has(c))
            .map((category) => {
              return (
                <Tag
                  key={category}
                  variant="solid"
                  colorScheme="brand.green"
                  size={{ base: "md", md: "lg" }}
                  transform="scale(0.95)"
                  transition="transform .2s ease-in-out"
                  _hover={{
                    cursor: "pointer",
                    transform: "scale(1)",
                    transition: "transform .2s ease-in-out",
                  }}
                  onClick={() =>
                    addFilterCategory(category)
                  }
                >
                  {category}
                </Tag>
              );
            })}
      </HStack>
      <Box w="100%">
        <Heading fontFamily="heading" as="h2">
          Posts
        </Heading>
        {!!filterCategories.size && (
          <HStack>
            <Text>Filtered by: </Text>
            {[...filterCategories].map((category) => {
              return (
                <Tag
                  key={category}
                  variant="solid"
                  colorScheme="black"
                >
                  <TagLabel>{category}</TagLabel>
                  <TagCloseButton
                    onClick={() =>
                      removeFilterCategory(category)
                    }
                  />
                </Tag>
              );
            })}
          </HStack>
        )}
        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing="5"
          pt="5"
        >
          {searching && metadata && !metadata.length && (
            <Text>
              Could not find any results for:{" "}
              <Text as="span" fontWeight="bold">
                {searchQuery}
              </Text>
            </Text>
          )}
          {!metadata && <ArticlesSkeleton />}
          {metadata &&
            metadata.map((post) => {
              const {
                id,
                name,
                description,
                publishDate,
                categories,
                slug,
                authors,
                image,
              } = post;
              const publishedDate = new Date(publishDate);
              const elapsed = formatDistance(
                publishedDate,
                new Date(),
                {
                  addSuffix: true,
                },
              );
              return (
                <Card
                  key={id}
                  as={ReactLink}
                  to={`/articles/post/${slug}`}
                  p={0}
                >
                  {image && (
                    <Image
                      src={image}
                      borderRadius="lg"
                      h="40vh"
                      w="100%"
                      objectFit="cover"
                    />
                  )}
                  <Box p="5">
                    <Heading fontFamily="heading" size="lg">
                      {name}
                    </Heading>
                    <HStack spacing="3" my="1">
                      {categories.map((category) => {
                        return (
                          <Tag
                            key={category}
                            variant="solid"
                            colorScheme="gray"
                          >
                            {category}
                          </Tag>
                        );
                      })}
                    </HStack>

                    <Text color={accentColor} mb="1">
                      {elapsed}
                    </Text>
                    {!!authors.length && (
                      <Text color={accentColor} mb="1">
                        By: {authors.join(", ")}
                      </Text>
                    )}
                    <Text>
                      {description
                        .map((text) => text.plainText)
                        .join("")}
                    </Text>
                  </Box>
                </Card>
              );
            })}
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default Articles;
