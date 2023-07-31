import { useMemo } from 'react'
import { Flex, Box, ButtonProps } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import AddCakeButton from '../Buttons/AddCakeButton'
import ExtendButton from '../Buttons/ExtendDurationButton'
import AfterLockedActions from './AfterLockedActions'
import { LockedActionsPropsType } from '../types'

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
            lockEndTime={lockEndTime}
            lockStartTime={lockStartTime}
            currentLockedAmount={lockedAmount}
            stakingToken={stakingToken}
            currentBalance={currentBalance}
            stakingTokenBalance={stakingTokenBalance}
            stakingTokenPrice={stakingTokenPrice}
          />
        </Box>
        <Box width="100%" ml="4px">
          <ExtendButton
            variant={variant || 'primary'}
            lockEndTime={lockEndTime}
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
      lockEndTime={lockEndTime}
      lockStartTime={lockStartTime}
      position={position}
      currentLockedAmount={lockedAmountAsNumber}
      stakingToken={stakingToken}
      stakingTokenPrice={stakingTokenPrice}
    />
  )
}

export default LockedActions
