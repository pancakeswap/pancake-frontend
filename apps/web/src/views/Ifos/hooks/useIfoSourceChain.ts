import { PROFILE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/ifos'
import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'

// By deafult source chain is the first chain that supports native ifo
export function useIfoSourceChain() {
  return useMemo(() => PROFILE_SUPPORTED_CHAIN_IDS[0] || ChainId.BSC, [])
}
