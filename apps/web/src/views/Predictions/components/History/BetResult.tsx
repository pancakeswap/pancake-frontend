import { useTranslation } from '@pancakeswap/localization'
import { BetPosition, REWARD_RATE } from '@pancakeswap/prediction'
import { BlockIcon, Box, Flex, Heading, InfoIcon, PrizeIcon, ScanLink, Text, useTooltip } from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useMemo } from 'react'
import { fetchLedgerData, markAsCollected } from 'state/predictions'
import { Result } from 'state/predictions/helpers'
import { useGetIsClaimable } from 'state/predictions/hooks'
import { Bet } from 'state/types'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { useConfig } from 'views/Predictions/context/ConfigProvider'
import { useTokenUsdPriceBigNumber } from 'views/Predictions/hooks/useTokenPrice'
import { useAccount } from 'wagmi'

import useIsRefundable from '../../hooks/useIsRefundable'
import CollectWinningsButton from '../CollectWinningsButton'
import PositionTag from '../PositionTag'
import ReclaimPositionButton from '../ReclaimPositionButton'
import { formatBnb, getNetPayout } from './helpers'

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

const BetResult: React.FC<React.PropsWithChildren<BetResultProps>> = ({ bet, result }) => {
  const { t } = useTranslation()
  const dispatch = useLocalDispatch()
  const { address: account } = useAccount()
  const { isRefundable } = useIsRefundable(bet?.round?.epoch ?? 0)
  const canClaim = useGetIsClaimable(bet?.round?.epoch)
  const config = useConfig()
  const tokenPrice = useTokenUsdPriceBigNumber(config?.token)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text as="p">{t('Includes your original position and your winnings, minus the %fee% fee.', { fee: '3%' })}</Text>,
  )

  const isWinner = result === Result.WIN

  // Winners get the payout, otherwise the claim what they put it if it was canceled
  const payout = isWinner ? getNetPayout(bet, REWARD_RATE) : bet.amount
  const totalPayout = tokenPrice.multipliedBy(payout).toNumber()
  const returned = payout + bet.amount

  const tokenSymbol = useMemo(() => config?.token?.symbol ?? '', [config])
  const displayedDecimals = useMemo(() => config?.displayedDecimals ?? 4, [config])

  const headerColor = useMemo(() => {
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
  }, [result])

  const headerText = useMemo(() => {
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
  }, [t, result])

  const headerIcon = useMemo(() => {
    switch (result) {
      case Result.WIN:
        return <PrizeIcon color={headerColor} />
      case Result.LOSE:
      case Result.CANCELED:
        return <BlockIcon color={headerColor} />
      default:
        return null
    }
  }, [result, headerColor])

  const resultColor = useMemo(() => {
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
  }, [result])

  const handleSuccess = async () => {
    if (account && bet?.round?.epoch && config?.token?.chainId) {
      // We have to mark the bet as claimed immediately because it does not update fast enough
      dispatch(markAsCollected({ [bet.round.epoch]: true }))
      dispatch(fetchLedgerData({ account, chainId: config?.token?.chainId, epochs: [bet.round.epoch] }))
    }
  }

  return (
    <>
      <Flex alignItems="center" justifyContent="space-between" mb="8px">
        <Heading>{t('Your History')}</Heading>
        <Flex alignItems="center">
          <Heading as="h3" color={headerColor} textTransform="uppercase" bold mr="4px">
            {headerText}
          </Heading>
          {headerIcon}
        </Flex>
      </Flex>
      <StyledBetResult>
        {result === Result.WIN && canClaim && (
          <CollectWinningsButton hasClaimed={!canClaim} width="100%" mb="16px" onSuccess={handleSuccess}>
            {bet.claimed ? t('Already Collected') : t('Collect Winnings')}
          </CollectWinningsButton>
        )}
        {bet.claimed && bet.claimedHash && (
          <Flex justifyContent="center">
            <ScanLink href={getBlockExploreLink(bet.claimedHash, 'transaction', config?.token?.chainId)} mb="16px">
              {t('View on %site%', { site: t('Explorer') })}
            </ScanLink>
          </Flex>
        )}
        {result === Result.CANCELED && isRefundable && (
          <ReclaimPositionButton epoch={bet?.round?.epoch ?? 0} width="100%" mb="16px" />
        )}
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{t('Your direction')}:</Text>
          <PositionTag betPosition={bet.position}>
            {bet.position === BetPosition.BULL ? t('Up') : t('Down')}
          </PositionTag>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between" mb="16px">
          <Text>{t('Your position')}</Text>
          <Text>{`${formatBnb(bet.amount, displayedDecimals)} ${tokenSymbol}`}</Text>
        </Flex>
        <Flex alignItems="start" justifyContent="space-between">
          <Text bold>{isWinner ? t('Your winnings') : t('Your Result')}:</Text>
          <Box style={{ textAlign: 'right' }}>
            <Text bold color={resultColor}>{`${isWinner ? '+' : '-'}${formatBnb(
              payout,
              displayedDecimals,
            )} ${tokenSymbol}`}</Text>
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
                <Text fontSize="14px" color="textSubtle">{`${formatBnb(
                  returned,
                  displayedDecimals,
                )} ${tokenSymbol}`}</Text>
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
