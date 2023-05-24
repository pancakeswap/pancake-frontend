import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Text, InfoIcon, Message, MessageText, Pool } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import AddCakeButton from 'views/Pools/components/LockedPool/Buttons/AddCakeButton'
import { Token } from '@pancakeswap/sdk'
import { DeserializedLockedVaultUser } from 'state/types'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import useRewardInCake from 'views/TradingReward/hooks/useRewardInCake'
import useRewardInUSD from 'views/TradingReward/hooks/useRewardInUSD'

interface QualifiedPreviewProps {
  timeRemaining: number
  campaignClaimTime: number
  pool: Pool.DeserializedPool<Token>
  userData: DeserializedLockedVaultUser
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail
}

const QualifiedPreview: React.FC<React.PropsWithChildren<QualifiedPreviewProps>> = ({
  pool,
  userData,
  rewardInfo,
  timeRemaining,
  campaignClaimTime,
  currentUserCampaignInfo,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const {
    lockEndTime,
    lockStartTime,
    balance: { cakeAsBigNumber },
  } = userData

  const { stakingToken, userData: poolUserData } = pool ?? {}
  const { totalVolume, tradingFeeArr } = currentUserCampaignInfo ?? {}

  const currentBalance = useMemo(
    () => (poolUserData?.stakingTokenBalance ? new BigNumber(poolUserData?.stakingTokenBalance ?? '0') : BIG_ZERO),
    [poolUserData],
  )
  const currentRewardInfo = useMemo(
    () => rewardInfo?.[currentUserCampaignInfo?.campaignId],
    [rewardInfo, currentUserCampaignInfo],
  )

  const timeUntil = getTimePeriods(timeRemaining)

  const cakePriceBusd = usePriceCakeUSD()

  const rewardInUSD = useRewardInUSD({
    timeRemaining,
    totalEstimateRewardUSD: currentUserCampaignInfo?.totalEstimateRewardUSD ?? 0,
    canClaim: currentUserCampaignInfo?.canClaim ?? '0',
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  const rewardInCake = useRewardInCake({
    timeRemaining,
    totalEstimateRewardUSD: currentUserCampaignInfo?.totalEstimateRewardUSD ?? 0,
    totalReward: currentUserCampaignInfo?.canClaim ?? '0',
    cakePriceBusd,
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  // Additional Amount
  const additionalAmount = useMemo(() => {
    const totalMapCap = tradingFeeArr.map((fee) => fee.maxCap).reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
    return new BigNumber(totalMapCap).minus(currentUserCampaignInfo.totalEstimateRewardUSD).toNumber()
  }, [currentUserCampaignInfo, tradingFeeArr])

  // MAX REWARD CAP
  const maxRewardCap = useMemo(() => {
    return tradingFeeArr.map((fee) => fee.maxCap).reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
  }, [tradingFeeArr])

  const maxRewardCapCakePrice = useMemo(
    () => new BigNumber(maxRewardCap).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, maxRewardCap],
  )

  const maxRewardCapInfoAmount = useMemo(
    () => new BigNumber(currentRewardInfo?.rewardFeeRatio ?? 0).div(1e10).toNumber(),
    [currentRewardInfo],
  )

  return (
    <>
      <GreyCard>
        <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
          {t('Your Current trading rewards')}
        </Text>
        <Text bold fontSize="40px">{`$${formatNumber(rewardInUSD)}`}</Text>
        <Text fontSize="14px" color="textSubtle">{`~${formatNumber(rewardInCake)} CAKE`}</Text>
        <Text fontSize="12px" color="textSubtle" mt="4px">
          {t('Available for claiming')}
          {timeRemaining > 0 ? (
            <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
              {t('in')}
              {timeUntil.months ? (
                <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                  {`${timeUntil.months}${t('m')}`}
                </Text>
              ) : null}
              {timeUntil.days ? (
                <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                  {`${timeUntil.days}${t('d')}`}
                </Text>
              ) : null}
              {timeUntil.days || timeUntil.hours ? (
                <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                  {`${timeUntil.hours}${t('h')}`}
                </Text>
              ) : null}
              <Text bold fontSize="12px" color="textSubtle" as="span" ml="4px">
                {`${timeUntil.minutes}${t('m')}`}
              </Text>
            </Text>
          ) : null}
          <Text fontSize="12px" color="textSubtle" ml="4px" as="span">
            {t('(at ~%date%)', { date: timeFormat(locale, campaignClaimTime ?? 0) })}
          </Text>
        </Text>
        {additionalAmount >= 0.01 && (
          <Message variant="warning" mt="10px">
            <MessageText>
              <Text as="span">{t('An additional amount of reward of')}</Text>
              <Text as="span" bold m="0 4px">{`~$${formatNumber(additionalAmount)}`}</Text>
              <Text as="span" mr="4px">
                {t('can not be claim due to the max reward cap.')}
              </Text>
              <Text as="span" bold>
                {t('Lock more CAKE to keep earning.')}
              </Text>
            </MessageText>
          </Message>
        )}
      </GreyCard>

      {additionalAmount >= 0.01 && (
        <GreyCard mt="24px">
          <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
            {t('Your Current Max Reward Cap')}
          </Text>
          <Text bold color="failure" fontSize="24px">{`$${formatNumber(maxRewardCap)}`}</Text>
          <Text color="failure" fontSize="14px">{`~${formatNumber(maxRewardCapCakePrice)} CAKE`}</Text>
          <Text width="100%" lineHeight="120%">
            <Text color="textSubtle" fontSize="14px" lineHeight="120%" as="span">
              {t('Equals to your %amount%% of locked CAKE divided by', { amount: maxRewardCapInfoAmount })}
            </Text>
            <Text color="textSubtle" fontSize="14px" lineHeight="120%" as="span" ml="4px">
              {t('of the amount of your locked CAKE. Lock more CAKE to raise this limit')}
            </Text>
          </Text>
          {additionalAmount >= 0.01 && (
            <AddCakeButton
              scale="sm"
              mt="10px"
              width="fit-content"
              padding="0 16px !important"
              lockEndTime={lockEndTime}
              lockStartTime={lockStartTime}
              currentLockedAmount={cakeAsBigNumber}
              stakingToken={stakingToken}
              currentBalance={currentBalance}
              stakingTokenBalance={currentBalance}
            />
          )}
        </GreyCard>
      )}

      <GreyCard mt="24px">
        <Flex>
          <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
            {t('Your Current Trading VOLUME')}
          </Text>
          <InfoIcon color="secondary" width={16} height={16} ml="4px" />
        </Flex>
        <Text bold fontSize="24px">{`$${formatNumber(totalVolume)}`}</Text>
      </GreyCard>
    </>
  )
}

export default QualifiedPreview
