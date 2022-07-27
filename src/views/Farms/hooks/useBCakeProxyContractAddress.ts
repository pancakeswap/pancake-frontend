import useSWR from 'swr'
import { NO_PROXY_CONTRACT } from 'config/constants'
import { useBCakeFarmBoosterContract } from 'hooks/useContract'
import { FetchStatus } from 'config/constants/types'

export const useBCakeProxyContractAddress = (account?: string) => {
  const bCakeFarmBoosterContract = useBCakeFarmBoosterContract()
  const { data, status, mutate } = useSWR(account && ['proxyAddress', account], async () =>
    bCakeFarmBoosterContract.proxyContract(account),
  )

  return {
    proxyAddress: data,
    isLoading: status !== FetchStatus.Fetched,
    proxyCreated: data && data !== NO_PROXY_CONTRACT,
    refreshProxyAddress: mutate,
  }
}
