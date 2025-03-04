import { PostMetadata } from "@/types/api";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import Properties from "../notion/properties";
import { databases } from "./database";
import {
  filterDatabaseResults,
  getAllBlocks,
  mapRichText,
  toPlainText,
  updatePage,
} from "../notion/utils";
import { toSlug } from "./utils";
import {
  Block,
  CalloutBlock,
  CodeBlock,
  EquationBlock,
  HeadingBlock,
  ImageBlock,
  ListItem,
  OrderedListBlock,
  ParagraphBlock,
  QuoteBlock,
  UnorderedListBlock,
  VideoBlock,
} from "@/types/api/blocks";
import { isFullBlock } from "@notionhq/client";
import { v4 as uuid } from "uuid";

export type PostListOptions = {
  onlyPublished?: boolean;
  onlyFeatured?: boolean;
  ascending?: boolean;
  slug?: string;
};

export type PostContentOptions = {
  slug: string;
};

export type PostContentResponse = {
  metadata: PostMetadata;
  content: Block[];
};

class Posts {
  private async parseMetadata(
    page: PageObjectResponse,
  ): Promise<PostMetadata> {
    const properties = new Properties(page.properties);

    const dbSlug = toPlainText(properties.get("Slug").asRichText());
    let genSlug: string | undefined = undefined;
    if (!dbSlug) {
      genSlug = toSlug(properties.get("Name").asTitle());
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
      image = `/api/notion-assets/page/${page.id}/cover`;
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

  async getAllListChildren(
    parentId: string,
    block: BlockObjectResponse,
  ): Promise<ListItem[]> {
    const result: ListItem[] = [];
    if (!block.has_children) {
      return result;
    }
    const resp = await getAllBlocks(parentId);
    for (const block of resp) {
      if (isFullBlock(block)) {
        if (block.type === "bulleted_list_item") {
          result.push({
            content:
              block.bulleted_list_item.rich_text.map(mapRichText),
            children: await this.getAllListChildren(block.id, block),
          });
        } else if (block.type === "numbered_list_item") {
          result.push({
            content:
              block.numbered_list_item.rich_text.map(mapRichText),
            children: await this.getAllListChildren(block.id, block),
          });
        }
      }
    }
    return result;
  }

  async content(
    opts: PostContentOptions,
  ): Promise<PostContentResponse> {
    const resp = await databases.blog.query({
      filter: {
        and: [
          {
            property: "Slug",
            rich_text: {
              equals: opts.slug,
            },
          },
        ],
      },
    });

    if (resp.results.length === 0) {
      throw new Error("404: Nothing found." + opts.slug);
    }

    const filteredResults = filterDatabaseResults(resp.results);
    const [page] = filteredResults;
    const allBlocks = await getAllBlocks(page.id);
    const content: Block[] = [];
    let listType: "unorderedList" | "orderedList" = "unorderedList";
    let listStack: ListItem[] = [];
    for (const block of allBlocks) {
      switch (block.type) {
        case "heading_1":
          content.push({
            id: block.id,
            type: "heading",
            level: 1,
            content: block.heading_1.rich_text.map(mapRichText),
          } as HeadingBlock);
          break;
        case "heading_2":
          content.push({
            id: block.id,
            type: "heading",
            level: 2,
            content: block.heading_2.rich_text.map(mapRichText),
          } as HeadingBlock);
          break;
        case "heading_3":
          content.push({
            id: block.id,
            type: "heading",
            level: 3,
            content: block.heading_3.rich_text.map(mapRichText),
          } as HeadingBlock);
          break;
        case "paragraph":
          content.push({
            id: block.id,
            type: "paragraph",
            content: block.paragraph.rich_text.map(mapRichText),
          } as ParagraphBlock);
          break;
        case "image":
          content.push({
            id: block.id,
            type: "image",
            url: `/api/notion-assets/block/${block.id}/image`,
            caption: block.image.caption.map(mapRichText),
          } as ImageBlock);
          break;
        case "code":
          content.push({
            id: block.id,
            type: "code",
            language: block.code.language,
            content: block.code.rich_text
              .map((r) => r.plain_text)
              .join(""),
            caption: block.code.caption.map(mapRichText),
          } as CodeBlock);
          break;
        case "bulleted_list_item":
          listType = "unorderedList";
          listStack.push({
            content:
              block.bulleted_list_item.rich_text.map(mapRichText),
            children: await this.getAllListChildren(block.id, block),
          });
          break;
        case "numbered_list_item":
          listType = "orderedList";
          listStack.push({
            content:
              block.numbered_list_item.rich_text.map(mapRichText),
            children: await this.getAllListChildren(block.id, block),
          });
          break;
        case "equation":
          content.push({
            id: block.id,
            type: "equation",
            expression: block.equation.expression,
          } as EquationBlock);
          break;
        case "quote":
          content.push({
            id: block.id,
            type: "quote",
            content: block.quote.rich_text.map(mapRichText),
          } as QuoteBlock);
          break;
        case "callout":
          let icon: string | undefined = undefined;
          if (block.callout.icon) {
            if (block.callout.icon.type === "emoji") {
              icon = block.callout.icon.emoji;
            }
          }
          content.push({
            id: block.id,
            type: "callout",
            icon,
            content: block.callout.rich_text.map(mapRichText),
          } as CalloutBlock);
          break;
        case "video":
          content.push({
            id: block.id,
            type: "video",
            url: `/api/notion-assets/block/${block.id}/video`,
            caption: block.video.caption.map(mapRichText),
          } as VideoBlock);
          break;
        case "file":
          break;
        default:
          console.warn(
            "Encountered unknown block type: " + block.type,
          );
          break;
      }
      if (
        block.type !== "numbered_list_item" &&
        block.type !== "bulleted_list_item"
      ) {
        if (listStack.length > 0) {
          // Insert before the last element for correct ordering
          if (listType === "unorderedList") {
            content.splice(content.length - 1, 0, {
              id: uuid(),
              type: "unorderedList",
              content: listStack,
            } as UnorderedListBlock);
          } else {
            content.splice(content.length - 1, 0, {
              id: uuid(),
              type: "orderedList",
              content: listStack,
            } as OrderedListBlock);
          }
          listStack = [];
        }
      }
    }
    const metadata = await this.parseMetadata(page);
    return {
      metadata,
      content,
    };
  }
}

export const posts = new Posts();
