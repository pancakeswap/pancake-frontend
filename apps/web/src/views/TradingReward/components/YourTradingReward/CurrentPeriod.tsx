import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Text } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { useDeserializedPoolByVaultKey } from 'state/pools/hooks'
import { DeserializedLockedVaultUser, VaultKey } from 'state/types'
import ComingSoon from 'views/TradingReward/components/YourTradingReward/ComingSoon'
import QualifiedPreview from 'views/TradingReward/components/YourTradingReward/QualifiedPreview'
import { VeCakePreview } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakePreview'
import { Incentives, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'

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
                <VeCakePreview />
              )}
            </>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default CurrentPeriod
