import { DefaultTheme } from "styled-components";
import mediaQueries, { breakpoints } from "./mediaQueries";
import { light as lightButton } from "../components/Button/theme";
import { light as lightCard } from "../components/Card/theme";
import { lightColors } from "./colors";

const lightTheme: DefaultTheme = {
  isDark: false,
  colors: lightColors,
  button: lightButton,
  card: lightCard,
  scales: {
    breakpoints,
    mediaQueries,
  },
  shadows: {
    level1: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  },
};

export default lightTheme;
