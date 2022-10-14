import { Pair, PAIR_LP_TYPE_TAG, PAIR_RESERVE_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountResources } from '@pancakeswap/awgmi'
import {
  CoinStoreResource,
  COIN_STORE_TYPE_PREFIX,
  createAccountResourceFilter,
  FetchAccountResourcesResult,
  unwrapTypeArgFromString,
} from '@pancakeswap/awgmi/core'
import { PairState, usePairsFromAddresses } from 'hooks/usePairs'
import { useMemo } from 'react'

function filterPair(v2Pairs): Pair[] {
  return v2Pairs?.length
    ? v2Pairs.filter(([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair)).map(([, pair]) => pair)
    : []
}

interface LPPairsResponse {
  data: Pair[]
  loading: boolean
}

const coinStoreLPfilter = createAccountResourceFilter<CoinStoreResource<typeof PAIR_LP_TYPE_TAG>>(
  `${COIN_STORE_TYPE_PREFIX}<${PAIR_LP_TYPE_TAG}`,
)

const selector = (resource: FetchAccountResourcesResult) => {
  return resource.filter(coinStoreLPfilter).filter(({ data }) => data.coin.value !== '0')
}

export default function useLPPairsHaveBalance(): LPPairsResponse {
  const { account } = useAccount()

  const {
    data: v2PairsBalances,
    isLoading,
    isIdle,
  } = useAccountResources({
    watch: true,
    address: account?.address,
    select: selector,
  })

  const mmV2PairsBalances = useMemo(
    () =>
      (v2PairsBalances
        ?.map((p) => `${PAIR_RESERVE_TYPE_TAG}<${unwrapTypeArgFromString(p.type)}>`)
        .filter(Boolean) as string[]) ?? [],
    [v2PairsBalances],
  )

  const v2Pairs = usePairsFromAddresses(mmV2PairsBalances)

  return useMemo(
    () => ({
      data: filterPair(v2Pairs),
      loading:
        (isIdle && isLoading) ||
        Boolean(v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING)),
    }),
    [v2Pairs, isLoading, isIdle],
  )
}
