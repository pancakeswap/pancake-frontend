import React from "react";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import { bscTokens } from "@pancakeswap/tokens";
import { FeeAmount } from "@pancakeswap/v3-sdk";
import { CurrencyAmount, Price } from "@pancakeswap/sdk";

import { LiquidityChartRangeInput } from "./index";
import mockData from "./mockData.json";

export default {
  title: "Components/LiquidityChart",
  component: LiquidityChartRangeInput,
  argTypes: {},
} as Meta;

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <LiquidityChartRangeInput
        // price={0.0006380911608100259}
        price={
          new Price({
            baseAmount: CurrencyAmount.fromRawAmount(bscTokens.bnb, "15671741929954778"),
            quoteAmount: CurrencyAmount.fromRawAmount(bscTokens.cake, "10000000000000"),
          })
        }
        currencyA={bscTokens.bnb}
        currencyB={bscTokens.cake}
        tickCurrent={-202763}
        liquidity={3799256509904881797n}
        feeAmount={FeeAmount.MEDIUM}
        ticks={mockData}
      />
    </div>
  );
};
