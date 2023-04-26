import { ChainId } from '@pancakeswap/sdk'
import { Contract } from '@ethersproject/contracts'

import cakeFlexibleSideVaultV2Abi from '../abis/ICakeFlexibleSideVaultV2.json'
import { OnChainProvider } from '../types'
import { getCakeFlexibleSideVaultAddress } from './getAddresses'

export function getCakeFlexibleSideVaultV2Contract(chainId: ChainId, provider: OnChainProvider) {
  return new Contract(getCakeFlexibleSideVaultAddress(chainId), cakeFlexibleSideVaultV2Abi, provider({ chainId }))
}
