import React from "react";
/* eslint-disable import/no-unresolved */
import { Meta } from "@storybook/react/types-6-0";
import { FeeAmount } from "@pancakeswap/v3-sdk";
import { CurrencyAmount, Price } from "@pancakeswap/sdk";

import mockData from "./mockData.json";
import { LiquidityChartRangeInput } from "./LiquidityChartRangeInput";
import { cakeToken, bscToken } from "../../mockData";
import { TickDataRaw } from "./types";

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
        price={parseFloat(
          new Price({
            baseAmount: CurrencyAmount.fromRawAmount(bscToken, "15671741929954778"),
            quoteAmount: CurrencyAmount.fromRawAmount(cakeToken, "10000000000000"),
          }).toSignificant(6)
        )}
        currencyA={bscToken}
        currencyB={cakeToken}
        tickCurrent={-202763}
        liquidity={3799256509904881797n}
        feeAmount={FeeAmount.MEDIUM}
        formattedData={[]}
        ticks={mockData as unknown as TickDataRaw[]}
      />
    </div>
  );
};
