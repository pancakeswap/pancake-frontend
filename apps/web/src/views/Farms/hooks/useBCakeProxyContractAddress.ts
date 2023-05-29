import useSWRImmutable from 'swr/immutable'
import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import { FetchStatus } from 'config/constants/types'
import { bCakeSupportedChainId } from '@pancakeswap/farms/src/index'
import { Address } from 'wagmi'

export const useBCakeProxyContractAddress = (account?: Address, chainId?: number) => {
  const bCakeFarmBoosterContract = useBCakeFarmBoosterContract()
  const isSupportedChain = bCakeSupportedChainId.includes(chainId)
  const { data, status, mutate } = useSWRImmutable(
    account && isSupportedChain && ['bProxyAddress', account, chainId],
    async () => bCakeFarmBoosterContract.read.proxyContract([account]),
  )
  const isLoading = isSupportedChain ? status !== FetchStatus.Fetched : false

  return {
    proxyAddress: data,
    isLoading,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: mutate,
  }
}
