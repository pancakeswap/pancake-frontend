import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Box, BlockIcon, CardBody } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { NodeRound, BetPosition, NodeLedger } from 'state/types'
import { useGetBetByEpoch } from 'state/hooks'
import { useBlock } from 'state/block/hooks'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { getHasRoundFailed, getNetPayoutv2 } from '../../helpers'
import { RoundResult } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import Card from './Card'
import CardHeader from './CardHeader'
import CollectWinningsOverlay from './CollectWinningsOverlay'
import CanceledRoundCard from './CanceledRoundCard'

interface ExpiredRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  hasClaimedUp: boolean
  hasClaimedDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

const StyledExpiredRoundCard = styled(Card)`
  opacity: 0.7;
  transition: opacity 300ms;

  &:hover {
    opacity: 1;
  }
`

const ExpiredRoundCard: React.FC<ExpiredRoundCardProps> = ({
  round,
  betAmount,
  hasEnteredUp,
  hasEnteredDown,
  hasClaimedUp,
  hasClaimedDown,
  bullMultiplier,
  bearMultiplier,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { initialBlock } = useBlock()
  const { epoch, endBlock, lockPrice, closePrice } = round

  const betPosition = closePrice > lockPrice ? BetPosition.BULL : BetPosition.BEAR
  const ledger = useGetBetByEpoch(account, epoch)
  const payout = getNetPayoutv2(ledger, round)
  const formattedPayout = payout.toUnsafeFloat().toFixed(4)
  const hasRoundFailed = getHasRoundFailed(round, initialBlock)

  if (hasRoundFailed) {
    return <CanceledRoundCard round={round} />
  }

  return (
    <Box position="relative">
      <StyledExpiredRoundCard>
        <CardHeader
          status="expired"
          icon={<BlockIcon mr="4px" width="21px" color="textDisabled" />}
          title={t('Expired')}
          blockNumber={endBlock}
          epoch={round.epoch}
        />
        <CardBody p="16px" style={{ position: 'relative' }}>
          <MultiplierArrow
            betAmount={betAmount}
            multiplier={bullMultiplier}
            isActive={betPosition === BetPosition.BULL}
            hasEntered={hasEnteredUp}
            hasClaimed={hasClaimedUp}
          />
          <RoundResult round={round} hasFailed={hasRoundFailed} />
          <MultiplierArrow
            betAmount={betAmount}
            multiplier={bearMultiplier}
            betPosition={BetPosition.BEAR}
            isActive={betPosition === BetPosition.BEAR}
            hasEntered={hasEnteredDown}
            hasClaimed={hasClaimedDown}
          />
        </CardBody>
      </StyledExpiredRoundCard>
      <CollectWinningsOverlay
        epoch={epoch}
        payout={formattedPayout}
        betAmount={betAmount ? formatBigNumberToFixed(betAmount, 4) : '0'}
        isBottom={hasEnteredDown}
      />
    </Box>
  )
}

export default ExpiredRoundCard
