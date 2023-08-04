import { ChainId, CurrencyAmount } from '@pancakeswap/sdk'
import { PROFILE_SUPPORTED_CHAIN_IDS, fetchUserIfoCredit } from '@pancakeswap/ifos'
import { CAKE } from '@pancakeswap/tokens'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'

import { getViemClients } from 'utils/viem'

type Params = {
  ifoChainId?: ChainId
  sourceChainId?: ChainId
}

// By deafult will use the first chain that supports native ifo
export function useIfoCreditOnSourceChain({ ifoChainId, sourceChainId }: Params) {
  const { address: account } = useAccount()
  const chain = sourceChainId || PROFILE_SUPPORTED_CHAIN_IDS[0] || ChainId.BSC
  const { data: creditAmountRaw } = useQuery(
    [account, chain, 'ifo-credit-on-source-chain'],
    () =>
      fetchUserIfoCredit({
        account,
        chainId: chain,
        provider: getViemClients,
      }),
    {
      enabled: Boolean(account && chain && chain !== ifoChainId),
    },
  )
  return useMemo(
    () => creditAmountRaw && CAKE[chain] && CurrencyAmount.fromRawAmount(CAKE[chain], creditAmountRaw),
    [creditAmountRaw, chain],
  )
}
