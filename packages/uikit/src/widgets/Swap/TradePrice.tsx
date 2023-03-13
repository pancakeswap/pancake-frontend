import { Price, Currency } from "@pancakeswap/swap-sdk-core";
import { Loading, SyncAltIcon } from "@pancakeswap/uikit";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useState } from "react";
import { iconButtonClass } from "./SwapWidget.css";
import { AutoRenewIcon } from "../../components/Svg";
import { Text } from "../../components/Text";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
  loading?: boolean;
}

export function TradePrice({ price, loading }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <Text
      fontSize="14px"
      style={{ justifyContent: "center", alignItems: "center", display: "flex", opacity: loading ? 0.6 : 1 }}
    >
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
          <SyncAltIcon width="14px" height="14px" color="textSubtle" ml="4px" mr="4px" />
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
          {loading ? (
            <AtomBox className={iconButtonClass}>
              <Loading width="12px" height="12px" />
            </AtomBox>
          ) : (
            <AtomBox className={iconButtonClass} onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </AtomBox>
          )}
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
