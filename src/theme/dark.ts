import { DefaultTheme } from "styled-components";
import mediaQueries, { breakpoints } from "./mediaQueries";

const darkTheme: DefaultTheme = {
  colors: {
    primary: "#1FC7D4",
    secondary: "#7645D9",
    tertiary: "#293450",
    success: "#31D0AA",
    failure: "#ED4B9E",
    contrast: "#FFFFFF",
    input: "#151021",
    background: "#191326",
    text: "#ED4B9E",
    textSubtle: "#ED4B9E",
    card: {
      background: "#2B223E",
      borderColor: "rgba(14, 14, 44, 0.05)",
    },
  },
  scales: {
    breakpoints,
    mediaQueries,
  },
  shadows: {
    level1: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  },
};

export default darkTheme;
