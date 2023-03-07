import { Price, Currency } from "@pancakeswap/swap-sdk-core";
import { SyncAltIcon } from "@pancakeswap/uikit";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useState } from "react";
import { balanceMaxMiniClass } from "./SwapWidget.css";
import { AutoRenewIcon } from "../../components/Svg";
import { Text } from "../../components/Text";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
}

export function TradePrice({ price }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <Text style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
          <SyncAltIcon color="textSubtle" ml="4px" mr="4px" />
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
          <AtomBox className={balanceMaxMiniClass} onClick={() => setShowInverted(!showInverted)}>
            <AutoRenewIcon width="14px" />
          </AtomBox>
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
