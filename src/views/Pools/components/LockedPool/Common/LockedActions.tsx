import { useMemo } from 'react'
import { Flex } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import AddCakeButton from '../Buttons/AddCakeButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import AfterLockedActions from './AfterLockedActions'
import { LockedActionsPropsType } from '../types'

const LockedActions: React.FC<LockedActionsPropsType> = ({
  userShares,
  locked,
  lockEndTime,
  lockStartTime,
  stakingToken,
  stakingTokenBalance,
  lockedAmount,
}) => {
  const position = useMemo(
    () =>
      getVaultPosition({
        userShares,
        locked,
        lockEndTime,
      }),
    [userShares, locked, lockEndTime],
  )
  const { t } = useTranslation()
  const lockedAmountAsNumber = getBalanceNumber(lockedAmount)

  const currentBalance = useMemo(
    () => (stakingTokenBalance ? new BigNumber(stakingTokenBalance) : BIG_ZERO),
    [stakingTokenBalance],
  )

  if (position === VaultPosition.Locked) {
    return (
      <Flex>
        <AddCakeButton
          lockEndTime={lockEndTime}
          lockStartTime={lockStartTime}
          currentLockedAmount={lockedAmount}
          stakingToken={stakingToken}
          currentBalance={currentBalance}
        />
        <ExtendButton
          lockEndTime={lockEndTime}
          lockStartTime={lockStartTime}
          stakingToken={stakingToken}
          currentLockedAmount={lockedAmountAsNumber}
        >
          {t('Extend')}
        </ExtendButton>
      </Flex>
    )
  }

  return (
    <AfterLockedActions
      lockEndTime={lockEndTime}
      lockStartTime={lockStartTime}
      position={position}
      currentLockedAmount={lockedAmountAsNumber}
      stakingToken={stakingToken}
    />
  )
}

export default LockedActions
