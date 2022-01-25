import styled from "styled-components";
import { space } from "styled-system";
import { RadioProps, scales } from "./types";

const getScale = ({ scale }: RadioProps) => {
  switch (scale) {
    case scales.SM:
      return "24px";
    case scales.MD:
    default:
      return "32px";
  }
};

const getCheckedScale = ({ scale }: RadioProps) => {
  switch (scale) {
    case scales.SM:
      return "12px";
    case scales.MD:
    default:
      return "20px";
  }
};

const Radio = styled.input.attrs({ type: "radio" })<RadioProps>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: 0;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};

  &:after {
    border-radius: 50%;
    content: "";
    height: ${getCheckedScale};
    left: 6px;
    position: absolute;
    top: 6px;
    width: ${getCheckedScale};
  }

  &:hover:not(:disabled):not(:checked) {
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.success};
    &:after {
      background-color: ${({ theme }) => theme.radio.handleBackground};
    }
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  ${space}
`;

Radio.defaultProps = {
  scale: scales.MD,
  m: 0,
};

export default Radio;
