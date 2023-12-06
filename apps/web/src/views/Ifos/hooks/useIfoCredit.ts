import { ChainId } from '@pancakeswap/chains'
import { fetchPublicIfoData } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { getViemClients } from 'utils/viem'

import { useIfoSourceChain } from './useIfoSourceChain'
import { useUserIfoInfo } from './useUserIfoInfo'

type IfoCreditParams = {
  chainId?: ChainId
}

export function useIfoCredit({ chainId }: IfoCreditParams) {
  const { credit } = useUserIfoInfo({ chainId })
  return credit
}

export function useIfoCeiling({ chainId }: { chainId?: ChainId }): BigNumber | undefined {
  const { data } = useQuery([chainId, 'ifo-ceiling'], () => fetchPublicIfoData(chainId, getViemClients), {
    enabled: !!chainId,
  })
  return useMemo(() => (data?.ceiling ? new BigNumber(data.ceiling) : undefined), [data])
}

type ICakeStatusParams = {
  ifoChainId?: ChainId
}

export function useICakeBridgeStatus({ ifoChainId }: ICakeStatusParams) {
  const srcChainId = useIfoSourceChain(ifoChainId)
  const destChainCredit = useIfoCredit({ chainId: ifoChainId })
  const sourceChainCredit = useIfoCredit({ chainId: srcChainId })
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
