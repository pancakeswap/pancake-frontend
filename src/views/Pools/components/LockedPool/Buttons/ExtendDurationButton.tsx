import { useMemo } from 'react'
import { Button, useModal, ButtonProps } from '@pancakeswap/uikit'

import ExtendDurationModal from '../Modals/ExtendDurationModal'
import { ExtendDurationButtonPropsType } from '../types'

const ExtendDurationButton: React.FC<ExtendDurationButtonPropsType & ButtonProps> = ({
  modalTitle,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  children,
  ...rest
}) => {
  const currentDuration = useMemo(() => Number(lockEndTime) - Number(lockStartTime), [lockEndTime, lockStartTime])

  const [openExtendDurationModal] = useModal(
    <ExtendDurationModal
      modalTitle={modalTitle}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      currentLockedAmount={currentLockedAmount}
      currentDuration={currentDuration}
    />,
    true,
    true,
    'ExtendDurationModal',
  )

  return (
    <Button onClick={openExtendDurationModal} width="100%" {...rest}>
      {children}
    </Button>
  )
}

export default ExtendDurationButton
