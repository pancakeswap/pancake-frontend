import {
  useBlockNumber,
  useReadContract as useWagmiReadContract,
  ResolvedRegister,
  UseReadContractParameters,
  UseReadContractReturnType,
  Config,
} from 'wagmi'
import { useQueryClient } from '@tanstack/react-query'
import { type Abi, type ContractFunctionArgs, type ContractFunctionName } from 'viem'
import { ReadContractData } from 'wagmi/query'
import { useEffect } from 'react'

export function useReadContract<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, 'pure' | 'view'>,
  args extends ContractFunctionArgs<abi, 'pure' | 'view', functionName>,
  config extends Config = ResolvedRegister['config'],
  selectData = ReadContractData<abi, functionName, args>,
>(
  parameters: UseReadContractParameters<abi, functionName, args, config, selectData> & { watch?: boolean } = {} as any,
): UseReadContractReturnType<abi, functionName, args, selectData> {
  const { watch, ...queryParameters } = parameters
  const queryClient = useQueryClient()
  const { data: blockNumber } = useBlockNumber({ watch })

  const readContractResult = useWagmiReadContract(queryParameters as any)

  useEffect(() => {
    if (watch) {
      queryClient.invalidateQueries({ queryKey: readContractResult.queryKey }, { cancelRefetch: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, queryClient, watch])

  return readContractResult as UseReadContractReturnType<abi, functionName, args, selectData>
}
