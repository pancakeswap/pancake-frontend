import { useMemo } from 'react'
import { Box, Text, Message, MessageText, TooltipText } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import { getBalanceAmount, formatNumber } from '@pancakeswap/utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'
import { useCakeBusdPrice } from 'hooks/useBUSDPrice'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'

interface NotQualifiedProps {
  totalAvailableClaimData: UserCampaignInfoDetail[]
}

const NotQualified: React.FC<React.PropsWithChildren<NotQualifiedProps>> = ({ totalAvailableClaimData }) => {
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

  const currentDate = new Date().getTime() / 1000
  const timeRemaining = rewardExpiredSoonData?.campaignClaimEndTime - currentDate
  const expiredTime = getTimePeriods(timeRemaining)

  const expiredCakePrice = useMemo(() => {
    const balance = getBalanceAmount(new BigNumber(rewardExpiredSoonData?.canClaim ?? 0))
    const cakePice = multiplyPriceByAmount(cakePriceBusd, balance.toNumber())
    return formatNumber(cakePice)
  }, [cakePriceBusd, rewardExpiredSoonData])

  return (
    <Box width={['100%', '100%', '100%', '236px']} m={['0 0 24px 0', '0 0 24px 0', '0 0 24px 0', '0 91px 0 0']}>
      <GreyCard>
        <Box>
          <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
            {t('You have earn some trading rewards')}
          </Text>
          <Text bold fontSize={['40px']}>{`$ ${formatNumber(totalUnclaimUSDValue)}`}</Text>
          <Text fontSize="14px" color="textSubtle">{`~ ${formatNumber(totalUnclaimCake)} CAKE`}</Text>
        </Box>
        {timeRemaining > 0 && (
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
    </Box>
  )
}

export default NotQualified
