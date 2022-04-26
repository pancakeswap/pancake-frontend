import { useMemo } from 'react'
import { useMatchBreakpoints } from '@pancakeswap/uikit'
import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import { usePoolsWithVault } from 'state/pools/hooks'
import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'

const IfoPoolVaultCard = () => {
  const { isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanTablet = isMd || isXs || isSm
  const { pools } = usePoolsWithVault()
  const cakePool = useMemo(() => pools.find((pool) => pool.userData && pool.sousId === 0), [pools])

  if (isSmallerThanTablet) {
    return <IfoPoolVaultCardMobile pool={cakePool} />
  }

  return <CakeVaultCard pool={cakePool} showStakedOnly={false} />
}

export default IfoPoolVaultCard
