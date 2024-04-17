import { useBlockNumber, useReadContracts as useWagmiReadContracts } from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'

import { ExtendFunctionParams } from '../types'

export const useReadContracts: ExtendFunctionParams<typeof useWagmiReadContracts, { watch?: boolean }> = (
  parameters,
) => {
  const { watch, ...queryParameters } = parameters
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch })

  const readContractResult = useWagmiReadContracts(queryParameters)

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, watch])

  return readContractResult
}
