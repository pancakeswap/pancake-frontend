import { DefaultTheme } from "styled-components";
import mediaQueries, { breakpoints } from "./mediaQueries";
import shadows from "./shadows";
import { light as lightButton } from "../components/Button/theme";
import { light as lightCard } from "../components/Card/theme";
import { light as lightTag } from "../components/Tag/theme";
import { light as lightToggle } from "../components/Toggle/theme";
import { lightColors } from "./colors";

const lightTheme: DefaultTheme = {
  isDark: false,
  button: lightButton,
  colors: lightColors,
  card: lightCard,
  scales: {
    breakpoints,
    mediaQueries,
  },
  shadows: {
    level1: "0px 2px 12px -8px rgba(25, 19, 38, 0.1), 0px 1px 1px rgba(25, 19, 38, 0.05)",
    ...shadows,
  },
  tag: lightTag,
  toggle: lightToggle,
};

export default lightTheme;
