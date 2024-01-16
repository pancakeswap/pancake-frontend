import { useTranslation } from '@pancakeswap/localization'
import { Box, ButtonProps, Flex } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { VaultPosition, getVaultPosition } from 'utils/cakePool'
import AddCakeButton from '../Buttons/AddCakeButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import { LockedActionsPropsType } from '../types'
import AfterLockedActions from './AfterLockedActions'

const LockedActions: React.FC<React.PropsWithChildren<LockedActionsPropsType & ButtonProps>> = ({
  userShares,
  locked,
  lockEndTime,
  lockStartTime,
  stakingToken,
  stakingTokenBalance,
  stakingTokenPrice,
  lockedAmount,
  variant,
}) => {
  const position = useMemo(
    // () => VaultPosition.LockedEnd,
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
        <Box width="100%" mr="4px">
          <AddCakeButton
            variant={variant || 'primary'}
            lockEndTime={lockEndTime ?? ''}
            lockStartTime={lockStartTime}
            currentLockedAmount={lockedAmount ?? new BigNumber(0)}
            stakingToken={stakingToken}
            currentBalance={currentBalance}
            stakingTokenBalance={stakingTokenBalance ?? new BigNumber(0)}
            stakingTokenPrice={stakingTokenPrice}
          />
        </Box>
        <Box width="100%" ml="4px">
          <ExtendButton
            variant={variant || 'primary'}
            lockEndTime={lockEndTime ?? ''}
            lockStartTime={lockStartTime}
            stakingToken={stakingToken}
            stakingTokenPrice={stakingTokenPrice}
            currentBalance={currentBalance}
            currentLockedAmount={lockedAmountAsNumber}
          >
            {t('Extend')}
          </ExtendButton>
        </Box>
      </Flex>
    )
  }

  return (
    <AfterLockedActions
      lockEndTime={lockEndTime ?? ''}
      lockStartTime={lockStartTime}
      position={position}
      currentLockedAmount={lockedAmountAsNumber}
      stakingToken={stakingToken}
      stakingTokenPrice={stakingTokenPrice}
    />
  )
}

export default LockedActions
