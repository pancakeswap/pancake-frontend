import { useState, useEffect } from 'react'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { useExtendEnable } from '../hooks/useExtendEnable'

interface ExtendEnableProps {
  hasEnoughCake: boolean
  handleConfirmClick: () => void
  pendingConfirmTx: boolean
  isValidAmount: boolean
  isValidDuration: boolean
}

const ExtendEnable: React.FC<React.PropsWithChildren<ExtendEnableProps>> = ({
  hasEnoughCake,
  handleConfirmClick,
  pendingConfirmTx,
  isValidAmount,
  isValidDuration,
}) => {
  const { handleEnable, pendingEnableTx } = useExtendEnable()

  const [pendingEnableTxWithBalance, setPendingEnableTxWithBalance] = useState(pendingEnableTx)

  useEffect(() => {
    if (pendingEnableTx) {
      setPendingEnableTxWithBalance(true)
    } else if (hasEnoughCake) {
      setPendingEnableTxWithBalance(false)
    }
  }, [hasEnoughCake, pendingEnableTx])

  return (
    <ApproveConfirmButtons
      isApproveDisabled={!(isValidAmount && isValidDuration) || hasEnoughCake}
      isApproving={pendingEnableTxWithBalance}
      isConfirmDisabled={!(isValidAmount && isValidDuration) || !hasEnoughCake}
      isConfirming={pendingConfirmTx}
      onApprove={handleEnable}
      onConfirm={handleConfirmClick}
      useMinWidth={false}
    />
  )
}

export default ExtendEnable
