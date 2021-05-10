import React from 'react'
import { Button, ButtonProps, useModal } from '@pancakeswap/uikit'
import CollectRoundWinningsModal from './CollectRoundWinningsModal'

interface CollectWinningsButtonProps extends ButtonProps {
  payout: number
  epoch: number
  hasClaimed: boolean
  onSuccess?: () => Promise<void>
}

const CollectWinningsButton: React.FC<CollectWinningsButtonProps> = ({
  payout,
  epoch,
  hasClaimed,
  onSuccess,
  children,
  ...props
}) => {
  const [onPresentCollectWinningsModal] = useModal(
    <CollectRoundWinningsModal payout={payout} epoch={epoch} onSuccess={onSuccess} />,
    false,
  )

  return (
    <Button onClick={onPresentCollectWinningsModal} disabled={hasClaimed} {...props}>
      {children}
    </Button>
  )
}

export default CollectWinningsButton
