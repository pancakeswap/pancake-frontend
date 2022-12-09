import React from "react";
import { Flex, TooltipText, useTooltip } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";

export const AprRowWithToolTip: React.FC<React.PropsWithChildren<{ isVaultKey: boolean }>> = ({
  children,
  isVaultKey,
}) => {
  const { t } = useTranslation();

  const tooltipContent = t(
    "Calculated based on current rates and subject to change based on various external variables. It is a rough estimate provided for convenience only, and by no means represents guaranteed returns."
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: "bottom-start" });

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef}>{isVaultKey ? `${t("APY")}:` : `${t("APR")}:`}</TooltipText>
      {children}
    </Flex>
  );
};
