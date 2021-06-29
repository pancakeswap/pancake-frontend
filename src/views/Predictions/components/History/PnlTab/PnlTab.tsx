import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Box, Flex, Heading, Text, Button, Link, OpenNewIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBscScanAddressUrl } from 'utils/bscscan'
import store from 'state'
import { useGetCurrentEpoch, usePriceBnbBusd } from 'state/hooks'
import { Bet, BetPosition } from 'state/types'
import { formatBnb, getMultiplier, getNetPayout } from 'views/Predictions/helpers'
import { getRoundResult, Result } from 'state/predictions/helpers'
import PnlChart from './PnlChart'
import SummaryRow from './SummaryRow'

interface PnlTabProps {
  hasBetHistory: boolean
  bets: Bet[]
}

interface PnlCategory {
  rounds: number
  amount: number
}

interface PnlSummary {
  won: PnlCategory & { payout: number; bestRound: { id: string; payout: number; multiplier: number } }
  lost: PnlCategory
  entered: PnlCategory
}

const Divider = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundDisabled};
  height: 1px;
  margin: 24px auto;
  width: 100%;
`

const initialPnlSummary: PnlSummary = {
  won: {
    rounds: 0,
    amount: 0,
    payout: 0, // net payout after all deductions
    bestRound: {
      id: '0',
      payout: 0, // net payout after all deductions
      multiplier: 0,
    },
  },
  lost: {
    rounds: 0,
    amount: 0,
  },
  entered: {
    rounds: 0,
    amount: 0,
  },
}

const getPnlSummary = (bets: Bet[], currentEpoch: number): PnlSummary => {
  const state = store.getState()
  const rewardRate = state.predictions.rewardRate / 100

  return bets.reduce((summary: PnlSummary, bet) => {
    const roundResult = getRoundResult(bet, currentEpoch)
    if (roundResult === Result.WIN) {
      const payout = getNetPayout(bet, rewardRate)
      let { bestRound } = summary.won
      if (payout > bestRound.payout) {
        const { bullAmount, bearAmount, totalAmount } = bet.round
        const multiplier = getMultiplier(totalAmount, bet.position === BetPosition.BULL ? bullAmount : bearAmount)
        bestRound = { id: bet.round.id, payout, multiplier }
      }
      return {
        won: {
          rounds: summary.won.rounds + 1,
          amount: summary.won.amount + bet.amount,
          payout: summary.won.payout + payout,
          bestRound,
        },
        entered: {
          rounds: summary.entered.rounds + 1,
          amount: summary.entered.amount + bet.amount,
        },
        lost: summary.lost,
      }
    }
    if (roundResult === Result.LOSE) {
      return {
        lost: {
          rounds: summary.lost.rounds + 1,
          amount: summary.lost.amount + bet.amount,
        },
        entered: {
          rounds: summary.entered.rounds + 1,
          amount: summary.entered.amount + bet.amount,
        },
        won: summary.won,
      }
    }
    // Ignore Canceled and Live rounds
    return summary
  }, initialPnlSummary)
}

const PnlTab: React.FC<PnlTabProps> = ({ hasBetHistory, bets }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const currentEpoch = useGetCurrentEpoch()
  const bnbBusdPrice = usePriceBnbBusd()

  const summary = getPnlSummary(bets, currentEpoch)
  const netResultAmount = summary.won.payout - summary.lost.amount
  const netResultIsPositive = netResultAmount > 0
  const avgPositionEntered = summary.entered.amount / summary.entered.rounds
  const avgBnbWonPerRound = netResultAmount / summary.entered.rounds
  const avgBnbWonIsPositive = avgBnbWonPerRound > 0

  // Guard in case user has only lost rounds
  const hasBestRound = summary.won.bestRound.payout !== 0

  return hasBetHistory ? (
    <Box p="16px">
      <Text bold fontSize="24px" color="secondary" pb="24px">
        {t('Your history')}
      </Text>
      <Flex>
        <PnlChart lost={summary.lost.rounds} won={summary.won.rounds} />
        <Flex flexDirection="column" justifyContent="center" pl="24px">
          <Text bold color="textSubtle">
            {t('Net results')}
          </Text>
          <Text bold fontSize="24px" lineHeight="1" color={netResultIsPositive ? 'success' : 'failure'}>
            {`${netResultIsPositive ? '+' : ''}${formatBnb(netResultAmount)} BNB`}
          </Text>
          <Text small color="textSubtle">
            {`~$${formatBnb(bnbBusdPrice.times(netResultAmount).toNumber())}`}
          </Text>
        </Flex>
      </Flex>
      <Box pl="8px">
        <Text mt="24px" bold color="textSubtle">
          {t('Average return / round')}
        </Text>
        <Text bold color={avgBnbWonIsPositive ? 'success' : 'failure'}>
          {`${avgBnbWonIsPositive ? '+' : ''}${formatBnb(avgBnbWonPerRound)} BNB`}
        </Text>
        <Text small color="textSubtle">
          {`~$${formatBnb(bnbBusdPrice.times(avgBnbWonPerRound).toNumber())}`}
        </Text>

        {hasBestRound && (
          <>
            <Text mt="16px" bold color="textSubtle">
              {t('Best round: #%roundId%', { roundId: summary.won.bestRound.id })}
            </Text>
            <Flex alignItems="flex-end">
              <Text bold color="success">{`+${formatBnb(summary.won.bestRound.payout)} BNB`}</Text>
              <Text ml="4px" small color="textSubtle">
                ({summary.won.bestRound.multiplier.toFixed(2)}x)
              </Text>
            </Flex>
            <Text small color="textSubtle">
              {`~$${formatBnb(bnbBusdPrice.times(summary.won.bestRound.payout).toNumber())}`}
            </Text>
          </>
        )}

        <Text mt="16px" bold color="textSubtle">
          {t('Average position entered / round')}
        </Text>
        <Text bold>{`${formatBnb(avgPositionEntered)} BNB`}</Text>
        <Text small color="textSubtle">
          {`~$${formatBnb(bnbBusdPrice.times(avgPositionEntered).toNumber())}`}
        </Text>

        <Divider />

        <SummaryRow type="won" summary={summary} bnbBusdPrice={bnbBusdPrice} />
        <SummaryRow type="lost" summary={summary} bnbBusdPrice={bnbBusdPrice} />
        <SummaryRow type="entered" summary={summary} bnbBusdPrice={bnbBusdPrice} />

        <Flex justifyContent="center" mt="24px">
          <Link href={`${getBscScanAddressUrl(account)}#internaltx`} mb="16px" external>
            <Button mt="8px" width="100%">
              {t('View Reclaimed & Won')}
              <OpenNewIcon color="white" ml="4px" />
            </Button>
          </Link>
        </Flex>
      </Box>
    </Box>
  ) : (
    <Box p="24px">
      <Heading size="lg" textAlign="center" mb="8px">
        {t('No prediction history available')}
      </Heading>
      <Text as="p" textAlign="center">
        {t(
          'If you are sure you should see history here, make sure you’re connected to the correct wallet and try again.',
        )}
      </Text>
    </Box>
  )
}

export default PnlTab
