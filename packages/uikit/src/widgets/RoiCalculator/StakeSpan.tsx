import { useTranslation } from "@pancakeswap/localization";
import { useMemo, memo } from "react";

import { ButtonMenuItem } from "../../components";
import { FullWidthButtonMenu } from "./FullWidthButtonMenu";

export const SPANS = ["1d", "7d", "30d", "1y", "5y"];

interface Props {
  spanIndex?: number;
  onSpanChange?: (spanIndex: number) => void;
}

export const StakeSpan = memo(function StakeSpan({
  spanIndex = 3,
  onSpanChange = () => {
    // default
  },
}: Props) {
  const { t } = useTranslation();
  const SPAN = useMemo(
    () => [
      {
        key: SPANS[0],
        text: t("1D"),
      },
      {
        key: SPANS[1],
        text: t("7D"),
      },
      {
        key: SPANS[2],
        text: t("30D"),
      },
      {
        key: SPANS[3],
        text: t("1Y"),
      },
      {
        key: SPANS[4],
        text: t("5Y"),
      },
    ],
    [t]
  );

  return (
    <FullWidthButtonMenu activeIndex={spanIndex} onItemClick={onSpanChange} scale="sm">
      {SPAN.map((span) => (
        <ButtonMenuItem key={span.key} variant="tertiary">
          {span.text}
        </ButtonMenuItem>
      ))}
    </FullWidthButtonMenu>
  );
});
