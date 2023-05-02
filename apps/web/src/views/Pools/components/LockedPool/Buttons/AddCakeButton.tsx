import { useCallback, memo } from 'react'
import { Button, useModal, Skeleton, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePool } from 'state/pools/hooks'
import AddAmountModal from '../Modals/AddAmountModal'
import { AddButtonProps } from '../types'
import NotEnoughTokensModal from '../../Modals/NotEnoughTokensModal'

interface AddButtonPropsType extends AddButtonProps, ButtonProps {}

const AddCakeButton: React.FC<React.PropsWithChildren<AddButtonPropsType>> = ({
  currentBalance,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  stakingTokenBalance,
  customLockAmount,
  ...props
}) => {
  const {
    pool: { userDataLoaded },
  } = usePool(0)

  const { t } = useTranslation()

  const [openAddAmountModal] = useModal(
    <AddAmountModal
      currentLockedAmount={currentLockedAmount}
      currentBalance={currentBalance}
      stakingToken={stakingToken}
      lockStartTime={lockStartTime}
      lockEndTime={lockEndTime}
      stakingTokenBalance={stakingTokenBalance}
      customLockAmount={customLockAmount}
    />,
    true,
    true,
    'AddAmountModal',
  )

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)

  const handleClicked = useCallback(() => {
    return currentBalance.gt(0) ? openAddAmountModal() : onPresentTokenRequired()
  }, [currentBalance, openAddAmountModal, onPresentTokenRequired])

  return userDataLoaded ? (
    <Button
      onClick={handleClicked}
      width="100%"
      style={{ whiteSpace: 'nowrap', paddingLeft: 0, paddingRight: 0 }}
      {...props}
    >
      {t('Add CAKE')}
    </Button>
  ) : (
    <Skeleton height={48} />
  )
}

export default memo(AddCakeButton)
