import styled from 'styled-components'
import { Box, Flex, Text, Button, Balance, useMatchBreakpoints } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'
import { Incentives } from 'views/TradingReward/hooks/useInCentives'
import { CampaignIdInfoDetail } from 'views/TradingReward/hooks/useCampaignIdInfo'
import Link from 'next/link'

const Container = styled(Flex)`
  position: relative;
  width: 100%;
  padding: 40px 16px;
  margin: 80px auto auto auto;
  flex-direction: column;
  border-radius: 32px;
  background: linear-gradient(180deg, #7645d9 0%, #5121b1 100%);
  z-index: 1;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: 1140px;
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

  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 10px rgba(56, 50, 65, 1);
  }

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
  const timeUntil = getTimePeriods(incentives.campaignClaimTime)

  return (
    <Container>
      <StyledHeading data-text={t('Current Reward Pool')}>{t('Current Reward Pool')}</StyledHeading>
      <Flex flexDirection="column" margin={['40px auto auto auto']} width={['100%', '100%', '100%', '530px']}>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Starts')}
          </Text>
          <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
            {t('On %date%', { date: timeFormat(locale, incentives.campaignStart) })}
          </Text>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Ends')}
          </Text>
          {timeUntil.days || timeUntil.hours || timeUntil.minutes ? (
            <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {t('in')}
              {timeUntil.days && (
                <Text bold color="white" fontSize={['14px', '14px', '14px', '20px']} as="span" ml="4px">
                  {`${timeUntil.days}${t('d')}`}
                </Text>
              )}
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
              {t('On %date%', { date: timeFormat(locale, incentives.campaignClaimTime) })}
            </Text>
          )}
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Total volume generated')}
          </Text>
          <Balance
            bold
            color="white"
            prefix="$"
            fontSize={['14px', '14px', '14px', '20px']}
            decimals={3}
            value={campaignInfoData.totalVolume}
          />
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Total reward to distribute')}
          </Text>
          <Flex>
            <Balance
              bold
              color="white"
              fontSize={['14px', '14px', '14px', '20px']}
              decimals={0}
              value={getBalanceNumber(new BigNumber(incentives.totalReward))}
            />
            <Text ml="4px" bold color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {t('in CAKE')}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" mb="10px">
          <Text color="white" fontWeight={['400', '400', '400', '600']} fontSize={['14px', '14px', '14px', '20px']}>
            {t('Number of eligible pairs')}
          </Text>
          <Flex>
            <Text bold mr="8px" color="white" fontSize={['14px', '14px', '14px', '20px']}>
              {campaignInfoData.total}
            </Text>
            {isDesktop && (
              <Link href="#rewards-breakdown">
                <StyledButton scale="sm">{t('View Pairs')}</StyledButton>
              </Link>
            )}
          </Flex>
        </Flex>
        {!isDesktop && (
          <Link href="#rewards-breakdown">
            <StyledButton width="fit-content" margin="14px auto auto auto" scale="sm">
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
