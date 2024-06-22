import BigNumber from 'bignumber.js'
import { explorerApiClient } from 'state/info/api/client'

export const getAprsForStableFarm = async (stableSwapAddress?: string): Promise<BigNumber> => {
  try {
    if (stableSwapAddress) {
      const data = await explorerApiClient
        .GET('/cached/pools/apr/stable/{chainName}/{address}', {
          signal: null,
          params: {
            path: {
              chainName: 'bsc',
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
