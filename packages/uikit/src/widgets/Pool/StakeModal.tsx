import { useTranslation } from "@pancakeswap/localization";

import BigNumber from "bignumber.js";
import { useCallback, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { getInterestBreakdown } from "@pancakeswap/utils/compoundApyHelpers";
import { formatNumber, getDecimalAmount, getFullDisplayBalance } from "@pancakeswap/utils/formatBalance";
import removeTrailingZeros from "@pancakeswap/utils/removeTrailingZeros";

import PercentageButton from "./PercentageButton";
import getThemeValue from "../../util/getThemeValue";

import {
  AutoRenewIcon,
  BalanceInput,
  Button,
  CalculateIcon,
  Flex,
  IconButton,
  Image,
  Link,
  Skeleton,
  Slider,
  Text,
  RoiCalculatorModal,
} from "../../components";
import { Modal } from "../Modal";

const StyledLink = styled(Link)`
  width: 100%;
`;

const AnnualRoiContainer = styled(Flex)`
  cursor: pointer;
`;

const AnnualRoiDisplay = styled(Text)`
  width: 72px;
  max-width: 72px;
  overflow: hidden;
  text-align: right;
  text-overflow: ellipsis;
`;

interface StakeModalProps {
  // Pool attributes
  stakingTokenDecimals: number;
  stakingTokenSymbol: string;
  stakingTokenAddress: string;
  earningTokenPrice: number;
  apr: number;
  stakingLimit: BigNumber;
  earningTokenSymbol: string;
  userDataStakedBalance: BigNumber;
  userDataStakingTokenBalance: BigNumber;
  enableEmergencyWithdraw: boolean;

  stakingTokenBalance: BigNumber;
  stakingTokenPrice: number;
  isRemovingStake?: boolean;
  needEnable?: boolean;
  enablePendingTx?: boolean;
  setAmount?: (value: string) => void;
  onDismiss?: () => void;
  handleEnableApprove?: () => void;
  account: string;
  handleConfirmClick: any;
  pendingTx: boolean;
}

export const StakeModal: React.FC<React.PropsWithChildren<StakeModalProps>> = ({
  stakingTokenDecimals,
  stakingTokenSymbol,
  stakingTokenAddress,
  stakingTokenBalance,
  stakingTokenPrice,
  apr,
  stakingLimit,
  earningTokenPrice,
  earningTokenSymbol,
  userDataStakedBalance,
  userDataStakingTokenBalance,
  enableEmergencyWithdraw,
  isRemovingStake = false,
  needEnable,
  enablePendingTx,
  setAmount,
  onDismiss,
  handleEnableApprove,
  account,
  pendingTx,
  handleConfirmClick,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [stakeAmount, setStakeAmount] = useState("");
  const [hasReachedStakeLimit, setHasReachedStakedLimit] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showRoiCalculator, setShowRoiCalculator] = useState(false);
  const getCalculatedStakingLimit = useCallback(() => {
    if (isRemovingStake) {
      return userDataStakedBalance;
    }
    if (stakingLimit.gt(0)) {
      const stakingLimitLeft = stakingLimit.minus(userDataStakedBalance);
      if (stakingTokenBalance.gt(stakingLimitLeft)) {
        return stakingLimitLeft;
      }
    }
    return stakingTokenBalance;
  }, [userDataStakedBalance, stakingTokenBalance, stakingLimit, isRemovingStake]);
  const fullDecimalStakeAmount = getDecimalAmount(new BigNumber(stakeAmount), stakingTokenDecimals);
  const userNotEnoughToken = isRemovingStake
    ? userDataStakedBalance.lt(fullDecimalStakeAmount)
    : userDataStakingTokenBalance.lt(fullDecimalStakeAmount);

  const usdValueStaked = new BigNumber(stakeAmount).times(stakingTokenPrice);
  const formattedUsdValueStaked = !usdValueStaked.isNaN() && formatNumber(usdValueStaked.toNumber());

  const interestBreakdown = getInterestBreakdown({
    principalInUSD: !usdValueStaked.isNaN() ? usdValueStaked.toNumber() : 0,
    apr,
    earningTokenPrice,
  });
  const annualRoi = interestBreakdown[3] * earningTokenPrice;
  const formattedAnnualRoi = formatNumber(annualRoi, annualRoi > 10000 ? 0 : 2, annualRoi > 10000 ? 0 : 2);

  const getTokenLink = stakingTokenAddress ? `/swap?outputCurrency=${stakingTokenAddress}` : "/swap";

  useEffect(() => {
    if (stakingLimit.gt(0) && !isRemovingStake) {
      setHasReachedStakedLimit(fullDecimalStakeAmount.plus(userDataStakedBalance).gt(stakingLimit));
    }
  }, [
    stakeAmount,
    stakingLimit,
    isRemovingStake,
    setHasReachedStakedLimit,
    fullDecimalStakeAmount,
    userDataStakedBalance,
  ]);

  const handleStakeInputChange = (input: string) => {
    if (input) {
      const convertedInput = getDecimalAmount(new BigNumber(input), stakingTokenDecimals);
      const percentage = Math.floor(convertedInput.dividedBy(getCalculatedStakingLimit()).multipliedBy(100).toNumber());
      setPercent(Math.min(percentage, 100));
    } else {
      setPercent(0);
    }
    setStakeAmount(input);
  };

  const handleChangePercent = useCallback(
    (sliderPercent: number) => {
      if (sliderPercent > 0) {
        const percentageOfStakingMax = getCalculatedStakingLimit().dividedBy(100).multipliedBy(sliderPercent);
        const amountToStake = getFullDisplayBalance(percentageOfStakingMax, stakingTokenDecimals, stakingTokenDecimals);

        setStakeAmount(removeTrailingZeros(amountToStake));
      } else {
        setStakeAmount("");
      }
      setPercent(sliderPercent);
    },
    [getCalculatedStakingLimit, stakingTokenDecimals]
  );

  useEffect(() => {
    if (setAmount) {
      setAmount(Number(stakeAmount) > 0 ? stakeAmount : "0");
    }
  }, [setAmount, stakeAmount]);

  if (showRoiCalculator) {
    return (
      <RoiCalculatorModal
        account={account}
        earningTokenPrice={earningTokenPrice}
        stakingTokenPrice={stakingTokenPrice}
        stakingTokenDecimals={stakingTokenDecimals}
        apr={apr}
        linkLabel={t("Get %symbol%", { symbol: stakingTokenSymbol })}
        linkHref={getTokenLink}
        stakingTokenBalance={userDataStakedBalance.plus(stakingTokenBalance)}
        stakingTokenSymbol={stakingTokenSymbol}
        earningTokenSymbol={earningTokenSymbol}
        onBack={() => setShowRoiCalculator(false)}
        initialValue={stakeAmount}
      />
    );
  }

  return (
    <Modal
      minWidth="346px"
      title={isRemovingStake ? t("Unstake") : t("Stake in Pool")}
      onDismiss={onDismiss}
      headerBackground={getThemeValue(theme, "colors.gradientCardHeader")}
    >
      {stakingLimit.gt(0) && !isRemovingStake && (
        <Text color="secondary" bold mb="24px" style={{ textAlign: "center" }} fontSize="16px">
          {t("Max stake for this pool: %amount% %token%", {
            amount: getFullDisplayBalance(stakingLimit, stakingTokenDecimals, 0),
            token: stakingTokenSymbol,
          })}
        </Text>
      )}
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Text bold>{isRemovingStake ? t("Unstake") : t("Stake")}:</Text>
        <Flex alignItems="center" minWidth="70px">
          <Image src={`/images/tokens/${stakingTokenAddress}.png`} width={24} height={24} alt={stakingTokenSymbol} />
          <Text ml="4px" bold>
            {stakingTokenSymbol}
          </Text>
        </Flex>
      </Flex>
      <BalanceInput
        value={stakeAmount}
        onUserInput={handleStakeInputChange}
        currencyValue={stakingTokenPrice !== 0 && `~${formattedUsdValueStaked || 0} USD`}
        isWarning={hasReachedStakeLimit || userNotEnoughToken}
        decimals={stakingTokenDecimals}
      />
      {hasReachedStakeLimit && (
        <Text color="failure" fontSize="12px" style={{ textAlign: "right" }} mt="4px">
          {t("Maximum total stake: %amount% %token%", {
            amount: getFullDisplayBalance(new BigNumber(stakingLimit), stakingTokenDecimals, 0),
            token: stakingTokenSymbol,
          })}
        </Text>
      )}
      {userNotEnoughToken && (
        <Text color="failure" fontSize="12px" style={{ textAlign: "right" }} mt="4px">
          {t("Insufficient %symbol% balance", {
            symbol: stakingTokenSymbol,
          })}
        </Text>
      )}
      {needEnable && (
        <Text color="failure" textAlign="right" fontSize="12px" mt="8px">
          {t('Insufficient token allowance. Click "Enable" to approve.')}
        </Text>
      )}
      <Text ml="auto" color="textSubtle" fontSize="12px" mb="8px">
        {t("Balance: %balance%", {
          balance: getFullDisplayBalance(
            isRemovingStake ? userDataStakedBalance : stakingTokenBalance,
            stakingTokenDecimals
          ),
        })}
      </Text>
      <Slider
        min={0}
        max={100}
        value={percent}
        onValueChanged={handleChangePercent}
        name="stake"
        valueLabel={`${percent}%`}
        step={1}
      />
      <Flex alignItems="center" justifyContent="space-between" mt="8px">
        <PercentageButton onClick={() => handleChangePercent(25)}>25%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(50)}>50%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(75)}>75%</PercentageButton>
        <PercentageButton onClick={() => handleChangePercent(100)}>{t("Max")}</PercentageButton>
      </Flex>
      {!isRemovingStake && (
        <Flex mt="24px" alignItems="center" justifyContent="space-between">
          <Text mr="8px" color="textSubtle">
            {t("Annual ROI at current rates")}:
          </Text>
          {Number.isFinite(annualRoi) ? (
            <AnnualRoiContainer
              alignItems="center"
              onClick={() => {
                setShowRoiCalculator(true);
              }}
            >
              <AnnualRoiDisplay>${formattedAnnualRoi}</AnnualRoiDisplay>
              <IconButton variant="text" scale="sm">
                <CalculateIcon color="textSubtle" width="18px" />
              </IconButton>
            </AnnualRoiContainer>
          ) : (
            <Skeleton width={60} />
          )}
        </Flex>
      )}
      {isRemovingStake && enableEmergencyWithdraw && (
        <Flex maxWidth="346px" mt="24px">
          <Text textAlign="center">
            {t(
              "This pool was misconfigured. Please unstake your tokens from it, emergencyWithdraw method will be used. Your tokens will be returned to your wallet, however rewards will not be harvested."
            )}
          </Text>
        </Flex>
      )}
      {needEnable ? (
        <Button
          isLoading={enablePendingTx}
          endIcon={enablePendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleEnableApprove}
          mt="24px"
        >
          {t("Enable")}
        </Button>
      ) : (
        <Button
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={() => handleConfirmClick(stakeAmount)}
          disabled={!stakeAmount || parseFloat(stakeAmount) === 0 || hasReachedStakeLimit || userNotEnoughToken}
          mt="24px"
        >
          {pendingTx ? t("Confirming") : t("Confirm")}
        </Button>
      )}
      {!isRemovingStake && (
        <StyledLink external href={getTokenLink}>
          <Button width="100%" mt="8px" variant="secondary">
            {t("Get %symbol%", { symbol: stakingTokenSymbol })}
          </Button>
        </StyledLink>
      )}
    </Modal>
  );
};
