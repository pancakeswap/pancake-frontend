import { useMemo } from 'react'
import { Box, Flex, Card, Text, Message, MessageText, TooltipText, Button } from '@pancakeswap/uikit'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useClaimAllReward } from 'views/TradingReward/hooks/useClaimAllReward'

interface TotalPeriodProps {
  campaignIds: Array<string>
  totalAvailableClaimData: UserCampaignInfoDetail[]
}

const TotalPeriod: React.FC<React.PropsWithChildren<TotalPeriodProps>> = ({ campaignIds, totalAvailableClaimData }) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeUSD()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Claim your rewards before expiring.'), {
    placement: 'bottom',
  })

  // Unclaim data
  const unclaimData = useMemo(() => {
    return totalAvailableClaimData
      .filter((campaign) => new BigNumber(campaign.canClaim).gt(0) && !campaign.userClaimedIncentives)
      .sort((a, b) => a.campaignClaimEndTime - b.campaignClaimEndTime)
  }, [totalAvailableClaimData])

  const { isPending, handleClaim } = useClaimAllReward(campaignIds, unclaimData)

  const rewardExpiredSoonData = useMemo(() => unclaimData[0], [unclaimData])

  const currentDate = new Date().getTime() / 1000
  const timeRemaining = rewardExpiredSoonData?.campaignClaimEndTime - currentDate
  const expiredTime = getTimePeriods(timeRemaining)

  const totalUnclaimInUSD = useMemo(() => {
    const totalUSD = unclaimData
      .map((available) => (timeRemaining > 0 ? available.totalEstimateReward : available.canClaim))
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

    return new BigNumber(totalUSD).toNumber()
  }, [timeRemaining, unclaimData])

  const totalUnclaimInCake = useMemo(
    () => new BigNumber(totalUnclaimInUSD).div(cakePriceBusd).toNumber(),
    [cakePriceBusd, totalUnclaimInUSD],
  )

  // Expired Soon Data
  const expiredUSDPrice = useMemo(() => {
    const balance = timeRemaining > 0 ? rewardExpiredSoonData.totalEstimateReward : rewardExpiredSoonData?.canClaim
    return formatNumber(new BigNumber(balance).toNumber())
  }, [rewardExpiredSoonData, timeRemaining])

  const totalTradingReward = useMemo(() => {
    const total = totalAvailableClaimData
      .map((available) => available.canClaim)
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)

    return new BigNumber(total).toNumber()
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
            {t('Total')}
          </Text>
          {unclaimData.length > 0 && (
            <GreyCard>
              <Flex flexDirection={['column', 'column', 'column', 'row']}>
                <Box>
                  <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
                    {t('Your unclaimed trading rewards')}
                  </Text>
                  <Text bold fontSize={['40px']}>{`$ ${formatNumber(totalUnclaimInUSD)}`}</Text>
                  <Text fontSize={['14px']} color="textSubtle">{`~ ${formatNumber(totalUnclaimInCake)} CAKE`}</Text>
                </Box>
                <Button
                  width={['100%', '100%', '100%', 'fit-content']}
                  m={['10px 0 0 0', '10px 0 0 0', '10px 0 0 0', 'auto 0 auto auto']}
                  disabled={isPending}
                  onClick={handleClaim}
                >
                  {t('Claim All')}
                </Button>
              </Flex>
              {rewardExpiredSoonData && (
                <Message variant="danger" mt="16px">
                  <MessageText>
                    <TooltipText bold as="span">
                      {`$${expiredUSDPrice}`}
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
          )}
          <GreyCard mt="24px">
            <Box mb="24px">
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL trading Reward')}
              </Text>
              <Text bold fontSize={['24px']}>
                {`$ ${formatNumber(totalTradingReward)}`}
              </Text>
            </Box>
            <Box>
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL VOLUME Traded')}
              </Text>
              <Text bold fontSize={['24px']}>
                {`$ ${formatNumber(totalVolumeTrade)}`}
              </Text>
            </Box>
          </GreyCard>
        </Box>
      </Card>
    </Box>
  )
}

export default TotalPeriod
