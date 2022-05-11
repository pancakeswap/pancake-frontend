import React from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { Button, useModal } from '@pancakeswap/uikit'
import LockedStakeModal from 'views/Pools/components/LockedPool/Modals/LockedStakeModal'
import VaultApprovalAction from 'views/Pools/components/CakeVaultCard/VaultCardActions/VaultApprovalAction'
import { useCheckVaultApprovalStatus } from 'views/Pools/hooks/useApprove'

interface NotTokensProps {
  pool: DeserializedPool
}

const LockCakeButton: React.FC<NotTokensProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { stakingToken, userData } = pool
  const { isVaultApproved, setLastUpdated } = useCheckVaultApprovalStatus()

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const [openPresentLockedStakeModal] = useModal(
    <LockedStakeModal
      currentBalance={stakingTokenBalance}
      stakingToken={stakingToken}
      stakingTokenBalance={stakingTokenBalance}
    />,
  )

  return (
    <>
      {isVaultApproved ? (
        <Button onClick={openPresentLockedStakeModal}>{t('Lock CAKE')}</Button>
      ) : (
        <VaultApprovalAction isLoading={false} setLastUpdated={setLastUpdated} />
      )}
    </>
  )
}

export default LockCakeButton
