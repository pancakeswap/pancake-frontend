import {
  useReadContracts as useWagmiReadContracts,
  type ResolvedRegister,
  type Config,
  type UseReadContractsParameters,
  type UseReadContractsReturnType,
} from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import type { ReadContractsData } from 'wagmi/query'

import { useBlockNumber } from './useBlock'
import useDidMountEffect from './useDidMountEffect'

export function useReadContracts<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister['config'],
  selectData = ReadContractsData<contracts, allowFailure>,
>(
  parameters: UseReadContractsParameters<contracts, allowFailure, config, selectData> & { watch?: boolean } = {} as any,
): UseReadContractsReturnType<contracts, allowFailure, selectData> {
  const { watch, ...queryParameters } = parameters
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch, chainId: (parameters.contracts?.[0] as any)?.chainId })

  const readContractResult = useWagmiReadContracts(queryParameters as any)

  useDidMountEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
  }, blockNumber)

  return readContractResult as UseReadContractsReturnType<contracts, allowFailure, selectData>
}
