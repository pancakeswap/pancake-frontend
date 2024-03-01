import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useCakePrice } from 'hooks/useCakePrice'
import Link from 'next/link'
import { useMemo } from 'react'
import { styled } from 'styled-components'
import TextComponent from 'views/TradingReward/components/TopTraders/YourTradingReward/TextComponent'
import TimeText from 'views/TradingReward/components/TopTraders/YourTradingReward/TimeText'
import { Incentives, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { CampaignIdInfoDetail } from 'views/TradingReward/hooks/useCampaignIdInfo'
import useRewardInCake from 'views/TradingReward/hooks/useRewardInCake'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

const Container = styled(Flex)`
  position: relative;
  width: calc(100% - 32px);
  padding: 40px 16px;
  margin: auto;
  flex-direction: column;
  border-radius: 32px;
  background: linear-gradient(180deg, #7645d9 0%, #5121b1 100%);
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1140px;
    margin: 80px auto auto auto;
  }
`

const StyledHeading = styled(Text)`
  position: relative;
  font-size: 40px;
  font-weight: 900;
  line-height: 98%;
  letter-spacing: 0.01em;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: auto;
  text-align: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 56px;
  }
`

const StyledButton = styled(Button)`
  background: linear-gradient(180deg, #fcc631 0%, #ff9d00 100%);
  color: #08060b;
`

const Decorations = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  pointer-events: none;
  > img {
    position: absolute;
  }
  & :nth-child(1) {
    bottom: -12%;
    left: -6%;
  }
  & :nth-child(2) {
    bottom: 0;
    right: 0;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
  }
}`

interface CurrentRewardPoolProps {
  campaignId: string
  incentives: Incentives | undefined
  campaignInfoData: CampaignIdInfoDetail
  rewardInfo: { [key in string]: RewardInfo }
}

const CurrentRewardPool: React.FC<React.PropsWithChildren<CurrentRewardPoolProps>> = ({
  campaignId,
  incentives,
  campaignInfoData,
  rewardInfo,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const cakePriceBusd = useCakePrice()
  const { totalReward, campaignClaimTime } = incentives ?? { totalReward: '0', campaignClaimTime: 0 }

  const currentDate = Date.now() / 1000
  const timeRemaining = campaignClaimTime - currentDate
  const timeUntil = getTimePeriods(timeRemaining)

  const currentRewardInfo = useMemo(() => rewardInfo?.[campaignId], [rewardInfo, campaignId])

  const rewardInCake = useRewardInCake({
    timeRemaining,
    totalEstimateRewardUSD: campaignInfoData?.totalEstimateRewardUSD ?? 0,
    totalReward,
    cakePriceBusd,
    rewardPrice: currentRewardInfo?.rewardPrice ?? '0',
    rewardTokenDecimal: currentRewardInfo?.rewardTokenDecimal ?? 0,
  })

  return (
    <Container>
      <StyledHeading data-text={t('Current Reward Pool')}>{t('Current Reward Pool')}</StyledHeading>
      <Flex flexDirection="column" margin={['40px auto auto auto']} width={['100%', '100%', '100%', '530px']}>
        <Flex justifyContent="space-between" mb="10px">
          <TextComponent text={t('Starts')} />
          <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
            {t('On %date%', { date: timeFormat(locale, incentives?.campaignStart ?? 0) })}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <TextComponent text={t('Ends')} />
          {timeRemaining > 0 ? (
            <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {t('in')}
              {timeUntil.months ? <TimeText text={`${timeUntil.months}${t('m')}`} /> : null}
              {timeUntil.days ? <TimeText text={`${timeUntil.days}${t('d')}`} /> : null}
              {timeUntil.days || timeUntil.hours ? <TimeText text={`${timeUntil.hours}${t('h')}`} /> : null}
              <TimeText text={`${timeUntil.minutes}${t('m')}`} />
            </Text>
          ) : (
            <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {timeFormat(locale, incentives?.campaignClaimTime ?? 0)}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <TextComponent text={t('Total volume generated')} />
          <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
            {`$${formatNumber(campaignInfoData?.totalVolume, 3, 3)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <TextComponent text={t('Total reward to distribute')} />
          <Flex>
            <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {formatNumber(rewardInCake, 0, 0)}
            </Text>
            <Text ml="4px" bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {t('in CAKE')}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <TextComponent text={t('Number of eligible pairs')} />
          <Flex>
            <Text bold mr="8px" color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {campaignInfoData?.total}
            </Text>
            {isDesktop && (
              <Link href="#rewards-breakdown">
                <StyledButton scale="sm">{t('View Pairs')}</StyledButton>
              </Link>
            )}
          </Flex>
        </Flex>
        {!isDesktop && (
          <Link href="#rewards-breakdown" style={{ width: '100%' }}>
            <StyledButton display="block" width="fit-content" margin="24px auto auto auto" scale="sm">
              {t('View Pairs')}
            </StyledButton>
          </Link>
        )}
      </Flex>
      <Decorations>
        <img src="/images/trading-reward/pool-1.png" width="307px" height="195px" alt="pool-1" />
        <img src="/images/trading-reward/pool-2.png" width="106px" height="106px" alt="pool-2" />
      </Decorations>
    </Container>
  )
}

export default CurrentRewardPool
