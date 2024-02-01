import React from "react";
import { IRichText, IAnnotations } from "@z-squared/types";
import {
  Text,
  TextProps,
  LinkProps,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import MathJax from "react-mathjax";

type RichTextProps = TextProps & {
  data: IRichText[];
  blockKey: string;
};

const RichText: React.FC<RichTextProps> = ({
  data,
  blockKey,
  ...rest
}) => {
  const defaultCodeColor = useColorModeValue(
    "brand.dark.900",
    "brand.light.500",
  );
  const defaultColor = useColorModeValue(
    "brand.dark",
    "brand.light",
  );
  const codeBg = useColorModeValue(
    "brand.green.400",
    "brand.green.700",
  );
  const colorNumber = useColorModeValue(".700", ".300");
  function createProps<T extends TextProps | LinkProps>(
    annots: IAnnotations,
  ): T {
    let result: TextProps | LinkProps = {};
    let textDecoration = "";

    const inlineCode = {
      bg: codeBg,
      px: 1,
      py: 0.5,
      borderRadius: "md",
    };

    if (annots.bold) result.fontWeight = "bold";
    if (annots.strikethrough)
      textDecoration = "line-through";
    if (annots.underline) textDecoration += " underline";
    if (annots.italic) result.fontStyle = "italic";
    if (annots.color !== "default")
      result.color = annots.color + colorNumber;
    if (annots.color === "default")
      result.color = defaultColor;

    result.textDecoration = textDecoration;

    if (annots.code) {
      result = {};
      Object.assign(result, inlineCode);
      result.color =
        annots.color === "default"
          ? defaultCodeColor
          : annots.color;
    }

    result.whiteSpace = "pre-line";

    return result as T;
  }

  return (
    <Text {...rest}>
      <MathJax.Provider>
        {data.map((richText, idx) => {
          const {
            annotations,
            plainText,
            href,
            inlineLatex,
          } = richText;
          const { code } = annotations;
          const key = `${blockKey}-rich-text-${idx}`;
          if (href) {
            return (
              <Link
                href={href}
                isExternal
                {...createProps<LinkProps>(annotations)}
                key={key}
              >
                {plainText}
              </Link>
            );
          } else if (inlineLatex) {
            return (
              <Text
                key={key}
                as="span"
                {...createProps<TextProps>(annotations)}
              >
                <MathJax.Node inline formula={plainText} />
              </Text>
            );
          } else {
            return (
              <Text
                key={key}
                as={code ? "kbd" : "span"}
                {...createProps<TextProps>(annotations)}
              >
                {plainText}
              </Text>
            );
          }
        })}
      </MathJax.Provider>
    </Text>
  );
};

export default RichText;
