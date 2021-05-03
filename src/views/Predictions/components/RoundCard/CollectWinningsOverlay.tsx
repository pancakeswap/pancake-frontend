import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Flex, TrophyGoldIcon } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import { useGetCurrentEpoch } from 'state/hooks'
import { getBetHistory, transformBetResponse } from 'state/predictions/helpers'
import { markBetAsCollected } from 'state/predictions'
import { useTranslation } from 'contexts/Localization'
import CollectWinningsButton from '../CollectWinningsButton'
import { getPayout } from '../../helpers'

interface CollectWinningsOverlayProps {
  roundId: string
  hasEntered: boolean
  isBottom?: boolean
}

const Wrapper = styled(Flex)<{ isBottom: CollectWinningsOverlayProps['isBottom'] }>`
  background-color: ${({ theme }) => theme.colors.secondary};
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 30;

  ${({ isBottom }) => {
    return isBottom
      ? `
      border-radius: 0 0 16px 16px;
      bottom: 0;
    `
      : `
      top: 0;
    `
  }}
`

const CollectWinningsOverlay: React.FC<CollectWinningsOverlayProps> = ({
  roundId,
  hasEntered,
  isBottom = false,
  ...props
}) => {
  const [state, setState] = useState<{ betId: string; epoch: number; payout: number }>({
    betId: null,
    epoch: null,
    payout: 0,
  })
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const currentEpoch = useGetCurrentEpoch()

  // Check if the wallet can collect the bet
  // We do it here because it is not guaranteed the bet info will be in the history
  useEffect(() => {
    const fetchBet = async () => {
      const bets = await getBetHistory({ user: account.toLowerCase(), round: roundId, claimed: false })

      if (bets.length === 1) {
        const [firstBetResponse] = bets
        const bet = transformBetResponse(firstBetResponse)

        if (bet.position === bet.round.position) {
          setState({
            betId: bet.id,
            epoch: bet.round.epoch,
            payout: getPayout(bet),
          })
        }
      }
    }

    if (account && hasEntered) {
      fetchBet()
    }
  }, [account, roundId, hasEntered, currentEpoch, setState])

  if (!state.epoch) {
    return null
  }

  const handleSuccess = async () => {
    dispatch(markBetAsCollected({ betId: state.betId, account }))
    setState({ betId: null, epoch: null, payout: 0 })
  }

  return (
    <Wrapper alignItems="center" p="16px" isBottom={isBottom} {...props}>
      <TrophyGoldIcon width="64px" style={{ flex: 'none' }} mr="8px" />
      <CollectWinningsButton
        payout={state.payout}
        epoch={state.epoch}
        hasClaimed={false}
        width="100%"
        onSuccess={handleSuccess}
      >
        {t('Collect Winnings')}
      </CollectWinningsButton>
    </Wrapper>
  )
}

export default CollectWinningsOverlay
