import { useMemo } from 'react'
import { Box, Flex, Card, Text, Balance, Message, MessageText, TooltipText, Button } from '@pancakeswap/uikit'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { getBalanceAmount, formatNumber } from '@pancakeswap/utils/formatBalance'
import { useClaimAllReward } from 'views/TradingReward/hooks/useClaimAllReward'

interface TotalPeriodProps {
  totalAvailableClaimData: UserCampaignInfoDetail[]
}

const TotalPeriod: React.FC<React.PropsWithChildren<TotalPeriodProps>> = ({ totalAvailableClaimData }) => {
  const { t } = useTranslation()
  const cakePriceBusd = useCakeBusdPrice()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Claim your rewards before expiring.'), {
    placement: 'bottom',
  })

  // Unclaim data
  const unclaimData = useMemo(() => {
    return totalAvailableClaimData
      .filter((campaign) => new BigNumber(campaign.canClaim).gt(0) && !campaign.userClaimedIncentives)
      .sort((a, b) => a.campaignClaimEndTime - b.campaignClaimEndTime)
  }, [totalAvailableClaimData])

  const { isPending, handleClaim } = useClaimAllReward(unclaimData)

  const totalUnclaimCake = useMemo(() => {
    const totalCake = unclaimData
      .map((available) => available.canClaim)
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
    return getBalanceAmount(new BigNumber(totalCake)).toNumber()
  }, [unclaimData])

  const totalUnclaimUSDValue = useMemo(
    () => multiplyPriceByAmount(cakePriceBusd, totalUnclaimCake),
    [cakePriceBusd, totalUnclaimCake],
  )

  // Expired Soon Data
  const rewardExpiredSoonData = useMemo(() => unclaimData[0], [unclaimData])
  const expiredTime = getTimePeriods(rewardExpiredSoonData?.campaignClaimEndTime)
  const expiredCakePrice = useMemo(() => {
    const balance = getBalanceAmount(new BigNumber(rewardExpiredSoonData?.canClaim))
    const cakePice = multiplyPriceByAmount(cakePriceBusd, balance.toNumber())
    return formatNumber(cakePice)
  }, [cakePriceBusd, rewardExpiredSoonData])

  const totalTradingReward = useMemo(() => {
    const total = totalAvailableClaimData
      .map((available) => available.canClaim)
      .reduce((a, b) => new BigNumber(a).plus(b).toNumber(), 0)
    const balance = getBalanceAmount(new BigNumber(total))
    return multiplyPriceByAmount(cakePriceBusd, balance.toNumber())
  }, [cakePriceBusd, totalAvailableClaimData])

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
          <GreyCard>
            <Flex flexDirection={['column', 'column', 'column', 'row']}>
              <Box>
                <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
                  {t('Your unclaimed trading rewards')}
                </Text>
                <Balance bold fontSize={['40px']} prefix="$ " decimals={2} value={totalUnclaimUSDValue} />
                <Balance
                  fontSize="14px"
                  color="textSubtle"
                  prefix="~ "
                  unit=" CAKE"
                  decimals={2}
                  value={totalUnclaimCake}
                />
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
                    {`$${expiredCakePrice}`}
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
          <GreyCard mt="24px">
            <Box mb="24px">
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL trading Reward')}
              </Text>
              <Balance bold fontSize={['24px']} prefix="$ " decimals={2} value={totalTradingReward} />
            </Box>
            <Box>
              <Text color="textSubtle" textTransform="uppercase" fontSize="12px" bold>
                {t('Your TOTAL VOLUME Traded')}
              </Text>
              <Balance bold fontSize={['24px']} prefix="$ " decimals={2} value={totalVolumeTrade} />
            </Box>
          </GreyCard>
        </Box>
      </Card>
    </Box>
  )
}

export default TotalPeriod
