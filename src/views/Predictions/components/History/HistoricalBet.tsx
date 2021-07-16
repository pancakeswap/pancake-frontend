import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  Box,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  IconButton,
  PlayCircleOutlineIcon,
  Text,
} from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import { useAppDispatch } from 'state'
import { markBetAsCollected } from 'state/predictions'
import { Bet, BetPosition, PredictionStatus } from 'state/types'
import { useGetCurrentEpoch, useGetPredictionsStatus } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import { formatBnb, getPayout } from '../../helpers'
import CollectWinningsButton from '../CollectWinningsButton'
import ReclaimPositionButton from '../ReclaimPositionButton'
import BetDetails from './BetDetails'
import { Result } from './BetResult'

interface BetProps {
  bid: any
}

const StyledBet = styled(Flex).attrs({ alignItems: 'center', p: '16px' })`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  cursor: pointer;
`

const YourResult = styled(Box)`
  flex: 1;
`

const HistoricalBet: React.FC<BetProps> = ({ bid }) => {
  const [isOpen, setIsOpen] = useState(false)

  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const currentEpoch = useGetCurrentEpoch()
  const status = useGetPredictionsStatus()

  const toggleOpen = () => setIsOpen(!isOpen)

  const getRoundColor = () => {
    // switch (result) {
    //   case Result.WIN:
        return 'success'
      // case Result.LOSE:
      //   return 'failure'
      // case Result.CANCELED:
      //   return 'textDisabled'
      // default:
      //   return 'text'
    // }
  }

  const getRoundPrefix = (result) => {
    if (result === Result.LOSE) {
      return '-'
    }

    if (result === Result.WIN) {
      return '+'
    }

    return ''
  }

  const handleSuccess = async () => {
    dispatch(markBetAsCollected({ account, betId: bid.id }))
  }

  const renderBetLabel = () => {
    if (true) {
      return (
        <Flex alignItems="center">
          <PlayCircleOutlineIcon color="primary" mr="6px" width="24px" />
          <Text color="primary" bold>
            {t('Starting Soon')}
          </Text>
        </Flex>
      )
    }

    if (true) {
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
        <Text bold color={getRoundColor()} lineHeight={1}>
          {/* {`${resultTextPrefix}${formatBnb(payout)}`} */}
        </Text>
      </>
    )
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
              {/* {round.epoch.toLocaleString()} */}
            </Text>
          </Text>
        </Box>
        <YourResult px="24px">{renderBetLabel()}</YourResult>
        {/* {roundResult === Result.WIN && !claimed && ( */}
        {/*  <CollectWinningsButton */}
        {/*    onSuccess={handleSuccess} */}
        {/*    hasClaimed={bet.claimed} */}
        {/*    epoch={bet.round.epoch} */}
        {/*    payout={payout} */}
        {/*    scale="sm" */}
        {/*    mr="8px" */}
        {/*  > */}
        {/*    {t('Collect')} */}
        {/*  </CollectWinningsButton> */}
        {/* )} */}
      {/*  {roundResult === Result.CANCELED && !claimed && ( */}
      {/*    <ReclaimPositionButton onSuccess={handleSuccess} epoch={bet.round.epoch} scale="sm" mr="8px"> */}
      {/*      {t('Reclaim')} */}
      {/*    </ReclaimPositionButton> */}
      {/*  )} */}
      {/*  {!isOpenRound && !isLiveRound && ( */}
      {/*    <IconButton variant="text" scale="sm"> */}
      {/*      {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />} */}
      {/*    </IconButton> */}
      {/*  )} */}
       </StyledBet>
      {/* {isOpen && <BetDetails bid={bid} result={getRoundResult()} />} */}
    </>
  )
}

export default HistoricalBet
