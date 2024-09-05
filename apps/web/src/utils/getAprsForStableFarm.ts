import { STABLE_SUPPORTED_CHAIN_IDS } from '@pancakeswap/stable-swap-sdk'
import BigNumber from 'bignumber.js'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { operations } from 'state/info/api/schema'

export const getAprsForStableFarm = async (stableSwapAddress?: string, chainId?: number): Promise<BigNumber> => {
  try {
    if (stableSwapAddress && chainId && STABLE_SUPPORTED_CHAIN_IDS.includes(chainId)) {
      const data = await explorerApiClient
        .GET('/cached/pools/apr/stable/{chainName}/{address}', {
          signal: null,
          params: {
            path: {
              chainName: chainIdToExplorerInfoChainName[
                chainId
              ] as operations['getCachedPoolsAprStableByChainNameByAddress']['parameters']['path']['chainName'],
              address: stableSwapAddress,
            },
          },
        })
        .then((res) => res.data)

      if (!data) {
        return new BigNumber(0)
      }

      return new BigNumber(data.apr7d).multipliedBy(100)
    }
    return new BigNumber(0)
  } catch (error) {
    console.error(error, '[LP APR Update] getAprsForStableFarm error')
  }

  return new BigNumber('0')
}
