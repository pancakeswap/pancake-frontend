import React, { useCallback } from 'react'
import styled from 'styled-components'
import {
  Heading,
  Text,
  BaseLayout,
  Card,
  Button,
} from '@pancakeswap-libs/uikit'
import { useWallet } from 'use-wallet'
import useI18n from 'hooks/useI18n'
import useFarm from 'hooks/useFarm'
import useModal from 'hooks/useModal'
import Page from 'components/layout/Page'
import WalletProviderModal from 'components/WalletProviderModal'
import Container from 'components/layout/Container'
import CakeHarvestBalance from './components/CakeHarvestBalance'
import CakeWalletBalance from './components/CakeWalletBalance'
import HarvestAll from './components/HarvestAll'

const Hero = styled(Container)`
  align-items: center;
  background-image: url('/images/pan-bg-mobile.svg');
  background-repeat: no-repeat;
  background-position: top center;
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 32px;
  padding-top: 116px;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.lg} {
    background-image: url('/images/pan-bg.svg'), url('/images/pan-bg2.svg');
    background-position: left center, right center;
    height: 165px;
    margin-top: 48px;
    padding-top: 0;
  }
`

const Title = styled(Heading)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 40px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 64px;
  }
`

const Subtitle = styled(Text)`
  font-weight: 400;
`

const Cards = styled(BaseLayout)`
  & > div {
    grid-column: span 6;
  }
  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 64px;
  }
`

const FarmStakingCard = styled(Card)`
  background: url('/images/cake-bg.svg') no-repeat top right;
`

const CardTitle = styled(Heading).attrs({ size: 'lg' })`
  margin-bottom: 24px;
`

const CardImage = styled.img`
  margin-bottom: 16px;
`

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 14px;
`

const Block = styled.div`
  margin-bottom: 16px;
`

const Value = styled.div`
  margin-bottom: 8px;
`

const Controls = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-template-columns: repeat(2, 1fr);
  padding: 8px 0;
`

const Home: React.FC = () => {
  const farmInfo = useFarm('CAKE')
  const TranslateString = useI18n()
  const { account } = useWallet()
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
    <Page>
      <Hero>
        <div>
          <Title as="h1">Pancake Swap</Title>
          <Subtitle>
            {TranslateString(
              9999,
              'The #1 AMM and yield farm on Binance Smart Chain.',
            )}
          </Subtitle>
        </div>
      </Hero>
      <Container>
        <Cards>
          <FarmStakingCard>
            <CardTitle>{TranslateString(9999, 'Farms & Staking')}</CardTitle>
            <CardImage src="/images/cake.svg" alt="cake logo" />
            <Block>
              <Value>
                <CakeHarvestBalance />
              </Value>
              <Label>{TranslateString(9999, 'CAKE to Harvest')}</Label>
            </Block>
            <Block>
              <Value>
                <CakeWalletBalance />
              </Value>
              <Label>{TranslateString(9999, 'CAKE in Wallet')}</Label>
            </Block>
            {!account && (
              <Button onClick={handleUnlockClick}>
                {TranslateString(292, 'Unlock Wallet')}
              </Button>
            )}
            {account && (
              <Controls>
                <HarvestAll />
                <Button variant="secondary" fullWidth>
                  Stake All
                </Button>
              </Controls>
            )}
          </FarmStakingCard>
        </Cards>
      </Container>
    </Page>
  )
}

export default Home
