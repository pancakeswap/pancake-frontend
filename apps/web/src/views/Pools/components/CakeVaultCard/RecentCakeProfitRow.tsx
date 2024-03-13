import { Flex, Text } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { Pool } from '@pancakeswap/widgets-internal'

import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { useCakePrice } from 'hooks/useCakePrice'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedLockedVaultUser, VaultKey } from 'state/types'
import { getCakeVaultEarnings } from 'views/Pools/helpers'
import { useAccount } from 'wagmi'
import RecentCakeProfitBalance from './RecentCakeProfitBalance'

const RecentCakeProfitCountdownRow = ({ pool }: { pool: Pool.DeserializedPool<Token> }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pricePerFullShare, userData } = useVaultPoolByKey(pool.vaultKey)
  const cakePriceBusd = useCakePrice()
  const { hasAutoEarnings, autoCakeToDisplay } = getCakeVaultEarnings(
    account,
    userData?.cakeAtLastUserAction || BIG_ZERO,
    userData?.userShares || BIG_ZERO,
    pricePerFullShare || BIG_ZERO,
    cakePriceBusd.toNumber(),
    pool.vaultKey === VaultKey.CakeVault
      ? (userData as DeserializedLockedVaultUser).currentPerformanceFee.plus(
          (userData as DeserializedLockedVaultUser).currentOverdueFee,
        )
      : undefined,
  )

  if (!(userData?.userShares.gt(0) && account)) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent CAKE profit')}:`}</Text>
      {hasAutoEarnings && <RecentCakeProfitBalance cakeToDisplay={autoCakeToDisplay} pool={pool} account={account} />}
    </Flex>
  )
}

export default RecentCakeProfitCountdownRow
