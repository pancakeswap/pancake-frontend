import { Pair, PAIR_LP_TYPE_TAG, PAIR_RESERVE_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
import { useMemo } from 'react'
import { useAccount, useAccountResources } from '@pancakeswap/awgmi'
import {
  COIN_STORE_TYPE_PREFIX,
  unwrapTypeArgFromString,
  createAccountResourceFilter,
  CoinStoreResource,
} from '@pancakeswap/awgmi/core'
import { PairState, usePairsFromAddresses } from 'hooks/usePairs'

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

export default function useLPPairsHaveBalance(): LPPairsResponse {
  const { account } = useAccount()

  const {
    data: v2PairsBalances,
    isFetching,
    isIdle,
  } = useAccountResources({
    watch: true,
    address: account?.address,
    select(resource) {
      return resource.filter(coinStoreLPfilter).filter(({ data }) => data.coin.value !== '0')
    },
  })

  const mmV2PairsBalances = useMemo(
    () =>
      (v2PairsBalances
        ?.map((p) => `${PAIR_RESERVE_TYPE_TAG}<${unwrapTypeArgFromString(p.type)}>`)
        .filter(Boolean) as string[]) ?? [],
    [v2PairsBalances],
  )

  const v2Pairs = usePairsFromAddresses(mmV2PairsBalances)

  const isLoading =
    (isIdle && isFetching) ||
    Boolean(v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING))

  return useMemo(
    () => ({
      data: filterPair(v2Pairs),
      loading: isLoading,
    }),
    [v2Pairs, isLoading],
  )
}
