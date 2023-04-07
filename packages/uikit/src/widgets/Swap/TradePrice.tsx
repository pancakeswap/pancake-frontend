import { useTranslation } from "@pancakeswap/localization";
import { Price, Currency } from "@pancakeswap/swap-sdk-core";
import { Loading, SyncAltIcon } from "@pancakeswap/uikit";
import { formatPrice } from "@pancakeswap/utils/formatFractions";
import { AtomBox } from "@pancakeswap/ui/components/AtomBox";
import { useState, useEffect } from "react";
import { iconButtonClass } from "./SwapWidget.css";
import { AutoRenewIcon } from "../../components/Svg";
import { Text } from "../../components/Text";

interface TradePriceProps {
  price?: Price<Currency, Currency>;
  loading?: boolean;
}

export function TradePrice({ price, loading }: TradePriceProps) {
  const { t } = useTranslation();
  const [showInverted, setShowInverted] = useState<boolean>(false);
  const [onLoadingSlow, setOnLoadingSlow] = useState<boolean>(false);

  const formattedPrice = showInverted ? formatPrice(price, 6) : formatPrice(price?.invert(), 6);
  const show = Boolean(price?.baseCurrency && price?.quoteCurrency);

  useEffect(() => {
    let count = 0;

    // When loading exceeds 10 seconds, prompt the user "Fetching best price..."
    const timer = setInterval(() => {
      count++;
      if (loading) {
        if (count >= 10) {
          setOnLoadingSlow(true);
        }
      } else {
        setOnLoadingSlow(false);
        count = 0;
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [loading]);

  return (
    <Text
      fontSize="14px"
      style={{ justifyContent: "center", alignItems: "center", display: "flex", opacity: loading ? 0.6 : 1 }}
    >
      {show ? (
        <>
          {loading && onLoadingSlow ? (
            t("Fetching best price...")
          ) : (
            <>
              {`1 ${showInverted ? price?.baseCurrency?.symbol : price?.quoteCurrency?.symbol}`}
              <SyncAltIcon width="14px" height="14px" color="textSubtle" ml="4px" mr="4px" />
              {`${formattedPrice} ${showInverted ? price?.quoteCurrency?.symbol : price?.baseCurrency?.symbol}`}
            </>
          )}
          {loading ? (
            <AtomBox className={iconButtonClass}>
              <Loading width="12px" height="12px" />
            </AtomBox>
          ) : (
            <AtomBox role="button" className={iconButtonClass} onClick={() => setShowInverted(!showInverted)}>
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
