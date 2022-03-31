import { useMemo } from 'react'
import { Button, useModal } from '@pancakeswap/uikit'

import ExtendDurationModal from '../Modals/ExtendDurationModal'

// TODO: Add type

export const ExtendDurationButton = ({ stakingToken, currentLockedAmount, lockEndTime, lockStartTime, children }) => {
  const currentDuration = useMemo(() => Number(lockEndTime) - Number(lockStartTime), [lockEndTime, lockStartTime])

  const [openExtendDurationModal] = useModal(
    <ExtendDurationModal
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      currentLockedAmount={currentLockedAmount}
      currentDuration={currentDuration}
    />,
  )

  return (
    <Button mx="4px" onClick={openExtendDurationModal} width="100%">
      {children}
    </Button>
  )
}

export default ExtendDurationButton
