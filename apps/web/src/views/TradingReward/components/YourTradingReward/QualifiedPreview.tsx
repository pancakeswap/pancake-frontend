import { Flex, InfoIcon, Message, MessageText, Text, useModal } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Header } from 'views/TradingReward/components/YourTradingReward/VeCake/Header'
import {
  VeCakeAddCakeOrWeeksModal,
  VeCakeModalView,
} from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeAddCakeOrWeeksModal'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
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
  pool: Pool.DeserializedPool<Token>
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail
}

const QualifiedPreview: React.FC<React.PropsWithChildren<QualifiedPreviewProps>> = ({
  pool,
  rewardInfo,
  timeRemaining,
  campaignClaimTime,
  currentUserCampaignInfo,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const [onPresentVeCakeAddCakeModal] = useModal(
    <VeCakeAddCakeOrWeeksModal viewMode={VeCakeModalView.CAKE_FORM_VIEW} showSwitchButton />,
  )
  const [onPresentVeCakeAddWeeksModal] = useModal(
    <VeCakeAddCakeOrWeeksModal viewMode={VeCakeModalView.WEEKS_FORM_VIEW} showSwitchButton />,
  )

  const { totalVolume, tradingFeeArr } = currentUserCampaignInfo ?? {}

  const currentRewardInfo = useMemo(
    () => rewardInfo?.[currentUserCampaignInfo?.campaignId],
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
  const additionalAmount = useMemo(() => {
    const totalMapCap =
      tradingFeeArr?.map((fee) => fee.maxCap).reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0) ?? 0
    return new BigNumber(totalMapCap).minus(currentUserCampaignInfo?.totalEstimateRewardUSD).toNumber() ?? 0
  }, [currentUserCampaignInfo, tradingFeeArr])

  return (
    <>
      <Header />

      <GreyCard>
        <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
          {t('Your Current trading rewards')}
        </Text>
        <Text bold fontSize="40px">{`$${formatNumber(rewardInUSD)}`}</Text>
        <Text fontSize="14px" color="textSubtle">{`~${formatNumber(rewardInCake)} CAKE`}</Text>

        <Message variant="danger" mt="10px">
          <MessageText>
            <Text as="span" bold m="0 4px">{`$${formatNumber(rewardInUSD)}`}</Text>
            <Text as="span">{t('unclaimed reward expiring in ')}</Text>
            <Text as="span" mr="4px">
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
              {/* <Text fontSize="12px" color="textSubtle" ml="4px" as="span">
                {t('(at ~%date%)', { date: timeFormat(locale, campaignClaimTime ?? 0) })}
              </Text> */}
            </Text>
          </MessageText>
        </Message>

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
