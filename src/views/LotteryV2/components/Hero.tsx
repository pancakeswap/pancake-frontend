import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Heading, Button, useModal, Ticket, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useLottery, usePriceCakeBusd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { TicketPurchaseCard } from '../svgs'
import BuyTicketsModal from './BuyTicketsModal'

const PrizeTotalBalance = styled(Balance)`
  background: ${({ theme }) => theme.colors.gradients.gold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const StyledTicketButton = styled(Button)`
  background: linear-gradient(180deg, #7645d9 0%, #452a7a 100%);
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

const Hero = () => {
  const { t } = useTranslation()
  const [onPresentBuyTicketModal] = useModal(<BuyTicketsModal />)
  const {
    currentRound: { amountCollectedInCake },
  } = useLottery()

  // TODO: Re-enebale in prod
  // const cakePriceBusd = usePriceCakeBusd()
  const cakePriceBusd = new BigNumber(20.55)
  const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center">
      <Heading mb="8px" scale="md" color="#ffffff">
        {t('The PancakeSwapLottery')}
      </Heading>
      {prizeTotal ? (
        <PrizeTotalBalance fontSize="64px" bold prefix="$" value={prizeTotal} mb="8px" decimals={0} />
      ) : (
        <Skeleton my="7px" height={60} width={190} />
      )}

      <Heading mb="32px" scale="lg" color="#ffffff">
        {t('in prizes!')}
      </Heading>
      <Flex position="relative" width="288px" height="113px" alignItems="center" justifyContent="center">
        <ButtonWrapper>
          <StyledTicketButton onClick={onPresentBuyTicketModal} width="240px">
            {t('Buy Tickets')}
          </StyledTicketButton>
        </ButtonWrapper>
        <TicketSvgWrapper>
          <TicketPurchaseCard width="288px" />
        </TicketSvgWrapper>
      </Flex>
    </Flex>
  )
}

export default Hero
