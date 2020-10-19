import styled, { DefaultTheme } from "styled-components";
import { ButtonProps, variants } from "./types";

interface ThemedProps extends ButtonProps {
  theme: DefaultTheme;
}

const getBackground = ({ variant, disabled, theme }: ThemedProps) => {
  if (disabled) {
    return "#ddd";
  }

  switch (variant) {
    case variants.OUTLINE:
    case variants.TEXT:
      return "transparent";
    case variants.SECONDARY:
      return theme.colors.tertiary;
    case variants.PRIMARY:
    default:
      return theme.colors.primary;
  }
};

const getBorder = ({ variant, disabled, theme }: ThemedProps) => {
  if (disabled) {
    return 0;
  }

  switch (variant) {
    case variants.OUTLINE:
      return `2px solid ${theme.colors.primary}`;
    case variants.PRIMARY:
    case variants.SECONDARY:
    case variants.TEXT:
    default:
      return 0;
  }
};

const getColor = ({ variant, disabled, theme }: ThemedProps) => {
  if (disabled) {
    return "#acaaaf";
  }

  switch (variant) {
    case variants.PRIMARY:
      return "#FFFFFF";
    case variants.TEXT:
      return theme.colors.text;
    case variants.OUTLINE:
    case variants.SECONDARY:
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

const StyledButton = styled.button<ButtonProps>`
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
