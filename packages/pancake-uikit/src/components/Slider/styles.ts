import { InputHTMLAttributes } from "react";
import styled from "styled-components";
import Text from "../Text/Text";
import bunnyHeadMain from "./svg/bunnyhead-main.svg";
import bunnyHeadMax from "./svg/bunnyhead-max.svg";

interface SliderLabelProps {
  progress: number;
}

interface StyledInputProps extends InputHTMLAttributes<HTMLInputElement> {
  isMax: boolean;
}

export const SliderLabel = styled(Text)<SliderLabelProps>`
  bottom: 0;
  font-size: 12px;
  left: calc(${({ progress }) => progress}%);
  position: absolute;
  margin-left: 16px; // offset the bunny butt width
`;

export const BunnyButt = styled.img`
  position: absolute;
`;

export const BunnySlider = styled.div`
  position: absolute;
  left: 14px;
  width: 100%;
`;

const getBaseThumbStyles = ({ isMax }: StyledInputProps) => `
-webkit-appearance: none;
  background-image: url(${isMax ? bunnyHeadMax : bunnyHeadMain});
  width: 24px;
  height: 32px;
  cursor: pointer;
  transform: translate(-2px, -2px);
  transition: 0.1s all;

  :hover {
    transform: scale(1.1) translate(-3px, -3px);
  }
`;

export const StyledInput = styled.input<StyledInputProps>`
  cursor: pointer;
  height: 32px;
  position: relative;

  ::-webkit-slider-thumb {
    -webkit-appearance: none;
    ${getBaseThumbStyles}
  }
  ::-moz-range-thumb {
    ${getBaseThumbStyles}

    background-color: transparent;
    border: 0;
  }

  ::-ms-thumb {
    ${getBaseThumbStyles}
  }
`;

export const BarBackground = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  top: 18px;
  background-color: ${({ theme }) => theme.colors.inputSecondary};
`;

export const BarProgress = styled.div<{ progress: number; isMax: boolean }>`
  position: absolute;
  height: 10px;
  top: 18px;

  background: ${({ theme }) => theme.colors.primary};
`;
