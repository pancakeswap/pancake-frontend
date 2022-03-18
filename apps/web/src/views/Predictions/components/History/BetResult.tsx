import { useWeb3React } from '@web3-react/core'
import { Box, Flex, Heading, Text, PrizeIcon, BlockIcon, LinkExternal, useTooltip, InfoIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { useTranslation } from 'contexts/Localization'
import { REWARD_RATE } from 'state/predictions/config'
import { Bet, BetPosition } from 'state/types'
import { fetchLedgerData, markAsCollected } from 'state/predictions'
import { Result } from 'state/predictions/helpers'
import { useGetIsClaimable } from 'state/predictions/hooks'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { getBscScanLink } from 'utils'
import { multiplyPriceByAmount } from 'utils/prices'
import useIsRefundable from '../../hooks/useIsRefundable'
import { formatBnb, getNetPayout } from './helpers'
import CollectWinningsButton from '../CollectWinningsButton'
import PositionTag from '../PositionTag'
import ReclaimPositionButton from '../ReclaimPositionButton'

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

const Divider = styled.hr`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const BetResult: React.FC<BetResultProps> = ({ bet, result }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { isRefundable } = useIsRefundable(bet.round.epoch)
  const canClaim = useGetIsClaimable(bet.round.epoch)
  const bnbBusdPrice = useBNBBusdPrice()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text as="p">{t('Includes your original position and your winnings, minus the %fee% fee.', { fee: '3%' })}</Text>,
    { placement: 'auto' },
  )

  const isWinner = result === Result.WIN

  // Winners get the payout, otherwise the claim what they put it if it was canceled
  const payout = isWinner ? getNetPayout(bet, REWARD_RATE) : bet.amount
  const totalPayout = multiplyPriceByAmount(bnbBusdPrice, payout)
  const returned = payout + bet.amount

  const getHeaderColor = () => {
    switch (result) {
      case Result.WIN:
        return 'warning'
      case Result.LOSE:
        return 'textSubtle'
      case Result.CANCELED:
        return 'textDisabled'
      case Result.HOUSE:
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
        return t('Cancelled')
      case Result.HOUSE:
        return t('To Burn')
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
      case Result.HOUSE:
      default:
        return 'text'
    }
  }

  const handleSuccess = async () => {
    // We have to mark the bet as claimed immediately because it does not update fast enough
    dispatch(markAsCollected({ [bet.round.epoch]: true }))
    dispatch(fetchLedgerData({ account, epochs: [bet.round.epoch] }))
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
        {result === Result.WIN && !canClaim && (
          <CollectWinningsButton hasClaimed={!canClaim} width="100%" mb="16px" onSuccess={handleSuccess}>
            {bet.claimed ? t('Already Collected') : t('Collect Winnings')}
          </CollectWinningsButton>
        )}
        {bet.claimed && bet.claimedHash && (
          <Flex justifyContent="center">
            <LinkExternal href={getBscScanLink(bet.claimedHash, 'transaction')} mb="16px">
              {t('View on BscScan')}
            </LinkExternal>
          </Flex>
        )}
        {result === Result.CANCELED && isRefundable && (
          <ReclaimPositionButton epoch={bet.round.epoch} width="100%" mb="16px" />
        )}
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{t('Your direction')}:</Text>
          <PositionTag betPosition={bet.position}>
            {bet.position === BetPosition.BULL ? t('Up') : t('Down')}
          </PositionTag>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{t('Your position')}</Text>
          <Text>{`${formatBnb(bet.amount)} BNB`}</Text>
        </Flex>
        <Flex alignItems="start" justifyContent="space-between">
          <Text bold>{isWinner ? t('Your winnings') : t('Your Result')}:</Text>
          <Box style={{ textAlign: 'right' }}>
            <Text bold color={getResultColor()}>{`${isWinner ? '+' : '-'}${formatBnb(payout)} BNB`}</Text>
            <Text fontSize="12px" color="textSubtle">
              {`~$${totalPayout.toFixed(2)}`}
            </Text>
          </Box>
        </Flex>
        {isWinner && (
          <>
            <Divider />
            <Flex alignItems="start" justifyContent="space-between">
              <Text fontSize="14px" color="textSubtle">
                {t('Amount to collect')}:
              </Text>
              <Flex justifyContent="end">
                <Text fontSize="14px" color="textSubtle">{`${formatBnb(returned)} BNB`}</Text>
                <span ref={targetRef}>
                  <InfoIcon color="textSubtle" ml="4px" />
                </span>
              </Flex>
              {tooltipVisible && tooltip}
            </Flex>
          </>
        )}
      </StyledBetResult>
    </>
  )
}

export default BetResult
