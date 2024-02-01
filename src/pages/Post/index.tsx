import React, { useEffect, useState } from "react";
import { Text, Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import {
  MetadataBySlugQuery,
  METADATA_BY_SLUG_QUERY,
} from "../../graphql/queries/Metadata";
import {
  ContentQuery,
  CONTENT_QUERY,
} from "../../graphql/queries/Content";
import { useLazyQuery } from "@apollo/client";
import PostHeading from "./Heading";
import PostContent from "./Content";

const Post: React.FC = () => {
  const params = useParams();
  const [getMetadata, metadataResponse] = useLazyQuery<
    MetadataBySlugQuery.Response,
    MetadataBySlugQuery.Variables
  >(METADATA_BY_SLUG_QUERY);
  const [getContent, contentResponse] = useLazyQuery<
    ContentQuery.Response,
    ContentQuery.Variables
  >(CONTENT_QUERY);
  const [contentId, setContentId] = useState<string>();

  const { slug } = params;

  useEffect(() => {
    if (slug) {
      getMetadata({
        variables: {
          slug,
        },
      });
    }
  }, [slug, getMetadata]);

  useEffect(() => {
    if (metadataResponse.loading) {
      console.log("Metadata loading...");
    }

    if (
      metadataResponse.data &&
      metadataResponse.data.metadataBySlug
    ) {
      // console.log(metadataResponse.data.metadataBySlug);
      setContentId(metadataResponse.data.metadataBySlug.id);
    }
  }, [metadataResponse]);

  useEffect(() => {
    if (contentId) {
      getContent({
        variables: {
          contentId,
        },
      });
    }
  }, [contentId, getContent]);

  if (slug) {
    return (
      <Box>
        <PostHeading
          data={metadataResponse.data?.metadataBySlug}
          isLoading={metadataResponse.loading}
        />
        <PostContent
          data={contentResponse.data?.content}
          isLoading={contentResponse.loading}
        />
      </Box>
    );
  } else {
    return (
      <Box>
        <Text>Error 404</Text>
      </Box>
    );
  }
};

export default Post;
