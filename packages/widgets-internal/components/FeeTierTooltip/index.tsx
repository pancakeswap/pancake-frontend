import { useTranslation } from "@pancakeswap/localization";
import { Percent } from "@pancakeswap/swap-sdk-core";
import { FeeTier, LinkExternal, useTooltip } from "@pancakeswap/uikit";
import { useMemo } from "react";

export type FeeTierType = "v2" | "v3" | "v4" | "stable" | string;

export type FeeTierTooltipProps = {
  type: FeeTierType;
  dynamic?: boolean;
  percent: Percent;
};

const FeeTooltips: React.FC<FeeTierTooltipProps> = ({ type, dynamic, percent }) => {
  const { t } = useTranslation();
  const p = useMemo(() => percent.toSignificant(2), [percent]);

  switch (type) {
    case "stable":
      return t("Fees are lower for Stable LP");
    case "v4": {
      if (dynamic) {
        return (
          <>
            {t("Dynamic fee: ↕️ %p%% Fee may vary based on several conditions", { p })}
            {/* @todo @ChefJerry */}
            <LinkExternal href="https://pancakeswap.finance/#todo">{t("Learn more")}</LinkExternal>
          </>
        );
      }
      return t("Static Fee: %p%%", { p });
    }
    case "v3":
    case "v2":
    default:
      return t("%p%% Fee Tier", { p });
  }
};

export const FeeTierTooltip: React.FC<FeeTierTooltipProps> = ({ type, dynamic, percent }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <FeeTooltips type={type} dynamic={dynamic} percent={percent} />
  );

  return (
    <>
      <FeeTier
        ref={targetRef}
        dynamic={dynamic}
        type={type}
        fee={Number(percent.numerator)}
        denominator={Number(percent.denominator)}
      />
      {tooltipVisible && tooltip}
    </>
  );
};
