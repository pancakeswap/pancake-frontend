import { BIG_ZERO } from "@pancakeswap/utils/bigNumber";
import { Text, useMatchBreakpoints, Pool } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { useTranslation } from "@pancakeswap/localization";
import { createElement, FunctionComponent } from "react";

interface AprCellProps<T> {
  pool: Pool.DeserializedPool<T>;
  aprComp: FunctionComponent<{
    pool: Pool.DeserializedPool<T>;
    stakedBalance: BigNumber;
    showIcon: boolean;
  }>;
}

export function AprCell<T>({ pool, aprComp }: AprCellProps<T>) {
  const { t } = useTranslation();
  const { isMobile } = useMatchBreakpoints();
  const { userData } = pool;
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO;

  return (
    <Pool.BaseCell role="cell" flex={["1 0 50px", "1 0 50px", "2 0 100px", "2 0 100px", "1 0 120px"]}>
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t("APR")}
        </Text>
        {createElement(aprComp, {
          pool,
          stakedBalance,
          showIcon: !isMobile,
        })}
      </Pool.CellContent>
    </Pool.BaseCell>
  );
}
