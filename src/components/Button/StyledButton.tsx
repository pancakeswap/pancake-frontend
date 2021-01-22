import styled, { DefaultTheme } from "styled-components";
import { space } from "styled-system";
import { ButtonProps, ButtonThemeVariant, variants } from "./types";

type ThemedProps = {
  theme: DefaultTheme;
} & ButtonProps;

const getDisabledStyles = ({ isLoading, theme }: ThemedProps) => {
  if (isLoading === true) {
    return `
      &:disabled,
      &.button--disabled {
        cursor: not-allowed;
      }
    `;
  }

  return `
    &:disabled,
    &.button--disabled {
      background-color: ${theme.colors.backgroundDisabled};
      border-color: ${theme.colors.backgroundDisabled};
      box-shadow: none;
      color: ${theme.colors.textDisabled};
      cursor: not-allowed;
    }
  `;
};

const removePointerEvents = ({ disabled, as }: ThemedProps) => {
  if (disabled && as && as !== "button") {
    return `
      pointer-events: none;
    `;
  }

  return "";
};

const getButtonVariantProp = (prop: keyof ButtonThemeVariant) => ({
  theme,
  variant = variants.PRIMARY,
}: ThemedProps) => {
  return theme.button[variant][prop];
};

const StyledButton = styled.button<ButtonProps>`
  align-items: center;
  background-color: ${getButtonVariantProp("background")};
  border: ${getButtonVariantProp("border")};
  border-radius: 16px;
  box-shadow: ${getButtonVariantProp("boxShadow")};
  color: ${getButtonVariantProp("color")};
  cursor: pointer;
  display: inline-flex;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  /* max-content instead of auto for Safari fix */
  width: ${({ fullWidth }) => (fullWidth ? "100%" : "max-content")};
  height: ${({ size }) => (size === "sm" ? "32px" : "48px")};
  line-height: 1;
  letter-spacing: 0.03em;
  justify-content: center;
  outline: 0;
  padding: ${({ size }) => (size === "sm" ? "0 16px" : "0 24px")};
  transition: background-color 0.2s;
  opacity: ${({ isLoading }) => (isLoading ? 0.5 : 1)};

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    background-color: ${getButtonVariantProp("backgroundHover")};
    border-color: ${getButtonVariantProp("borderColorHover")};
  }

  &:focus:not(:active) {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.secondary};
  }

  &:active {
    background-color: ${getButtonVariantProp("backgroundActive")};
    box-shadow: ${getButtonVariantProp("boxShadowActive")};
  }

  ${getDisabledStyles}
  ${removePointerEvents}
  ${space}
`;

StyledButton.defaultProps = {
  fullWidth: false,
  type: "button",
};

export default StyledButton;
