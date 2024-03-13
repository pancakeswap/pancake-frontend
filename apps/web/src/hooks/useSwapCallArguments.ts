import { Currency, Percent, Router, SwapParameters, Trade, TradeType } from '@pancakeswap/sdk'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { BIPS_BASE } from 'config/constants/exchange'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useMemo } from 'react'
import { useRouterContract } from 'utils/exchange'
import { useTransactionDeadline } from './useTransactionDeadline'

export interface SwapCall {
  contract: ReturnType<typeof useRouterContract>
  parameters: SwapParameters
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
  trade: Trade<Currency, Currency, TradeType> | undefined | null, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId } = useAccountActiveChain()

  const recipient = recipientAddress === null ? account : recipientAddress
  const [deadline] = useTransactionDeadline()
  const contract = useRouterContract()

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId || !deadline) return []

    if (!contract) {
      return []
    }

    const swapMethods: SwapParameters[] = []

    swapMethods.push(
      Router.swapCallParameters(trade, {
        feeOnTransfer: false,
        allowedSlippage: new Percent(BigInt(allowedSlippage), BIPS_BASE),
        recipient,
        deadline: Number(deadline),
      }),
    )

    if (trade.tradeType === TradeType.EXACT_INPUT) {
      swapMethods.push(
        Router.swapCallParameters(trade, {
          feeOnTransfer: true,
          allowedSlippage: new Percent(BigInt(allowedSlippage), BIPS_BASE),
          recipient,
          deadline: Number(deadline),
        }),
      )
    }

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, allowedSlippage, chainId, contract, deadline, recipient, trade])
}
