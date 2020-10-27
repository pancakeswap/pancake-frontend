import { DefaultTheme } from "styled-components";
import { light as lightButton } from "../components/Button/theme";
import { light as lightCard } from "../components/Card/theme";
import { light as lightTag } from "../components/Tag/theme";
import { light as lightToggle } from "../components/Toggle/theme";
import base from "./base";
import { lightColors } from "./colors";

const lightTheme: DefaultTheme = {
  ...base,
  isDark: false,
  button: lightButton,
  colors: lightColors,
  card: lightCard,
  tag: lightTag,
  toggle: lightToggle,
};

export default lightTheme;
