import { useQueryClient } from '@tanstack/react-query'
import {
  useBalance as useWagmiBalance,
  type Config,
  type ResolvedRegister,
  type UseBalanceParameters,
  type UseBalanceReturnType,
} from 'wagmi'

import { GetBalanceData } from '../types'
import { useBlockNumber } from './useBlock'
import useDidMountEffect from './useDidMountEffect'

export function useBalance<config extends Config = ResolvedRegister['config'], selectData = GetBalanceData>(
  params: UseBalanceParameters<config, selectData> & { watch?: boolean } = {},
): UseBalanceReturnType<selectData> {
  const { watch, ...queryParameters } = params
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ chainId: params.chainId, watch })

  const readContractResult = useWagmiBalance(queryParameters)

  useDidMountEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
  }, blockNumber)

  return readContractResult as UseBalanceReturnType<selectData>
}
