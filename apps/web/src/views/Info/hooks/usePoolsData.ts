import dayjs from 'dayjs'
import { useMemo } from 'react'
import { checkIsStableSwap } from 'state/info/constant'
import { useAllPoolDataQuery, useStableSwapTopPoolsAPR } from 'state/info/hooks'
import { Address } from 'viem'

export const usePoolsData = () => {
  const isStableSwap = checkIsStableSwap()

  // get all the pool datas that exist
  const allPoolData = useAllPoolDataQuery()

  const poolAddresses = useMemo(() => {
    return Object.values(allPoolData)
      .map(({ data }) => data?.lpAddress)
      .filter((address): address is Address => !!address)
  }, [allPoolData])

  const stableSwapsAprs = useStableSwapTopPoolsAPR(poolAddresses)
  // get all the pool datas that exist
  const poolsData = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => {
        return {
          ...pool.data,
          ...(isStableSwap &&
            stableSwapsAprs &&
            pool.data.lpAddress && { lpApr7d: stableSwapsAprs[pool.data.lpAddress] }),
        }
      })
      .filter((pool) => pool.token1.name !== 'unknown' && pool.token0.name !== 'unknown')
  }, [allPoolData, isStableSwap, stableSwapsAprs])
  return { poolsData, stableSwapsAprs }
}

export const useNonSpamPoolsData = () => {
  const { poolsData: rawPoolsData, ...others } = usePoolsData()
  // top 10 pair need create at least 4 days
  const poolsData = useMemo(
    () =>
      rawPoolsData.reduce((acc, data) => {
        if (acc.length > 10) {
          acc.push(data)
          return acc
        }

        const maySpam = dayjs().diff(dayjs.unix(data.timestamp), 'day') < 4

        // top 10 should not show may spam tokens,
        if (maySpam) return acc

        // after top 10 will not filtered
        acc.push(data)
        return acc
      }, [] as typeof rawPoolsData),
    [rawPoolsData],
  )

  return {
    poolsData,
    ...others,
  }
}
