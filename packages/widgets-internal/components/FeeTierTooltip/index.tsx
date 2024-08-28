import { Protocol } from "@pancakeswap/farms";
import { useTranslation } from "@pancakeswap/localization";
import { Percent } from "@pancakeswap/swap-sdk-core";
import { FeeTier, LinkExternal, Text, useTooltip } from "@pancakeswap/uikit";
import { useMemo } from "react";

export type FeeTierTooltipProps = {
  type: Protocol;
  dynamic?: boolean;
  percent: Percent;
};

const FeeTooltips: React.FC<FeeTierTooltipProps> = ({ type, dynamic, percent }) => {
  const { t } = useTranslation();
  const p = useMemo(() => percent.toSignificant(2), [percent]);

  switch (type) {
    case "stable":
      return (
        <>
          <Text bold>{t("%t% LP", { t: "StableSwap" })}</Text>
          <div>{t("Fees are lower for Stable LP")}</div>
        </>
      );
    case "v4bin": {
      return (
        <>
          <Text bold>{t("%t% LP", { t: type.toUpperCase() })}</Text>
          {dynamic ? (
            <>
              {t("Dynamic fee: ↕️ %p%% Fee may vary based on several conditions", { p })}
              {/* @todo @ChefJerry */}
              <LinkExternal href="https://pancakeswap.finance/#todo">{t("Learn more")}</LinkExternal>
            </>
          ) : (
            t("Static Fee: %p%%", { p })
          )}
        </>
      );
    }
    case "v3":
    case "v2":
    default:
      return (
        <>
          <Text bold>{t("%t% LP", { t: type.toUpperCase() })}</Text>
          {t("%p%% Fee Tier", { p })}
        </>
      );
  }
};

export const FeeTierTooltip: React.FC<FeeTierTooltipProps> = ({ type, dynamic, percent }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <FeeTooltips type={type} dynamic={dynamic} percent={percent} />
  );

  const typeSymbol = useMemo(() => (type === "stable" ? "SS" : type), [type]);

  return (
    <>
      <FeeTier
        ref={targetRef}
        dynamic={dynamic}
        type={typeSymbol}
        fee={Number(percent.numerator)}
        denominator={Number(percent.denominator)}
      />
      {tooltipVisible && tooltip}
    </>
  );
};
