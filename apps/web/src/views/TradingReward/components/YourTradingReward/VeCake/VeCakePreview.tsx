import { useTranslation } from '@pancakeswap/localization'
import { Flex, Message, MessageText, Text, useModal } from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { useVeCakeUserCreditWithTime } from 'views/Pools/hooks/useVeCakeUserCreditWithTime'
import { Header } from 'views/TradingReward/components/YourTradingReward/VeCake/Header'
import { NoLockingCakeModal } from 'views/TradingReward/components/YourTradingReward/VeCake/NoLockingCakeModal'
import {
  VeCakeAddCakeOrWeeksModal,
  VeCakeModalView,
} from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeAddCakeOrWeeksModal'
import { VeCakeButtonWithMessage } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeButtonWithMessage'
import { VeCakePreviewTextInfo } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakePreviewTextInfo'
import { RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import useRewardInCake from 'views/TradingReward/hooks/useRewardInCake'
import useRewardInUSD from 'views/TradingReward/hooks/useRewardInUSD'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface VeCakePreviewProps {
  isValidLockAmount: boolean
  thresholdLockAmount: number
  endTime: number
  timeRemaining: number
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail | undefined
}

export const VeCakePreview: React.FC<React.PropsWithChildren<VeCakePreviewProps>> = ({
  timeRemaining,
  isValidLockAmount,
  thresholdLockAmount,
  endTime,
  rewardInfo,
  currentUserCampaignInfo,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const cakePriceBusd = useCakePrice()
  const { cakeLocked } = useCakeLockStatus()
  const timeUntil = getTimePeriods(timeRemaining)
  const { userCreditWithTime } = useVeCakeUserCreditWithTime(endTime)

  const [onPresentNoLockingCakeModal] = useModal(
    <NoLockingCakeModal endTime={endTime} isValidLockAmount={isValidLockAmount} />,
  )

  const [onPresentVeCakeAddCakeModal] = useModal(
    <VeCakeAddCakeOrWeeksModal
      showSwitchButton
      viewMode={VeCakeModalView.CAKE_FORM_VIEW}
      endTime={endTime}
      isValidLockAmount={isValidLockAmount}
    />,
  )

  const minVeCake = useMemo(
    () => formatNumber(getBalanceNumber(new BigNumber(thresholdLockAmount)), 2, 2),
    [thresholdLockAmount],
  )

  const previewVeCakeAtSnapshot = useMemo(
    () => formatNumber(getBalanceNumber(new BigNumber(userCreditWithTime)), 2, 2),
    [userCreditWithTime],
  )

  const currentRewardInfo = useMemo(
    () => rewardInfo?.[currentUserCampaignInfo?.campaignId ?? 0],
    [rewardInfo, currentUserCampaignInfo],
  )

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

  return (
    <Flex flexDirection={['column']}>
      <Header />

      {rewardInUSD > 0 && (
        <GreyCard mb="24px">
          <Text textTransform="uppercase" color="secondary" bold mb="4px">
            {t('You have earn some trading REWARDS')}
          </Text>
          <Text bold fontSize="40px">{`$${formatNumber(rewardInUSD)}`}</Text>
          <Text fontSize="14px" color="textSubtle">{`~${formatNumber(rewardInCake)} CAKE`}</Text>

          <Message variant="danger" mt="10px">
            <MessageText>
              <Text as="span" bold m="0 4px">{`$${formatNumber(rewardInUSD)}`}</Text>
              <Text as="span">{t('unclaimed reward expiring in ')}</Text>
              <Text as="span" mr="4px">
                {timeRemaining > 0 ? (
                  <Text bold as="span" ml="4px">
                    {t('in')}
                    {timeUntil.months ? (
                      <Text bold as="span" ml="4px">
                        {`${timeUntil.months}${t('m')}`}
                      </Text>
                    ) : null}
                    {timeUntil.days ? (
                      <Text bold as="span" ml="4px">
                        {`${timeUntil.days}${t('d')}`}
                      </Text>
                    ) : null}
                    {timeUntil.days || timeUntil.hours ? (
                      <Text bold as="span" ml="4px">
                        {`${timeUntil.hours}${t('h')}`}
                      </Text>
                    ) : null}
                    <Text bold as="span" ml="4px">
                      {`${timeUntil.minutes}${t('m')}`}
                    </Text>
                  </Text>
                ) : null}
              </Text>
            </MessageText>
          </Message>
        </GreyCard>
      )}

      <GreyCard mb="24px">
        <VeCakePreviewTextInfo bold mb="18px" title={t('Min. veCAKE at snapshot time:')} value={minVeCake} />
        <VeCakePreviewTextInfo
          mb="18px"
          title={t('Preview of your veCAKE⌛ at snapshot time:')}
          value={previewVeCakeAtSnapshot}
        />
        <VeCakePreviewTextInfo title={t('Snapshot at / Campaign Ends:')} value={timeFormat(locale, endTime)} />
      </GreyCard>
      {!cakeLocked ? (
        <VeCakeButtonWithMessage
          messageText={t('Get veCAKE to start earning')}
          buttonText={t('Get veCAKE')}
          onClick={onPresentNoLockingCakeModal}
        />
      ) : (
        <VeCakeButtonWithMessage
          messageText={t('Increase veCAKE to reach min. requirement')}
          buttonText={t('Increase veCAKE')}
          onClick={onPresentVeCakeAddCakeModal}
        />
      )}
    </Flex>
  )
}
