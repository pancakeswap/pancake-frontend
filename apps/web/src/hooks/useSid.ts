import { ChainId } from '@pancakeswap/sdk'
import SID, { getSidAddress } from '@siddomains/sidjs'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback } from 'react'
import { useAccount, useProvider } from 'wagmi'

/**
 * Reverse resolves an address and returns the name
 * If bnb name doesn't exist, returns address instead
 * @param address active user address
 * @param chainId chain ID
 * @param provider provider
 * @returns reverse resolved name
 */
async function getName(address, chainId, provider) {
  if (![ChainId.BSC, ChainId.BSC_TESTNET].includes(chainId)) {
    return address
  }

  try {
    const sid = new SID({ provider, sidAddress: getSidAddress(`${chainId}`) })
    const name = await sid.getName(address)
    return name?.name ?? address
  } catch (error) {
    return address
  }
}

/**
 * Returns a promise of get name
 * @returns
 */
export const useSid = () => {
  const { chainId } = useActiveChainId()
  const provider = useProvider({ chainId })
  const { address } = useAccount()

  return useCallback(async () => {
    return getName(address, chainId, provider)
  }, [address, chainId, provider])
}
