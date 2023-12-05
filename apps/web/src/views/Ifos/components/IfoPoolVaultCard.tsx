import { useMemo } from 'react'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { Pool } from '@pancakeswap/widgets-internal'
import { Token } from '@pancakeswap/sdk'
import { isCakeVaultSupported } from '@pancakeswap/pools'

import CakeVaultCard from 'views/Pools/components/CakeVaultCard'
import { usePoolsWithVault } from 'state/pools/hooks'
import { useActiveChainId } from 'hooks/useActiveChainId'

import IfoPoolVaultCardMobile from './IfoPoolVaultCardMobile'
import IfoVesting from './IfoVesting/index'

type Props = {
  ifoBasicSaleType?: number
}

const IfoPoolVaultCard = ({ ifoBasicSaleType }: Props) => {
  const { chainId } = useActiveChainId()
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(chainId), [chainId])
  const { isXl, isLg, isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanXl = isXl || isLg || isMd || isXs || isSm
  const { pools } = usePoolsWithVault()
  const cakePool = useMemo(
    () => pools.find((pool) => pool.userData && pool.sousId === 0),
    [pools],
  ) as Pool.DeserializedPool<Token>

  const vault = isSmallerThanXl ? (
    <IfoPoolVaultCardMobile pool={cakePool} />
  ) : (
    <CakeVaultCard pool={cakePool} showSkeleton={false} showStakedOnly={false} showICake />
  )

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {cakeVaultSupported ? vault : null}
      <IfoVesting pool={cakePool} ifoBasicSaleType={ifoBasicSaleType} />
    </Flex>
  )
}

export default IfoPoolVaultCard
