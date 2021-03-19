import React, { ChangeEvent } from "react";
import styled from "styled-components";
import { Box, BoxProps } from "../Box";
import { BunnySlider, BarBackground, BarProgress, StyledInput, SliderLabel } from "./styles";
import BunnyButt from "./svg/BunnyButt";
import SliderProps from "./types";

const StyledSlider = styled(Box)<{ isDisabled: SliderProps["isDisabled"] & BoxProps }>`
  opacity: ${({ isDisabled }) => (isDisabled ? ".5" : 1)};
`;

// We need to adjust the offset as the percentage increases, as 100% really is 100% - label width.
// The number 10 is arbitrary, but seems to work...
const LABEL_OFFSET = 10;

const Slider: React.FC<SliderProps> = ({
  name,
  min,
  max,
  value,
  onValueChanged,
  valueLabel,
  step = "any",
  isDisabled = false,
  ...props
}) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onValueChanged(parseFloat(target.value));
  };

  const progressPercentage = (value / max) * 100;
  const isMax = value === max;

  const labelOffset = progressPercentage - progressPercentage / LABEL_OFFSET;

  return (
    <StyledSlider position="relative" height="48px" isDisabled={isDisabled} {...props}>
      <BunnyButt style={{ position: "absolute" }} />
      <BunnySlider>
        <BarBackground />
        <BarProgress
          isMax={isMax}
          progress={progressPercentage}
          style={{ width: isMax ? "calc(100% - 16px)" : `${progressPercentage}%` }}
        />
        <StyledInput
          name={name}
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleChange}
          isMax={isMax}
          disabled={isDisabled}
        />
      </BunnySlider>
      {valueLabel && <SliderLabel progress={labelOffset}>{valueLabel}</SliderLabel>}
    </StyledSlider>
  );
};

export default Slider;
