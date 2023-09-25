/* eslint-disable @typescript-eslint/no-unused-vars */
import { Percent, TradeType } from '@pancakeswap/sdk'
import { SMART_ROUTER_ADDRESSES, SmartRouterTrade, SwapRouter } from '@pancakeswap/smart-router/evm'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { useMemo } from 'react'
import { isAddress } from 'utils'

import { useGetENSAddressByName } from 'hooks/useGetENSAddressByName'
import { PancakeUniSwapRouter, UNIVERSAL_ROUTER_ADDRESS } from '@pancakeswap/universal-router-sdk'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
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
 * @param signatureData the signature data of the permit of the input token amount, if available
 */
export function useSwapCallArguments(
  trade: SmartRouterTrade<TradeType> | undefined | null,
  allowedSlippage: Percent,
  recipientAddress: string | null | undefined,
  permitSignature: string | null | undefined,
  deadline: bigint | undefined,
  feeOptions: FeeOptions | undefined,
): SwapCall[] {
  const { account, chainId } = useAccountActiveChain()
  const recipientENSAddress = useGetENSAddressByName(recipientAddress)
  const recipient = (
    recipientAddress === null
      ? account
      : isAddress(recipientAddress)
      ? recipientAddress
      : isAddress(recipientENSAddress)
      ? recipientENSAddress
      : null
  ) as Address | null

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId) return []

  
    const methodParamaters = PancakeUniSwapRouter.swapERC20CallParameters(trade, {
      fee: feeOptions,
      recipient,
      permit: permitSignature,
      slippageTolerance: allowedSlippage,
      deadlineOrPreviousBlockhash: deadline?.toString(),
    })
    const swapRouterAddress =  UNIVERSAL_ROUTER_ADDRESS(chainId)
    if (!swapRouterAddress) return []
    return [
      {
        address: swapRouterAddress,
        calldata: methodParamaters.calldata as `0x${string}`,
        value: methodParamaters.value as `0x${string}`,
      },
    ]
  }, [
    account,
    allowedSlippage,
    // argentWalletContract,
    chainId,
    deadline,
    feeOptions,
    recipient,
    // signatureData,
    permitSignature,
    trade,
  ])
}
