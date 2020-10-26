import { DefaultTheme } from "styled-components";
import mediaQueries, { breakpoints } from "./mediaQueries";
import { dark as darkButton } from "../components/Button/theme";
import { dark as darkCard } from "../components/Card/theme";
import { dark as darkTag } from "../components/Tag/theme";
import { darkColors } from "./colors";

const darkTheme: DefaultTheme = {
  isDark: true,
  button: darkButton,
  colors: darkColors,
  card: darkCard,
  scales: {
    breakpoints,
    mediaQueries,
  },
  shadows: {
    level1: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
  },
  tag: darkTag,
};

export default darkTheme;
