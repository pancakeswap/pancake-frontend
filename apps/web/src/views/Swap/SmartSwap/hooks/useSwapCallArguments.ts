import { getAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import {
  Currency,
  CurrencyAmount,
  JSBI,
  Percent,
  SwapParameters,
  Token,
  TradeOptions,
  TradeOptionsDeadline,
  TradeType,
} from '@pancakeswap/sdk'
import { Trade, TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { BIPS_BASE } from 'config/constants/exchange'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'
import warning from 'tiny-warning'
import { useSmartRouterContract } from '../utils/exchange'

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
    // TODO: parameter need to be fit the new contract
    swapMethods.push(
      swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber(),
      }),
    )

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

function validateAndParseAddress(address: string): string {
  try {
    const checksummedAddress = getAddress(address)
    warning(address === checksummedAddress, `${address} is not checksummed.`)
    return checksummedAddress
  } catch (error) {
    invariant(false, `${address} is not a valid address.`)
    return ''
  }
}

function swapCallParameters(
  trade: TradeWithStableSwap<Currency, Currency, TradeType>,
  options: TradeOptions | TradeOptionsDeadline,
): SwapParameters {
  const etherIn = trade.inputAmount.currency.isNative
  const etherOut = trade.outputAmount.currency.isNative
  // the router does not support both ether in and out
  invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
  invariant(!('ttl' in options) || options.ttl > 0, 'TTL')

  const to: string = validateAndParseAddress(options.recipient)
  const amountIn: string = toHex(Trade.maximumAmountIn(trade, options.allowedSlippage))
  const amountOut: string = toHex(Trade.minimumAmountOut(trade, options.allowedSlippage))
  const path: string[] = trade.route.path.map((token: Token) => token.address)
  const deadline =
    'ttl' in options
      ? `0x${(Math.floor(new Date().getTime() / 1000) + options.ttl).toString(16)}`
      : `0x${options.deadline.toString(16)}`

  const useFeeOnTransfer = Boolean(options.feeOnTransfer)

  let methodName: string
  let args: (string | string[])[]
  let value: string
  // eslint-disable-next-line default-case
  switch (trade.tradeType) {
    case TradeType.EXACT_INPUT:
      if (etherIn) {
        methodName = useFeeOnTransfer ? 'swapExactETHForTokensSupportingFeeOnTransferTokens' : 'swapExactETHForTokens'
        // (uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountOut, path, to, deadline]
        value = amountIn
      } else if (etherOut) {
        methodName = useFeeOnTransfer ? 'swapExactTokensForETHSupportingFeeOnTransferTokens' : 'swapExactTokensForETH'
        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountIn, amountOut, path, to, deadline]
        value = ZERO_HEX
      } else {
        methodName = useFeeOnTransfer
          ? 'swapExactTokensForTokensSupportingFeeOnTransferTokens'
          : 'swapExactTokensForTokens'
        // (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        args = [amountIn, amountOut, path, to, deadline]
        value = ZERO_HEX
      }
      break
    case TradeType.EXACT_OUTPUT:
      invariant(!useFeeOnTransfer, 'EXACT_OUT_FOT')
      if (etherIn) {
        methodName = 'swapETHForExactTokens'
        // (uint amountOut, address[] calldata path, address to, uint deadline)
        args = [amountOut, path, to, deadline]
        value = amountIn
      } else if (etherOut) {
        methodName = 'swapTokensForExactETH'
        // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        args = [amountOut, amountIn, path, to, deadline]
        value = ZERO_HEX
      } else {
        methodName = 'swapTokensForExactTokens'
        // (uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        args = [amountOut, amountIn, path, to, deadline]
        value = ZERO_HEX
      }
      break
  }
  return {
    methodName,
    args,
    value,
  }
}
