import { ChainId } from '@pancakeswap/sdk'
import SID, { getSidAddress } from '@siddomains/sidjs'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useCallback } from 'react'
import { useProvider } from 'wagmi'

/**
 * Reverse resolves an address and returns the name
 * If bnb name doesn't exist, returns null.
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
 * Resolves an Space ID name and returns the corresponding address.
 * If bnb name doesn't exist, returns null.
 * @param name requesting Space ID name
 * @param chainId chain ID
 * @param provider provider
 * @returns {string}
 */
async function getAddress(name, chainId, provider) {
  if (![ChainId.BSC, ChainId.BSC_TESTNET].includes(chainId)) {
    return null
  }

  try {
    const sid = new SID({ provider, sidAddress: getSidAddress(`${chainId}`) })
    const address = await sid.name(name).getAddress()
    if (parseInt(address, 16) === 0) {
      return null
    }
    return address
  } catch (error) {
    return null
  }
}

/**
 * Returns promises of SID resolving and reversed resolving.
 * @returns {Promise}
 */
export const useSid = () => {
  const { chainId } = useActiveChainId()
  const provider = useProvider({ chainId })

  const getSidName = useCallback(
    async (address) => {
      return getName(address, chainId, provider)
    },
    [chainId, provider],
  )

  const getSidAddr = useCallback(
    async (name) => {
      return getAddress(name, chainId, provider)
    },
    [chainId, provider],
  )

  return { getSidName, getSidAddr }
}
