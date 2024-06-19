import React from "react";
import Select from "./Select";

export default {
  title: "Components/Select",
  component: Select,
  argTypes: {
    defaultOptionIndex: { control: "number" },
  },
};

export const Default: React.FC<React.PropsWithChildren> = (args) => {
  return (
    <Select
      options={[
        {
          label: "Hot",
          value: "hot",
        },
        {
          label: "APR",
          value: "apr",
        },
        {
          label: "Multiplier",
          value: "multiplier",
        },
        {
          label: "Earned",
          value: "earned",
        },
        {
          label: "Liquidity",
          value: "liquidity",
        },
        {
          label: "Latest",
          value: "latest",
        },
      ]}
      {...args}
    />
  );
};
