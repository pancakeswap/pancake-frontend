import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Box, Flex, Heading, Text, PrizeIcon, BlockIcon } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import { usePriceBnbBusd } from 'state/hooks'
import styled from 'styled-components'
import { Bet, BetPosition } from 'state/types'
import { fetchBet } from 'state/predictions'
import useIsRefundable from '../../hooks/useIsRefundable'
import { formatBnb, getPayout } from '../../helpers'
import CollectWinningsButton from '../CollectWinningsButton'
import PositionTag from '../PositionTag'
import ReclaimPositionButton from '../ReclaimPositionButton'

export enum Result {
  WIN = 'win',
  LOSE = 'lose',
  CANCELED = 'canceled',
  LIVE = 'live',
}

interface BetResultProps {
  bet: Bet
  result: Result
}

const StyledBetResult = styled(Box)`
  border: 2px solid ${({ theme }) => theme.colors.textDisabled};
  border-radius: 16px;
  margin-bottom: 24px;
  padding: 16px;
`

const BetResult: React.FC<BetResultProps> = ({ bet, result }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { isRefundable } = useIsRefundable(bet.round.epoch)
  const bnbBusdPrice = usePriceBnbBusd()

  // Winners get the payout, otherwise the claim what they put it if it was canceled
  const payout = result === Result.WIN ? getPayout(bet) : bet.amount

  const getHeaderColor = () => {
    switch (result) {
      case Result.WIN:
        return 'warning'
      case Result.LOSE:
        return 'textSubtle'
      case Result.CANCELED:
        return 'textDisabled'
      default:
        return 'text'
    }
  }

  const getHeaderText = () => {
    switch (result) {
      case Result.WIN:
        return t('Win')
      case Result.LOSE:
        return t('Lose')
      case Result.CANCELED:
        return t('Canceled')
      default:
        return ''
    }
  }

  const getHeaderIcon = () => {
    switch (result) {
      case Result.WIN:
        return <PrizeIcon color={getHeaderColor()} />
      case Result.LOSE:
      case Result.CANCELED:
        return <BlockIcon color={getHeaderColor()} />
      default:
        return null
    }
  }

  const getResultColor = () => {
    switch (result) {
      case Result.WIN:
        return 'success'
      case Result.LOSE:
        return 'failure'
      case Result.CANCELED:
      default:
        return 'text'
    }
  }

  const handleSuccess = async () => {
    await dispatch(fetchBet({ account, id: bet.id }))
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Heading>{t('Your History')}</Heading>
        <Flex alignItems="center">
          <Heading as="h3" color={getHeaderColor()} textTransform="uppercase" bold mr="4px">
            {getHeaderText()}
          </Heading>
          {getHeaderIcon()}
        </Flex>
      </Flex>
      <StyledBetResult>
        {result === Result.WIN && !bet.claimed && (
          <CollectWinningsButton
            payout={payout}
            epoch={bet.round.epoch}
            hasClaimed={bet.claimed}
            width="100%"
            mb="16px"
            onSuccess={handleSuccess}
          >
            {t('Collect Winnings')}
          </CollectWinningsButton>
        )}
        {result === Result.CANCELED && isRefundable && (
          <ReclaimPositionButton epoch={bet.round.epoch} width="100%" mb="16px" />
        )}
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{t('Your direction')}</Text>
          <PositionTag betPosition={bet.position}>
            {bet.position === BetPosition.BULL ? t('Up') : t('Down')}
          </PositionTag>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{t('Your position')}</Text>
          <Text>{`${formatBnb(bet.amount)} BNB`}</Text>
        </Flex>
        <Flex alignItems="start" justifyContent="space-between">
          <Text bold>{t('Your Result')}</Text>
          <Box style={{ textAlign: 'right' }}>
            <Text bold color={getResultColor()}>{`${result === Result.LOSE ? '-' : '+'}${formatBnb(payout)} BNB`}</Text>
            <Text fontSize="12px" color="textSubtle">
              {`~$${formatBnb(bnbBusdPrice.times(payout).toNumber())}`}
            </Text>
          </Box>
        </Flex>
      </StyledBetResult>
    </>
  )
}

export default BetResult
