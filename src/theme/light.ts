import { DefaultTheme } from "styled-components";
import mediaQueries, { breakpoints } from "./mediaQueries";

const lightTheme: DefaultTheme = {
  colors: {
    primary: "#1FC7D4",
    secondary: "#7645D9",
    tertiary: "#EFF4F5",
    success: "#31D0AA",
    failure: "#ED4B9E",
    contrast: "#191326",
    input: "#F4F2F7",
    background: "#FAF9FA",
    text: "#452A7A",
    textSubtle: "#AEA0D6",
    card: {
      background: "#FFFFFF",
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

export default lightTheme;
