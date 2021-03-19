import React, { useState } from "react";
import Box from "../Box/Box";
import BalanceInput from "./BalanceInput";

export default {
  title: "Components/BalanceInput",
  component: BalanceInput,
  argTypes: {},
};

export const Default: React.FC = () => {
  const [value, setValue] = useState(1.43333);
  const currencyValue = `~${(value * 1.3).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} USD`;

  const handleChange = (evt) => {
    setValue(evt.target.value);
  };

  return (
    <Box width="300px">
      <BalanceInput value={value} currencyValue={currencyValue} onChange={handleChange} placeholder="0.0" mb="32px" />
      <BalanceInput
        value={value * 1.5}
        currencyValue={currencyValue}
        onChange={handleChange}
        placeholder="1.5"
        isWarning
        mb="32px"
      />
    </Box>
  );
};
