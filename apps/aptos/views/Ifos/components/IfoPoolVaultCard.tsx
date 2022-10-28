// import { useMemo } from 'react'
import { APTOS_COIN } from '@pancakeswap/awgmi'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { PoolCategory } from 'config/constants/types'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { DeserializedPool } from 'state/types'
// import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
// import { usePoolsWithVault } from 'state/pools/hooks'
// import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'
import IfoVesting from './IfoVesting'

const IfoPoolVaultCard = () => {
  const { isXl, isLg, isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanXl = isXl || isLg || isMd || isXs || isSm
  // const { pools } = usePoolsWithVault()
  // const cakePool = useMemo(() => pools.find((pool) => pool.userData && pool.sousId === 0), [pools])
  const native = useNativeCurrency()
  const cakePool: DeserializedPool = {
    earningToken: native,
    stakingToken: native,
    sousId: 0,
    contractAddress: 'TODO: Aptos',
    poolCategory: PoolCategory.CORE,
    tokenPerBlock: '0',
  }

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {/* {isSmallerThanXl ? (
        <IfoPoolVaultCardMobile pool={cakePool} />
      ) : (
        <CakeVaultCard pool={cakePool} showStakedOnly={false} showICake />
      )} */}
      <IfoVesting pool={cakePool} />
    </Flex>
  )
}

export default IfoPoolVaultCard
