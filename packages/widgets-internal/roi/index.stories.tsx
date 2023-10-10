import React, { useState } from "react";
import { LanguageProvider } from "@pancakeswap/localization";
import { CurrencyAmount, Price } from "@pancakeswap/sdk";
import { ethereumTokens } from "@pancakeswap/tokens";
import { FeeAmount } from "@pancakeswap/v3-sdk";
import { Button, MatchBreakpointsProvider } from "@pancakeswap/uikit";
import mockData from "swap/LiquidityChartRangeInput/mockData.json";

import { RoiCalculator } from "./RoiCalculator";
import { RoiCalculatorModal } from "./RoiCalculatorModal";

export default {
  title: "Widget/RoiCalculator",
  component: RoiCalculator,
  argTypes: {},
};

export const Default: React.FC<React.PropsWithChildren> = () => {
  return (
    <div style={{ padding: "32px", width: "800px" }}>
      <MatchBreakpointsProvider>
        <LanguageProvider>
          <RoiCalculator
            price={
              new Price({
                baseAmount: CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1564567634"),
                quoteAmount: CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000"),
              })
            }
            currencyA={ethereumTokens.weth}
            currencyB={ethereumTokens.usdc}
            balanceA={CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000")}
            balanceB={CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1464567634")}
            currencyAUsdPrice={1564.567634}
            currencyBUsdPrice={0.999999}
            sqrtRatioX96={2002509526268673110418559843593160n}
            liquidity={26477362146968540419n}
            feeAmount={FeeAmount.LOW}
            ticks={mockData as any}
            volume24H={291_000_000}
            priceUpper={
              new Price({
                baseAmount: CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1464567634"),
                quoteAmount: CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000"),
              })
            }
            priceLower={
              new Price({
                baseAmount: CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1764567634"),
                quoteAmount: CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000"),
              })
            }
          />
        </LanguageProvider>
      </MatchBreakpointsProvider>
    </div>
  );
};

export const CalculatorModal: React.FC<React.PropsWithChildren> = () => {
  const [isOpen, setOpen] = useState(false);
  return (
    <MatchBreakpointsProvider>
      <LanguageProvider>
        <Button onClick={() => setOpen(true)}>Show modal</Button>
        <RoiCalculatorModal
          isOpen={isOpen}
          onDismiss={() => setOpen(false)}
          price={
            new Price({
              baseAmount: CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1564567634"),
              quoteAmount: CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000"),
            })
          }
          currencyA={ethereumTokens.weth}
          currencyB={ethereumTokens.usdc}
          balanceA={CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000")}
          balanceB={CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1464567634")}
          currencyAUsdPrice={1564.567634}
          currencyBUsdPrice={0.999999}
          sqrtRatioX96={2002509526268673110418559843593160n}
          liquidity={26477362146968540419n}
          feeAmount={FeeAmount.LOW}
          ticks={mockData as any}
          volume24H={291_000_000}
          priceUpper={
            new Price({
              baseAmount: CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1464567634"),
              quoteAmount: CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000"),
            })
          }
          priceLower={
            new Price({
              baseAmount: CurrencyAmount.fromRawAmount(ethereumTokens.usdc, "1764567634"),
              quoteAmount: CurrencyAmount.fromRawAmount(ethereumTokens.weth, "1000000000000000000"),
            })
          }
        />
      </LanguageProvider>
    </MatchBreakpointsProvider>
  );
};
