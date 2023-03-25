import useSWRImmutable from 'swr/immutable'
import multicall from 'utils/multicall'
import bCakeFarmBoosterAbi from 'config/abi/bCakeFarmBooster.json'
import { getBCakeFarmBoosterAddress } from 'utils/addressHelpers'
import { useMemo } from 'react'
import { FetchStatus } from 'config/constants/types'
import BigNumber from 'bignumber.js'

const useFarmBoosterConstants = () => {
  const bCakeFarmBoosterAddress = getBCakeFarmBoosterAddress()

  const { data, status } = useSWRImmutable('farmBoosterConstants', async () => {
    const calls = ['cA', 'CA_PRECISION', 'cB'].map((method) => {
      return { address: bCakeFarmBoosterAddress, name: method }
    })

    return multicall(bCakeFarmBoosterAbi, calls)
  })
  return useMemo(() => {
    return {
      constants: data && {
        cA: new BigNumber(data[0]).div(new BigNumber(data[1])).toNumber(),
        cB: new BigNumber(data[2]).toNumber(),
      },
      isLoading: status !== FetchStatus.Fetched,
    }
  }, [data, status])
}

export default useFarmBoosterConstants
