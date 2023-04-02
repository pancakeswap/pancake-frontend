import { useTranslation } from "@pancakeswap/localization";
import { memo, useCallback, useMemo } from "react";

import { ButtonMenuItem, Flex, Checkbox } from "../../components";
import { FullWidthButtonMenu } from "./FullWidthButtonMenu";

export const FREQUENCIES = ["12h", "1d", "7d", "30d"];

interface Props {
  on?: boolean;
  onToggleCompound?: (on: boolean) => void;
  compoundIndex?: number;
  onCompoundChange?: (compoundIndex: number) => void;
}

export const CompoundFrequency = memo(function CompoundFrequency({
  on = true,
  compoundIndex = 0,
  onToggleCompound = () => {
    // default
  },
  onCompoundChange = () => {
    // default
  },
}: Props) {
  const { t } = useTranslation();
  const frequencies = useMemo(
    () => [
      {
        key: FREQUENCIES[0],
        text: t("12H"),
      },
      {
        key: FREQUENCIES[1],
        text: t("1D"),
      },
      {
        key: FREQUENCIES[2],
        text: t("7D"),
      },
      {
        key: FREQUENCIES[3],
        text: t("30D"),
      },
    ],
    [t]
  );

  const onToggle = useCallback(() => onToggleCompound(!on), [onToggleCompound, on]);

  return (
    <Flex alignItems="center">
      <Flex flex="1">
        <Checkbox scale="sm" checked={on} onChange={onToggle} />
      </Flex>
      <Flex flex="6">
        <FullWidthButtonMenu scale="sm" disabled={!on} activeIndex={compoundIndex} onItemClick={onCompoundChange}>
          {frequencies.map((frequency) => (
            <ButtonMenuItem key={frequency.key} variant="tertiary">
              {frequency.text}
            </ButtonMenuItem>
          ))}
        </FullWidthButtonMenu>
      </Flex>
    </Flex>
  );
});
