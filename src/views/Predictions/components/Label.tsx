import React from 'react'
import styled from 'styled-components'
import { BnbUsdtPairTokenIcon, Box, Card, PocketWatchIcon, Text } from '@pancakeswap-libs/uikit'
import { useBnbUsdtTicker } from 'hooks/ticker'
import useI18n from 'hooks/useI18n'
import { formatRoundTime } from '../helpers'
import useRoundCountdown from '../hooks/useRoundCountdown'

const Token = styled(Box)`
  margin-top: -24px;
  position: absolute;
  top: 50%;
  z-index: 30;

  & > svg {
    height: 48px;
    width: 48px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: -32px;

    & > svg {
      height: 64px;
      width: 64px;
    }
  }
`

const Title = styled(Text)`
  font-size: 16px;
  line-height: 21px;

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 20px;
    line-height: 22px;
  }
`

const Price = styled(Text)`
  height: 18px;
  justify-self: start;
  width: 60px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
  }
`

const Interval = styled(Text)`
  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: center;
    width: 32px;
  }
`

const Label = styled(Card)<{ dir: 'left' | 'right' }>`
  align-items: ${({ dir }) => (dir === 'right' ? 'flex-end' : 'flex-start')};
  border-radius: ${({ dir }) => (dir === 'right' ? '8px 8px 8px 24px' : '8px 8px 24px 8px')};
  display: flex;
  flex-direction: column;
  overflow: initial;
  padding: ${({ dir }) => (dir === 'right' ? '0 28px 0 8px' : '0 8px 0 24px')};

  ${({ theme }) => theme.mediaQueries.lg} {
    align-items: center;
    border-radius: 16px;
    flex-direction: row;
    padding: ${({ dir }) => (dir === 'right' ? '8px 40px 8px 8px' : '8px 8px 8px 40px')};
  }
`

export const PricePairLabel: React.FC = () => {
  const { stream } = useBnbUsdtTicker()
  const { lastPrice } = stream ?? {}

  return (
    <Box pl="24px" position="relative" display="inline-block">
      <Token left={0}>
        <BnbUsdtPairTokenIcon />
      </Token>
      <Label dir="left">
        <Title bold textTransform="uppercase">
          BNBUSDT
        </Title>
        <Price fontSize="12px">
          {lastPrice &&
            `$${lastPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
        </Price>
      </Label>
    </Box>
  )
}

interface TimerLabelProps {
  interval: string
}

export const TimerLabel: React.FC<TimerLabelProps> = ({ interval }) => {
  const seconds = useRoundCountdown()
  const countdown = formatRoundTime(seconds)
  const TranslateString = useI18n()

  return (
    <Box pr="24px" position="relative">
      <Label dir="right">
        <Title bold color="secondary">
          {seconds === 0 ? TranslateString(999, 'Closing') : countdown}
        </Title>
        <Interval fontSize="12px">{interval}</Interval>
      </Label>
      <Token right={0}>
        <PocketWatchIcon />
      </Token>
    </Box>
  )
}
