import { useMemo } from 'react'
import { Flex } from '@pancakeswap/uikit'
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

const IfoPoolVaultCard = ({ ifoBasicSaleType, ifoAddress }: Props) => {
  const { chainId } = useActiveChainId()
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(chainId), [chainId])

  const vault = <VeCakeCard ifoAddress={ifoAddress} />

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {cakeVaultSupported ? vault : null}
      <IfoVesting ifoBasicSaleType={ifoBasicSaleType} />
    </Flex>
  )
}

export default IfoPoolVaultCard
