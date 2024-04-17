import { useBlockNumber, useBalance as useWagmiBalance, ResolvedRegister, Config } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { GetBalanceData } from 'wagmi/query'
import { useEffect } from 'react'
import { UseBalanceParameters, UseBalanceReturnType } from 'wagmi/src/hooks/useBalance'

export function useBalance<config extends Config = ResolvedRegister['config'], selectData = GetBalanceData>(
  parameters: UseBalanceParameters<config, selectData> & { watch?: boolean } = {} as any,
): UseBalanceReturnType<selectData> {
  const { watch, ...queryParameters } = parameters
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch })

  const readContractResult = useWagmiBalance(queryParameters as any)

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, watch])

  return readContractResult as UseBalanceReturnType<selectData>
}
