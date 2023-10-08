import { styled, DefaultTheme, css } from "styled-components";

import { Input } from "@pancakeswap/uikit";
import getThemeValue from "@pancakeswap/uikit/util/getThemeValue";

interface ThemedProps {
  theme: DefaultTheme;
  color?: string;
}

const getColor = ({ color, theme }: ThemedProps) => {
  return getThemeValue(theme, `colors.${color}`, color);
};

export const StyledInput = styled(Input)<{ textAlign?: string; color?: string }>`
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding-left: 0;
  padding-right: 0;
  text-align: ${({ textAlign = "left" }) => textAlign};
  border: none;
  height: 1.5em;
  min-width: 0;
  flex: 1;

  color: ${getColor};
  ${({ theme, color }) =>
    color &&
    css`
      color: ${getColor({ color, theme })};
    `}

  ::placeholder {
    color: ${({ theme }) => theme.colors.textSubtle};
  }

  ::beofre {
    content: "$";
  }

  &:focus:not(:disabled) {
    box-shadow: none;
    outline: solid ${({ theme }) => theme.colors.primary};
  }
`;
