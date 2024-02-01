import { gql } from "@apollo/client";
import { RICH_TEXT_FRAGMENTS } from "../fragments";
import { IBlock } from "@z-squared/types";

export const CONTENT_QUERY = gql`
  query Content($contentId: String!) {
    content(id: $contentId) {
      type
      content {
        ... on RichText {
          ...completeRichText
        }
        ... on Image {
          url
          caption {
            ...completeRichText
          }
        }
        ... on List {
          children {
            content {
              ...completeRichText
            }
            children {
              content {
                ...completeRichText
              }
              children {
                content {
                  ...completeRichText
                }
              }
            }
          }
        }
        ... on Equation {
          expression
        }
      }
    }
  }
  ${RICH_TEXT_FRAGMENTS}
`;

export namespace ContentQuery {
  export interface Response {
    content: IBlock[];
  }

  export interface Variables {
    contentId: string;
  }
}
