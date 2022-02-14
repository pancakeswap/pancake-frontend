import { useWeb3React } from '@web3-react/core'
import tokens from 'config/constants/tokens'
import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { Zero } from '@ethersproject/constants'
import useSWR from 'swr'
import { simpleRpcProvider } from 'utils/providers'
import { useCake, useTokenContract } from './useContract'
import { useSWRContract } from './useSWRContract'

const useTokenBalance = (tokenAddress: string) => {
  const { account } = useWeb3React()

  const contract = useTokenContract(tokenAddress, false)
  const { data, status, ...rest } = useSWRContract(
    account
      ? {
          contract,
          methodName: 'balanceOf',
          params: [account],
        }
      : null,
    {
      refreshInterval: FAST_INTERVAL,
    },
  )

  return {
    ...rest,
    fetchStatus: status,
    balance: data || Zero,
  }
}

export const useTotalSupply = () => {
  const cakeContract = useCake(false)
  const { data } = useSWRContract([cakeContract, 'totalSupply'], {
    refreshInterval: SLOW_INTERVAL,
  })

  return data
}

export const useBurnedBalance = (tokenAddress: string) => {
  const contract = useTokenContract(tokenAddress, false)
  const { data } = useSWRContract([contract, 'balanceOf', ['0x000000000000000000000000000000000000dEaD']], {
    refreshInterval: SLOW_INTERVAL,
  })

  return data || Zero
}

export const useGetBnbBalance = () => {
  const { account } = useWeb3React()
  const { status, data, mutate } = useSWR([account, 'bnbBalance'], async () => {
    return simpleRpcProvider.getBalance(account)
  })

  return { balance: data || Zero, fetchStatus: status, refresh: mutate }
}

export const useGetCakeBalance = () => {
  const { balance, fetchStatus } = useTokenBalance(tokens.cake.address)

  return { balance, fetchStatus }
}

export default useTokenBalance
