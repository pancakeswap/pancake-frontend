import { ChainId } from '@pancakeswap/chains'
import { isCakeVaultSupported } from '@pancakeswap/pools'
import { Flex } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { Address } from 'viem'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { isCrossChainIfoSupportedOnly } from '@pancakeswap/ifos'
import { useActiveIfoConfig } from 'hooks/useIfoConfig'
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
  const { activeIfo } = useActiveIfoConfig()

  const targetChainId = useMemo(() => activeIfo?.chainId || chainId, [activeIfo, chainId])
  const cakeVaultSupported = useMemo(() => isCakeVaultSupported(targetChainId), [targetChainId])

  const vault = useMemo(
    () =>
      cakeVaultSupported ? (
        <VeCakeCard ifoAddress={ifoAddress} />
      ) : isCrossChainIfoSupportedOnly(targetChainId) ? (
        <CrossChainVeCakeCard ifoAddress={ifoAddress} />
      ) : null,
    [targetChainId, cakeVaultSupported, ifoAddress],
  )

  return (
    <Flex width="100%" maxWidth={400} alignItems="center" flexDirection="column">
      {vault}

      {/* Note: Only show when user is connected to BSC for now. 
      When CrossChain IFO is moved to finished, can enable this again for all chains */}
      {chainId === ChainId.BSC && <IfoVesting ifoBasicSaleType={ifoBasicSaleType} />}
    </Flex>
  )
}

export default IfoPoolVaultCard
