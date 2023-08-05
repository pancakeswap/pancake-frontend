import { ChainId, CurrencyAmount } from '@pancakeswap/sdk'
import { fetchUserIfoCredit } from '@pancakeswap/ifos'
import { CAKE } from '@pancakeswap/tokens'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { getViemClients } from 'utils/viem'
import { useActiveChainId } from 'hooks/useActiveChainId'

type IfoCreditParams = {
  chainId?: ChainId
  // Ifo credit on current chain
  ifoCredit?: BigNumber
}

export function useIfoCredit({ chainId, ifoCredit }: IfoCreditParams) {
  const { address: account } = useAccount()
  const { chainId: currentChainId } = useActiveChainId()
  const shouldUseCreditFromCurrentChain = chainId === currentChainId
  const { data: creditAmountRaw } = useQuery(
    [account, chainId, 'ifo-credit'],
    () =>
      fetchUserIfoCredit({
        account,
        chainId,
        provider: getViemClients,
      }),
    {
      enabled: Boolean(account && chainId && currentChainId && !shouldUseCreditFromCurrentChain),
    },
  )
  return useMemo(
    () =>
      CAKE[chainId] &&
      (shouldUseCreditFromCurrentChain
        ? ifoCredit && CurrencyAmount.fromRawAmount(CAKE[chainId], ifoCredit.toString())
        : creditAmountRaw && CurrencyAmount.fromRawAmount(CAKE[chainId], creditAmountRaw)),
    [creditAmountRaw, chainId, shouldUseCreditFromCurrentChain, ifoCredit],
  )
}
