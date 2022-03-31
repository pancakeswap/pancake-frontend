import { useMemo, memo } from 'react'
import { Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { differenceInSeconds } from 'date-fns'
import AddAmountModal from '../Modals/AddAmountModal'
import convertLockTimeToSeconds from '../utils/convertLockTimeToSeconds'

// TODO: Add type

export const AddButton = ({ currentBalance, stakingToken, currentLockedAmount, lockEndTime, lockStartTime }) => {
  const { t } = useTranslation()
  const remainingDuration = useMemo(
    () => differenceInSeconds(new Date(convertLockTimeToSeconds(lockEndTime)), new Date()),
    [lockEndTime],
  )
  const passedDuration = useMemo(
    () => differenceInSeconds(new Date(), new Date(convertLockTimeToSeconds(lockStartTime))),
    [lockStartTime],
  )

  const [openAddAmountModal] = useModal(
    <AddAmountModal
      passedDuration={passedDuration}
      currentLockedAmount={currentLockedAmount}
      remainingDuration={remainingDuration}
      currentBalance={currentBalance}
      stakingToken={stakingToken}
    />,
  )

  return (
    <Button onClick={openAddAmountModal} width="100%">
      {t('Add Cake')}
    </Button>
  )
}

export default memo(AddButton)
