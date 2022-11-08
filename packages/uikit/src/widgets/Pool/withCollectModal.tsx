import { Flex, Text, Button, Heading, Skeleton, Balance, useModal } from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { ReactElement } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { getFullDisplayBalance, getBalanceNumber, formatNumber } from "@pancakeswap/utils/formatBalance";
import { CollectModalProps } from "./CollectModal";

interface HarvestActionsProps {
  earnings: BigNumber;
  isLoading?: boolean;
  onPresentCollect: any;
  earningTokenPrice: number;
  earningTokenBalance: number;
  earningTokenDollarBalance: number;
}

const HarvestActions: React.FC<React.PropsWithChildren<HarvestActionsProps>> = ({
  earnings,
  isLoading,
  onPresentCollect,
  earningTokenPrice,
  earningTokenBalance,
  earningTokenDollarBalance,
}) => {
  const { t } = useTranslation();
  const hasEarnings = earnings.toNumber() > 0;

  return (
    <Flex justifyContent="space-between" alignItems="center" mb="16px">
      <Flex flexDirection="column">
        {isLoading ? (
          <Skeleton width="80px" height="48px" />
        ) : (
          <>
            {hasEarnings ? (
              <>
                <Balance bold fontSize="20px" decimals={5} value={earningTokenBalance} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Heading color="textDisabled">0</Heading>
                <Text fontSize="12px" color="textDisabled">
                  0 USD
                </Text>
              </>
            )}
          </>
        )}
      </Flex>
      <Button disabled={!hasEarnings} onClick={onPresentCollect}>
        {t("Harvest")}
      </Button>
    </Flex>
  );
};

interface WithHarvestActionsProps {
  earnings: BigNumber;
  earningTokenSymbol: string;
  sousId: number;
  isBnbPool: boolean;
  earningTokenPrice: number;
  isLoading?: boolean;
  earningTokenDecimals: number;
  earningTokenAddress?: string;
  poolAddress?: {
    [index: number]: string;
  };
}

export const withCollectModal =
  (CollectModalComponent: (props: CollectModalProps) => ReactElement) =>
  ({
    earnings,
    earningTokenSymbol,
    earningTokenAddress,
    earningTokenDecimals,
    sousId,
    isBnbPool,
    earningTokenPrice,
    isLoading,
    poolAddress,
  }: WithHarvestActionsProps) => {
    const earningTokenBalance: number = getBalanceNumber(earnings, earningTokenDecimals);

    const formattedBalance = formatNumber(earningTokenBalance, 5, 5);

    const fullBalance = getFullDisplayBalance(earnings, earningTokenDecimals);

    const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningTokenDecimals);

    const [onPresentCollect] = useModal(
      <CollectModalComponent
        formattedBalance={formattedBalance}
        fullBalance={fullBalance}
        earningTokenSymbol={earningTokenSymbol}
        earningsDollarValue={earningTokenDollarBalance}
        sousId={sousId}
        isBnbPool={isBnbPool}
        earningTokenAddress={earningTokenAddress}
        poolAddress={poolAddress}
      />
    );

    return (
      <HarvestActions
        onPresentCollect={onPresentCollect}
        earnings={earnings}
        earningTokenPrice={earningTokenPrice}
        earningTokenDollarBalance={earningTokenDollarBalance}
        earningTokenBalance={earningTokenBalance}
        isLoading={isLoading}
      />
    );
  };
