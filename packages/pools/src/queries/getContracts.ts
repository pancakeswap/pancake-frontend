import { ChainId } from '@pancakeswap/sdk'
import { getContract } from 'viem'

import { cakeFlexibleSideVaultV2ABI } from '../abis/ICakeFlexibleSideVaultV2'
import { OnChainProvider } from '../types'
import { getCakeFlexibleSideVaultAddress } from './getAddresses'

export function getCakeFlexibleSideVaultV2Contract(chainId: ChainId, provider: OnChainProvider) {
  const abi = cakeFlexibleSideVaultV2ABI
  const address = getCakeFlexibleSideVaultAddress(chainId)
  return {
    ...getContract({
      abi,
      address,
      publicClient: provider({ chainId }),
    }),
    address,
    abi,
  }
}
