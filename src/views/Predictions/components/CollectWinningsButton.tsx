import React from 'react'
import { Button, ButtonProps, useModal } from '@pancakeswap/uikit'
import CollectRoundWinningsModal from './CollectRoundWinningsModal'

interface CollectWinningsButtonProps extends ButtonProps {
  payout: string
  betAmount: string
  epoch: number
  hasClaimed: boolean
  onSuccess?: () => Promise<void>
}

const CollectWinningsButton: React.FC<CollectWinningsButtonProps> = ({
  payout,
  betAmount,
  epoch,
  hasClaimed,
  onSuccess,
  children,
  ...props
}) => {
  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal payout={payout} betAmount={betAmount} epoch={epoch} onSuccess={onSuccess} />,
    false,
  )

  return (
    <Button onClick={onPresentCollectWinningsModal} disabled={hasClaimed} {...props}>
      {children}
    </Button>
  )
}

export default CollectWinningsButton
