import styled from 'styled-components'
import { Box, Flex, Text, Button, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { Incentives } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { CampaignIdInfoDetail } from 'views/TradingReward/hooks/useCampaignIdInfo'
import Link from 'next/link'

const Container = styled(Flex)`
  position: relative;
  width: calc(100% - 32px);
  padding: 40px 16px;
  margin: auto;
  flex-direction: column;
  border-radius: 32px;
  background: linear-gradient(33.75deg, #6c56c0 -1.75%, #717be1 89.48%);
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

  ${({ theme }) => theme.mediaQueries.xl} {
    display: block;
  }
}`

interface CurrentRewardPoolProps {
  incentives: Incentives
  campaignInfoData: CampaignIdInfoDetail
}

const CurrentRewardPool: React.FC<React.PropsWithChildren<CurrentRewardPoolProps>> = ({
  incentives,
  campaignInfoData,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { campaignClaimTime } = incentives ?? {}

  const currentDate = Date.now() / 1000
  const timeRemaining = campaignClaimTime - currentDate
  const timeUntil = getTimePeriods(timeRemaining)

  return (
    <Container>
      <StyledHeading data-text={t('Current Reward Pool')}>{t('Current Reward Pool')}</StyledHeading>
      <Flex flexDirection="column" margin={['40px auto auto auto']} width={['100%', '100%', '100%', '530px']}>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Starts')}
          </Text>
          <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
            {t('On %date%', { date: timeFormat(locale, incentives?.campaignStart) })}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Ends')}
          </Text>
          {timeRemaining > 0 ? (
            <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {t('in')}
              {timeUntil.months ? (
                <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']} as="span" ml="4px">
                  {`${timeUntil.months}${t('m')}`}
                </Text>
              ) : null}
              {timeUntil.days ? (
                <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']} as="span" ml="4px">
                  {`${timeUntil.days}${t('d')}`}
                </Text>
              ) : null}
              {timeUntil.days || timeUntil.hours ? (
                <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']} as="span" ml="4px">
                  {`${timeUntil.hours}${t('h')}`}
                </Text>
              ) : null}
              <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']} as="span" ml="4px">
                {`${timeUntil.minutes}${t('m')}`}
              </Text>
            </Text>
          ) : (
            <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {timeFormat(locale, incentives?.campaignClaimTime)}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('To win')}
          </Text>
          <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
            {t('Rank #500 or higher')}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Rewarding')}
          </Text>
          <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
            {t('3% of the trading fee')}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Total volume generated')}
          </Text>
          <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
            {`$${formatNumber(campaignInfoData?.totalVolume, 3, 3)}`}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Number of eligible pairs')}
          </Text>
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
        <img src="/images/trading-reward/top-traders-pool-1.png" width="201px" height="232px" alt="pool-1" />
      </Decorations>
    </Container>
  )
}

export default CurrentRewardPool
