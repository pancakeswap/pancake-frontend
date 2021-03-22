import React, { ChangeEvent } from "react";
import { Box } from "../Box";
import { BunnySlider, BarBackground, BarProgress, BunnyButt, StyledInput, SliderLabel } from "./styles";
import SliderProps from "./types";

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
  disabled = false,
  ...props
}) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onValueChanged(parseFloat(target.value));
  };

  const progressPercentage = (value / max) * 100;
  const isMax = value === max;
  const progressWidth = isMax ? "calc(100% - 16px)" : `${progressPercentage}%`;
  const labelOffset = progressPercentage - progressPercentage / LABEL_OFFSET;

  return (
    <Box position="relative" height="48px" {...props}>
      <BunnyButt disabled={disabled} />
      <BunnySlider>
        <BarBackground disabled={disabled} />
        <BarProgress style={{ width: progressWidth }} disabled={disabled} />
        <StyledInput
          name={name}
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleChange}
          isMax={isMax}
          disabled={disabled}
        />
      </BunnySlider>
      {valueLabel && <SliderLabel progress={labelOffset}>{valueLabel}</SliderLabel>}
    </Box>
  );
};

export default Slider;
