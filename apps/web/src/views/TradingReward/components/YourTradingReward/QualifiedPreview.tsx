import {
  Box,
  Flex,
  InfoIcon,
  Message,
  MessageText,
  Text,
  TooltipText,
  WarningIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { VeCakePreviewTextInfo } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakePreviewTextInfo'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

import { useTranslation } from '@pancakeswap/localization'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { GreyCard } from 'components/Card'
import { useCakePrice } from 'hooks/useCakePrice'
import { RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import useRewardInCake from 'views/TradingReward/hooks/useRewardInCake'
import useRewardInUSD from 'views/TradingReward/hooks/useRewardInUSD'

interface QualifiedPreviewProps {
  timeRemaining: number
  campaignClaimTime: number
  isValidLockAmount: boolean
  thresholdLockAmount: number
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail | undefined
}

const QualifiedPreview: React.FC<React.PropsWithChildren<QualifiedPreviewProps>> = ({
  rewardInfo,
  timeRemaining,
  campaignClaimTime,
  currentUserCampaignInfo,
  isValidLockAmount,
  thresholdLockAmount,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const { totalVolume, tradingFeeArr } = currentUserCampaignInfo ?? {}

  const currentRewardInfo = useMemo(
    () => rewardInfo?.[currentUserCampaignInfo?.campaignId ?? 0],
    [rewardInfo, currentUserCampaignInfo],
  )

  const timeUntil = getTimePeriods(timeRemaining)

  const cakePriceBusd = useCakePrice()

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
  const totalMapCap = useMemo(
    () => tradingFeeArr?.map((fee) => fee.maxCap).reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0) ?? 0,
    [tradingFeeArr],
  )

  const totalMapCapCovertCakeAmount = useMemo(
    () => new BigNumber(totalMapCap).dividedBy(cakePriceBusd).toNumber() ?? 0,
    [totalMapCap, cakePriceBusd],
  )

  const additionalAmount = useMemo(() => {
    return new BigNumber(totalMapCap).minus(currentUserCampaignInfo?.totalEstimateRewardUSD ?? 0).toNumber() ?? 0
  }, [currentUserCampaignInfo, totalMapCap])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Box mb="12px">
        <Text lineHeight="110%" as="span">
          {t('The maximum amount of CAKE reward you may earn is capped at')}
        </Text>
        <Text lineHeight="110%" as="span" bold m="0 4px">
          0.1%
        </Text>
        <Text lineHeight="110%" as="span">
          {t('of your veCAKE balance at the snapshot time.')}
        </Text>
      </Box>
      <Text lineHeight="110%">{t('Increase your veCAKE to continue earning.')}</Text>
    </Box>,
    {
      placement: 'top',
    },
  )

  return (
    <>
      <GreyCard>
        <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
          {t('Your Current trading rewards')}
        </Text>
        <Flex>
          <Text bold fontSize="40px">{`$${formatNumber(rewardInUSD)}`}</Text>
          {additionalAmount >= 0.01 && <WarningIcon ml="10px" width={24} color="warning" />}
        </Flex>
        <Text fontSize="14px" color="textSubtle">{`~${formatNumber(rewardInCake)} CAKE`}</Text>

        <Box>
          <Text as="span" fontSize="12px" color="textSubtle" lineHeight="110%">
            {t('Available for claiming')}
          </Text>
          <Text lineHeight="110%" as="span" m="0 4px">
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
          </Text>
          <Text fontSize="12px" color="textSubtle" as="span" lineHeight="110%">
            {t('(at ~%date%)', { date: timeFormat(locale, campaignClaimTime ?? 0) })}
          </Text>
        </Box>

        {additionalAmount >= 0.01 && (
          <Message variant="warning" mt="10px">
            <MessageText>
              <TooltipText ref={targetRef} bold as="span" mr="4px" fontSize={14}>
                {t('Your Max Reward Capped')}
              </TooltipText>
              {tooltipVisible && tooltip}
              <Text as="span" mr="4px" fontSize={14}>
                {t('at')}
              </Text>
              <Text color="warning" as="span" bold mr="4px" fontSize={14}>
                {`$${formatNumber(totalMapCap)} (~${formatNumber(totalMapCapCovertCakeAmount)} CAKE)`}
              </Text>
              <Text as="span" mr="4px" fontSize={14}>
                {t('An additional amount of reward of')}
              </Text>
              <Text as="span" bold mr="4px" fontSize={14}>
                {`~$${formatNumber(additionalAmount)}`}
              </Text>
              <Text as="span" fontSize={14}>
                {t('can not be claim.')}
              </Text>
            </MessageText>
          </Message>
        )}
      </GreyCard>

      <VeCakePreviewTextInfo
        mt="24px"
        showIncreaseButton
        endTime={campaignClaimTime}
        isValidLockAmount={isValidLockAmount}
        thresholdLockAmount={thresholdLockAmount}
      />

      <GreyCard mt="24px">
        <Flex>
          <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
            {t('Your Current Trading VOLUME')}
          </Text>
          <InfoIcon color="secondary" width={16} height={16} ml="4px" />
        </Flex>
        <Text bold fontSize="24px">{`$${formatNumber(totalVolume ?? 0)}`}</Text>
      </GreyCard>
    </>
  )
}

export default QualifiedPreview
