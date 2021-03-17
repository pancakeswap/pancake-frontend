import React, { ChangeEvent } from "react";
import { Box } from "../Box";
import { BunnySlider, BarBackground, BarProgress, StyledInput, SliderLabel } from "./styles";
import BunnyButt from "./svg/BunnyButt";
import SliderProps from "./types";

// We need to adjust the offset as the percentage increases, as 100% really is 100% - label width.
// The number 10 is arbitrary, but seems to work...
const LABEL_OFFSET = 10;

const Slider: React.FC<SliderProps> = ({ min, max, value, step = "any", onValueChanged, valueLabel, ...props }) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onValueChanged(parseFloat(target.value));
  };

  const progressPercentage = (value / max) * 100;
  const isMax = value === max;

  const labelOffset = progressPercentage - progressPercentage / LABEL_OFFSET;

  return (
    <Box position="relative" height="48px" {...props}>
      <BunnyButt style={{ position: "absolute" }} />
      <BunnySlider>
        <BarBackground />
        <BarProgress
          isMax={isMax}
          progress={progressPercentage}
          style={{ width: isMax ? "calc(100% - 16px)" : `${progressPercentage}%` }}
        />
        <StyledInput type="range" min={min} max={max} value={value} step={step} onChange={handleChange} isMax={isMax} />
      </BunnySlider>
      {valueLabel && <SliderLabel progress={labelOffset}>{valueLabel}</SliderLabel>}
    </Box>
  );
};

export default Slider;
