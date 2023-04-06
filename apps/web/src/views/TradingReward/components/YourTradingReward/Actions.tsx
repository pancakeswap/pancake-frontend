import { Box, Button, useModal, Flex } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'
import { VaultKey } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useVaultApprove, useCheckVaultApprovalStatus } from 'views/Pools/hooks/useApprove'
import AddCakeButton from 'views/Pools/components/LockedPool/Buttons/AddCakeButton'
import ExtendButton from 'views/Pools/components/LockedPool/Buttons/ExtendDurationButton'
import LockedStakedModal from 'views/Pools/components/LockedPool/Modals/LockedStakeModal'
import { useMemo } from 'react'

interface ActionsProps {
  lockEndTime: string
  lockStartTime: string
  lockedAmount: BigNumber
  stakingToken: Token
  currentBalance: BigNumber
  isOnlyNeedAddCake: boolean
  isOnlyNeedExtendLock: boolean
  needAddedWeek: number
  needAddedCakeAmount: string
}

const Actions: React.FC<React.PropsWithChildren<ActionsProps>> = ({
  lockEndTime,
  lockStartTime,
  lockedAmount,
  stakingToken,
  currentBalance,
  isOnlyNeedAddCake,
  isOnlyNeedExtendLock,
  needAddedWeek,
  needAddedCakeAmount,
}) => {
  const { t } = useTranslation()
  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus(VaultKey.CakeVault)
  const vaultData = useVaultPoolByKey(VaultKey.CakeVault)
  const {
    userData: { userShares, balance },
  } = vaultData

  const customLockWeekInSeconds = useMemo(
    () => new BigNumber(needAddedWeek).times(60).times(60).times(24).times(7).toNumber(),
    [needAddedWeek],
  )

  const lockedAmountAsNumber = getBalanceNumber(lockedAmount)

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakedModal
      currentBalance={currentBalance}
      stakingToken={stakingToken}
      stakingTokenBalance={currentBalance}
      customLockAmount={needAddedCakeAmount}
      customLockWeekInSeconds={customLockWeekInSeconds}
    />,
  )

  const { handleApprove, pendingTx } = useVaultApprove(VaultKey.CakeVault, setLastUpdated)

  return (
    <Flex width="250px" flexDirection={['column', 'column', 'column', 'row']} mt="32px">
      {!isOnlyNeedExtendLock ? (
        <Box width="100%">
          {!isVaultApproved && !balance.cakeAsBigNumber.gt(0) && !userShares.gt(0) ? (
            <Button width="100%" variant="secondary" disabled={pendingTx} onClick={handleApprove}>
              {t('Enable')}
            </Button>
          ) : (
            <Box width="100%">
              {isOnlyNeedAddCake ? (
                <AddCakeButton
                  lockEndTime={lockEndTime}
                  lockStartTime={lockStartTime}
                  currentLockedAmount={lockedAmount}
                  stakingToken={stakingToken}
                  currentBalance={currentBalance}
                  stakingTokenBalance={currentBalance}
                  customLockAmount={needAddedCakeAmount}
                />
              ) : (
                <Button width="100%" onClick={openPresentLockedStakeModal}>
                  {t('Lock CAKE')}
                </Button>
              )}
            </Box>
          )}
        </Box>
      ) : (
        <ExtendButton
          lockEndTime={lockEndTime}
          lockStartTime={lockStartTime}
          stakingToken={stakingToken}
          currentBalance={currentBalance}
          currentLockedAmount={lockedAmountAsNumber}
          customLockWeekInSeconds={customLockWeekInSeconds}
        >
          {t('Extend Lock')}
        </ExtendButton>
      )}
    </Flex>
  )
}

export default Actions
