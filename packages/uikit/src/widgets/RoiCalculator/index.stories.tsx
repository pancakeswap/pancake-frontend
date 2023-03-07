import React from "react";
import { LanguageProvider } from "@pancakeswap/localization";
import { CurrencyAmount, JSBI, Price } from "@pancakeswap/sdk";
import { bscTokens } from "@pancakeswap/tokens";
import { FeeAmount } from "@pancakeswap/v3-sdk";

import { RoiCalculator } from "./RoiCalculator";
import mockData from "../../components/LiquidityChartRangeInput/mockData.json";

export default {
  title: "Widget/RoiCalculator",
  component: RoiCalculator,
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "500px" }}>
      <LanguageProvider>
        <RoiCalculator
          price={
            new Price({
              baseAmount: CurrencyAmount.fromRawAmount(bscTokens.usdt, "15671741929954778"),
              quoteAmount: CurrencyAmount.fromRawAmount(bscTokens.wbnb, "10000000000000"),
            })
          }
          currencyA={bscTokens.wbnb}
          currencyB={bscTokens.usdt}
          sqrtRatioX96={JSBI.BigInt("2001337577267227747966810537")}
          liquidity={JSBI.BigInt("3799256509904881797")}
          feeAmount={FeeAmount.MEDIUM}
          ticks={mockData}
          priceLower={
            new Price({
              baseAmount: CurrencyAmount.fromRawAmount(bscTokens.usdt, "15671741929954778"),
              quoteAmount: CurrencyAmount.fromRawAmount(bscTokens.wbnb, "5000000000000"),
            })
          }
          priceUpper={
            new Price({
              baseAmount: CurrencyAmount.fromRawAmount(bscTokens.usdt, "15671741929954778"),
              quoteAmount: CurrencyAmount.fromRawAmount(bscTokens.wbnb, "30000000000000"),
            })
          }
        />
      </LanguageProvider>
    </div>
  );
};
