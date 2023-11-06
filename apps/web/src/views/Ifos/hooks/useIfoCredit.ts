import { ChainId, CurrencyAmount } from '@pancakeswap/sdk'
import { fetchUserIfoCredit, fetchPublicIfoData } from '@pancakeswap/ifos'
import { CAKE } from '@pancakeswap/tokens'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { getViemClients } from 'utils/viem'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { useIfoSourceChain } from './useIfoSourceChain'

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
      chainId &&
      CAKE[chainId] &&
      (shouldUseCreditFromCurrentChain
        ? ifoCredit && CurrencyAmount.fromRawAmount(CAKE[chainId], ifoCredit.toString())
        : creditAmountRaw && CurrencyAmount.fromRawAmount(CAKE[chainId], creditAmountRaw)),
    [creditAmountRaw, chainId, shouldUseCreditFromCurrentChain, ifoCredit],
  )
}

export function useIfoCeiling({ chainId }: { chainId?: ChainId }): BigNumber | undefined {
  const { data } = useQuery([chainId, 'ifo-ceiling'], () => fetchPublicIfoData(chainId, getViemClients), {
    enabled: !!chainId,
  })
  return useMemo(() => (data?.ceiling ? new BigNumber(data.ceiling) : undefined), [data])
}

type ICakeStatusParams = {
  ifoChainId?: ChainId

  // Ifo credit on destination chain, i.e. the chain on which ifo is hosted
  ifoCredit?: BigNumber
}

export function useICakeBridgeStatus({ ifoChainId, ifoCredit }: ICakeStatusParams) {
  const srcChainId = useIfoSourceChain(ifoChainId)
  const destChainCredit = useIfoCredit({ chainId: ifoChainId, ifoCredit })
  const sourceChainCredit = useIfoCredit({ chainId: srcChainId, ifoCredit })
  const noICake = useMemo(() => !sourceChainCredit || sourceChainCredit.quotient === 0n, [sourceChainCredit])
  const isICakeSynced = useMemo(
    () => destChainCredit && sourceChainCredit && destChainCredit.quotient === sourceChainCredit.quotient,
    [sourceChainCredit, destChainCredit],
  )
  const shouldBridgeAgain = useMemo(
    () =>
      destChainCredit &&
      sourceChainCredit &&
      destChainCredit.quotient > 0n &&
      sourceChainCredit.quotient !== destChainCredit.quotient,
    [destChainCredit, sourceChainCredit],
  )

  return {
    srcChainId,
    noICake,
    isICakeSynced,
    shouldBridgeAgain,
    sourceChainCredit,
    destChainCredit,
    hasBridged: !noICake && isICakeSynced,
  }
}
