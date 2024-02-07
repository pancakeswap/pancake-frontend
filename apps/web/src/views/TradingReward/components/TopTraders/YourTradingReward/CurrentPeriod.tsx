import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, LightBulbIcon, Message, MessageText, Text } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import ComingSoon from 'views/TradingReward/components/YourTradingReward/ComingSoon'
import { RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import useRewardInCake from 'views/TradingReward/hooks/useRewardInCake'
import useRewardInUSD from 'views/TradingReward/hooks/useRewardInUSD'
import { useUserTradeRank } from 'views/TradingReward/hooks/useUserTradeRank'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface CurrentPeriodProps {
  campaignStart: number
  campaignClaimTime: number
  rewardInfo: { [key in string]: RewardInfo }
  currentUserCampaignInfo: UserCampaignInfoDetail
}

const TOP_RANK = 100

const TimeText = ({ text }: { text: string }) => {
  return (
    <Text bold fontSize="14px" color="primary" as="span" ml="4px">
      {text}
    </Text>
  )
}

const CurrentPeriod: React.FC<React.PropsWithChildren<CurrentPeriodProps>> = ({
  rewardInfo,
  campaignStart,
  campaignClaimTime,
  currentUserCampaignInfo,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const cakePriceBusd = useCakePrice()
  const { data: rank } = useUserTradeRank({ campaignId: currentUserCampaignInfo?.campaignId })

  const currentDate = Date.now() / 1000
  const timeRemaining = campaignClaimTime - currentDate
  const timeUntil = getTimePeriods(timeRemaining)

  const currentRewardInfo = useMemo(
    () => rewardInfo?.[currentUserCampaignInfo?.campaignId],
    [rewardInfo, currentUserCampaignInfo],
  )

  const rewardInUSD = useRewardInUSD({
    timeRemaining,
    totalEstimateRewardUSD: currentUserCampaignInfo?.totalEstimateRewardUSD ?? 0,
    canClaim: currentUserCampaignInfo?.canClaim ?? '0',
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  const rewardInCake = useRewardInCake({
    timeRemaining,
    totalEstimateRewardUSD: currentUserCampaignInfo?.totalEstimateRewardUSD ?? 0,
    totalReward: currentUserCampaignInfo?.canClaim ?? '0',
    cakePriceBusd,
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  const isValid = useMemo(
    () => new BigNumber(rank.topTradersIndex).gt(0) && new BigNumber(rank.topTradersIndex).lte(TOP_RANK),
    [rank],
  )

  const isCampaignLive = useMemo(
    () => currentDate >= campaignStart && currentDate <= campaignClaimTime,
    [campaignClaimTime, campaignStart, currentDate],
  )

  return (
    <Box width={['100%', '100%', '100%', '48.5%']} mb={['24px', '24px', '24px', '0']}>
      <Card style={{ width: '100%' }}>
        <Box padding={['16px', '16px', '16px', '24px']}>
          <Text bold textAlign="right" mb="24px">
            {t('Current Period')}
          </Text>
          {!isCampaignLive ? (
            <ComingSoon />
          ) : (
            <Box>
              <GreyCard mb="24px">
                <Text textTransform="uppercase" fontSize="12px" color="secondary" bold mb="4px">
                  {t('Your Rank')}
                </Text>
                <Text color="text" fontSize="40px" bold mb="4px" lineHeight="110%">
                  {rank.topTradersIndex === 0 ? '???' : `#${rank.topTradersIndex}`}
                </Text>
                <Text fontSize="14px" color="textSubtle">
                  {t('out of %users% traders', { users: rank.totalUsers })}
                </Text>
              </GreyCard>

              <GreyCard>
                <Text textTransform="uppercase" fontSize="12px" color="textSubtle" bold mb="4px">
                  {t('Your Trading Reward')}
                </Text>
                <Text
                  color={isValid ? 'text' : 'textDisabled'}
                  fontSize="24px"
                  bold
                  mb="4px"
                  lineHeight="110%"
                >{`$${formatNumber(rewardInUSD)}`}</Text>
                <Text color={isValid ? 'text' : 'textDisabled'} fontSize="14px">{`~${formatNumber(
                  rewardInCake,
                )} CAKE`}</Text>
              </GreyCard>

              <Message mt="24px" variant="success" icon={<LightBulbIcon color="#1FC7D4" width="24px" />}>
                <MessageText>
                  <Box>
                    <Text fontSize="14px" color="primary" as="span">
                      {t('Keep trading to rank')}
                    </Text>
                    <Text fontSize="14px" color="primary" as="span" bold m="0 4px">
                      {t('#100 or less')}
                    </Text>
                    <Text fontSize="14px" color="primary" as="span">
                      {t('and maintain till the end of the campaign to win and claim your rewards.')}
                    </Text>
                  </Box>
                  <Box mt="10px">
                    <Text fontSize="14px" color="primary" as="span">
                      {t('Campaign ending')}
                      {timeRemaining > 0 ? (
                        <Text bold fontSize="14px" color="primary" as="span" ml="4px">
                          {t('in')}
                          {timeUntil.months ? <TimeText text={`${timeUntil.months}${t('m')}`} /> : null}
                          {timeUntil.days ? <TimeText text={`${timeUntil.days}${t('d')}`} /> : null}
                          {timeUntil.days || timeUntil.hours ? <TimeText text={`${timeUntil.hours}${t('h')}`} /> : null}
                          <TimeText text={`${timeUntil.minutes}${t('m')}`} />
                        </Text>
                      ) : null}
                      <Text fontSize="14px" color="primary" as="span" ml="4px">
                        {t('(at ~%date%)', { date: timeFormat(locale, campaignClaimTime ?? 0) })}
                      </Text>
                    </Text>
                  </Box>
                </MessageText>
              </Message>
            </Box>
          )}
        </Box>
      </Card>
    </Box>
  )
}

export default CurrentPeriod
