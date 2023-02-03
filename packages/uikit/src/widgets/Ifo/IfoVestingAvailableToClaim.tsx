import { useMemo } from "react";
import BigNumber from "bignumber.js";
import { useTranslation } from "@pancakeswap/localization";
import { getFullDisplayBalance } from "@pancakeswap/utils/formatBalance";
import { Text } from "../../components/Text";

interface IfoVestingAvailableToClaimProps {
  amountToReceive: BigNumber;
  percentage: number;
  decimals: number;
  displayDecimals: number;
}

const IfoVestingAvailableToClaim: React.FC<React.PropsWithChildren<IfoVestingAvailableToClaimProps>> = ({
  amountToReceive,
  percentage,
  decimals,
  displayDecimals,
}) => {
  const { t } = useTranslation();

  const num = useMemo(() => {
    const vestingaPercentage = new BigNumber(100).minus(percentage).div(100);
    const total = new BigNumber(amountToReceive).times(vestingaPercentage);
    return getFullDisplayBalance(total, decimals, displayDecimals);
  }, [amountToReceive, percentage, decimals, displayDecimals]);

  return (
    <Text fontSize="14px" color="textSubtle">
      {t("~%num% available to claim at sales end", { num })}
    </Text>
  );
};

export default IfoVestingAvailableToClaim;
