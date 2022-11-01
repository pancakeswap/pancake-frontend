import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { useAccountResource, useTableItem } from '@pancakeswap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getFarmConfig } from 'config/constants/farms'
import { SerializedFarmConfig, SerializedFarmsState, DeserializedFarmsState } from '@pancakeswap/farms'
import { deserializeFarm } from 'state/farms/utils/deserializeFarm'
import { FARMS_ADDRESS, FARMS_MODULE_NAME, FARMS_NAME, FARMS_USER_INFO } from './constants'
import { FarmResource } from './types'

const useFetchAllFarms = () => {
  return useAccountResource({
    address: FARMS_ADDRESS,
    resourceType: `${FARMS_ADDRESS}::${FARMS_MODULE_NAME}::${FARMS_NAME}`,
    watch: true,
  })
}

const useFetchFarmUserInfo = ({ data }: FarmResource) => {
  const { account, chainId } = useActiveWeb3React()
  // console.log('data', data)
  // "amount": "99900",
  // "reward_debt": "4315680000"

  // const { data } = useTableItem({
  //   handle: "0xebbc09bb6d14c930c1307291f37f2c224cf10b4a631177945e0f20aad5bf2d13",
  //   data: {
  //     key: account,
  //     keyType: "address",
  //     valueType: FARMS_USER_INFO
  //   }
  // })
}

const initialData = {
  data: [],
  loadArchivedFarmsData: false,
  userDataLoaded: false,
  loadingKeys: {},
}

export const useFarmsPageFetch = (): any => {
  const { account, chainId } = useActiveWeb3React()
  const [farmsConfig, setFarmsConfig] = useState<SerializedFarmConfig[]>([])
  const [farmDataList, setFarmDataList] = useState<SerializedFarmsState>(initialData)

  const { data: farmsList, isLoading, refetch } = useFetchAllFarms()
  // useFetchFarmUserInfo(farmsList as FarmResource)

  useEffect(() => {
    const fetchInitFarmsData = async () => {
      const response = await getFarmConfig(chainId)
      setFarmsConfig(response)
      setFarmDataList({
        ...farmDataList,
        chainId,
      })
    }
    fetchInitFarmsData()
  }, [chainId, farmDataList])

  const initData = useMemo((): SerializedFarmsState => {
    return {
      ...initialData,
      data: farmsConfig.map((farm) => ({
        ...farm,
        userData: {
          allowance: '0',
          tokenBalance: '0',
          stakedBalance: '0',
          earnings: '0',
        },
      })),
    }
  }, [farmsConfig])

  // const regularCakePerBlock = useMemo(() => {
  //   const cakePerSecond = (farmsData as FarmResource).data.cake_per_second
  //   return Number(cakePerSecond)
  // }, [farmsData])

  return {
    ...initData,
    data: initData.data.map(deserializeFarm).filter((farm) => farm.token.chainId === chainId),
  }
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
