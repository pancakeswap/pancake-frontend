import {
  Flex,
  Text,
  Button,
  IconButton,
  AddIcon,
  MinusIcon,
  useModal,
  Skeleton,
  useTooltip,
  Balance,
} from "@pancakeswap/uikit";
import BigNumber from "bignumber.js";
import { ReactElement } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { getBalanceNumber } from "@pancakeswap/utils/formatBalance";
import { DeserializedPool } from "./types";
import NotEnoughTokensModal from "../Modal/NotEnoughTokensModal";

interface StakeActionsPropsType<T> {
  pool: DeserializedPool<T>;
  stakingTokenBalance: BigNumber;
  stakedBalance: BigNumber;
  isBnbPool: boolean;
  isStaked: ConstrainBoolean;
  isLoading?: boolean;
  hideLocateAddress?: boolean;
}

export interface StakeModalPropsType<T> {
  isBnbPool: boolean;
  pool: DeserializedPool<T>;
  stakingTokenBalance: BigNumber;
  stakingTokenPrice: number;
  isRemovingStake?: boolean;
  onDismiss?: () => void;
}

export function withStakeActions<T>(StakeModal: (props: StakeModalPropsType<T>) => ReactElement) {
  return ({
    pool,
    stakingTokenBalance,
    stakedBalance,
    isBnbPool,
    isStaked,
    isLoading = false,
    hideLocateAddress = false,
  }: StakeActionsPropsType<T>) => {
    const { stakingToken, stakingTokenPrice, stakingLimit, isFinished, userData } = pool;
    const { t } = useTranslation();
    const stakedTokenBalance = getBalanceNumber(stakedBalance, stakingToken?.decimals);
    const stakedTokenDollarBalance = stakingTokenPrice
      ? getBalanceNumber(stakedBalance?.multipliedBy(stakingTokenPrice), stakingToken?.decimals)
      : 0;

    const [onPresentTokenRequired] = useModal(
      <NotEnoughTokensModal
        hideLocateAddress={hideLocateAddress}
        tokenAddress={stakingToken.address}
        tokenSymbol={stakingToken?.symbol || ""}
      />
    );

    const [onPresentStake] = useModal(
      <StakeModal
        isBnbPool={isBnbPool}
        pool={pool}
        stakingTokenBalance={stakingTokenBalance}
        stakingTokenPrice={stakingTokenPrice || 0}
      />
    );

    const [onPresentUnstake] = useModal(
      <StakeModal
        stakingTokenBalance={stakingTokenBalance}
        isBnbPool={isBnbPool}
        pool={pool}
        stakingTokenPrice={stakingTokenPrice || 0}
        isRemovingStake
      />
    );

    const { targetRef, tooltip, tooltipVisible } = useTooltip(
      t("You’ve already staked the maximum amount you can stake in this pool!"),
      { placement: "bottom" }
    );

    const reachStakingLimit = stakingLimit?.gt(0) && userData?.stakedBalance?.gte(stakingLimit);

    const renderStakeAction = () => {
      return isStaked ? (
        <Flex justifyContent="space-between" alignItems="center">
          <Flex flexDirection="column">
            <>
              <Balance bold fontSize="20px" decimals={3} value={stakedTokenBalance} />
              {stakingTokenPrice !== 0 && (
                <Text fontSize="12px" color="textSubtle">
                  <Balance
                    fontSize="12px"
                    color="textSubtle"
                    decimals={2}
                    value={stakedTokenDollarBalance}
                    prefix="~"
                    unit=" USD"
                  />
                </Text>
              )}
            </>
          </Flex>
          <Flex>
            <IconButton variant="secondary" onClick={onPresentUnstake} mr="6px">
              <MinusIcon color="primary" width="24px" />
            </IconButton>
            {reachStakingLimit ? (
              <span ref={targetRef}>
                <IconButton variant="secondary" disabled>
                  <AddIcon color="textDisabled" width="24px" height="24px" />
                </IconButton>
              </span>
            ) : (
              <IconButton
                variant="secondary"
                onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}
                disabled={isFinished}
              >
                <AddIcon color="primary" width="24px" height="24px" />
              </IconButton>
            )}
          </Flex>
          {tooltipVisible && tooltip}
        </Flex>
      ) : (
        <Button disabled={isFinished} onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
          {t("Stake")}
        </Button>
      );
    };

    return (
      <Flex flexDirection="column">{isLoading ? <Skeleton width="100%" height="52px" /> : renderStakeAction()}</Flex>
    );
  };
}
