import useSWRImmutable from 'swr/immutable'
import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import { FetchStatus } from 'config/constants/types'
import { Address } from 'wagmi'
import { bCakeSupportedChainId } from '@pancakeswap/farms'

export const useBCakeProxyContractAddress = (account?: Address, chainId?: number) => {
  const bCakeFarmBoosterContract = useBCakeFarmBoosterContract()
  const isSupportedChain = chainId ? bCakeSupportedChainId.includes(chainId) : false
  const { data, status, mutate } = useSWRImmutable(
    account && isSupportedChain && ['bProxyAddress', account, chainId],
    async () => bCakeFarmBoosterContract.read.proxyContract([account]),
  )
  const isLoading = isSupportedChain ? status !== FetchStatus.Fetched : false

  return {
    proxyAddress: data as Address,
    isLoading,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: mutate,
  }
}
