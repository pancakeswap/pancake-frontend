import { ChainId, CurrencyAmount } from '@pancakeswap/sdk'
import { Address } from 'viem'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { getUserIfoInfo, getCurrentIfoRatio } from '@pancakeswap/ifos'
import { CAKE } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'

import { getViemClients } from 'utils/viem'

type ICakeRatioParams = {
  chainId?: ChainId
}

export function useICakeRatio({ chainId }: ICakeRatioParams) {
  const { data } = useQuery({
    queryKey: [chainId, 'current-ifo-ratio'],

    queryFn: () =>
      getCurrentIfoRatio({
        chainId,
        provider: getViemClients,
      }),

    enabled: Boolean(chainId),
  })

  return data
}

type Params = {
  chainId?: ChainId
  ifoAddress?: Address
}

export function useUserIfoInfo({ chainId, ifoAddress }: Params) {
  const { address: account } = useAccount()
  const ratio = useICakeRatio({ chainId })
  const { data } = useQuery({
    queryKey: [account, chainId, ifoAddress, 'user-ifo-info'],

    queryFn: () =>
      getUserIfoInfo({
        account,
        chainId,
        ifo: ifoAddress,
        provider: getViemClients,
      }),

    enabled: Boolean(account && chainId),
  })

  const snapshotTime = useMemo(() => {
    const now = Math.floor(Date.now() / 1000)
    return data?.endTimestamp && data.endTimestamp > now ? data.endTimestamp : undefined
  }, [data?.endTimestamp])

  const credit = useMemo(
    () =>
      chainId && CAKE[chainId] && data?.credit !== undefined
        ? CurrencyAmount.fromRawAmount(CAKE[chainId], data?.credit)
        : undefined,
    [data?.credit, chainId],
  )
  const veCake = useMemo(
    () =>
      credit && ratio
        ? new BigNumber(credit.numerator.toString()).div(credit.decimalScale.toString()).div(ratio)
        : undefined,
    [credit, ratio],
  )

  return {
    snapshotTime,
    credit,
    veCake,
  }
}
