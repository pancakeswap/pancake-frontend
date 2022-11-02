import { useMemo, useEffect, useState } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useAccountResources, useAccountResource, useProvider } from '@pancakeswap/awgmi'
import { coinStoreResourcesFilter, unwrapTypeFromString } from '@pancakeswap/awgmi/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { DeserializedFarm, SerializedFarm } from '@pancakeswap/farms'
import { deserializeFarm } from 'state/farms/utils/deserializeFarm'
import { farmsPublicDataSelector, mapFarmList, transformFarm } from 'state/farms/utils/index'
import { SLOW_INTERVAL } from 'config/constants'
import { MapFarmResource, FarmResource, FarmResourcePoolInfo } from 'state/farms/types'
import { FARMS_ADDRESS, FARMS_NAME_TAG } from 'state/farms/constants'
import { fetchFarmUserInfo } from 'state/farms/fetchFarmUserInfo'
import { fetchLpInfo } from 'state/farms/fetchLpInfo'

export const useFarmsLength = (): number => {
  const { data: farms } = useAccountResource({
    watch: true,
    address: FARMS_ADDRESS,
    resourceType: FARMS_NAME_TAG,
  })
  return (farms as FarmResource)?.data.lp.length
}

export const useFarms = () => {
  const provider = useProvider()
  const { account, chainId } = useActiveWeb3React()
  const poolLength = useFarmsLength()
  const [farmsDataList, setFarmsDataList] = useState<SerializedFarm[]>([])

  const { data: farms } = useAccountResources({
    watch: true,
    address: FARMS_ADDRESS,
    select: (resources) => resources.filter(farmsPublicDataSelector).map(mapFarmList)[0],
  })

  const farmsData = useMemo(() => farms?.map(transformFarm(chainId)), [chainId, farms])

  useEffect(() => {
    setFarmsDataList(farmsData as SerializedFarm[])
  }, [farmsData])

  // PublicData
  useSWRImmutable(farmsDataList && chainId ? [farmsDataList, chainId, 'fetchPublicData'] : null, async () => {
    for await (const farm of farms as MapFarmResource[]) {
      const tokenInfoData = await fetchLpInfo({
        provider,
        chainId,
        singlePoolInfo: farm.singlePoolInfo as FarmResourcePoolInfo,
        lpAddress: farm.lp[farm.pid as number],
      })

      setFarmsDataList(
        farmsDataList.map((singleFarm) => {
          if (singleFarm.pid === farm.pid) {
            return { ...singleFarm, ...tokenInfoData }
          }
          return singleFarm
        }) as SerializedFarm[],
      )
    }
  })

  // @ts-ignores
  // UserData
  const { mutate } = useSWRImmutable(
    account && chainId && window && farmsDataList ? [account, chainId, farmsDataList, 'fetchFarmUser'] : null,
    async () => {
      if (account) {
        // Token Balance
        const userBalances = await provider.getAccountResources(account as string)
        const lpBalances = userBalances
          .filter(coinStoreResourcesFilter)
          .filter(({ data }) => data.coin.value !== '0')
          .reduce(
            (accumulator, value) => ({
              ...accumulator,
              [unwrapTypeFromString(value.type)?.toLowerCase() as string]: value.data.coin.value,
            }),
            {},
          )

        setFarmsDataList(
          farmsDataList.map((farm) => {
            const tokenBalance = lpBalances[farm.lpAddress.toLowerCase()]
            if (tokenBalance) {
              return { ...farm, userData: { ...farm.userData, tokenBalance } }
            }
            return farm
          }) as SerializedFarm[],
        )

        // User staked balance, earnings
        for await (const farm of farms as MapFarmResource[]) {
          const { earnings, stakedBalance } = await fetchFarmUserInfo({
            provider,
            address: account as string,
            userInfoAddress: farm.singleUserInfo as string,
          })
          setFarmsDataList(
            farmsDataList.map((singleFarm) => {
              if (singleFarm.pid === farm.pid) {
                return { ...singleFarm, userData: { ...singleFarm.userData, earnings, stakedBalance } }
              }
              return singleFarm
            }) as SerializedFarm[],
          )
        }
      }
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return useMemo(() => {
    return {
      userDataLoaded: true,
      poolLength,
      regularCakePerBlock: Number(farms?.[0].cake_per_second),
      loadArchivedFarmsData: false,
      data: farmsDataList?.map(deserializeFarm) as DeserializedFarm[],
      fetchUserFarmsData: mutate,
    }
  }, [poolLength, farms, farmsDataList, mutate])
}

// lpTokenPrice: BIG_ZERO,
// quoteTokenPriceBusd: BIG_ZERO,
// tokenPriceBusd: BIG_ZERO,
