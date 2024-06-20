import { useTranslation } from '@pancakeswap/localization'
import { PredictionStatus, REWARD_RATE } from '@pancakeswap/prediction'
import {
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  IconButton,
  InfoIcon,
  PlayCircleOutlineIcon,
  Text,
  WaitIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import useLocalDispatch from 'contexts/LocalRedux/useLocalDispatch'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useState } from 'react'
import { fetchLedgerData, markAsCollected } from 'state/predictions'
import { Result, getRoundResult } from 'state/predictions/helpers'
import { useGetCurrentEpoch, useGetIsClaimable, useGetPredictionsStatus } from 'state/predictions/hooks'
import { Bet } from 'state/types'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import { useConfig } from '../../context/ConfigProvider'
import CollectWinningsButton from '../CollectWinningsButton'
import ReclaimPositionButton from '../ReclaimPositionButton'
import { AIBetDetails } from './AIPredictions/AIBetDetails'
import BetDetails from './BetDetails'
import { formatBnb, getNetPayout } from './helpers'

interface BetProps {
  bet: Bet
}

const StyledBet = styled(Flex).attrs({ alignItems: 'center', p: '16px' })`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.cardBorder};
  cursor: pointer;
`

const YourResult = styled(Box)`
  flex: 1;
`

const HistoricalBet: React.FC<React.PropsWithChildren<BetProps>> = ({ bet }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { amount, round } = bet
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t('Neither side wins this round')}
      </Text>
      <Text>
        {t(
          'The Locked Price & Closed Price are exactly the same (within 8 decimals), so neither side wins. All funds entered into UP and DOWN positions will go to the weekly CAKE burn.',
        )}
      </Text>
    </>,
    { placement: 'top' },
  )

  const currentEpoch = useGetCurrentEpoch()
  const status = useGetPredictionsStatus()
  const { chainId } = useActiveChainId()
  const canClaim = useGetIsClaimable(bet?.round?.epoch)
  const dispatch = useLocalDispatch()
  const { address: account } = useAccount()
  const config = useConfig()

  const toggleOpen = () => setIsOpen(!isOpen)

  const getRoundColor = (result) => {
    switch (result) {
      case Result.WIN:
        return 'success'
      case Result.LOSE:
        return 'failure'
      case Result.CANCELED:
        return 'textDisabled'
      case Result.HOUSE:
        return 'textDisabled'
      default:
        return 'text'
    }
  }

  const roundResult = getRoundResult(bet, currentEpoch)
  const resultTextColor = getRoundColor(roundResult)
  const isOpenRound = round?.epoch === currentEpoch
  const isLiveRound = status === PredictionStatus.LIVE && round?.epoch === currentEpoch - 1

  // Winners get the payout, otherwise the claim what they put it if it was canceled
  const payout = roundResult === Result.WIN ? getNetPayout(bet, REWARD_RATE) : amount

  const getRoundPrefix = (result) => {
    if (result === Result.LOSE) {
      return '-'
    }

    if (result === Result.WIN && payout >= 0) {
      return '+'
    }

    return ''
  }
  const resultTextPrefix = getRoundPrefix(roundResult)

  const renderBetLabel = () => {
    if (isOpenRound) {
      return (
        <Flex alignItems="center">
          <WaitIcon color="primary" mr="6px" width="24px" />
          <Text color="primary" bold>
            {t('Starting Soon')}
          </Text>
        </Flex>
      )
    }

    if (isLiveRound) {
      return (
        <Flex alignItems="center">
          <PlayCircleOutlineIcon color="secondary" mr="6px" width="24px" />
          <Text color="secondary" bold>
            {t('Live Now')}
          </Text>
        </Flex>
      )
    }

    return (
      <>
        <Text fontSize="12px" color="textSubtle">
          {t('Your Result')}
        </Text>
        <Text bold color={resultTextColor} lineHeight={1}>
          {roundResult === Result.CANCELED ? (
            t('Cancelled')
          ) : roundResult === Result.HOUSE ? (
            <>
              {tooltipVisible && tooltip}
              <Flex alignItems="center" ref={targetRef}>
                {t('To Burn')}
                <InfoIcon width="16px" ml="4px" color="secondary" />
              </Flex>
            </>
          ) : (
            `${resultTextPrefix}${formatBnb(payout, config?.balanceDecimals ?? config?.displayedDecimals ?? 4)}`
          )}
        </Text>
      </>
    )
  }

  const handleSuccess = async () => {
    if (account && chainId && bet?.round?.epoch) {
      // We have to mark the bet as claimed immediately because it does not update fast enough
      dispatch(markAsCollected({ [bet.round.epoch]: true }))
      dispatch(fetchLedgerData({ account, chainId, epochs: [bet.round.epoch] }))
    }
  }

  return (
    <>
      <StyledBet onClick={toggleOpen} role="button">
        <Box width="48px">
          <Text textAlign="center">
            <Text fontSize="12px" color="textSubtle">
              {t('Round')}
            </Text>
            <Text bold lineHeight={1}>
              {round?.epoch}
            </Text>
          </Text>
        </Box>
        <YourResult px="24px">{renderBetLabel()}</YourResult>
        {roundResult === Result.WIN && canClaim && (
          <CollectWinningsButton hasClaimed={!canClaim} onSuccess={handleSuccess} scale="sm" mr="8px">
            {t('Collect')}
          </CollectWinningsButton>
        )}
        {roundResult === Result.CANCELED && canClaim && (
          <ReclaimPositionButton epoch={bet?.round?.epoch ?? 0} scale="sm" mr="8px">
            {t('Reclaim')}
          </ReclaimPositionButton>
        )}
        {!isOpenRound && !isLiveRound && (
          <IconButton variant="text" scale="sm">
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </IconButton>
        )}
      </StyledBet>
      {isOpen &&
        !isLiveRound &&
        !isOpenRound &&
        (config?.ai ? <AIBetDetails bet={bet} result={roundResult} /> : <BetDetails bet={bet} result={roundResult} />)}
    </>
  )
}

export default HistoricalBet
