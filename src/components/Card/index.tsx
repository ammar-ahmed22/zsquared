import React from "react";
import { LinkBox, LinkBoxProps } from "@chakra-ui/layout";
import { useColorModeValue } from "@chakra-ui/color-mode";

type CardProps = LinkBoxProps & {
  to?: string;
  href?: string;
  isExternal?: boolean;
};

const Card: React.FC<CardProps> = ({
  children,
  shadow,
  p,
  padding,
  bg,
  background,
  transform,
  transition,
  _hover,
  borderRadius,
  ...rest
}) => {
  const cardBg = useColorModeValue(
    "brand.light.200",
    "brand.dark.500",
  );

  return (
    <LinkBox
      {...rest}
      shadow={shadow ?? "xl"}
      p={p ?? padding ?? "5"}
      bg={bg ?? background ?? cardBg}
      transform={transform ?? "scale(0.95)"}
      borderRadius={borderRadius ?? "lg"}
      transition={transition ?? "transform .2s ease-in-out"}
      _hover={
        _hover ?? {
          transform: "scale(1)",
          transition: "transform .2s ease-in-out",
          cursor: "pointer",
        }
      }
    >
      {children}
    </LinkBox>
  );
};

export default Card;
