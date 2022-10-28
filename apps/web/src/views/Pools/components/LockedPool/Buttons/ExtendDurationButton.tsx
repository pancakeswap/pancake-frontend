import { useMemo } from 'react'
import { Button, useModal, ButtonProps } from '@pancakeswap/uikit'
import { ONE_WEEK_DEFAULT, MAX_LOCK_DURATION } from 'config/constants/pools'

import ExtendDurationModal from '../Modals/ExtendDurationModal'
import { ExtendDurationButtonPropsType } from '../types'

const ExtendDurationButton: React.FC<React.PropsWithChildren<ExtendDurationButtonPropsType & ButtonProps>> = ({
  modalTitle,
  stakingToken,
  currentLockedAmount,
  currentBalance,
  lockEndTime,
  lockStartTime,
  children,
  ...rest
}) => {
  const nowInSeconds = Math.floor(Date.now() / 1000)
  const currentDuration = useMemo(() => Number(lockEndTime) - Number(lockStartTime), [lockEndTime, lockStartTime])
  const currentDurationLeft = useMemo(
    () => Math.max(Number(lockEndTime) - nowInSeconds, 0),
    [lockEndTime, nowInSeconds],
  )

  const [openExtendDurationModal] = useModal(
    <ExtendDurationModal
      modalTitle={modalTitle}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      currentBalance={currentBalance}
      currentLockedAmount={currentLockedAmount}
      currentDuration={currentDuration}
      currentDurationLeft={currentDurationLeft}
    />,
    true,
    true,
    'ExtendDurationModal',
  )

  return (
    <Button
      disabled={Number.isFinite(currentDurationLeft) && MAX_LOCK_DURATION - currentDurationLeft < ONE_WEEK_DEFAULT}
      onClick={openExtendDurationModal}
      width="100%"
      {...rest}
    >
      {children}
    </Button>
  )
}

export default ExtendDurationButton
