import { DefaultTheme } from "styled-components";
import getThemeValue from "./getThemeValue";

const getColor = (color: string, theme: DefaultTheme): string => {
  return getThemeValue(`colors.${color}`, color)(theme);
};

export default getColor;
