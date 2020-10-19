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
  },
};

export default lightTheme;
