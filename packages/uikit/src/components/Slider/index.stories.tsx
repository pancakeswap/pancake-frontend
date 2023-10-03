import React, { useState } from "react";
import { styled } from "styled-components";
import Flex from "../Box/Flex";
import Box from "../Box/Box";
import Text from "../Text/Text";
import Button from "../Button/Button";
import Slider from "./Slider";

export default {
  title: "Components/Slider",
  component: Slider,
  argTypes: {},
};

const Col = styled(Flex)`
  flex-direction: column;
  width: 420px;
`;

const SliderVariant = ({ initialValue }: { initialValue: number }) => {
  const [value, setValue] = useState(initialValue);
  const min = 0;
  const max = 10;

  const percentage = (value / max) * 100;

  return (
    <Slider
      name="slider"
      min={min}
      max={max}
      value={value}
      onValueChanged={setValue}
      valueLabel={value === max ? "MAX" : `${percentage}%`}
    />
  );
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <Col>
      <SliderVariant initialValue={5} />
    </Col>
  );
};

export const Variants: React.FC<React.PropsWithChildren> = () => {
  const [value, setValue] = useState(10);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  return (
    <Col>
      <Slider name="sliderdisabled" value={value} onValueChanged={handleChange} min={1} max={20} disabled />
    </Col>
  );
};

const percentShortcuts = [10, 25, 50, 75];
const initialBalance = 1.795394;
const maxBalance = initialBalance - 0.01;

export const Balance: React.FC<React.PropsWithChildren> = () => {
  const [balance, setBalance] = useState(maxBalance);

  const handleChange = (newValue: number) => {
    setBalance(newValue);
  };

  const setMax = () => {
    setBalance(maxBalance);
  };

  return (
    <Box width="420px">
      <Slider name="slider" min={0} max={maxBalance} value={balance} onValueChanged={handleChange} />
      <Flex justifyContent="space-between" py="16px">
        {percentShortcuts.map((percent) => {
          const handleClick = () => {
            setBalance((percent / 100) * maxBalance);
          };

          return <Button scale="sm" variant="secondary" onClick={handleClick}>{`${percent}%`}</Button>;
        })}
        <Button scale="sm" variant="secondary" onClick={setMax}>
          Max
        </Button>
      </Flex>
      <Text>{`Current Balance: ${balance}`}</Text>
      <Text fontSize="12px" color="textSubtle">{`Initial Balance: ${initialBalance}`}</Text>
      <Text fontSize="12px" color="textSubtle">{`Max Balance: ${maxBalance}`}</Text>
    </Box>
  );
};
