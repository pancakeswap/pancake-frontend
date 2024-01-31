import { useTranslation } from '@pancakeswap/localization'
import { Flex, useModal } from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
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
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface VeCakePreviewProps {
  isValidLockAmount: boolean
  thresholdLockAmount: number
  endTime: number
}

export const VeCakePreview: React.FC<React.PropsWithChildren<VeCakePreviewProps>> = ({
  isValidLockAmount,
  thresholdLockAmount,
  endTime,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { cakeLocked } = useCakeLockStatus()
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

  return (
    <Flex flexDirection={['column']}>
      <Header />
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
