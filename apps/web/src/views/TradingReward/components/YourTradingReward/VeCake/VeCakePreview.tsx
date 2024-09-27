import { useTranslation } from '@pancakeswap/localization'
import { Flex, Message, MessageText, Text, useModal } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { GreyCard } from 'components/Card'
import { useCakePrice } from 'hooks/useCakePrice'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { CakeLockStatus } from 'views/CakeStaking/types'
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

interface VeCakePreviewProps {
  thresholdLockAmount: number
  endTime: number
  timeRemaining: number
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail | undefined
}

export const VeCakePreview: React.FC<React.PropsWithChildren<VeCakePreviewProps>> = ({
  timeRemaining,
  thresholdLockAmount,
  endTime,
  rewardInfo,
  currentUserCampaignInfo,
}) => {
  const { t } = useTranslation()
  const router = useRouter()
  const cakePrice = useCakePrice()
  const { status, cakeLockExpired, cakeLocked } = useCakeLockStatus()
  const timeUntil = getTimePeriods(timeRemaining)

  const [onPresentNoLockingCakeModal] = useModal(
    <NoLockingCakeModal endTime={endTime} thresholdLockAmount={thresholdLockAmount} />,
  )

  const [onPresentVeCakeAddCakeModal] = useModal(
    <VeCakeAddCakeOrWeeksModal
      showSwitchButton
      viewMode={VeCakeModalView.CAKE_FORM_VIEW}
      endTime={endTime}
      thresholdLockAmount={thresholdLockAmount}
    />,
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
    cakePrice,
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  const handleUnlockButton = () => {
    router.push(`/cake-staking`)
  }

  return (
    <Flex flexDirection={['column']}>
      <Header />

      {rewardInUSD > 0.01 && (
        <GreyCard mb="24px">
          <Text textTransform="uppercase" color="secondary" bold mb="4px">
            {t('You have earn some trading REWARDS')}
          </Text>
          <Text bold fontSize="40px">{`$${formatNumber(rewardInUSD)}`}</Text>
          <Text fontSize="14px" color="textSubtle">{`~${formatNumber(rewardInCake)} CAKE`}</Text>

          <Message variant="danger" mt="10px">
            <MessageText>
              <Text as="span" bold m="0 4px">{`$${formatNumber(rewardInUSD)}`}</Text>
              <Text as="span">{t('unclaimed reward expiring')}</Text>
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

      <VeCakePreviewTextInfo mb="24px" endTime={endTime} thresholdLockAmount={thresholdLockAmount} />

      {status === CakeLockStatus.NotLocked || !cakeLocked ? (
        <VeCakeButtonWithMessage
          messageText={t('Get veCAKE to start earning')}
          buttonText={t('Get veCAKE')}
          onClick={onPresentNoLockingCakeModal}
        />
      ) : cakeLockExpired ? (
        <VeCakeButtonWithMessage
          messageText={t(
            'Your CAKE staking position is expired. Unlock your position and set up a new one to start earning.',
          )}
          buttonText={t('Unlock')}
          onClick={handleUnlockButton}
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
