import styled from 'styled-components'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import NoConnected from 'views/TradingReward/components/YourTradingReward/NoConnected'
import ViewEligiblePairs from 'views/TradingReward/components/YourTradingReward/ViewEligiblePairs'
import NoProfile from 'views/TradingReward/components/YourTradingReward/NoProfile'
import NoCakeLockedOrExtendLock from 'views/TradingReward/components/YourTradingReward/NoCakeLockedOrExtendLock'
import ExpiringUnclaim from 'views/TradingReward/components/YourTradingReward/ExpiringUnclaim'

const BACKGROUND_COLOR = 'radial-gradient(55.22% 134.13% at 57.59% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)'

const StyledBackground = styled(Flex)<{ showBackgroundColor: boolean }>`
  position: relative;
  flex-direction: column;
  padding-top: 88px;
  background: ${({ showBackgroundColor }) => (showBackgroundColor ? BACKGROUND_COLOR : '')};
  z-index: 0;
`

const StyledHeading = styled(Text)`
  position: relative;
  font-size: 56px;
  font-weight: 900;
  line-height: 98%;
  letter-spacing: 0.01em;
  background: linear-gradient(166.02deg, #ffb237 -5.1%, #ffeb37 75.24%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: auto;

  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 10px rgb(101, 50, 205, 1);
  }
`

const Container = styled(Box)<{ showBackgroundColor: boolean }>`
  position: relative;
  z-index: 1;
  margin: 48px auto;
  width: ${({ showBackgroundColor }) => (showBackgroundColor ? '760px' : '1140px')};
`

const YourTradingReward = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const showBackgroundColor = true

  return (
    <StyledBackground showBackgroundColor={showBackgroundColor}>
      <StyledHeading data-text={t('Your Trading Reward')}>{t('Your Trading Reward')}</StyledHeading>
      {/* <Container showBackgroundColor={showBackgroundColor}>
        <Flex
          width="100%"
          borderRadius={32}
          padding={['48px 0']}
          flexDirection="column"
          alignItems={['center']}
          style={{ background: showBackgroundColor ? theme.card.background : BACKGROUND_COLOR }}
        >
          <NoConnected />
          <ViewEligiblePairs />
          <NoProfile />
          <NoCakeLockedOrExtendLock />
        </Flex>
      </Container> */}

      <ExpiringUnclaim />
    </StyledBackground>
  )
}

export default YourTradingReward
