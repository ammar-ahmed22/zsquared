import { NextRequest, NextResponse } from "next/server";
import { notion } from "@/lib/notion/client";
import { isFullBlock, isFullPage } from "@notionhq/client";
import { fetchImageResponse } from "@/lib/api/utils";

interface Options {
  params: Promise<Params>;
}

interface Params {
  object: string;
  id: string;
  resource: string;
}

type ObjectType = "block" | "page";
type BlockResourceType = "image" | "video";
type PageResourceType = "cover" | "icon";

const ALLOWED_BLOCK_RESOURCES = ["image", "video"];
const ALLOWED_PAGE_RESOURCES = ["cover", "icon"];
const ALLOWED_OBJECTS = ["block", "page"];

const isObjectType = (obj: string): obj is ObjectType => {
  return ALLOWED_OBJECTS.includes(obj);
};

const isPageResourceType = (
  resource: string,
): resource is PageResourceType => {
  return ALLOWED_PAGE_RESOURCES.includes(resource);
};

const isBlockResourceType = (
  resouce: string,
): resouce is BlockResourceType => {
  return ALLOWED_BLOCK_RESOURCES.includes(resouce);
};

const handleBlockObject = async (
  id: string,
  resource: BlockResourceType,
) => {
  const block = await notion.blocks.retrieve({ block_id: id });
  if (!isFullBlock(block)) {
    return NextResponse.json(
      { error: "Invalid block" },
      { status: 400 },
    );
  }

  if (resource === "image" && block.type === "image") {
    const imageUrl =
      block.image.type === "external"
        ? block.image.external.url
        : block.image.file.url;
    return fetchImageResponse(imageUrl);
  }

  if (resource === "video" && block.type === "video") {
    const videoUrl =
      block.video.type === "external"
        ? block.video.external.url
        : block.video.file.url;
    return fetchImageResponse(videoUrl);
  }

  return NextResponse.json(
    {
      error: "Resource not found",
    },
    { status: 404 },
  );
};

const handlePageObject = async (
  id: string,
  resource: PageResourceType,
) => {
  const page = await notion.pages.retrieve({ page_id: id });
  if (!isFullPage(page)) {
    return NextResponse.json(
      { error: "Invalid page" },
      { status: 400 },
    );
  }

  if (resource === "cover" && page.cover) {
    const imageUrl =
      page.cover.type === "external"
        ? page.cover.external.url
        : page.cover.file.url;
    return fetchImageResponse(imageUrl);
  }

  if (
    resource === "icon" &&
    page.icon &&
    page.icon.type !== "emoji" &&
    page.icon.type !== "custom_emoji"
  ) {
    const imageUrl =
      page.icon.type === "external"
        ? page.icon.external.url
        : page.icon.file.url;
    return fetchImageResponse(imageUrl);
  }

  return NextResponse.json(
    { error: "Resource not found" },
    { status: 404 },
  );
};

export async function GET(_: NextRequest, { params }: Options) {
  try {
    const { id, resource, object } = await params;

    if (!isObjectType(object)) {
      return NextResponse.json(
        { error: "Invalid object" },
        { status: 400 },
      );
    }

    if (object === "page") {
      if (!isPageResourceType(resource)) {
        return NextResponse.json(
          { error: "Invalid resource" },
          { status: 400 },
        );
      }
      return handlePageObject(id, resource);
    }

    if (object === "block") {
      if (!isBlockResourceType(resource)) {
        return NextResponse.json(
          { error: "Invalid resource" },
          { status: 400 },
        );
      }
      return handleBlockObject(id, resource);
    }

    return NextResponse.json(
      { error: "Resource not found" },
      { status: 404 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
