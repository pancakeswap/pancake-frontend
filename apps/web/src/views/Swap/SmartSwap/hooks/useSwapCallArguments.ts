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
import { isStableSwapPair, Trade, TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { BIPS_BASE } from 'config/constants/exchange'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'
import { useSmartRouterContract } from '../utils/exchange'

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
  trade: TradeWithStableSwap<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId } = useActiveWeb3React()

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

function swapCallParameters(
  trade: TradeWithStableSwap<Currency, Currency, TradeType>,
  options: TradeOptions | TradeOptionsDeadline,
): SwapParameters {
  const etherIn = trade.inputAmount.currency.isNative
  const etherOut = trade.outputAmount.currency.isNative
  // the router does not support both ether in and out
  invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
  invariant(!('ttl' in options) || options.ttl > 0, 'TTL')

  const amountIn: string = toHex(Trade.maximumAmountIn(trade, options.allowedSlippage))
  const amountOut: string = toHex(Trade.minimumAmountOut(trade, options.allowedSlippage))

  const path: string[] = trade.route.path.map((token, index) => {
    if (
      // return the native address if input or output is native token
      (index === 0 && trade.inputAmount.currency.isNative) ||
      (index === trade.route.path.length - 1 && trade.outputAmount.currency.isNative)
    )
      return NATIVE_CURRENCY_ADDRESS
    return token.isToken ? token.address : NATIVE_CURRENCY_ADDRESS
  })
  let methodName: string
  let args: (string | string[])[]
  let value: string
  const flag: string[] = trade.route.pairs.map((pair) => {
    if (isStableSwapPair(pair)) return '0x0'
    return '0x1'
  })
  // singleHop
  if (path.length === 2) {
    methodName = 'swap'
    //     [srcToken,dstToken,amount,minReturn,flag]
    args = [path[0], path[1], amountIn, amountOut, flag[0]]
    value = etherIn ? amountIn : ZERO_HEX
  }
  // multiHop
  else {
    methodName = 'swapMulti'
    //     [tokens,amount,minReturn,flag]
    args = [path, amountIn, amountOut, flag]
    value = etherIn ? amountIn : ZERO_HEX
  }
  return {
    methodName,
    args,
    value,
  }
}
