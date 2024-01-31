import { ChainId } from '@pancakeswap/chains'
import { fetchPublicIfoData } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Address } from 'viem'

import { getViemClients } from 'utils/viem'

import { useIfoSourceChain } from './useIfoSourceChain'
import { useUserIfoInfo } from './useUserIfoInfo'

type IfoCreditParams = {
  chainId?: ChainId
  ifoAddress?: Address
}

export function useIfoCredit({ chainId, ifoAddress }: IfoCreditParams) {
  const { credit } = useUserIfoInfo({ chainId, ifoAddress })
  return credit
}

export function useIfoCeiling({ chainId }: { chainId?: ChainId }): BigNumber | undefined {
  const { data } = useQuery({
    queryKey: [chainId, 'ifo-ceiling'],
    queryFn: () => fetchPublicIfoData(chainId, getViemClients),
    enabled: !!chainId,
  })
  return useMemo(() => (data?.ceiling ? new BigNumber(data.ceiling) : undefined), [data])
}

type ICakeStatusParams = {
  ifoChainId?: ChainId
  ifoAddress?: Address
}

export function useICakeBridgeStatus({ ifoChainId, ifoAddress }: ICakeStatusParams) {
  const srcChainId = useIfoSourceChain(ifoChainId)
  const destChainCredit = useIfoCredit({ chainId: ifoChainId, ifoAddress })
  const sourceChainCredit = useIfoCredit({ chainId: srcChainId, ifoAddress })
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
