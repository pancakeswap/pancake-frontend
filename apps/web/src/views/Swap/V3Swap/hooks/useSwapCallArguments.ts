/* eslint-disable @typescript-eslint/no-unused-vars */
import { Percent, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { useMemo } from 'react'
import {
  PancakeSwapUniversalRouter,
  getUniversalRouterAddress,
  Permit2Signature,
} from '@pancakeswap/universal-router-sdk'
import { safeGetAddress } from 'utils'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGetENSAddressByName } from 'hooks/useGetENSAddressByName'
import { Address, Hex } from 'viem'

interface SwapCall {
  address: Address
  calldata: Hex
  value: Hex
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName the ENS name or address of the recipient of the swap output
 * @param deadline the deadline for executing the trade
 * @param feeOptions the fee options to be applied to the trade.
 */
export function useSwapCallArguments(
  trade: SmartRouterTrade<TradeType> | undefined | null,
  allowedSlippage: Percent,
  recipientAddressOrName: string | null | undefined,
  permitSignature: Permit2Signature | undefined,
  deadline: bigint | undefined,
  feeOptions: FeeOptions | undefined,
): SwapCall[] {
  const { account, chainId } = useAccountActiveChain()
  const recipientENSAddress = useGetENSAddressByName(recipientAddressOrName ?? undefined)
  const recipient = (
    recipientAddressOrName === null || recipientAddressOrName === undefined
      ? account
      : safeGetAddress(recipientAddressOrName)
      ? recipientAddressOrName
      : safeGetAddress(recipientENSAddress)
      ? recipientENSAddress
      : null
  ) as Address | null

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId) return []

    const methodParameters = PancakeSwapUniversalRouter.swapERC20CallParameters(trade, {
      fee: feeOptions,
      recipient,
      inputTokenPermit: permitSignature,
      slippageTolerance: allowedSlippage,
      deadlineOrPreviousBlockhash: deadline?.toString(),
    })
    const swapRouterAddress = getUniversalRouterAddress(chainId)
    if (!swapRouterAddress) return []
    return [
      {
        address: swapRouterAddress,
        calldata: methodParameters.calldata as `0x${string}`,
        value: methodParameters.value as `0x${string}`,
      },
    ]
  }, [account, allowedSlippage, chainId, deadline, feeOptions, recipient, permitSignature, trade])
}
