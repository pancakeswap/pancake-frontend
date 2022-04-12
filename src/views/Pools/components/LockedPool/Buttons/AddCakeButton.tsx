import { useMemo, memo } from 'react'
import { Button, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { differenceInSeconds } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import AddAmountModal from '../Modals/AddAmountModal'
import { AddButtonProps } from '../types'

const AddCakeButton: React.FC<AddButtonProps> = ({
  currentBalance,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
}) => {
  const { t } = useTranslation()
  const remainingDuration = useMemo(
    () => differenceInSeconds(new Date(convertTimeToSeconds(lockEndTime)), new Date()),
    [lockEndTime],
  )
  const passedDuration = useMemo(
    () => differenceInSeconds(new Date(), new Date(convertTimeToSeconds(lockStartTime))),
    [lockStartTime],
  )

  const [openAddAmountModal] = useModal(
    <AddAmountModal
      passedDuration={passedDuration}
      currentLockedAmount={currentLockedAmount}
      remainingDuration={remainingDuration}
      currentBalance={currentBalance}
      stakingToken={stakingToken}
      lockEndTime={lockEndTime}
    />,
    true,
    true,
    'AddAmountModal',
  )

  return (
    <Button disabled={!currentBalance.gt(0)} onClick={openAddAmountModal} width="100%">
      {t('Add CAKE')}
    </Button>
  )
}

export default memo(AddCakeButton)
