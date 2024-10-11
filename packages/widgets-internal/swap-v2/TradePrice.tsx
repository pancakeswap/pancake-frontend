import { Currency, Price } from "@pancakeswap/swap-sdk-core";
import { FlexGap, SkeletonV2, SwapHorizIcon, Text } from "@pancakeswap/uikit";
import { formatPrice } from "@pancakeswap/utils/formatFractions";
import { useState } from "react";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
  loading?: boolean;
}

export function TradePrice({ price, loading }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);

  const formattedPrice = showInverted ? formatPrice(price, 6) : formatPrice(price?.invert(), 6);
  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <FlexGap justifyContent="center" alignItems="center">
      {show ? (
        <>
          <SkeletonV2 width="50px" height="18px" borderRadius="8px" minHeight="auto" isDataReady={!loading}>
            <Text fontSize="14px">
              {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
            </Text>
          </SkeletonV2>
          <SwapHorizIcon
            onClick={() => setShowInverted(!showInverted)}
            width="18px"
            height="18px"
            color="primary"
            ml="4px"
            mr="4px"
          />
          <SkeletonV2 width="100px" height="18px" borderRadius="8px" minHeight="auto" isDataReady={!loading}>
            <Text fontSize="14px">
              {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
            </Text>
          </SkeletonV2>
        </>
      ) : (
        "-"
      )}
    </FlexGap>
  );
}
