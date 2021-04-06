import React from 'react'
import { Button, ButtonProps, useModal } from '@pancakeswap-libs/uikit'
import { Bet } from 'state/types'
import CollectRoundWinningsModal from './CollectRoundWinningsModal'

interface CollectWinningsButtonProps extends ButtonProps {
  bet: Bet
}

const CollectWinningsButton: React.FC<CollectWinningsButtonProps> = ({ bet, children, ...props }) => {
  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal bnbToCollect={bet.amount} epoch={bet.round.epoch} roundId={bet.round.id} />,
    false,
  )

  return (
    <Button onClick={onPresentCollectWinningsModal} disabled={bet.claimed} {...props}>
      {children}
    </Button>
  )
}

export default CollectWinningsButton
