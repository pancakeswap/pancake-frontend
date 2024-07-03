import { Pair, PAIR_LP_TYPE_TAG, PAIR_RESERVE_TYPE_TAG } from '@pancakeswap/aptos-swap-sdk'
import { useAccount, useAccountBalances } from '@pancakeswap/awgmi'
import { unwrapTypeFromString } from '@pancakeswap/awgmi/core'
import { useMemo } from 'react'

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

export default function useLPPairsHaveBalance(): LPPairsResponse {
  const { account } = useAccount()

  const balances = useAccountBalances({
    watch: true,
    address: account?.address,
    select: (balance) => (balance.address.includes(PAIR_LP_TYPE_TAG) && balance.value !== '0' ? balance : null),
  })
  const isPending = useMemo(() => balances.some((b) => b.isPending), [balances])
  const mmV2PairsBalances = useMemo(
    () =>
      (balances
        .map((b) =>
          b.isSuccess && b.data ? `${PAIR_RESERVE_TYPE_TAG}<${unwrapTypeFromString(b.data.address)}>` : undefined,
        )
        .filter(Boolean) as string[]) ?? [],
    [balances],
  )

  const v2Pairs = usePairsFromAddresses(mmV2PairsBalances)

  return useMemo(
    () => ({
      data: filterPair(v2Pairs),
      loading: isPending || Boolean(v2Pairs?.length && v2Pairs.every(([pairState]) => pairState === PairState.LOADING)),
    }),
    [v2Pairs, isPending],
  )
}
