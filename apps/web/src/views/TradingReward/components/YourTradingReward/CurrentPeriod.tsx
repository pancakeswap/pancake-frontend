import { useMemo } from 'react'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { VaultKey, DeserializedLockedVaultUser } from 'state/types'
import { useDeserializedPoolByVaultKey } from 'state/pools/hooks'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { Incentives, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import QualifiedPreview from 'views/TradingReward/components/YourTradingReward/QualifiedPreview'
import NoCakeLockedOrExtendLock from 'views/TradingReward/components/YourTradingReward/NoCakeLockedOrExtendLock'
import ComingSoon from 'views/TradingReward/components/YourTradingReward/ComingSoon'

interface CurrentPeriodProps {
  incentives: Incentives
  campaignStart: number
  campaignClaimTime: number
  userData: DeserializedLockedVaultUser
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail
  isQualified: boolean
  isLockPosition: boolean
  isValidLockDuration: boolean
  thresholdLockTime: number
  totalAvailableClaimData: UserCampaignInfoDetail[]
}

const CurrentPeriod: React.FC<React.PropsWithChildren<CurrentPeriodProps>> = ({
  userData,
  incentives,
  rewardInfo,
  campaignStart,
  campaignClaimTime,
  currentUserCampaignInfo,
  isQualified,
  isLockPosition,
  isValidLockDuration,
  thresholdLockTime,
}) => {
  const { t } = useTranslation()
  const pool = useDeserializedPoolByVaultKey(VaultKey.CakeVault)

  const currentDate = Date.now() / 1000
  const timeRemaining = campaignClaimTime - currentDate

  const isCampaignLive = useMemo(
    () => currentDate >= campaignStart && currentDate <= campaignClaimTime,
    [campaignClaimTime, campaignStart, currentDate],
  )

  return (
    <Box width={['100%', '100%', '100%', '48.5%']} mb={['24px', '24px', '24px', '0']}>
      <Card style={{ width: '100%' }}>
        <Box padding={['24px']}>
          <Text bold textAlign="right" mb="24px">
            {t('Current Period')}
          </Text>
          {!isCampaignLive ? (
            <ComingSoon />
          ) : (
            <>
              {isQualified ? (
                <QualifiedPreview
                  pool={pool}
                  userData={userData}
                  rewardInfo={rewardInfo}
                  timeRemaining={timeRemaining}
                  campaignClaimTime={campaignClaimTime}
                  currentUserCampaignInfo={currentUserCampaignInfo}
                />
              ) : (
                <NoCakeLockedOrExtendLock
                  pool={pool}
                  userData={userData}
                  incentives={incentives}
                  isLockPosition={isLockPosition}
                  isValidLockDuration={isValidLockDuration}
                  thresholdLockTime={thresholdLockTime}
                />
              )}
            </>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default CurrentPeriod
