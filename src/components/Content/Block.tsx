import React, { useState } from "react";
import {
  IBlock,
  BlockType,
  IRichText,
  isImageContent,
  isRichTextContent,
  isEquationContent,
  isListContent,
} from "@z-squared/types";
import {
  TextProps,
  ImageProps,
  ListProps,
  BoxProps,
  Spinner,
  useColorModeValue,
  Text,
  UnorderedList,
  OrderedList,
  Box,
  IconButton,
  IconButtonProps,
} from "@chakra-ui/react";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import SyntaxHighlighter from "react-syntax-highlighter";
import RichText from "./RichText";
import ImageModal from "./ImageModal";
import MathJax from "react-mathjax";
import { BiCopy, BiCheck } from "react-icons/bi";
import RecursiveListItem from "./RecursiveListItem";

type BlockProps = {
  blockId: string;
  block: IBlock;
};

type CodeStyles = {
  box: BoxProps;
  highlighter: any;
};

type ComponentProps =
  | TextProps
  | ImageProps
  | ListProps
  | CodeStyles;

type ComponentPropsMapping = {
  [k in BlockType]: ComponentProps;
};

const Block: React.FC<BlockProps> = ({
  block,
  blockId,
}) => {
  const { type, content } = block;

  const componentProps: ComponentPropsMapping = {
    heading_1: {
      as: "h2",
      fontFamily: "heading",
      fontSize: "xl",
      mb: "2",
      fontWeight: "bold",
    },
    heading_2: {
      as: "h3",
      fontFamily: "heading",
      fontSize: "lg",
      mb: "2",
      fontWeight: "bold",
    },
    heading_3: {
      as: "h4",
      fontFamily: "heading",
      fontSize: "md",
      mb: "2",
      fontWeight: "bold",
    },
    paragraph: {
      mb: "2",
    },
    bulleted_list: {
      mb: 2,
    },
    numbered_list: {
      mb: 2,
    },
    image: {
      objectFit: "cover",
      borderRadius: "md",
      boxShadow: "lg",
      mb: "2",
      fallback: (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="brand.green.500"
          size="xl"
        />
      ),
      w: "container.sm",
    },
    equation: {},
    code: {
      box: {
        bg: useColorModeValue(
          "brand.light.100",
          "brand.dark.500",
        ),
        borderRadius: "md",
        pos: "relative",
        mb: 2,
        p: 1,
      },
      highlighter: {
        showLineNumbers: true,
        style: useColorModeValue(atomOneLight, atomOneDark),
        customStyle: {
          background: "transparent",
        },
      },
    },
  };

  const props = componentProps[type];
  const key = blockId;
  const [copyProps, setCopyProps] =
    useState<IconButtonProps>({
      variant: "ghost",
      icon: <BiCopy />,
      "aria-label": "copy the code block",
      display: "none",
    });
  const handleCodeCopy = (copy: string) => {
    navigator.clipboard.writeText(copy);
    setCopyProps((prev) => ({
      ...prev,
      icon: <BiCheck />,
      variant: "solid",
      display: "inline-flex",
    }));

    setTimeout(() => {
      setCopyProps((prev) => ({
        ...prev,
        icon: <BiCopy />,
        variant: "ghost",
      }));
    }, 3000);
  };

  switch (type) {
    case "heading_1":
    case "heading_2":
    case "heading_3":
    case "paragraph":
      return (
        <RichText
          data={content as IRichText[]}
          blockKey={key}
          {...(props as TextProps)}
        />
      );
    case "bulleted_list":
      const [bl] = content;
      if (isListContent(bl)) {
        const { children } = bl;
        return (
          <UnorderedList {...(props as ListProps)}>
            {children.map((child, idx) => (
              <RecursiveListItem
                data={child}
                blockId={key}
                listType={type}
                depth={0}
                key={blockId + idx}
              />
            ))}
          </UnorderedList>
        );
      }

      return <Text>ERROR: invalid unordered list</Text>;
    case "numbered_list":
      const [nl] = content;
      if (isListContent(nl)) {
        const { children } = nl;
        return (
          <OrderedList {...(props as ListProps)}>
            {children.map((child, idx) => (
              <RecursiveListItem
                data={child}
                blockId={key}
                listType={type}
                depth={1}
                key={blockId + idx}
              />
            ))}
          </OrderedList>
        );
      }

      return <Text>ERROR: invalid ordered list</Text>;
    case "image":
      const [value] = content;
      if (isImageContent(value)) {
        const { url, caption } = value;
        return (
          <ImageModal
            imageProps={{
              src: url,
              ...(props as ImageProps),
            }}
            captionProps={{
              fontSize: "sm",
              color: "gray.500",
              textAlign: "center",
            }}
            captionData={caption}
          />
        );
      }
      return <Text>ERROR: invalid image content</Text>;
    case "equation":
      const [val] = content;
      if (isEquationContent(val)) {
        const { expression } = val;
        return (
          <MathJax.Provider>
            <Box>
              <MathJax.Node formula={expression} />
            </Box>
          </MathJax.Provider>
        );
      }
      return <Text>ERROR: invalid equation content</Text>;
    case "code":
      const [richText] = content;
      if (isRichTextContent(richText)) {
        const { language } = richText.annotations;
        const p = props as CodeStyles;
        return (
          <Box
            {...p.box}
            borderRadius="md"
            pos="relative"
            onMouseEnter={() => {
              setCopyProps((prev) => ({
                ...prev,
                display: "inline-flex",
              }));
            }}
            onMouseLeave={() => {
              setCopyProps((prev) => ({
                ...prev,
                display: "none",
              }));
            }}
          >
            <SyntaxHighlighter
              language={language}
              id={key}
              {...p.highlighter}
            >
              {richText.plainText}
            </SyntaxHighlighter>
            <IconButton
              {...copyProps}
              aria-label="copy the code block"
              // icon={<BiCopy />}
              colorScheme="brand.green"
              pos="absolute"
              top="1"
              right="1"
              // variant="ghost"
              onClick={() =>
                handleCodeCopy(richText.plainText)
              }
            />
          </Box>
        );
      }
      return <Text>ERROR: invalid code content</Text>;

    default:
      return (
        <Text key={key} color="red.500">
          ERROR: NOT IMPLEMENTED '{type}'
        </Text>
      );
  }
};

export default Block;
