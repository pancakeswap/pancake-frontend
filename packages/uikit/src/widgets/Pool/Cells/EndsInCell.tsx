import getTimePeriods from "@pancakeswap/utils/getTimePeriods";
import { useTranslation } from "@pancakeswap/localization";
import { useMemo } from "react";
import { CellContent, BaseCell } from "./BaseCell";
import { Flex } from "../../../components/Box";

import { Text } from "../../../components/Text";
import { DeserializedPool } from "../types";
import { useTooltip } from "../../../hooks";
import { TimerIcon } from "../../../components/Svg";

interface EndsInCellProps<T> {
  pool: DeserializedPool<T>;
  getNow: () => number;
}

interface EndTimeTooltipComponentProps {
  endTime: number;
}

export const EndTimeTooltipComponent: React.FC<React.PropsWithChildren<EndTimeTooltipComponentProps>> = ({
  endTime,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation();

  return (
    <>
      <Text bold>{t("End Time")}:</Text>
      <Text>
        {new Date(endTime * 1000).toLocaleString(locale, {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </Text>
    </>
  );
};

export function TimeCountdownDisplay({
  timestamp,
  getNow = () => Date.now(),
}: {
  timestamp: number;
  getNow?: () => number;
}) {
  const { t } = useTranslation();

  const currentDate = getNow() / 1000;
  const poolTimeRemaining = Math.abs(timestamp - currentDate);
  const endTimeObject = useMemo(() => getTimePeriods(poolTimeRemaining), [poolTimeRemaining]);

  const {
    targetRef: endTimeTargetRef,
    tooltip: endTimeTooltip,
    tooltipVisible: endTimeTooltipVisible,
  } = useTooltip(<EndTimeTooltipComponent endTime={timestamp} />, {
    placement: "top",
  });

  return (
    <Flex alignItems="center">
      <Text color="textSubtle" small>
        {poolTimeRemaining > 0
          ? endTimeObject?.totalDays
            ? endTimeObject?.totalDays === 1
              ? t("1 day")
              : t("%days% days", { days: endTimeObject?.totalDays })
            : t("< 1 day")
          : t("%days% days", { days: 0 })}
      </Text>
      <span ref={endTimeTargetRef}>
        <TimerIcon ml="4px" color="primary" />
        {endTimeTooltipVisible && endTimeTooltip}
      </span>
    </Flex>
  );
}

export function EndsInCell<T>({ pool, getNow }: EndsInCellProps<T>) {
  const { t } = useTranslation();
  const { endTimestamp = 0, isFinished } = pool;

  const countdown =
    isFinished || !endTimestamp ? <Text>-</Text> : <TimeCountdownDisplay timestamp={endTimestamp} getNow={getNow} />;

  return (
    <BaseCell role="cell" flex={["1 0 50px", "1 0 50px", "2 0 100px", "2 0 100px", "1 0 120px"]}>
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t("Ends in")}
        </Text>
        {countdown}
      </CellContent>
    </BaseCell>
  );
}
