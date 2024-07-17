import { styled } from "styled-components";
import { CheckboxProps, Scales, scales } from "./types";

const getScale = ({ scale }: CheckboxProps) => {
  if (scale && Object.values(scales).includes(scale as Scales)) {
    switch (scale) {
      case scales.XS:
        return "20px";
      case scales.SM:
        return "24px";
      case scales.MD:
      default:
        return "32px";
    }
  }
  return scale;
};

const Checkbox = styled.input.attrs({ type: "checkbox" })<CheckboxProps>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  min-height: ${getScale};
  min-width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: ${({ theme, colors }) =>
    colors?.border
      ? `solid 1px ${theme.colors[colors.border]}`
      : theme.isDark
      ? `solid 1px ${theme.colors.disabled}`
      : "0"};
  border-radius: 8px;
  background-color: ${({ theme, colors }) => theme.colors[colors?.background ?? "cardBorder"]};
  box-shadow: ${({ theme }) => theme.shadows.inset};

  &:before {
    content: "";
    position: absolute;
    border-top: 2px solid;
    border-color: transparent;
    top: 50%;
    left: 50%;
    width: 33%;
    height: 0;
    margin: auto;
    transform: translate(-50%, -50%);
    transition: border-color 0.2s ease-in-out;
  }

  &:after {
    content: "";
    position: absolute;
    border-bottom: 2px solid;
    border-left: 2px solid;
    border-color: transparent;
    top: 30%;
    left: 0;
    right: 0;
    width: 50%;
    height: 25%;
    margin: auto;
    transform: rotate(-50deg);
    transition: border-color 0.2s ease-in-out;
  }

  ${({ indeterminate, theme, colors }) =>
    indeterminate &&
    `
    border: 0;
    background-color: ${theme.colors[colors?.checkedBackground ?? "success"]};
    &:before {
      border-color: ${theme.colors.backgroundAlt};
    }
    `}

  &:hover:not(:disabled):not(:checked) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:checked {
    border: 0;
    background-color: ${({ theme, colors }) => theme.colors[colors?.checkedBackground ?? "success"]};
    &:after {
      border-color: ${({ theme, colors }) => (colors?.checkedColor ? theme.colors[colors?.checkedColor] : "white")};
    }
  }

  &:disabled {
    border: 0;
    cursor: default;
    opacity: 0.6;
  }
`;

Checkbox.defaultProps = {
  scale: scales.MD,
};

export default Checkbox;
