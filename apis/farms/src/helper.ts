import { Obj } from 'itty-router'
import { error } from 'itty-router-extras'
import { createFarmFetcher } from '@pancakeswap/farms'
import { createMulticall } from '@pancakeswap/multicall'
import { bscProvider, bscTestnetProvider, goerliProvider, ethProvider } from './provider'

export const getProvider = ({ chainId }: { chainId?: number }) => {
  switch (chainId) {
    case 56:
      return bscProvider
    case 97:
      return bscTestnetProvider
    case 5:
      return goerliProvider
    case 1:
      return ethProvider
    default:
      return null
  }
}

export const { multicallv2, multicallv3 } = createMulticall(getProvider)

export const farmFetcher = createFarmFetcher(multicallv2)

export function requireChainId(params: Obj | undefined) {
  if (!params) {
    return error(400, 'Invalid params')
  }
  const { chainId } = params
  if (!chainId || !farmFetcher.isChainSupported(+chainId)) {
    return error(400, 'Invalid chain id')
  }
  return null
}
