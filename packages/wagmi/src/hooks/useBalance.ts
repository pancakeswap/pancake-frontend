import { useBlockNumber, useBalance as useWagmiBalance } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { ExtendFunctionParams } from '../types'

export const useBalance: ExtendFunctionParams<typeof useWagmiBalance, { watch?: boolean }> = (params) => {
  const { watch, ...queryParameters } = params
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch })

  const readContractResult = useWagmiBalance(queryParameters)

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, watch])

  return readContractResult
}
