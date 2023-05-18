import { useCallback, useMemo } from 'react'
import { Box, Flex, Card, Text, Message, MessageText, TooltipText, Button } from '@pancakeswap/uikit'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import { GreyCard } from 'components/Card'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { formatNumber, getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useClaimAllReward } from 'views/TradingReward/hooks/useClaimAllReward'
import { RewardInfo, Qualification, Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'

interface TotalPeriodProps {
  campaignIds: Array<string>
  rewardInfo: { [key in string]: RewardInfo }
  totalAvailableClaimData: UserCampaignInfoDetail[]
  qualification: Qualification
  campaignIdsIncentive: Incentives[]
}

const TotalPeriod: React.FC<React.PropsWithChildren<TotalPeriodProps>> = ({
  campaignIds,
  rewardInfo,
  totalAvailableClaimData,
  qualification,
  campaignIdsIncentive,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Claim your rewards before expiring.'), {
    placement: 'bottom',
  })

  // Not Ready for claim
  const notReadyForClaim = useMemo(() => {
    // eslint-disable-next-line array-callback-return, consistent-return
    return totalAvailableClaimData.filter((campaign) => {
      const campaignIncentive = campaignIdsIncentive.find(
        (incentive) => incentive.campaignId.toLowerCase() === campaign.campaignId.toLowerCase(),
      )
      if (!campaignIncentive.isActivated) {
        return campaign
      }
    })
  }, [campaignIdsIncentive, totalAvailableClaimData])

  const notReadyForClaimUSDPrice = useMemo(() => {
    return notReadyForClaim
      .map((available) => available.totalEstimateRewardUSD)
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
  }, [notReadyForClaim])

  // Unclaim data
  const unclaimData = useMemo(() => {
    return (
      totalAvailableClaimData
        // eslint-disable-next-line array-callback-return, consistent-return
        .filter((campaign) => {
          const campaignIncentive = campaignIdsIncentive.find(
            (incentive) => incentive.campaignId.toLowerCase() === campaign.campaignId.toLowerCase(),
          )
          if (
            new BigNumber(campaign.canClaim).gt(0) &&
            !campaign.userClaimedIncentives &&
            campaignIncentive.isActivated
          ) {
            return campaign
          }
        })
        .sort((a, b) => a.campaignClaimEndTime - b.campaignClaimEndTime)
    )
  }, [campaignIdsIncentive, totalAvailableClaimData])

  const { isPending, handleClaim } = useClaimAllReward({ campaignIds, unclaimData, qualification })

  const rewardExpiredSoonData = useMemo(() => unclaimData[0], [unclaimData])

  const currentDate = new Date().getTime() / 1000
  const timeRemaining = rewardExpiredSoonData?.campaignClaimEndTime - currentDate
  const expiredTime = getTimePeriods(timeRemaining)

  const getUSDValue = useCallback(
    (userCampaignInfoDetail: UserCampaignInfoDetail) => {
      const currentReward = rewardInfo?.[userCampaignInfoDetail?.campaignId]
      if (currentReward) {
        const rewardCakeUSDPriceAsBg = getBalanceAmount(
          new BigNumber(currentReward.rewardPrice),
          currentReward.rewardTokenDecimal,
        )
        const rewardCakeAmount = getBalanceAmount(
          new BigNumber(userCampaignInfoDetail?.canClaim),
          currentReward.rewardTokenDecimal,
        )
        return rewardCakeAmount.times(rewardCakeUSDPriceAsBg).toNumber() || 0
      }
      return 0
    },
    [rewardInfo],
  )

  const totalUnclaimInUSD = useMemo(() => {
    return unclaimData
      .map((available) => getUSDValue(available))
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
  }, [getUSDValue, unclaimData])

  const totalUnclaimInCake = useMemo(() => {
    return unclaimData
      .map((available) => {
        const currentReward = rewardInfo?.[available.campaignId]
        if (currentReward) {
          const reward = getBalanceAmount(new BigNumber(available.canClaim))
          const rewardCakePrice = getBalanceAmount(
            new BigNumber(currentReward.rewardPrice ?? '0'),
            currentReward.rewardTokenDecimal ?? 0,
          )
          return reward.div(rewardCakePrice).isNaN() ? 0 : reward.div(rewardCakePrice).toNumber()
        }
        return 0
      })
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
  }, [rewardInfo, unclaimData])

  // Expired Soon Data
  const expiredUSDPrice = useMemo(() => getUSDValue(rewardExpiredSoonData), [getUSDValue, rewardExpiredSoonData])

  const totalTradingReward = useMemo(() => {
    return totalAvailableClaimData
      .map((available) => available.totalEstimateRewardUSD)
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
  }, [totalAvailableClaimData])

  const totalVolumeTrade = useMemo(() => {
    return totalAvailableClaimData
      .map((available) => available.totalVolume)
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
  }, [totalAvailableClaimData])

  return (
    <Box width={['100%', '100%', '100%', '48.5%']}>
      <Card style={{ width: '100%' }}>
        <Box padding={['24px']}>
          <Text bold textAlign="right" mb="24px">
            {t('Previously Ended')}
          </Text>
          <GreyCard>
            <Flex flexDirection={['column', 'column', 'column', 'row']}>
              <Box>
                <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
                  {t('Your unclaimed trading rewards')}
                </Text>
                <Text bold fontSize={['40px']}>{`$${formatNumber(totalUnclaimInUSD)}`}</Text>
                <Text fontSize={['14px']} color="textSubtle">{`~${formatNumber(totalUnclaimInCake)} CAKE`}</Text>
              </Box>
              <Button
                width={['100%', '100%', '100%', 'fit-content']}
                m={['10px 0 0 0', '10px 0 0 0', '10px 0 0 0', 'auto 0 auto auto']}
                disabled={isPending || unclaimData.length === 0}
                onClick={handleClaim}
              >
                {t('Claim All')}
              </Button>
            </Flex>
            {chainId !== ChainId.BSC && (
              <Message variant="warning" mt="16px">
                <MessageText>
                  <Text m="0 4px" as="span">
                    {t('Please switch your network to BNB Chain to claim your trading rewards.')}
                  </Text>
                </MessageText>
              </Message>
            )}
            {notReadyForClaim.length > 0 && notReadyForClaimUSDPrice > 0 && (
              <Message variant="primary" mt="16px">
                <MessageText>
                  <TooltipText bold as="span">
                    {`$${formatNumber(notReadyForClaimUSDPrice)}`}
                  </TooltipText>
                  <Text m="0 4px" as="span">
                    {t('from the recent campaign period is under tallying and will be available for claiming soon.')}
                  </Text>
                </MessageText>
              </Message>
            )}
            {rewardExpiredSoonData && (
              <Message variant="danger" mt="16px">
                <MessageText>
                  <TooltipText bold as="span">
                    {`$${formatNumber(expiredUSDPrice)}`}
                  </TooltipText>
                  <Text m="0 4px" as="span">
                    {t('unclaimed reward expiring in')}
                  </Text>
                  {timeRemaining > 0 && (
                    <Text ref={targetRef} as="span">
                      <Text bold as="span">
                        {expiredTime.days ? (
                          <Text bold as="span" ml="4px">
                            {`${expiredTime.days}${t('d')}`}
                          </Text>
                        ) : null}
                        {expiredTime.days || expiredTime.hours ? (
                          <Text bold as="span" ml="4px">
                            {`${expiredTime.hours}${t('h')}`}
                          </Text>
                        ) : null}
                        <Text bold as="span" ml="4px">
                          {`${expiredTime.minutes}${t('m')}`}
                        </Text>
                      </Text>
                    </Text>
                  )}
                  {tooltipVisible && tooltip}
                </MessageText>
              </Message>
            )}
          </GreyCard>
          <GreyCard mt="24px">
            <Box mb="24px">
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL trading Reward')}
              </Text>
              <Text bold fontSize={['24px']}>
                {`$${formatNumber(totalTradingReward)}`}
              </Text>
            </Box>
            <Box>
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL VOLUME Traded')}
              </Text>
              <Text bold fontSize={['24px']}>
                {`$${formatNumber(totalVolumeTrade)}`}
              </Text>
            </Box>
          </GreyCard>
        </Box>
      </Card>
    </Box>
  )
}

export default TotalPeriod
