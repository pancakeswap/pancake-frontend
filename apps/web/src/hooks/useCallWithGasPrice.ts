import { useCallback } from 'react'
import { useGasPrice } from 'state/user/hooks'
import { calculateGasMargin } from 'utils'
import { publicClient } from 'utils/wagmi'
import type { EstimateContractGasParameters } from 'viem'
import {
  Abi,
  Account,
  Address,
  CallParameters,
  Chain,
  GetFunctionArgs,
  InferFunctionName,
  WriteContractParameters,
} from 'viem'
import { useWalletClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { useActiveChainId } from './useActiveChainId'

export function useCallWithGasPrice() {
  const gasPrice = useGasPrice()
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  // const callWithGasPrice = useCallback(
  //   async <
  //     TAbi extends Abi | unknown[],
  //     TFunctionName extends string = string,
  //     _FunctionName = InferFunctionName<TAbi, TFunctionName>,
  //     Args = TFunctionName extends string
  //       ? GetFunctionArgs<TAbi, TFunctionName>['args']
  //       : _FunctionName extends string
  //       ? GetFunctionArgs<TAbi, _FunctionName>['args']
  //       : never,
  //   >(
  //     contract: { abi: TAbi; account: Account; chain: Chain; address: Address },
  //     methodName: InferFunctionName<TAbi, TFunctionName>,
  //     methodArgs?: Args extends never ? undefined : Args,
  //     overrides?: Omit<CallParameters, 'chain' | 'to' | 'data'>,
  //   ): Promise<SendTransactionResult> => {
  //     const res = await walletClient.writeContract({
  //       abi: contract.abi,
  //       address: contract.address,
  //       functionName: methodName,
  //       args: methodArgs,
  //       account: walletClient.account,
  //       gasPrice,
  //       ...overrides,
  //     } as any) // TODO: fix types

  //     const hash = res

  //     return {
  //       hash,
  //     }
  //   },
  //   [gasPrice, walletClient],
  // )

  const callWithGasPriceWithSimulate = useCallback(
    async <
      TAbi extends Abi | unknown[],
      TFunctionName extends string = string,
      _FunctionName = InferFunctionName<TAbi, TFunctionName>,
      Args = TFunctionName extends string
        ? GetFunctionArgs<TAbi, TFunctionName>['args']
        : _FunctionName extends string
        ? GetFunctionArgs<TAbi, _FunctionName>['args']
        : never,
    >(
      contract: { abi: TAbi; account: Account | undefined; chain: Chain | undefined; address: Address } | null,
      methodName: InferFunctionName<TAbi, TFunctionName>,
      methodArgs?: Args extends never ? undefined : Args,
      overrides?: Omit<CallParameters, 'chain' | 'to' | 'data'>,
    ): Promise<SendTransactionResult> => {
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
