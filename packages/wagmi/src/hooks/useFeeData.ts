import {
  useFeeData as useWagmiFeeData,
  ResolvedRegister,
  Config,
  UseEstimateFeesPerGasParameters,
  UseEstimateFeesPerGasReturnType,
} from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { EstimateFeesPerGasData } from 'wagmi/query'
import type { FeeValuesType } from 'viem'

import { useBlockNumber } from './useBlock'
import useDidMountEffect from './useDidMountEffect'

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

  const readContractResult = useWagmiFeeData(queryParameters as any)

  useDidMountEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
  }, blockNumber)

  return readContractResult as UseEstimateFeesPerGasReturnType<type, selectData>
}
