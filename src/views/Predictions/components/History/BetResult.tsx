import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Flex, Heading, Text, PrizeIcon, BlockIcon } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import useI18n from 'hooks/useI18n'
import styled from 'styled-components'
import { Bet, BetPosition } from 'state/types'
import { updateBet } from 'state/predictions'
import { formatBnb, getPayout } from '../../helpers'
import CollectWinningsButton from '../CollectWinningsButton'
import PositionTag from '../PositionTag'

interface BetResultProps {
  bet: Bet
  isWinner: boolean
}

const StyledBetResult = styled(Box)`
  border: 2px solid ${({ theme }) => theme.colors.textDisabled};
  border-radius: 16px;
  margin-bottom: 24px;
  padding: 16px;
`

const BetResult: React.FC<BetResultProps> = ({ bet, isWinner }) => {
  const TranslateString = useI18n()
  const payout = getPayout(bet)
  const dispatch = useAppDispatch()
  const headerColor = isWinner ? 'warning' : 'textSubtle'
  const { account } = useWeb3React()

  const handleSuccess = async () => {
    await dispatch(updateBet({ account, id: bet.id }))
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between">
        <Heading mb="8px">{TranslateString(999, 'Your History')}</Heading>
        <Flex alignItems="center">
          <Heading as="h3" color={headerColor} textTransform="uppercase" bold mr="4px">
            {isWinner ? TranslateString(999, 'Win') : TranslateString(999, 'Lose')}
          </Heading>
          {isWinner ? <PrizeIcon color={headerColor} /> : <BlockIcon color={headerColor} />}
        </Flex>
      </Flex>
      <StyledBetResult>
        {isWinner && !bet.claimed && (
          <CollectWinningsButton
            payout={payout}
            epoch={bet.round.epoch}
            hasClaimed={bet.claimed}
            width="100%"
            mb="16px"
            onSuccess={handleSuccess}
          >
            {TranslateString(999, 'Collect Winnings')}
          </CollectWinningsButton>
        )}
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{TranslateString(999, 'Your direction')}</Text>
          <PositionTag betPosition={bet.position}>
            {bet.position === BetPosition.BULL ? TranslateString(999, 'Up') : TranslateString(999, 'Down')}
          </PositionTag>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{TranslateString(999, 'Your position')}</Text>
          <Text>{`${formatBnb(bet.amount)} BNB`}</Text>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text bold>{TranslateString(999, 'Your Result')}</Text>
          <Text bold color={isWinner ? 'success' : 'failure'}>{`${isWinner ? '+' : '-'}${formatBnb(payout)} BNB`}</Text>
        </Flex>
      </StyledBetResult>
    </>
  )
}

export default BetResult
