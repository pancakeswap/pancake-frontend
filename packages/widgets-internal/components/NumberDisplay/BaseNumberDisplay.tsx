import { useTranslation } from "@pancakeswap/localization";
import { Text, useTooltip } from "@pancakeswap/uikit";
import type { CommonNumberDisplayProps } from "./types";

export type BaseNumberDisplayProps = {
  valueDisplayInFullDigits: string;
  valueDisplay: string;
} & CommonNumberDisplayProps;

export const BaseNumberDisplay = ({
  prefix,
  suffix,
  value,
  valueDisplayInFullDigits,
  valueDisplay,
  showFullDigitsTooltip = true,
  style,
  ...props
}: BaseNumberDisplayProps) => {
  const { t } = useTranslation();

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t("Exact number: %numberWithFullDigits%", { numberWithFullDigits: valueDisplayInFullDigits }),
    {
      placement: "top-end",
    }
  );
  const showTooltip = value && showFullDigitsTooltip && valueDisplay !== valueDisplayInFullDigits;

  return (
    <>
      <Text ref={targetRef} style={{ textDecoration: showTooltip ? "underline dotted" : "none", ...style }} {...props}>
        {prefix}
        {valueDisplay}
        {suffix}
      </Text>
      {showTooltip && tooltipVisible ? tooltip : null}
    </>
  );
};
