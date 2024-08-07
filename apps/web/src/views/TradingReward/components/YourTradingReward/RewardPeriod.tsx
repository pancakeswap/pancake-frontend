import { Box, Card, Flex, Text } from '@pancakeswap/uikit'
import CurrentPeriod from 'views/TradingReward/components/YourTradingReward/CurrentPeriod'
import TotalPeriod from 'views/TradingReward/components/YourTradingReward/TotalPeriod'
import { Incentives, Qualification, RewardInfo, RewardType } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { VeCakePreviewTextInfo } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakePreviewTextInfo'
import { useTranslation } from '@pancakeswap/localization'
import dayjs from 'dayjs'

interface RewardPeriodProps {
  campaignIds: Array<string>
  incentives: Incentives | undefined
  rewardInfo: { [key in string]: RewardInfo }
  totalAvailableClaimData: UserCampaignInfoDetail[]
  currentUserCampaignInfo: UserCampaignInfoDetail | undefined
  isQualified: boolean
  thresholdLockAmount: number
  qualification: Qualification
  campaignIdsIncentive: Incentives[]
}

const RewardPeriod: React.FC<React.PropsWithChildren<RewardPeriodProps>> = ({
  campaignIds,
  incentives,
  currentUserCampaignInfo,
  rewardInfo,
  totalAvailableClaimData,
  isQualified,
  thresholdLockAmount,
  qualification,
  campaignIdsIncentive,
}) => {
  const { t } = useTranslation()

  const thresholdAmount = useMemo(() => {
    if (currentUserCampaignInfo?.thresholdLockedAmount) {
      return getDecimalAmount(new BigNumber(currentUserCampaignInfo?.thresholdLockedAmount)).toNumber()
    }
    return thresholdLockAmount
  }, [thresholdLockAmount, currentUserCampaignInfo])

  const isCampaignFinished = useMemo(() => {
    if (incentives?.campaignClaimTime) {
      return dayjs().unix() >= incentives.campaignClaimTime
    }
    return false
  }, [incentives])

  return (
    <Flex
      width={['100%', '100%', '100%', '100%', '900px']}
      margin={['32px auto 61px auto']}
      justifyContent="space-between"
      flexDirection={['column', 'column', 'column', 'row']}
    >
      <CurrentPeriod
        incentives={incentives}
        rewardInfo={rewardInfo}
        currentUserCampaignInfo={currentUserCampaignInfo}
        isQualified={isQualified}
        thresholdLockAmount={thresholdLockAmount}
        totalAvailableClaimData={totalAvailableClaimData}
      />
      <Flex justifyContent="space-between" flexDirection="column" style={{ gap: '4px' }}>
        <TotalPeriod
          width={isCampaignFinished ? '100%' : undefined}
          type={RewardType.CAKE_STAKERS}
          campaignIds={campaignIds}
          rewardInfo={rewardInfo}
          qualification={qualification}
          totalAvailableClaimData={totalAvailableClaimData}
          campaignIdsIncentive={campaignIdsIncentive}
        />
        {isCampaignFinished && (
          <Box width="100%">
            <Card style={{ width: '100%' }}>
              <Box padding={['16px', '16px', '16px', '24px']}>
                <Text bold textAlign="right">
                  {t('Previous Period')}
                </Text>
                <VeCakePreviewTextInfo
                  mt="24px"
                  endTime={incentives?.campaignClaimTime ?? 0}
                  thresholdLockAmount={thresholdAmount}
                />
              </Box>
            </Card>
          </Box>
        )}
      </Flex>
    </Flex>
  )
}

export default RewardPeriod
