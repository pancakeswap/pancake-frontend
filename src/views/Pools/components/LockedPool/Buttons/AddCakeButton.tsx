import { useCallback, memo } from 'react'
import { Button, useModal, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePool } from 'state/pools/hooks'
import AddAmountModal from '../Modals/AddAmountModal'
import { AddButtonProps } from '../types'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'

const AddCakeButton: React.FC<AddButtonProps> = ({
  currentBalance,
  stakingToken,
  currentLockedAmount,
  lockEndTime,
  lockStartTime,
  stakingTokenBalance,
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
    <Button onClick={handleClicked} width="100%">
      {t('Add CAKE')}
    </Button>
  ) : (
    <Skeleton height={48} />
  )
}

export default memo(AddCakeButton)
