import useSWRImmutable from 'swr/immutable'
import { getBCakeFarmBoosterAddress } from 'utils/addressHelpers'
import { useMemo } from 'react'
import { FetchStatus } from 'config/constants/types'
import BigNumber from 'bignumber.js'
import { publicClient } from 'utils/wagmi'
import { ChainId } from '@pancakeswap/sdk'
import { bCakeFarmBoosterABI } from 'config/abi/bCakeFarmBooster'

const useFarmBoosterConstants = () => {
  const bCakeFarmBoosterAddress = getBCakeFarmBoosterAddress()

  const { data, status } = useSWRImmutable('farmBoosterConstants', async () => {
    return publicClient({ chainId: ChainId.BSC }).multicall({
      contracts: [
        {
          address: bCakeFarmBoosterAddress,
          abi: bCakeFarmBoosterABI,
          functionName: 'cA',
        },
        {
          address: bCakeFarmBoosterAddress,
          abi: bCakeFarmBoosterABI,
          functionName: 'CA_PRECISION',
        },
        {
          address: bCakeFarmBoosterAddress,
          abi: bCakeFarmBoosterABI,
          functionName: 'cB',
        },
      ],
      allowFailure: false,
    })
  })
  return useMemo(() => {
    return {
      constants: data && {
        cA: new BigNumber(data[0].toString()).div(new BigNumber(data[1].toString())).toNumber(),
        cB: new BigNumber(data[2].toString()).toNumber(),
      },
      isLoading: status !== FetchStatus.Fetched,
    }
  }, [data, status])
}

export default useFarmBoosterConstants
