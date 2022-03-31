import { useMemo } from 'react'
import { Flex } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getVaultPosition, VaultPosition } from 'utils/cakePool'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useTranslation } from 'contexts/Localization'
import AddCakeButton from '../Buttons/AddCakeButton'
import ExtendButton from '../Buttons/ExtendButton'
import AfterLockedActions from './AfterLockedActions'

// TODO: add Type

const LockedActions = ({ userData, stakingToken, stakingTokenBalance }) => {
  const position = useMemo(() => getVaultPosition(userData), [userData])
  const cakeBalance = getBalanceNumber(userData?.lockedAmount)
  const { t } = useTranslation()

  const currentBalance = useMemo(
    () => (stakingTokenBalance ? new BigNumber(stakingTokenBalance) : BIG_ZERO),
    [stakingTokenBalance],
  )

  if (position === VaultPosition.Locked) {
    return (
      <Flex>
        <AddCakeButton
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          currentLockedAmount={cakeBalance}
          stakingToken={stakingToken}
          currentBalance={currentBalance}
        />
        <ExtendButton
          lockEndTime={userData?.lockEndTime}
          lockStartTime={userData?.lockStartTime}
          stakingToken={stakingToken}
          currentLockedAmount={cakeBalance}
        >
          {t('Extend')}
        </ExtendButton>
      </Flex>
    )
  }

  return (
    <AfterLockedActions
      lockEndTime={userData?.lockEndTime}
      lockStartTime={userData?.lockStartTime}
      position={position}
      currentLockedAmount={cakeBalance}
      stakingToken={stakingToken}
    />
  )
}

export default LockedActions
