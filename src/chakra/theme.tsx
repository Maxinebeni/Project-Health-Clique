import { extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/libre-baskerville/400.css";
import { Button } from "./Button";

export const theme = extendTheme({
  colors: {
    brand: {
      100: "#066fcc",
    },
  },
  fonts: {
    body: `'Open Sans', sans-serif`,
    heading: `'Libre Baskerville', serif`,
    mono: `'Menlo', monospace`,
  },
  styles: {
    global: () => ({
      body: {
        bg: "gray.100",
        color: "#000000",
        fontSize: "15px",

      },
    }),
  },
  components: {
    Button,
    Text: {
      baseStyle: {
        fontSize: "14px",
        color: "#000000",
      },
    },
  },
});