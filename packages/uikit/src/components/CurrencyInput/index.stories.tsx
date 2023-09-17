import React, { useState } from "react";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import { CurrencyAmount } from "@pancakeswap/sdk";

import { CurrencyInput } from "./index";
import { cakeToken } from "../../shared";

export default {
  title: "Components/CurrencyInput",
  component: CurrencyInput,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  const [value, setValue] = useState("1.0");

  const balance = CurrencyAmount.fromRawAmount(cakeToken, "10000000000000000000");
  const balanceText = `Balances: ${balance.toSignificant(6)}`;

  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <CurrencyInput
        currency={cakeToken}
        value={value}
        onChange={setValue}
        balance={balance}
        balanceText={balanceText}
      />
    </div>
  );
};
