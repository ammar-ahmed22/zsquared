import React from "react";
import { Skeleton } from "@chakra-ui/skeleton";

export const ArticlesSkeleton: React.FC = () => {
  return (
    <>
      {new Array(6).fill(0).map((_, i) => {
        return (
          <Skeleton
            key={`article-skeleton-${i}`}
            w="100%"
            h="65vh"
            transform="scale(0.95)"
          />
        );
      })}
    </>
  );
};

export const CategoriesSkeleton: React.FC = () => {
  return (
    <>
      {new Array(3).fill(0).map((_, i) => {
        return (
          <Skeleton
            key={`category-skeleton-${i}`}
            height="1.125rem"
            w="100%"
          />
        );
      })}
    </>
  );
};
