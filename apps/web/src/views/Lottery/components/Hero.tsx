import { useCallback } from 'react'
import { styled, keyframes } from 'styled-components'
import { Box, Flex, Heading, Skeleton, Balance, Text, Button } from '@pancakeswap/uikit'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeUSD } from 'state/farms/hooks'
import { useLottery } from 'state/lottery/hooks'
import Image from 'next/image'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { TicketPurchaseCard } from '../svgs'
import BuyTicketsButton from './BuyTicketsButton'
import { BirthdayDecorations } from './BirthdayDecorations'

export const floatingStarsLeft = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(10px, 10px);
  }
  to {
    transform: translate(0, -0px);
  }
`

export const floatingStarsRight = keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-10px, 10px);
  }
  to {
    transform: translate(0, -0px);
  }
`

const mainTicketAnimation = keyframes`
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(6deg);
  }
  to {
    transform: rotate(0deg);
  }
`

const TicketContainer = styled(Flex)`
  animation: ${mainTicketAnimation} 3s ease-in-out infinite;
`

const PrizeTotalBalance = styled(Balance)`
  padding: 0 3px;
  color: #ffffff;
  background: #6532cd;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 7px transparent;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(14, 14, 44, 0.1);
`

const StyledBuyTicketButton = styled(BuyTicketsButton)<{ disabled: boolean }>`
  background: ${({ theme, disabled }) =>
    disabled ? theme.colors.disabled : 'linear-gradient(180deg, #7645d9 0%, #452a7a 100%)'};
  width: 200px;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: 240px;
  }
`

const ButtonWrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-4deg);
`

const TicketSvgWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-4deg);
`

const Decorations = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(/images/decorations/bg-star.svg);
  background-repeat: no-repeat;
  background-position: center 0;
  opacity: 0.8;
`

const YellowText = styled(Text)`
  position: relative;
  font-style: normal;
  font-weight: 800;
  font-size: 40px;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(166deg, #ffb237 -5.1%, #ffeb37 66.78%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(166deg, #ffb237 -5.1%, #ffeb37 66.78%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 4px #6532cd;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
`

const OutlineText = styled(Text)<{ color: string; backgroundColor: string; stroke?: number }>`
  padding: 0 2px;
  color: ${({ color }) => color};
  background: ${({ backgroundColor }) => backgroundColor};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: ${({ stroke }) => `${stroke ? `${stroke}px` : '4px'} transparent`};
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(14, 14, 44, 0.1);
`

const StyledLearnMoreButton = styled(Button)`
  width: fit-content;
  color: #533295;
  background: linear-gradient(180deg, #ffd800 0%, #fdab32 100%);
  margin: 20px 0 0 0;
  align-self: center;

  ${({ theme }) => theme.mediaQueries.xl} {
    margin: 0 0 0 8px;
  }
`

const Hero = () => {
  const { t } = useTranslation()
  const {
    currentRound: { amountCollectedInCake, status },
    isTransitioning,
  } = useLottery()

  const cakePriceBusd = usePriceCakeUSD()
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const ticketBuyIsDisabled = status !== LotteryStatus.OPEN || isTransitioning

  const getHeroHeading = () => {
    if (status === LotteryStatus.OPEN) {
      return (
        <Flex zIndex={1} flexDirection="column" justifyContent="center">
          {prizeInBusd.isNaN() ? (
            <Skeleton my="7px" height={60} width={190} />
          ) : (
            <PrizeTotalBalance fontSize="64px" bold prefix="$" value={prizeTotal} mb="8px" decimals={0} />
          )}
          <OutlineText
            textAlign="center"
            color="#ffffff"
            backgroundColor="#6532CD"
            mb={['151px', '151px', '151px', '151px', '151px', '32px']}
            stroke={5}
            fontSize={['24px']}
          >
            {t('in prizes!')}
          </OutlineText>
        </Flex>
      )
    }
    return (
      <Heading mb="24px" scale="xl" color="#ffffff">
        {t('Tickets on sale soon')}
      </Heading>
    )
  }

  const onClickButton = useCallback(() => {
    window.open(
      'https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-4-mars-mystique-lottery-paradise',
      '_blank',
      'noopener noreferrer',
    )
  }, [])

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Decorations />
      <BirthdayDecorations />
      <Flex zIndex={1} flexDirection="column">
        <OutlineText
          textAlign="center"
          id="lottery-hero-title"
          color="#26FFCB"
          backgroundColor="#6532CD"
          mb="8px"
          fontSize={['24px']}
        >
          {t('The PancakeSwap Birthday Lottery')}
        </OutlineText>
        <Flex mb="8px" flexDirection={['column', 'column', 'column', 'column', 'column', 'row']}>
          <YellowText data-text={t('Mars Lottery Paradise!')}>{t('Mars Lottery Paradise!')}</YellowText>
          <Flex justifyContent="center">
            <Box
              display={['block', 'block', 'block', 'block', 'block', 'none']}
              position="relative"
              top="6px"
              right="-14px"
              zIndex={1}
              style={{ pointerEvents: 'none' }}
            >
              <Image src="/images/lottery/birthday/birthday-cake-icon.png" width={50} height={50} alt="birthday-cion" />
            </Box>
            <StyledLearnMoreButton scale="sm" onClick={onClickButton}>
              {t('Learn More')}
            </StyledLearnMoreButton>
          </Flex>
        </Flex>
      </Flex>
      {getHeroHeading()}
      <TicketContainer
        position="relative"
        width={['240px', '288px']}
        height={['94px', '113px']}
        alignItems="center"
        justifyContent="center"
      >
        <ButtonWrapper>
          <StyledBuyTicketButton disabled={ticketBuyIsDisabled} themeMode="light" />
        </ButtonWrapper>
        <TicketSvgWrapper>
          <TicketPurchaseCard width="100%" />
        </TicketSvgWrapper>
      </TicketContainer>
    </Flex>
  )
}

export default Hero
