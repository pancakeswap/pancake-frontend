import React, { ChangeEvent } from "react";
import { Box } from "../Box";
import {
  BunnySlider,
  BarBackground,
  BarProgress,
  BunnyButt,
  StyledInput,
  SliderLabel,
  SliderLabelContainer,
} from "./styles";
import SliderProps from "./types";

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
  const labelProgress = isMax ? "calc(100% - 12px)" : `${progressPercentage}%`;
  const displayValueLabel = isMax ? "MAX" : valueLabel;
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
      {valueLabel && (
        <SliderLabelContainer>
          <SliderLabel progress={labelProgress}>{displayValueLabel}</SliderLabel>
        </SliderLabelContainer>
      )}
    </Box>
  );
};

export default Slider;
