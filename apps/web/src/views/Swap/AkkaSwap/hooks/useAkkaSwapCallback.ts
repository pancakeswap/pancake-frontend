import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber, BigNumberish, BytesLike } from 'ethers'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AkkaRouter, BridgeDescriptionStruct, SplitedPathDescriptionStruct } from 'config/abi/types/AkkaRouter'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useAkkaRouterContract } from 'utils/exchange'
export function useAkkaBitgertAggrigatorSwapCallback(): {
  multiPathSwap?:
    | undefined
    | ((
        amountIn: BigNumberish,
        amountOutMin: BigNumberish,
        data: SplitedPathDescriptionStruct[],
        bridge: BridgeDescriptionStruct[],
        dstData: SplitedPathDescriptionStruct[],
        to: string,
      ) => Promise<TransactionResponse>)
} {
  const akkaContract = useAkkaRouterContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    return {
      multiPathSwap: async (amountIn, amountOutMin, data, bridge, dstData, to) => {
        const tx = await callWithGasPrice(akkaContract, 'multiPathSwap', [
          amountIn,
          amountOutMin,
          data,
          bridge,
          dstData,
          to,
        ])
        addTransaction(tx, {
          summary: `swap ${amountIn}`,
          type: 'swap',
        })

        return tx as TransactionResponse
      },
    }
  }, [akkaContract, addTransaction])
}
