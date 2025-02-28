import { RichText } from "@/types/api";
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  RichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { notion } from "../notion/client";
import { isFullPage } from "@notionhq/client";

type DatabaseResults = (
  | PageObjectResponse
  | PartialPageObjectResponse
  | PartialDatabaseObjectResponse
  | DatabaseObjectResponse
)[];

export function filterDatabaseResults(
  results: DatabaseResults,
): PageObjectResponse[] {
  return results.filter(
    (result) => isFullPage(result) && result,
  ) as PageObjectResponse[];
}

type UpdatePageProperties = Parameters<
  (typeof notion)["pages"]["update"]
>[0]["properties"];

export async function updatePage(
  pageId: string,
  properties: UpdatePageProperties,
): Promise<void> {
  await notion.pages.update({ page_id: pageId, properties });
}

export function mapRichText(rt: RichTextItemResponse): RichText {
  return {
    plainText: rt.plain_text,
    annotations: {
      ...rt.annotations,
      href: rt.href ?? undefined,
      equation: rt.type === "equation",
    },
  };
}

export function toPlainText(richText: RichText[]): string {
  return richText.map((r) => r.plainText).join("");
}
