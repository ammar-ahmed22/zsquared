import React from "react";
import { IListItem } from "@z-squared/types";
import {
  ListItem,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import RichText from "./RichText";

type RecursiveListItemProps = {
  data: IListItem;
  listType: "bulleted_list" | "numbered_list";
  blockId: string;
  depth: number;
};

const RecursiveListItem: React.FC<
  RecursiveListItemProps
> = ({ data, listType, blockId, depth = 0 }) => {
  const getListStyleType = (
    depth: number,
    listType: "bulleted_list" | "numbered_list",
  ) => {
    const ulTypes = ["circle", "square", "disc"];
    const olTypes = [
      "decimal",
      "lower-alpha",
      "lower-roman",
    ];
    if (listType === "bulleted_list") {
      const idx = depth % ulTypes.length;
      return ulTypes[idx];
    } else {
      const idx = depth & olTypes.length;
      return olTypes[idx];
    }
  };

  const blockKey = `${blockId}-depth-${depth}`;

  return (
    <ListItem>
      <RichText data={data.content} blockKey={blockKey} />
      {data.children &&
        !!data.children.length &&
        listType === "numbered_list" && (
          <OrderedList
            listStyleType={getListStyleType(
              depth,
              listType,
            )}
          >
            {data.children.map((child, idx) => (
              <RecursiveListItem
                key={`${blockKey}-child-${idx}`}
                data={child}
                blockId={blockId}
                depth={depth + 1}
                listType={listType}
              />
            ))}
          </OrderedList>
        )}
      {data.children &&
        !!data.children.length &&
        listType === "bulleted_list" && (
          <UnorderedList
            listStyleType={getListStyleType(
              depth,
              listType,
            )}
          >
            {data.children.map((child, idx) => (
              <RecursiveListItem
                key={`${blockKey}-child-${idx}`}
                data={child}
                blockId={blockId}
                depth={depth + 1}
                listType={listType}
              />
            ))}
          </UnorderedList>
        )}
    </ListItem>
  );
};

export default RecursiveListItem;
