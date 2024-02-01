import { gql } from "@apollo/client";
import { RICH_TEXT_FRAGMENTS } from "../fragments";
import { IMetadata } from "@z-squared/types";

export const METADATA_QUERY = gql`
  query Metadata(
    $categories: [String!]
    $onlyPublished: Boolean
    $ascending: Boolean
    $featured: Boolean
  ) {
    metadata(
      categories: $categories
      onlyPublished: $onlyPublished
      ascending: $ascending
      featured: $featured
    ) {
      id
      name
      slug
      authors
      publish
      publishDate
      categories
      description {
        ...completeRichText
      }
      image
      featured
    }
  }
  ${RICH_TEXT_FRAGMENTS}
`;

export const SEARCH_METADATA_QUERY = gql`
  query SearchMetadata($query: String!) {
    searchMetadata(query: $query) {
      id
      name
      slug
      authors
      publish
      publishDate
      categories
      description {
        ...completeRichText
      }
      image
    }
  }
  ${RICH_TEXT_FRAGMENTS}
`;

export const METADATA_BY_SLUG_QUERY = gql`
  query MetadataBySlug($slug: String!) {
    metadataBySlug(slug: $slug) {
      id
      name
      slug
      authors
      publish
      publishDate
      categories
      description {
        ...completeRichText
      }
      image
    }
  }
  ${RICH_TEXT_FRAGMENTS}
`;

export namespace MetadataQuery {
  export interface Response {
    metadata: IMetadata[];
  }

  export interface Variables {
    categories?: string[];
    onlyPublished?: boolean;
    ascending?: boolean;
    featured?: boolean;
  }
}

export namespace SearchMetadataQuery {
  export interface Response {
    searchMetadata: IMetadata[];
  }

  export interface Variables {
    query: string;
  }
}

export namespace MetadataBySlugQuery {
  export interface Response {
    metadataBySlug: IMetadata;
  }

  export interface Variables {
    slug: string;
  }
}
