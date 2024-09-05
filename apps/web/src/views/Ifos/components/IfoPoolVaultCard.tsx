import { ChainId } from '@pancakeswap/chains'
import { isCakeVaultSupported } from '@pancakeswap/pools'
import { Flex } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { Address } from 'viem'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { isCrossChainIfoSupportedOnly } from '@pancakeswap/ifos'
import { CrossChainVeCakeCard } from './CrossChainVeCakeCard'
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

  const vault = useMemo(
    () =>
      cakeVaultSupported ? (
        <VeCakeCard ifoAddress={ifoAddress} />
      ) : isCrossChainIfoSupportedOnly(chainId) ? (
        <CrossChainVeCakeCard ifoAddress={ifoAddress} />
      ) : null,
    [chainId, cakeVaultSupported, ifoAddress],
  )

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {vault}
      <IfoVesting ifoBasicSaleType={ifoBasicSaleType} />
    </Flex>
  )
}

export default IfoPoolVaultCard
