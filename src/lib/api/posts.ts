import { PostMetadata } from "@/types/api";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import Properties from "../notion/properties";
import { databases } from "./database";
import {
  filterDatabaseResults,
  toPlainText,
  updatePage,
} from "../notion/utils";
import { toSlug } from "./utils";

export type PostListOptions = {
  onlyPublished?: boolean;
  onlyFeatured?: boolean;
  ascending?: boolean;
  slug?: string;
};

class Posts {
  private async parseMetadata(
    page: PageObjectResponse,
  ): Promise<PostMetadata> {
    const properties = new Properties(page.properties);

    const dbSlug = toPlainText(properties.get("Slug").asRichText());
    let genSlug: string | undefined = undefined;
    if (!dbSlug) {
      genSlug = toSlug(properties.get("name").asTitle());
      await updatePage(page.id, {
        Slug: {
          rich_text: [
            {
              text: {
                content: genSlug,
              },
            },
          ],
        },
      });
    }
    let image: string | undefined = undefined;
    if (page.cover) {
      // TODO: Implement the notion assets api endpoints - https://linear.app/ammar-ahmed/issue/AMM-75/create-notion-assets-api-endpoints
      image = undefined;
      // image = `/api/notion-assets/page/${page.id}/cover`;
    }
    return {
      id: page.id,
      name: properties.get("Name").asTitle(),
      description: properties.get("Description").asRichText(),
      categories: properties.get("Categories").asMultiSelect(),
      date: properties.get("PublishDate").asDateRange()?.start,
      authors: properties.get("Authors").asPeople(),
      featured: properties.get("Featured").asCheckbox(),
      slug: dbSlug ?? genSlug!,
      image,
    };
  }
  async list(opts?: PostListOptions): Promise<PostMetadata[]> {
    const and = [];
    if (opts?.onlyPublished) {
      and.push({
        property: "Publish",
        checkbox: {
          equals: true,
        },
      });
    }

    if (opts?.slug) {
      and.push({
        property: "Slug",
        rich_text: {
          equals: opts.slug,
        },
      });
    }

    if (opts?.onlyFeatured) {
      and.push({
        property: "Featured",
        checkbox: {
          equals: true,
        },
      });
    }

    const response = await databases.blog.query({
      filter: {
        and,
      },
      sorts: [
        {
          property: "PublishDate",
          direction: opts?.ascending ? "ascending" : "descending",
        },
      ],
    });

    const { results } = response;
    const filteredResults = filterDatabaseResults(results);

    const posts = await Promise.all(
      filteredResults.map(async (result) => {
        const metadata = await this.parseMetadata(result);
        return metadata;
      }),
    );
    return posts;
  }
}

export const posts = new Posts();
