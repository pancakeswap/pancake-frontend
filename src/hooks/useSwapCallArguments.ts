import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType, Currency } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { BIPS_BASE } from 'config/constants/exchange'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { useRouterContract } from 'utils/exchange'
import useTransactionDeadline from './useTransactionDeadline'

interface SwapCall {
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
  trade: Trade<Currency, Currency, TradeType> | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId } = useActiveWeb3React()

  const recipient = recipientAddress === null ? account : recipientAddress
  const deadline = useTransactionDeadline()
  const contract = useRouterContract()

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId || !deadline) return []

    if (!contract) {
      return []
    }

    const swapMethods = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(JSBI.BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: deadline.toNumber(),
      }),
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
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
