import styled from "styled-components";
import { CheckboxProps, scales } from "./types";

const getScale = ({ scale }: CheckboxProps) => {
  switch (scale) {
    case scales.SM:
      return "24px";
    case scales.MD:
    default:
      return "32px";
  }
};

const Checkbox = styled.input.attrs({ type: "checkbox" })<CheckboxProps>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: ${({ theme }) => (theme.isDark ? `solid 1px ${theme.colors.disabled}` : "0")};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.cardBorder};
  box-shadow: ${({ theme }) => theme.shadows.inset};

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

  &:hover:not(:disabled):not(:checked) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:checked {
    border: 0;
    background-color: ${({ theme }) => theme.colors.success};
    &:after {
      border-color: white;
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
