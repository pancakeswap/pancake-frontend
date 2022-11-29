import { ChainId } from '@pancakeswap/sdk'
import { getChainlinkOracleContract } from 'utils/contractHelpers'
import { useSWRContract } from 'hooks/useSWRContract'
import { Zero } from '@ethersproject/constants'

const getOracleAddress = (chainId: number) => {
  switch (chainId) {
    default:
      return ''
  }
}

export const useOraclePrice = (chainId: number) => {
  const tokenAddress = getOracleAddress(chainId)
  const chainlinkOracleContract = getChainlinkOracleContract(tokenAddress, null, chainId)
  // Can refactor to subscription later
  const { data: price } = useSWRContract([chainlinkOracleContract, 'latestAnswer'], {
    refreshWhenHidden: true,
    refreshWhenOffline: true,
    fallbackData: Zero,
  })

  return price.toString()
}
