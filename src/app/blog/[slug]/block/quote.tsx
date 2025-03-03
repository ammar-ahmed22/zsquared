import { QuoteBlock } from "@/types/api/blocks";
import React from "react";
import RichText from "@/components/ui/rich-text";
import { GrBlockQuote } from "react-icons/gr";

const Quote: React.FC<QuoteBlock> = (block) => {
  return (
    <blockquote className="flex justify-center">
      <div className="flex gap-4 w-4/5">
        <div>
          <GrBlockQuote className="size-8" />
        </div>
        <div>
          <RichText
            text={block.content}
            className="dark:text-neutral-300 text-neutral-700 font-medium"
            as="span"
          />
        </div>
      </div>
    </blockquote>
  );
};

export default Quote;
