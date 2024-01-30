import { useTranslation } from '@pancakeswap/localization'
import { Flex, useModal } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { Header } from 'views/TradingReward/components/YourTradingReward/VeCake/Header'
import { NoLockingCakeModal } from 'views/TradingReward/components/YourTradingReward/VeCake/NoLockingCakeModal'
import {
  VeCakeAddCakeOrWeeksModal,
  VeCakeModalView,
} from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeAddCakeOrWeeksModal'
import { VeCakeButtonWithMessage } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeButtonWithMessage'
import { VeCakePreviewTextInfo } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakePreviewTextInfo'

interface VeCakePreviewProps {
  isValidLockAmount: boolean
}

export const VeCakePreview: React.FC<React.PropsWithChildren<VeCakePreviewProps>> = ({ isValidLockAmount }) => {
  const { t } = useTranslation()
  const { cakeLocked } = useCakeLockStatus()
  const [onPresentNoLockingCakeModal] = useModal(<NoLockingCakeModal />)
  const [onPresentVeCakeAddCakeModal] = useModal(
    <VeCakeAddCakeOrWeeksModal viewMode={VeCakeModalView.CAKE_FORM_VIEW} showSwitchButton />,
  )

  return (
    <Flex flexDirection={['column']}>
      <Header />
      <GreyCard mb="24px">
        <VeCakePreviewTextInfo title={t('Min. veCAKE at snapshot time:')} value="500" bold mb="18px" />
        <VeCakePreviewTextInfo title={t('Preview of your veCAKE⌛ at snapshot time:')} value="0" mb="18px" />
        <VeCakePreviewTextInfo title={t('Snapshot at / Campaign Ends:')} value="16 Feb 2024, 21:45" />
      </GreyCard>
      {!cakeLocked || !isValidLockAmount ? (
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
