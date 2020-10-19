import styled, { DefaultTheme } from "styled-components";
import { Props, Variants } from "./types.d";

interface ThemedProps extends Props {
  theme: DefaultTheme;
}

const getBackground = ({ variant, disabled, theme }: ThemedProps) => {
  if (disabled) {
    return "#ddd";
  }

  switch (variant) {
    case Variants.OUTLINE:
    case Variants.TEXT:
      return "transparent";
    case Variants.SECONDARY:
      return theme.colors.tertiary;
    case Variants.PRIMARY:
    default:
      return theme.colors.primary;
  }
};

const getBorder = ({ variant, disabled, theme }: ThemedProps) => {
  if (disabled) {
    return 0;
  }

  switch (variant) {
    case Variants.OUTLINE:
      return `2px solid ${theme.colors.primary}`;
    case Variants.PRIMARY:
    case Variants.SECONDARY:
    case Variants.TEXT:
    default:
      return 0;
  }
};

const getColor = ({ variant, disabled, theme }: ThemedProps) => {
  if (disabled) {
    return "#acaaaf";
  }

  switch (variant) {
    case Variants.PRIMARY:
      return "#FFFFFF";
    case Variants.TEXT:
      return theme.colors.text;
    case Variants.OUTLINE:
    case Variants.SECONDARY:
    default:
      return theme.colors.primary;
  }
};

export const StartIcon = styled.span`
  margin-right: 0.5em;
`;

export const EndIcon = styled.span`
  margin-left: 0.5em;
`;

const StyledButton = styled.button<Props>`
  align-items: center;
  background-color: ${getBackground};
  border: ${getBorder};
  border-radius: 16px;
  color: ${getColor};
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  height: ${({ size }) => (size === "sm" ? "32px" : "48px")};
  letter-spacing: 0.03em;
  justify-content: center;
  outline: 0;
  padding: ${({ size }) => (size === "sm" ? "0 16px" : "0 24px")};

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

export default StyledButton;
