import React from "react";
import { Flex, TooltipText, useTooltip } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";

export const AprRowWithToolTip: React.FC<React.PropsWithChildren<{ isVaultKey: boolean }>> = ({
  children,
  isVaultKey,
}) => {
  const { t } = useTranslation();

  const tooltipContent = isVaultKey
    ? t("APY includes compounding, APR doesn’t. This pool’s CAKE is compounded automatically, so we show APY.")
    : t("This pool’s rewards aren’t compounded automatically, so we show APR");

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: "bottom-start" });

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{isVaultKey ? `${t("APY")}:` : `${t("APR")}:`}</TooltipText>
      {children}
    </Flex>
  );
};
