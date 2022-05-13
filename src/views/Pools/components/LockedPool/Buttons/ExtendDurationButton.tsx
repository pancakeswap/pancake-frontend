import { useMemo } from 'react'
import { Button, useModal, ButtonProps } from '@pancakeswap/uikit'

import ExtendDurationModal from '../Modals/ExtendDurationModal'
import { ExtendDurationButtonPropsType } from '../types'
import { secondsToWeeks } from '../utils/formatSecondsToWeeks'

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
  const currentDurationInWeeks = useMemo(() => secondsToWeeks(currentDuration), [currentDuration])

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
    <Button
      disabled={Number.isFinite(currentDurationInWeeks) && currentDurationInWeeks >= 52}
      onClick={openExtendDurationModal}
      width="100%"
      {...rest}
    >
      {children}
    </Button>
  )
}

export default ExtendDurationButton
