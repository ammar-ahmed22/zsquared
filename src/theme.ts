import { extendTheme } from "@chakra-ui/react";
import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import { inputAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const fonts = {
  body: "Noto Sans, sans-serif",
  heading: "Gloock, serif",
  handwriting: "Caveat, cursive",
};

const config = {
  initialColorMode: "system",
  useSystemColorMode: true,
  cssVarPrefix: "z2",
};

const colors = {
  brand: {
    green: {
      900: "#145446",
      800: "#176251",
      700: "#1a705d",
      600: "#1e7e68",
      500: "#218c74",
      400: "#379882",
      300: "#4da390",
      200: "#64af9e",
      100: "#7abaac",
      50: "#90c6ba",
    },
    light: {
      900: "#7d7a73",
      800: "#928f86",
      700: "#a7a39a",
      600: "#bcb8ad",
      500: "#d1ccc0",
      400: "#d6d1c6",
      300: "#dad6cd",
      200: "#dfdbd3",
      100: "#e3e0d9",
      50: "#e8e6e0",
    },
    dark: {
      900: "#1c2026",
      800: "#21262d",
      700: "#262b33",
      600: "#2a313a",
      500: "#2f3640",
      400: "#444a53",
      300: "#595e66",
      200: "#6d7279",
      100: "#82868c",
      50: "#979ba0",
    },
  },
};

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);
const branded = definePartsStyle({
  field: {
    border: "1px solid",
    borderColor: "gray.400",
    background: "brand.light.500",
    _focusVisible: {
      boxShadow(theme) {
        return `0 0 0 1px ${theme.colors.brand.green["500"]}`;
      },
      zIndex: 1,
      borderColor: "brand.green.500",
    },
    _placeholder: {
      color: "gray.500",
    },
    _dark: {
      borderColor: "gray.600",
      background: "brand.dark.900",
    },
  },
  addon: {
    border: "1px solid",
    borderColor: "gray.200",
    background: "brand.light.500",
    color: "gray.500",

    _dark: {
      borderColor: "gray.600",
      background: "brand.dark.900",
      color: "gray.400",
    },
  },
  element: {
    color: "brand.green.600",
    _dark: {
      color: "brand.green.500",
    },
  },
});

const inputTheme = defineMultiStyleConfig({
  variants: { branded },
});

const components = {
  Text: {
    variants: {
      gradient: {
        bgGradient:
          "linear(to-r, brand.green.500, brand.blue.500)",
        bgClip: "text",
        lineHeight: "base",
      },
      blackOutline: {
        textShadow:
          "-1px -1px #000, 1px -1px #000, -1px 1px #000, 1px 1px #000",
      },
      whiteOutline: {
        textShadow:
          "-1px -1px #fff, 1px -1px #fff, -1px 1px #fff, 1px 1px #fff",
      },
    },
  },
  Heading: {
    variants: {
      gradient: {
        bgGradient:
          "linear(to-r, brand.green.500, brand.blue.500)",
        bgClip: "text",
        lineHeight: "base",
      },
      blackOutline: {
        textShadow:
          "-1px -1px #000, 1px -1px #000, -1px 1px #000, 1px 1px #000",
      },
      whiteOutline: {
        textShadow:
          "-1px -1px #fff, 1px -1px #fff, -1px 1px #fff, 1px 1px #fff",
      },
    },
  },
  Input: inputTheme,
};

const styles = {
  global: (props: StyleFunctionProps) => ({
    body: {
      bg: "bg.subtle",
      color: mode(
        "brand.dark.900",
        "brand.light.500",
      )(props),
      overflowX: "hidden",
      maxWidth: "100%"
    },
  }),
};

const theme = extendTheme({
  fonts,
  config,
  colors,
  components,
  styles,
});

export default theme;
