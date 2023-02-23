/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import {
  Currency,
  CurrencyAmount,
  JSBI,
  Percent,
  SwapParameters,
  TradeOptions,
  TradeOptionsDeadline,
  TradeType,
} from '@pancakeswap/sdk'
import { Trade, SmartRouter } from '@pancakeswap/smart-router/evm'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'

import { useSwapState } from 'state/swap/hooks'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { BIPS_BASE } from 'config/constants/exchange'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useSmartRouterContract } from 'views/Swap/SmartSwap/utils/exchange'
import { useUserSlippageTolerance } from 'state/user/hooks'

const NATIVE_CURRENCY_ADDRESS = getAddress('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')

export interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
  trade: Trade<TradeType> | undefined | null, // trade to execute, required
): SwapCall[] {
  const { account, chainId } = useActiveWeb3React()
  const [userSlippage] = useUserSlippageTolerance()
  const allowedSlippage = userSlippage || INITIAL_ALLOWED_SLIPPAGE
  const { recipient: recipientAddress } = useSwapState()

  const recipient = recipientAddress === null ? account : recipientAddress
  const deadline = useTransactionDeadline()
  const contract = useSmartRouterContract()

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId || !deadline) return []

    if (!contract) {
      return []
    }

    const swapMethods = []
    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: deadline.toNumber(),
        }),
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, contract, deadline, recipient, trade])
}

function toHex(currencyAmount: CurrencyAmount<Currency>) {
  return `0x${currencyAmount.quotient.toString(16)}`
}

const ZERO_HEX = '0x0'

function swapCallParameters(trade: Trade<TradeType>, options: TradeOptions | TradeOptionsDeadline): SwapParameters {
  const etherIn = trade.inputAmount.currency.isNative
  const etherOut = trade.outputAmount.currency.isNative
  // the router does not support both ether in and out
  invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
  invariant(!('ttl' in options) || options.ttl > 0, 'TTL')

  const amountIn: string = toHex(SmartRouter.maximumAmountIn(trade, options.allowedSlippage))
  const amountOut: string = toHex(SmartRouter.minimumAmountOut(trade, options.allowedSlippage))

  // TODO build arguments
  return {
    methodName: 'swapMulti',
    args: [],
    value: ZERO_HEX,
  }
}
