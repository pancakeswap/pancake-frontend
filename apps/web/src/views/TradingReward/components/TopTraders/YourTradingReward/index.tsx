import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { floatingStarsLeft, floatingStarsRight } from 'views/Lottery/components/Hero'
import RewardPeriod from 'views/TradingReward/components/TopTraders/YourTradingReward/RewardPeriod'
import NoConnected from 'views/TradingReward/components/YourTradingReward/NoConnected'
import { Incentives, Qualification, RewardInfo } from 'views/TradingReward/hooks/useAllTradingRewardPair'
import { UserCampaignInfoDetail } from 'views/TradingReward/hooks/useAllUserCampaignInfo'
import { useAccount } from 'wagmi'

const BACKGROUND_COLOR = 'radial-gradient(55.22% 134.13% at 57.59% 0%, #F5DF8E 0%, #FCC631 33.21%, #FF9D00 79.02%)'

const StyledBackground = styled(Flex)<{ showBackgroundColor: boolean }>`
  position: relative;
  flex-direction: column;
  padding-top: 48px;
  margin-bottom: 48px;
  background: ${({ showBackgroundColor }) => (showBackgroundColor ? BACKGROUND_COLOR : '')};
  z-index: 0;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 88px 0;
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
  padding: 0 16px;
  text-align: center;

  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    padding: 0 16px;
    z-index: -1;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 8px rgb(101, 50, 205, 1);
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 56px;
    padding: 0;

    &::after {
      padding: 0;
    }
  }
`

const Container = styled(Box)<{ showBackgroundColor: boolean }>`
  position: relative;
  z-index: 1;
  margin: 48px auto auto auto;
  width: 100%;
  padding: 0 16px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    width: ${({ showBackgroundColor }) => (showBackgroundColor ? '100%' : '1140px')};
  }
`

const Decorations = styled(Box)<{ showBackgroundColor: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: none;
  pointer-events: none;
  overflow: hidden;
  > img {
    position: absolute;
  }
  & :nth-child(1) {
    top: 8%;
    left: 0%;
  }
  & :nth-child(2) {
    bottom: 20%;
    right: 0;
    animation: ${floatingStarsRight} 2.5s ease-in-out infinite;
  }
  & :nth-child(3) {
    right: 2%;
    bottom: ${({ showBackgroundColor }) => (showBackgroundColor ? '15%' : '0%')};
    animation: ${floatingStarsLeft} 4.5s ease-in-out infinite;
  }
  & :nth-child(4) {
    top: 2%;
    right: 0;
    animation: ${floatingStarsLeft} 3.5s ease-in-out infinite;
    display: ${({ showBackgroundColor }) => (showBackgroundColor ? 'block' : 'none')};
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    display: block;
  }

  @media screen and (min-width: 1680px) {
    & :nth-child(3) {
      right: 15%;
    }
  }
}`

const BaseContainer = styled(Flex)<{ showBackgroundColor: boolean }>`
  width: 100%;
  border-radius: 32px;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: ${({ theme, showBackgroundColor }) => (showBackgroundColor ? theme.card.background : BACKGROUND_COLOR)};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 48px 0;
  }
`

interface YourTradingRewardProps {
  isFetching: boolean
  incentives: Incentives
  campaignIds: Array<string>
  totalAvailableClaimData: UserCampaignInfoDetail[]
  qualification: Qualification
  rewardInfo: { [key in string]: RewardInfo }
  campaignIdsIncentive: Incentives[]
  currentUserCampaignInfo: UserCampaignInfoDetail
}

const YourTradingReward: React.FC<React.PropsWithChildren<YourTradingRewardProps>> = ({
  isFetching,
  incentives,
  campaignIds,
  qualification,
  totalAvailableClaimData,
  rewardInfo,
  campaignIdsIncentive,
  currentUserCampaignInfo,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  return (
    <StyledBackground showBackgroundColor={!!account}>
      <StyledHeading data-text={t('Your Trading Reward')}>{t('Your Trading Reward')}</StyledHeading>
      {isFetching && (
        <Skeleton
          height={380}
          borderRadius={16}
          margin="32px auto"
          width={['calc(100% - 32px)', 'calc(100% - 32px)', 'calc(100% - 32px)', 'calc(100% - 32px)', '900px']}
        />
      )}

      {!isFetching && !account && (
        <Container showBackgroundColor={false}>
          <BaseContainer showBackgroundColor={false}>
            <NoConnected />
          </BaseContainer>
        </Container>
      )}

      {!isFetching && account && (
        <Container showBackgroundColor>
          <RewardPeriod
            campaignIds={campaignIds}
            rewardInfo={rewardInfo}
            totalAvailableClaimData={totalAvailableClaimData}
            campaignStart={incentives?.campaignStart}
            campaignClaimTime={incentives?.campaignClaimTime}
            qualification={qualification}
            campaignIdsIncentive={campaignIdsIncentive}
            currentUserCampaignInfo={currentUserCampaignInfo}
          />
        </Container>
      )}

      <Decorations showBackgroundColor={!!account}>
        <img src="/images/trading-reward/left-bunny.png" width="93px" height="242px" alt="left-bunny" />
        <img src="/images/trading-reward/right-bunny.png" width="161px" height="161px" alt="right-bunny" />
        <img src="/images/trading-reward/boat.png" width="307px" height="297px" alt="boat" />
        <img src="/images/trading-reward/coin.png" width="183px" height="119px" alt="coin" />
      </Decorations>
    </StyledBackground>
  )
}

export default YourTradingReward
