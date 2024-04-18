import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  useBlockNumber,
  useBalance as useWagmiBalance,
  type Config,
  type ResolvedRegister,
  type UseBalanceParameters,
  type UseBalanceReturnType,
} from 'wagmi'

import { GetBalanceData } from '../types'

export function useBalance<config extends Config = ResolvedRegister['config'], selectData = GetBalanceData>(
  params: UseBalanceParameters<config, selectData> & { watch?: boolean } = {},
): UseBalanceReturnType<selectData> {
  const { watch, ...queryParameters } = params
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch, scopeKey: 'blockNumber' })

  const readContractResult = useWagmiBalance(queryParameters)

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey, exact: true }, { cancelRefetch: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, watch])

  return readContractResult
}
