import { useState, useEffect, useMemo } from "react";
import {
  BlockType,
  IBlock,
  isRichTextContent,
  isImageContent,
  isListContent,
  IBlockContent,
  IRichText,
  isEquationContent,
} from "@z-squared/types";
import {
  Text,
  OrderedList,
  UnorderedList,
  Image,
  TextProps,
  ImageProps,
  ListProps,
  ListItem,
  Spinner,
  Box,
  BoxProps,
  ColorMode,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import RichText from "../../components/Content/RichText";
import MathJax from "react-mathjax";
import ImageModal from "../../components/Content/ImageModal";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/esm/styles/hljs";
import { BiCopy } from "react-icons/bi";

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
  bulleted_list: {},
  numbered_list: {},
  image: {
    objectFit: "cover",
    borderRadius: "md",
    boxShadow: "lg",
    mb: "2",
    // _hover: {
    //   cursor: "pointer"
    // },
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
    box: {},
    highlighter: {},
  },
};

function colorModeValue<T = any>(
  light: T,
  dark: T,
  mode: ColorMode,
): T {
  if (mode === "dark") return dark;
  return light;
}

export const renderBlockContent = (
  content: IBlockContent[],
  key: string,
) => {
  return content.map((item, idx) => {
    if (isRichTextContent(item)) {
      // @ts-ignore
      return (
        <Text key={`${key}-item-${idx}`} as="span">
          {item.plainText}
        </Text>
      );
    } else if (isListContent(item)) {
      const { children } = item;
      return children.map((child) => {
        const { content } = child;
        return (
          <ListItem key={`list-${idx}`}>
            {content.map((c, cIdx) => (
              <Text
                key={`${key}-list-${idx}-item-${cIdx}`}
                as="span"
              >
                {c.plainText}
              </Text>
            ))}
          </ListItem>
        );
      });
    } else if (isImageContent(item)) {
      return undefined;
    }
  });
};

export const renderBlock = (
  block: IBlock,
  key: string,
  mode: ColorMode,
) => {
  // console.log("INSIDE RENDERBLOCK:", mode);
  const { type, content } = block;
  const props = componentProps[type];
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
      return (
        <MathJax.Provider>
          <UnorderedList
            {...(props as ListProps)}
            key={key}
          >
            {renderBlockContent(content, key)}
          </UnorderedList>
        </MathJax.Provider>
      );
    case "numbered_list":
      return (
        <MathJax.Provider>
          <OrderedList {...(props as ListProps)} key={key}>
            {renderBlockContent(content, key)}
          </OrderedList>
        </MathJax.Provider>
      );
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
        return (
          <Box
            bg={colorModeValue(
              "brand.light.100",
              "brand.dark.500",
              mode,
            )}
            borderRadius="md"
            pos="relative"
          >
            <SyntaxHighlighter
              language={language}
              showLineNumbers
              customStyle={{ background: "transparent" }}
              style={colorModeValue(
                atomOneLight,
                atomOneDark,
                mode,
              )}
            >
              {richText.plainText}
            </SyntaxHighlighter>
            <IconButton
              aria-label="copy the code block"
              icon={<BiCopy />}
              colorScheme="brand.green"
              pos="absolute"
              top="1"
              right="1"
              variant="ghost"
              onClick={() => {}}
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

export const useRenderedBlocks = (
  data?: IBlock[],
): JSX.Element[] => {
  const { colorMode } = useColorMode();
  const [rendered, setRendered] = useState<JSX.Element[]>(
    [],
  );
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
    bulleted_list: {},
    numbered_list: {},
    image: {
      objectFit: "cover",
      borderRadius: "md",
      boxShadow: "lg",
      mb: "2",
      // _hover: {
      //   cursor: "pointer"
      // },
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
      },
      highlighter: {
        showLineNumbers: true,
        style: useColorModeValue(atomOneLight, atomOneDark),
        customStyles: {
          background: "transparent",
        },
      },
    },
  };
  useEffect(() => {
    if (data) {
      setRendered(
        data.map((block, idx) => {
          const { type, content } = block;
          const key = `block-${idx}`;
          const props = componentProps[type];
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
              return (
                <MathJax.Provider>
                  <UnorderedList
                    {...(props as ListProps)}
                    key={key}
                  >
                    {renderBlockContent(content, key)}
                  </UnorderedList>
                </MathJax.Provider>
              );
            case "numbered_list":
              return (
                <MathJax.Provider>
                  <OrderedList
                    {...(props as ListProps)}
                    key={key}
                  >
                    {renderBlockContent(content, key)}
                  </OrderedList>
                </MathJax.Provider>
              );
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
              return (
                <Text>ERROR: invalid image content</Text>
              );
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
              return (
                <Text>ERROR: invalid equation content</Text>
              );
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
                  >
                    <SyntaxHighlighter
                      language={language}
                      {...p.highlighter}
                    >
                      {richText.plainText}
                    </SyntaxHighlighter>
                    <IconButton
                      aria-label="copy the code block"
                      icon={<BiCopy />}
                      colorScheme="brand.green"
                      pos="absolute"
                      top="1"
                      right="1"
                      variant="ghost"
                      onClick={() => {}}
                    />
                  </Box>
                );
              }
              return (
                <Text>ERROR: invalid code content</Text>
              );

            default:
              return (
                <Text key={key} color="red.500">
                  ERROR: NOT IMPLEMENTED '{type}'
                </Text>
              );
          }
        }),
      );
    }
  }, [data]);

  return rendered;
};
