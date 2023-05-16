import { Abi } from 'abitype'
import { useCallback } from 'react'
import { useGasPrice } from 'state/user/hooks'
import { getViemClients } from 'utils/viem'
import { Account, Address, CallParameters, Chain, GetFunctionArgs, InferFunctionName } from 'viem'
import { useWalletClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import { useActiveChainId } from './useActiveChainId'

export function useCallWithGasPrice() {
  const gasPrice = useGasPrice()
  const { chainId } = useActiveChainId()
  const { data: walletClient } = useWalletClient()

  const callWithGasPrice = useCallback(
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
      contract: { abi: TAbi; account: Account; chain: Chain; address: Address },
      methodName: InferFunctionName<TAbi, TFunctionName>,
      methodArgs?: Args extends never ? undefined : Args,
      overrides?: Omit<CallParameters, 'chain' | 'to' | 'data'>,
    ): Promise<SendTransactionResult> => {
      const res = await walletClient.writeContract({
        abi: contract.abi,
        address: contract.address,
        functionName: methodName,
        args: methodArgs,
        account: walletClient.account,
        gasPrice: BigInt(gasPrice),
        ...overrides,
      } as any) // TODO: fix types

      const hash = res

      return {
        hash,
      }
    },
    [gasPrice, walletClient],
  )

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
      contract: { abi: TAbi; account: Account; chain: Chain; address: Address },
      methodName: InferFunctionName<TAbi, TFunctionName>,
      methodArgs?: Args extends never ? undefined : Args,
      overrides?: Omit<CallParameters, 'chain' | 'to' | 'data'>,
    ): Promise<SendTransactionResult> => {
      const publicClient = getViemClients({ chainId })
      const { request } = await publicClient.simulateContract({
        abi: contract.abi,
        address: contract.address,
        functionName: methodName,
        args: methodArgs,
        gasPrice: BigInt(gasPrice),
        ...overrides,
      } as any) // TODO: fix types
      const res = await walletClient.writeContract({
        ...request,
      })

      const hash = res

      return {
        hash,
      }
    },
    [chainId, gasPrice, walletClient],
  )

  return { callWithGasPrice, callWithGasPriceWithSimulate }
}
