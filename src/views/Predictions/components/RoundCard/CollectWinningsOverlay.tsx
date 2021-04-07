import React from 'react'
import { useWeb3React } from '@web3-react/core'
import styled from 'styled-components'
import { Flex, TrophyGoldIcon } from '@pancakeswap-libs/uikit'
import { useAppDispatch } from 'state'
import { useGetBetByRoundId } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { updateRound } from 'state/predictions'
import CollectWinningsButton from '../CollectWinningsButton'
import { getPayout } from '../../helpers'

interface CollectWinningsOverlayProps {
  roundId: string
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

const CollectWinningsOverlay: React.FC<CollectWinningsOverlayProps> = ({ roundId, isBottom = false, ...props }) => {
  const { account } = useWeb3React()
  const bet = useGetBetByRoundId(roundId, account)
  const TranslateString = useI18n()
  const dispatch = useAppDispatch()
  const payout = getPayout(bet)

  const handleSuccess = async () => {
    await dispatch(updateRound({ id: roundId }))
  }

  return (
    <Wrapper alignItems="center" p="16px" isBottom={isBottom} {...props}>
      <TrophyGoldIcon width="64px" style={{ flex: 'none' }} mr="8px" />
      <CollectWinningsButton
        payout={payout}
        epoch={bet.round.epoch}
        hasClaimed={bet.claimed}
        width="100%"
        onSuccess={handleSuccess}
      >
        {TranslateString(556, 'Collect Winnings')}
      </CollectWinningsButton>
    </Wrapper>
  )
}

export default CollectWinningsOverlay
