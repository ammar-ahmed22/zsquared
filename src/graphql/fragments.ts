import { gql } from "@apollo/client";

export const RICH_TEXT_FRAGMENTS = gql`
  fragment completeRichText on RichText {
    plainText
    href
    annotations {
      ...all
    }
    inlineLatex
  }

  fragment all on Annotations {
    bold
    code
    color
    strikethrough
    underline
    italic
    language
  }
`;
