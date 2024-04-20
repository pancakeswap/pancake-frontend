import {
  useBalance as useWagmiBalance,
  ResolvedRegister,
  Config,
  UseEstimateFeesPerGasParameters,
  UseEstimateFeesPerGasReturnType,
} from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { EstimateFeesPerGasData } from 'wagmi/query'
import { useEffect } from 'react'
import type { FeeValuesType } from 'viem'

import { useBlockNumber } from './useBlock'

export function useFeeData<
  config extends Config = ResolvedRegister['config'],
  type extends FeeValuesType = 'eip1559',
  selectData = EstimateFeesPerGasData<type>,
>(
  parameters: UseEstimateFeesPerGasParameters<type, config, selectData> & { watch?: boolean } = {},
): UseEstimateFeesPerGasReturnType<type, selectData> {
  const { watch, ...queryParameters } = parameters
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch, chainId: parameters.chainId })

  const readContractResult = useWagmiBalance(queryParameters as any)

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, watch])

  return readContractResult as UseEstimateFeesPerGasReturnType<type, selectData>
}
