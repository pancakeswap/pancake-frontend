import React, { useState } from "react";
import styled from "styled-components";
import Slider from "./Slider";
import Flex from "../Box/Flex";

export default {
  title: "Components/Slider",
  component: Slider,
  argTypes: {},
};

const Col = styled(Flex)`
  flex-direction: column;
  width: 300px;
`;

const SliderVariant = ({ initialValue }: { initialValue: number }) => {
  const [value, setValue] = useState(initialValue);
  const min = 0;
  const max = 10;

  const percentage = (value / max) * 100;

  return (
    <Slider
      min={min}
      max={max}
      value={value}
      onValueChanged={setValue}
      valueLabel={value === max ? "MAX" : `${percentage}%`}
    />
  );
};

export const Default: React.FC = () => {
  return (
    <Col>
      <SliderVariant initialValue={5} />
    </Col>
  );
};

export const Variants: React.FC = () => {
  return (
    <Col>
      <SliderVariant initialValue={0} />
      <SliderVariant initialValue={10} />
    </Col>
  );
};
