import { DefaultTheme } from "styled-components";
import pallete from "./pallete";

const darkTheme: DefaultTheme = {
  colors: {
    ...pallete,
    primary: pallete.iris,
    secondary: pallete.peach,
    tertiary: "#EFF4F5",
    background: pallete.onyx,
    dark: pallete.onyx,
    failure: pallete.fuschia,
    success: pallete.evergreen,
    text: pallete.white,
    textSubtle: pallete.lightSlate,
    accent: pallete.dorian,
    light: pallete.cloud,
  },
};

export default darkTheme;
