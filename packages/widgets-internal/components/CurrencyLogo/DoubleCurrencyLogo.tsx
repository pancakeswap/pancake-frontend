import { useMemo } from "react";
import { Currency } from "@pancakeswap/sdk";
import { styled } from "styled-components";

import Image from "next/image";
import { CurrencyLogo } from "./CurrencyLogo";

const Wrapper = styled.div<{ margin: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: ${({ margin }) => margin && "4px"};
`;

interface DoubleCurrencyLogoProps {
  margin?: boolean;
  size?: number;
  currency0?: Currency;
  currency1?: Currency;
  innerMargin?: string | number;
  showChainLogo?: boolean;
}

export function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 20,
  margin = false,
  innerMargin = "4px",
  showChainLogo = false,
}: DoubleCurrencyLogoProps) {
  const chainLogoSize = useMemo(() => size * 0.66, [size]);
  return (
    <>
      <Wrapper margin={margin}>
        {currency0 && (
          <CurrencyLogo currency={currency0} size={`${size.toString()}px`} style={{ marginRight: innerMargin }} />
        )}
        {currency1 && <CurrencyLogo currency={currency1} size={`${size.toString()}px`} />}
        {showChainLogo && currency0 ? (
          <Image
            alt={`chain-${currency0.chainId}`}
            src={`https://assets.pancakeswap.finance/web/chains/${currency0.chainId}.png`}
            style={{ maxHeight: chainLogoSize, margin: "8px" }}
            width={chainLogoSize}
            height={chainLogoSize}
            unoptimized
          />
        ) : null}
      </Wrapper>
    </>
  );
}
