import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useAccountResources, useAccountResource, useProvider } from '@pancakeswap/awgmi'
import { coinStoreResourcesFilter, unwrapTypeFromString } from '@pancakeswap/awgmi/core'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { DeserializedFarm, SerializedFarm } from '@pancakeswap/farms'
import { FetchStatus } from 'config/constants/types'
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

  const { data: farms } = useAccountResources({
    watch: true,
    address: FARMS_ADDRESS,
    select: (resources) => resources.filter(farmsPublicDataSelector).map(mapFarmList)[0],
  })

  const farmsData = useMemo(() => farms?.map(transformFarm(chainId)), [chainId, farms])
  let farmsList = farmsData as SerializedFarm[]

  // PublicData
  useSWRImmutable(farmsData && chainId ? [farms, chainId, 'fetchPublicData'] : null, async () => {
    for await (const farm of farms as MapFarmResource[]) {
      const { tokenAmountTotal, quoteTokenAmountTotal, lpTotalSupply, lpTotalInQuoteToken, tokenPriceVsQuote } =
        await fetchLpInfo({
          provider,
          chainId,
          singlePoolInfo: farm.singlePoolInfo as FarmResourcePoolInfo,
          lpAddress: farm.lp[farm.pid as number],
        })

      farmsList = farmsList?.map((singleFarm) => {
        if (singleFarm.pid === farm.pid) {
          return {
            ...singleFarm,
            tokenAmountTotal,
            quoteTokenAmountTotal,
            lpTotalSupply,
            lpTotalInQuoteToken,
            tokenPriceVsQuote,
          }
        }
        return singleFarm
      }) as SerializedFarm[]
    }
  })

  // @ts-ignores
  // UserData
  const { status, mutate } = useSWRImmutable(
    account && chainId && farmsData ? [account, chainId, farmsData, 'fetchFarmUser'] : null,
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

        farmsList = farmsList?.map((farm) => {
          const tokenBalance = lpBalances[farm.lpAddress.toLowerCase()]
          if (tokenBalance) {
            return { ...farm, userData: { ...farm.userData, tokenBalance } }
          }
          return farm
        }) as SerializedFarm[]

        // User staked balance, earnings
        for await (const farm of farms as MapFarmResource[]) {
          const { earnings, stakedBalance } = await fetchFarmUserInfo({
            provider,
            address: account as string,
            userInfoAddress: farm.singleUserInfo as string,
          })
          farmsList = farmsList?.map((singleFarm) => {
            if (singleFarm.pid === farm.pid) {
              return { ...singleFarm, userData: { ...singleFarm.userData, earnings, stakedBalance } }
            }
            return singleFarm
          }) as SerializedFarm[]
        }
      }

      return farmsList
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )

  return useMemo(() => {
    const isFetching = status !== FetchStatus.Fetched
    return {
      userDataLoaded: isFetching,
      poolLength,
      regularCakePerBlock: Number(farms?.[0].cake_per_second),
      loadArchivedFarmsData: false,
      data: farmsList?.map(deserializeFarm).filter((farm) => farm.token.chainId === chainId) as DeserializedFarm[],
      fetchUserFarmsData: mutate,
    }
  }, [farmsList, poolLength, farms, chainId, status, mutate])
}

// const test = {
//   userDataLoaded: true,
//   poolLength: 2,
//   regularCakePerBlock: 2.033,
//   loadArchivedFarmsData: false,
//   data: [
//     {
//       pid: 1,
//       vaultpid: undefined,
//       auctionHostingEndDate: undefined,
//       boosted: false,
//       dual: undefined,
//       isCommunity: false,
//       isStable: false,
//       lpAddress: '0x123123',
//       lpSymbol: 'CAKE-BNB LP',
//       lpTokenPrice: BIG_ZERO,
//       lpTotalInQuoteToken: BIG_ZERO,
//       lpTotalSupply: BIG_ZERO,
//       multiplier: '2.5x',
//       poolWeight: BIG_ZERO,
//       quoteToken: {
//         address: '0x123',
//         chainId: 2,
//         decimals: 8,
//         isNative: false,
//         isToken: true,
//         name: 'Binance USD',
//         projectLink: 'https://sss.com',
//         symbol: 'BUSD'
//       },
//       quoteTokenAmountTotal: BIG_ZERO,
//       quoteTokenPriceBusd: BIG_ZERO,
//       token: {
//         address: '0x123',
//         chainId: 2,
//         decimals: 8,
//         isNative: false,
//         isToken: true,
//         name: 'Binance USD',
//         projectLink: 'https://sss.com',
//         symbol: 'BUSD'
//       },
//       tokenAmountTotal: BIG_ZERO,
//       tokenPriceBusd: BIG_ZERO,
//       tokenPriceVsQuote: BIG_ZERO,
//       userData: {
//         allowance: BIG_ZERO,
//         earnings: BIG_ZERO, (userInfo)
//         Proxy: BIG_ZERO,
//         stakedBalance: BIG_ZERO, (userInfo)
//         tokenBalance: BIG_ZERO,
//       }
//     }
//   ]
// }
