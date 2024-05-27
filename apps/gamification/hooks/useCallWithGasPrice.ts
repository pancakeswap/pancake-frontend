import { useGasPrice } from 'hooks/useGasPrice'
import { useCallback } from 'react'
import { calculateGasMargin } from 'utils'
import { publicClient } from 'utils/wagmi'
import type { ContractFunctionArgs, ContractFunctionName, EstimateContractGasParameters } from 'viem'
import { Abi, Account, Address, CallParameters, Chain, WriteContractParameters } from 'viem'
import { useWalletClient } from 'wagmi'
import { useActiveChainId } from './useActiveChainId'

export function useCallWithGasPrice() {
  const gasPrice = useGasPrice()
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  const callWithGasPriceWithSimulate = useCallback(
    async <
      TAbi extends Abi | unknown[],
      functionName extends ContractFunctionName<TAbi, 'nonpayable' | 'payable'>,
      args extends ContractFunctionArgs<TAbi, 'nonpayable' | 'payable', functionName>,
    >(
      contract: { abi: TAbi; account: Account | undefined; chain: Chain | undefined; address: Address } | null,
      methodName: functionName,
      methodArgs?: args,
      overrides?: Omit<CallParameters, 'chain' | 'to' | 'data'>,
    ): Promise<{ hash: Address }> => {
      if (!contract) {
        throw new Error('No valid contract')
      }
      if (!walletClient) {
        throw new Error('No valid wallet connect')
      }
      const { gas: gas_, ...overrides_ } = overrides || {}
      let gas = gas_
      if (!gas) {
        gas = await publicClient({ chainId }).estimateContractGas({
          abi: contract.abi,
          address: contract.address,
          account: walletClient.account,
          functionName: methodName,
          args: methodArgs,
          value: 0n,
          ...overrides_,
        } as unknown as EstimateContractGasParameters)
      }

      const res = await walletClient.writeContract({
        abi: contract.abi,
        address: contract.address,
        account: walletClient.account,
        functionName: methodName,
        args: methodArgs,
        gasPrice,
        // for some reason gas price is insamely high when using maxuint approval, so commenting out for now
        gas: calculateGasMargin(gas),
        value: 0n,
        ...overrides_,
      } as unknown as WriteContractParameters)

      const hash = res

      return {
        hash,
      }
    },
    [chainId, gasPrice, walletClient],
  )

  return { callWithGasPrice: callWithGasPriceWithSimulate }
}
