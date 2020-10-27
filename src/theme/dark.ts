import { DefaultTheme } from "styled-components";
import { dark as darkButton } from "../components/Button/theme";
import { dark as darkCard } from "../components/Card/theme";
import { dark as darkTag } from "../components/Tag/theme";
import { dark as darkToggle } from "../components/Toggle/theme";
import base from "./base";
import { darkColors } from "./colors";

const darkTheme: DefaultTheme = {
  ...base,
  isDark: true,
  button: darkButton,
  colors: darkColors,
  card: darkCard,
  tag: darkTag,
  toggle: darkToggle,
};

export default darkTheme;
