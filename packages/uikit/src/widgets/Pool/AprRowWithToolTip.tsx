import React, { ReactNode } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { Flex } from "../../components/Box";
import { TooltipText } from "../../components/Text";
import { useTooltip } from "../../hooks";

export const AprRowWithToolTip: React.FC<React.PropsWithChildren<{ questionTooltip?: ReactNode }>> = ({
  children,
  questionTooltip,
}) => {
  const { t } = useTranslation();

  const tooltipContent = t(
    "Calculated based on current rates and subject to change based on various external variables. It is a rough estimate provided for convenience only, and by no means represents guaranteed returns."
  );

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: "bottom-start" });

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {tooltipVisible && tooltip}
      <Flex>
        <TooltipText ref={targetRef}>{`${t("APR")}:`}</TooltipText>
        {questionTooltip}
      </Flex>
      {children}
    </Flex>
  );
};
