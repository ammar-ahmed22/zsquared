"use client";
import React from "react";
import { ImageBlock } from "@/types/api/blocks";
import RichText from "@/components/ui/rich-text";
import NextImage from "next/image";
// import ImageWithLoading from "@/components/ui/loading-image";
import { toPlainText } from "@/lib/notion/utils";

const Image: React.FC<ImageBlock> = (block) => {
  return (
    <div className="flex flex-col gap-2 relative">
      <NextImage
        width={1600}
        height={900}
        src={block.url}
        alt={toPlainText(block.caption)}
        className="w-full rounded-xl"
      />
      {block.caption.length > 0 && (
        <RichText
          text={block.caption}
          as="span"
          className="text-xs text-center"
        />
      )}
    </div>
  );
};

export default Image;
