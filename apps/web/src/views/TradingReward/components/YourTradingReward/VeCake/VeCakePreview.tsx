import { useTranslation } from '@pancakeswap/localization'
import { Flex, useModal } from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useMemo } from 'react'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { Header } from 'views/TradingReward/components/YourTradingReward/VeCake/Header'
import { NoLockingCakeModal } from 'views/TradingReward/components/YourTradingReward/VeCake/NoLockingCakeModal'
import {
  VeCakeAddCakeOrWeeksModal,
  VeCakeModalView,
} from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeAddCakeOrWeeksModal'
import { VeCakeButtonWithMessage } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeButtonWithMessage'
import { VeCakePreviewTextInfo } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakePreviewTextInfo'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface VeCakePreviewProps {
  isValidLockAmount: boolean
  thresholdLockAmount: number
  thresholdLockTime: number
  endTime: number
}

export const VeCakePreview: React.FC<React.PropsWithChildren<VeCakePreviewProps>> = ({
  isValidLockAmount,
  thresholdLockAmount,
  thresholdLockTime,
  endTime,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { cakeLocked, cakeUnlockTime } = useCakeLockStatus()
  const [onPresentNoLockingCakeModal] = useModal(<NoLockingCakeModal />)
  const [onPresentVeCakeAddCakeModal] = useModal(
    <VeCakeAddCakeOrWeeksModal viewMode={VeCakeModalView.CAKE_FORM_VIEW} showSwitchButton />,
  )

  const minVeCake = useMemo(
    () => formatNumber(getBalanceNumber(new BigNumber(thresholdLockAmount)), 2, 2),
    [thresholdLockAmount],
  )

  // const minLockWeek = useMemo(() => {
  //   const currentTime = Date.now() / 1000
  //   const minusTime = new BigNumber(cakeUnlockTime).gt(0) && cakeLocked ? cakeUnlockTime : currentTime
  //   const lockDuration = new BigNumber(endTime ?? 0).plus(thresholdLockTime).minus(minusTime)
  //   const week = Math.ceil(new BigNumber(lockDuration).div(ONE_WEEK_DEFAULT).toNumber())
  //   return week.toString()
  // }, [cakeLocked, cakeUnlockTime, endTime, thresholdLockTime])

  return (
    <Flex flexDirection={['column']}>
      <Header />
      <GreyCard mb="24px">
        <VeCakePreviewTextInfo title={t('Min. veCAKE at snapshot time:')} value={minVeCake} bold mb="18px" />
        <VeCakePreviewTextInfo title={t('Preview of your veCAKE⌛ at snapshot time:')} value="0" mb="18px" />
        <VeCakePreviewTextInfo title={t('Snapshot at / Campaign Ends:')} value={timeFormat(locale, endTime)} />
      </GreyCard>
      {!cakeLocked && !isValidLockAmount ? (
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
