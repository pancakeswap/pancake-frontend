import BigNumber from "bignumber.js";
import { useTranslation } from "@pancakeswap/localization";
import { Text, TextProps } from "../../components/Text";

interface IfoPercentageOfTotalProps extends TextProps {
  userAmount: BigNumber;
  totalAmount: BigNumber;
}

const IfoPercentageOfTotal: React.FC<React.PropsWithChildren<IfoPercentageOfTotalProps>> = ({
  userAmount,
  totalAmount,
  ...props
}) => {
  const { t } = useTranslation();
  const percentOfUserContribution = totalAmount.isGreaterThan(0)
    ? userAmount.div(totalAmount).times(100).toNumber()
    : 0;
  const percentOfUserDisplay = percentOfUserContribution.toLocaleString(undefined, { maximumFractionDigits: 5 });

  return (
    <Text fontSize="14px" color="textSubtle" {...props}>
      {t("%num% of total", { num: `${percentOfUserDisplay}%` })}
    </Text>
  );
};

export default IfoPercentageOfTotal;
