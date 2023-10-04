import { useTranslation } from "@pancakeswap/localization";
import { memo } from "react";

import { Flex, Text } from "@pancakeswap/uikit";
import {
  RoiCardInner,
  RoiCardWrapper,
  RoiDollarAmount,
  RoiDisplayContainer,
  MILLION,
  TRILLION,
} from "@pancakeswap/uikit/components/RoiCalculatorModal/RoiCard";

interface Props {
  usdAmount?: number;
  roiPercent?: number;
}

export const RoiRate = memo(function RoiRate({ usdAmount = 0, roiPercent }: Props) {
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
              <RoiDollarAmount fontSize="24px" bold fadeOut={usdAmount > TRILLION} ellipsis>
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
                ellipsis
              >
                (
                {roiPercent?.toLocaleString("en", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }) ?? "-"}
                %)
              </Text>
            </RoiDisplayContainer>
          </>
        </Flex>
      </RoiCardInner>
    </RoiCardWrapper>
  );
});
