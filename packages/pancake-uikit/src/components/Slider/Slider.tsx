import React, { ChangeEvent } from "react";
import { SliderContainer, BunnySlider, BarBackground, BarProgress, StyledInput, SliderLabel } from "./styles";
import BunnyButt from "./svg/BunnyButt";
import SliderProps from "./types";

// We need to adjust the offset as the percentage increases, as 100% really is 100% - label width. The number 10 is arbitrary, but seems to work...
const MOVING_SLIDER_LABEL_OFFSET_FACTOR = 10;

const Slider: React.FC<SliderProps> = ({ min, max, value, onValueChanged, valueLabel, ...props }) => {
  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onValueChanged(parseInt(target.value, 10));
  };

  const progressPercentage = (value / max) * 100;
  const isCurrentValueMaxValue = value === max;

  const labelOffset = progressPercentage - progressPercentage / MOVING_SLIDER_LABEL_OFFSET_FACTOR;

  return (
    <SliderContainer {...props}>
      <BunnyButt style={{ position: "absolute" }} />
      <BunnySlider>
        <BarBackground />
        <BarProgress isCurrentValueMaxValue={isCurrentValueMaxValue} progress={progressPercentage} />
        <StyledInput
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          isCurrentValueMaxValue={isCurrentValueMaxValue}
        />
      </BunnySlider>
      {valueLabel && <SliderLabel progress={labelOffset}>{valueLabel}</SliderLabel>}
    </SliderContainer>
  );
};

export default Slider;
