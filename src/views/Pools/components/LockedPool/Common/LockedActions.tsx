import { useMemo } from 'react'
import { Flex } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'
import { convertSharesToCake } from 'views/Pools/helpers'
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
  pricePerFullShare,
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
  const { cakeAsBigNumber, cakeAsNumberBalance } = convertSharesToCake(userShares, pricePerFullShare)

  const currentBalance = useMemo(
    () => (stakingTokenBalance ? new BigNumber(stakingTokenBalance) : BIG_ZERO),
    [stakingTokenBalance],
  )

  if (position !== VaultPosition.Locked) {
    return (
      <Flex>
        <AddCakeButton
          lockEndTime={lockEndTime}
          lockStartTime={lockStartTime}
          currentLockedAmount={cakeAsBigNumber}
          stakingToken={stakingToken}
          currentBalance={currentBalance}
        />
        <ExtendButton
          lockEndTime={lockEndTime}
          lockStartTime={lockStartTime}
          stakingToken={stakingToken}
          currentLockedAmount={cakeAsNumberBalance}
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
      currentLockedAmount={cakeAsNumberBalance}
      stakingToken={stakingToken}
    />
  )
}

export default LockedActions
