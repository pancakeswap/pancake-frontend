import { useMemo } from 'react'
import { Box, Text, Message, MessageText, TooltipText } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import { formatNumber, getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'

interface NotQualifiedProps {
  totalAvailableClaimData: UserCampaignInfoDetail[]
  rewardInfo: { [key in string]: RewardInfo }
}

const NotQualified: React.FC<React.PropsWithChildren<NotQualifiedProps>> = ({
  totalAvailableClaimData,
  rewardInfo,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Claim your rewards before expiring.'), {
    placement: 'bottom',
  })

  // Unclaim data
  const unclaimData = useMemo(() => {
    return totalAvailableClaimData
      .filter((campaign) => new BigNumber(campaign.canClaim).gt(0) && !campaign.userClaimedIncentives)
      .sort((a, b) => a.campaignClaimEndTime - b.campaignClaimEndTime)
  }, [totalAvailableClaimData])

  const rewardExpiredSoonData = useMemo(() => unclaimData[0], [unclaimData])

  const currentDate = new Date().getTime() / 1000
  const timeRemaining = rewardExpiredSoonData?.campaignClaimEndTime - currentDate
  const expiredTime = getTimePeriods(timeRemaining)

  const totalUnclaimInUSD = useMemo(() => {
    return unclaimData
      .map((available) => {
        const currentReward = rewardInfo?.[available.campaignId]
        if (currentReward) {
          const rewardPriceAsBg = new BigNumber(currentReward.rewardPrice).div(currentReward.rewardTokenDecimal)
          return (
            new BigNumber(
              getBalanceAmount(new BigNumber(available.canClaim.toString())).times(rewardPriceAsBg),
            ).toNumber() || 0
          )
        }
        return 0
      })
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
  }, [rewardInfo, unclaimData])

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
  const expiredUSDPrice = useMemo(() => {
    const balance = getBalanceAmount(new BigNumber(rewardExpiredSoonData?.canClaim ?? 0)).toNumber()
    return formatNumber(balance)
  }, [rewardExpiredSoonData])

  return (
    <Box width={['100%', '100%', '100%', '236px']} m={['0 0 24px 0', '0 0 24px 0', '0 0 24px 0', '0 91px 0 0']}>
      <GreyCard>
        <Box>
          <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
            {t('You have earn some trading rewards')}
          </Text>
          <Text bold fontSize={['40px']}>{`$ ${formatNumber(totalUnclaimInUSD)}`}</Text>
          <Text fontSize="14px" color="textSubtle">{`~ ${formatNumber(totalUnclaimInCake)} CAKE`}</Text>
        </Box>
        {timeRemaining > 0 && (
          <Message variant="danger" mt="16px">
            <MessageText>
              <TooltipText bold as="span">
                {`$${expiredUSDPrice}`}
              </TooltipText>
              <Text m="0 4px" as="span">
                {t('unclaimed reward expiring in')}
              </Text>
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
              {tooltipVisible && tooltip}
            </MessageText>
          </Message>
        )}
      </GreyCard>
    </Box>
  )
}

export default NotQualified
