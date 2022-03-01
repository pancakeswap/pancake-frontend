import BigNumber from 'bignumber.js'
import { Button, useModal } from '@pancakeswap/uikit'

import { useTranslation } from 'contexts/Localization'
import VaultStakeModal from 'views/Pools/components/CakeVaultCard/VaultStakeModal'
import { useIfoPoolVault, useIfoWithApr } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'

const StakeVaultButton = (props) => {
  const ifoPoolVault = useIfoPoolVault()
  const { pool } = useIfoWithApr()
  const { t } = useTranslation()

  const stakingTokenBalance = pool?.userData?.stakingTokenBalance
    ? new BigNumber(pool.userData.stakingTokenBalance)
    : BIG_ZERO

  const [onPresentStake] = useModal(
    <VaultStakeModal
      stakingMax={stakingTokenBalance}
      performanceFee={ifoPoolVault.fees.performanceFeeAsDecimal}
      pool={pool}
    />,
  )

  return (
    <Button {...props} onClick={onPresentStake}>
      {t('Stake CAKE in IFO pool')}
    </Button>
  )
}

export default StakeVaultButton
