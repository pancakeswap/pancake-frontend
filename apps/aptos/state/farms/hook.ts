import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { useAccountResources } from '@pancakeswap/awgmi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { DeserializedFarm } from '@pancakeswap/farms'
import { deserializeFarm } from 'state/farms/utils/deserializeFarm'
import { farmsPublicDataSelector, mapFarmList, transformFarm } from 'state/farms/utils/index'
import { SLOW_INTERVAL } from 'config/constants'
import { FARMS_ADDRESS } from './constants'

export const useFarms = (): any => {
  const { account, chainId } = useActiveWeb3React()

  const { data: farms } = useAccountResources({
    watch: true,
    address: FARMS_ADDRESS,
    select: (resources) => {
      return resources.filter(farmsPublicDataSelector).map(mapFarmList)[0].map(transformFarm(chainId))
    },
  })

  const farmsData = useMemo(() => {
    return farms?.map(deserializeFarm).filter((farm) => farm.token.chainId === chainId) as DeserializedFarm[]
  }, [chainId, farms])

  // const { data: balances } = useAccountResources({
  //   address: account
  // })

  // if (balances?.length) {
  //   console.log('balances', balances)
  // }

  return {
    userDataLoaded: false,
    poolLength: 0,
    regularCakePerBlock: 0,
    loadArchivedFarmsData: false,
    data: farmsData,
  }
}

const useFetchFarmUserInfo = (lpAddress: string) => {
  // const { account, chainId } = useActiveWeb3React()
  // const { data } = useTableItem({
  //   handle: lpAddress,
  //   data: {
  //     key: account,
  //     keyType: "address",
  //     valueType: FARMS_USER_INFO
  //   }
  // })
  // "amount": "99900",
  // "reward_debt": "4315680000"
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
