import { Currency, CurrencyAmount, Percent } from "@pancakeswap/sdk";
import { useTranslation } from "@pancakeswap/localization";

import { Flex, Text, PencilIcon, IconButton } from "../../components";
import {
  RoiCardInner,
  RoiCardWrapper,
  RoiDollarAmount,
  RoiDisplayContainer,
  MILLION,
  TRILLION,
} from "../../components/RoiCalculatorModal/RoiCard";

interface Props {
  usdAmount?: number;
  tokenAmount?: CurrencyAmount<Currency>;
  rate?: Percent;
}

export function RoiRate({ usdAmount = 0, tokenAmount, rate }: Props) {
  const { t } = useTranslation();

  return (
    <RoiCardWrapper>
      <RoiCardInner>
        <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
          {t("ROI at current rates")}
        </Text>
        <Flex justifyContent="space-between" mt="4px" height="36px">
          <>
            <RoiDisplayContainer alignItems="flex-end">
              {/* Dollar sign is separate cause its not supposed to scroll with a number if number is huge */}
              <Text fontSize="24px" bold>
                $
              </Text>
              <RoiDollarAmount fontSize="24px" bold fadeOut={usdAmount > TRILLION}>
                {usdAmount.toLocaleString("en", {
                  minimumFractionDigits: usdAmount > MILLION ? 0 : 2,
                  maximumFractionDigits: usdAmount > MILLION ? 0 : 2,
                })}
              </RoiDollarAmount>
              <Text
                fontSize="16px"
                color="textSubtle"
                ml="6px"
                mb="4px"
                display="inline-block"
                maxWidth="100%"
                style={{ lineBreak: "anywhere" }}
              >
                (
                {Number.parseFloat(rate?.toSignificant(6) || "0").toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                %)
              </Text>
            </RoiDisplayContainer>
            <IconButton scale="sm" variant="text">
              <PencilIcon color="primary" />
            </IconButton>
          </>
        </Flex>
        <Text fontSize="12px" color="textSubtle">
          ~ {tokenAmount?.toSignificant(6)} {tokenAmount?.currency.symbol}
        </Text>
      </RoiCardInner>
    </RoiCardWrapper>
  );
}
