import { Price, Currency } from "@pancakeswap/swap-sdk-core";
import { Loading, SyncAltIcon } from "@pancakeswap/uikit";
import { formatPrice } from "@pancakeswap/utils/formatFractions";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useState, useCallback } from "react";
import { iconButtonClass } from "./SwapWidget.css";
import { Text } from "../../components/Text";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
  loading?: boolean;
}

export function TradePrice({ price, loading }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const formattedPrice = showInverted ? formatPrice(price, 6) : formatPrice(price?.invert(), 6);

  const toggleShowInverted = useCallback(() => {
    setShowInverted((prev) => !prev);
  }, []);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <Text
      fontSize="14px"
      style={{ justifyContent: "center", alignItems: "center", display: "flex", opacity: loading ? 0.6 : 1 }}
    >
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
          {loading ? (
            <AtomBox className={iconButtonClass}>
              <Loading width="12px" height="12px" />
            </AtomBox>
          ) : (
            <AtomBox mt="8px" ml="4px" mr="4px" onClick={toggleShowInverted} style={{ cursor: "pointer" }}>
              <SyncAltIcon color="textSubtle" />
            </AtomBox>
          )}
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
