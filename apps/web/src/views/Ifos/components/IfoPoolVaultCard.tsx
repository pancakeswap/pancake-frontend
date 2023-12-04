import { useMemo } from 'react'
import { Flex, useMatchBreakpoints } from '@pancakeswap/uikit'
import { isCakeVaultSupported } from '@pancakeswap/pools'
import { Address } from 'viem'
import { ChainId } from '@pancakeswap/chains'

import { useActiveChainId } from 'hooks/useActiveChainId'

import IfoVesting from './IfoVesting/index'
import { VeCakeCard } from './VeCakeCard'

type Props = {
  ifoBasicSaleType?: number
  ifoAddress?: Address
  ifoChainId?: ChainId
}

const IfoPoolVaultCard = ({ ifoBasicSaleType }: Props) => {
  const { chainId } = useActiveChainId()
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(chainId), [chainId])
  const { isXl, isLg, isMd, isXs, isSm } = useMatchBreakpoints()
  const isSmallerThanXl = isXl || isLg || isMd || isXs || isSm

  const vault = isSmallerThanXl ? null : <VeCakeCard />

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {cakeVaultSupported ? vault : null}
      <IfoVesting ifoBasicSaleType={ifoBasicSaleType} />
    </Flex>
  )
}

export default IfoPoolVaultCard
