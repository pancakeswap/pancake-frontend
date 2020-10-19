import { DefaultTheme } from "styled-components";
import pallete from "./pallete";

const lightTheme: DefaultTheme = {
  colors: {
    ...pallete,
    primary: pallete.iris,
    secondary: pallete.peach,
    tertiary: "#EFF4F5",
    background: pallete.white,
    dark: pallete.onyx,
    failure: pallete.fuschia,
    success: pallete.evergreen,
    text: pallete.onyx,
    textSubtle: pallete.lightSlate,
    accent: pallete.dorian,
    light: pallete.cloud,
    card: {
      background: pallete.white,
      borderColor: "rgba(14, 14, 44, 0.05)",
    },
  },
  shadows: {
    level1: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  },
};

export default lightTheme;
