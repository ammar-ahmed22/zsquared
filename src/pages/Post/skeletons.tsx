import React from "react";
import {
  SkeletonText,
  Box,
  SkeletonTextProps,
} from "@chakra-ui/react";

export const HeadingSkeleton: React.FC = () => {
  const skeletons: SkeletonTextProps[] = [
    {
      skeletonHeight: "16",
      mb: "2",
      noOfLines: 1,
      width: "75%",
    },
    {
      skeletonHeight: "5",
      mb: 1,
      noOfLines: 1,
      width: "20%",
    },
    {
      skeletonHeight: "4",
      mb: 2,
      noOfLines: 1,
      width: "30%",
    },
  ];
  return (
    <Box>
      {skeletons.map((skel, idx) => {
        return <SkeletonText {...skel} key={idx} />;
      })}
    </Box>
  );
};

export const ContentSkeleton: React.FC = () => {
  return (
    <Box>
      {new Array(4).fill(0).map((_, idx) => {
        return (
          <>
            <SkeletonText
              skeletonHeight="7"
              noOfLines={1}
              width="50%"
              mb="2"
            />
            <SkeletonText
              skeletonHeight="3"
              noOfLines={5}
              mb="2"
            />
          </>
        );
      })}
    </Box>
  );
};
