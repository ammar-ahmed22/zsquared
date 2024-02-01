import { gql } from "@apollo/client";

export const CATEGORIES_QUERY = gql`
  query Categories {
    categories
  }
`;

export namespace CategoriesQuery {
  export interface Response {
    categories: string[];
  }
}
