import React from "react";
import { IBlock } from "@z-squared/types";
import { Box, Text, useColorMode } from "@chakra-ui/react";
import { renderBlock } from "./helpers";
import { ContentSkeleton } from "./skeletons";
import Block from "../../components/Content/Block";

type PostContentProps = {
  data?: IBlock[];
  isLoading?: boolean;
};

const PostContent: React.FC<PostContentProps> = ({
  data,
  isLoading,
}) => {
  const { colorMode } = useColorMode();
  if (isLoading && !data) {
    return <ContentSkeleton />;
  } else {
    return (
      <Box>
        {data &&
          data.map((block, idx) => {
            const key = `block-${idx}`;
            return (
              <Block
                block={block}
                blockId={key}
                key={key}
              />
            );
            // return renderBlock(block, `block-${idx}`, colorMode)
          })}
      </Box>
    );
  }
};

export default PostContent;
