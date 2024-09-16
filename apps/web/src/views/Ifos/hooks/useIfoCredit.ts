import { ChainId } from '@pancakeswap/chains'
import { fetchPublicIfoData, ICAKE, iCakeABI } from '@pancakeswap/ifos'
import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Address } from 'viem'

import { getViemClients } from 'utils/viem'

import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { CAKE } from '@pancakeswap/tokens'
import { useReadContract } from '@pancakeswap/wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
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

export function useVeCakeUserCreditWithTime(endTime: number, overrideChainId: ChainId) {
  const { account, chainId: activeChainId } = useAccountActiveChain()
  const chainId = useMemo(() => overrideChainId || activeChainId, [activeChainId, overrideChainId])

  const { data, refetch } = useReadContract({
    chainId,
    address: chainId && ICAKE[chainId] ? ICAKE[chainId] : ICAKE[ChainId.BSC],
    functionName: 'getUserCreditWithTime',
    abi: iCakeABI,
    args: [account as Address, BigInt(endTime)],
    query: {
      enabled: Boolean(account && chainId && endTime),
    },
  })

  const userCreditWithTime = useMemo(
    () =>
      chainId && CAKE[chainId] && data !== undefined ? CurrencyAmount.fromRawAmount(CAKE[chainId], data) : undefined,
    [data, chainId],
  )

  return {
    userCreditWithTime,
    refresh: refetch,
  }
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

  const isCrossChainIfo = useMemo(() => srcChainId !== ifoChainId, [srcChainId, ifoChainId])

  const destChainCredit = useIfoCredit({ chainId: ifoChainId, ifoAddress })

  // Ifo address is only on target chain so pass undefined for source chain
  const sourceChainCredit = useIfoCredit({ chainId: srcChainId, ifoAddress: isCrossChainIfo ? undefined : ifoAddress })

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
