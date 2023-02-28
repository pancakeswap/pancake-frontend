import { Price, Currency } from "@pancakeswap/swap-sdk-core";
import { SyncAltIcon } from "@pancakeswap/uikit";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useState, useCallback } from "react";
import { Text } from "../../components/Text";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
}

export function TradePrice({ price }: TradePriceProps) {
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const toggleShowInverted = useCallback(() => {
    setShowInverted((prev) => !prev);
  }, []);

  const formattedPrice = showInverted ? price?.toSignificant(6) : price?.invert()?.toSignificant(6);

  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  return (
    <Text style={{ justifyContent: "center", alignItems: "center", display: "flex" }}>
      {show ? (
        <>
          {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
          <AtomBox mt="8px" ml="4px" mr="4px" onClick={toggleShowInverted} style={{ cursor: "pointer" }}>
            <SyncAltIcon color="textSubtle" />
          </AtomBox>
          {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
        </>
      ) : (
        "-"
      )}
    </Text>
  );
}
