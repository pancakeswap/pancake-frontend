import React from "react";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import { bscTokens } from "@pancakeswap/tokens";

import { CurrencyLogo } from "./index";

export default {
  title: "Components/CurrencyLogo",
  component: CurrencyLogo,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <CurrencyLogo currency={bscTokens.cake} />
      <CurrencyLogo currency={bscTokens.bnb} />
      <CurrencyLogo currency={bscTokens.btcb} />
      <CurrencyLogo currency={bscTokens.usdt} />
      <CurrencyLogo currency={bscTokens.usdc} />
    </div>
  );
};
