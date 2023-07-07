import { Currency, SwapParameters, TradeType } from '@pancakeswap/sdk'
import { toHex } from '@pancakeswap/v3-sdk'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { MM_SIGNER, NATIVE_CURRENCY_ADDRESS } from '../constants'
import { RFQResponse, TradeWithMM } from '../types'
import { useMMSwapContract } from '../utils/exchange'

export interface SwapCall {
  contract: ReturnType<typeof useMMSwapContract>
  parameters: SwapParameters
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
  trade: TradeWithMM<Currency, Currency, TradeType> | null, // trade to execute, required
  rfq: RFQResponse['message'],
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId } = useAccountActiveChain()

  const recipient = recipientAddress ?? account
  const deadline = useTransactionDeadline()
  const contract = useMMSwapContract()
  const mmSigner = MM_SIGNER?.[chainId]?.[rfq?.mmId] ?? ''

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId || !deadline || !mmSigner || !rfq) return []

    if (!contract) {
      return []
    }
    const swapMethods = []

    swapMethods.push(swapCallParameters(mmSigner, trade, rfq, recipient))

    return swapMethods.map((parameters) => ({ parameters, contract }))
  }, [account, chainId, contract, deadline, recipient, trade, rfq, mmSigner])
}

function swapCallParameters(
  mmSigner: string,
  trade: TradeWithMM<Currency, Currency, TradeType>,
  rfq: RFQResponse['message'],
  recipient: string,
): SwapParameters {
  const etherIn = trade.inputAmount.currency.isNative
  const etherOut = trade.outputAmount.currency.isNative
  // the router does not support both ether in and out
  invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
  invariant(rfq, 'RFQ_REQUIRED')
  invariant(rfq.trader !== NATIVE_CURRENCY_ADDRESS, 'RFQ_REQUIRED')

  const methodName = 'swap'
  const args = [
    mmSigner,
    {
      nonce: rfq?.nonce,
      user: recipient,
      baseToken: rfq?.takerSideToken,
      quoteToken: rfq?.makerSideToken,
      baseTokenAmount: rfq?.takerSideTokenAmount,
      quoteTokenAmount: rfq?.makerSideTokenAmount,
      expiryTimestamp: rfq?.quoteExpiry.toString(),
    },
    rfq.signature,
  ]
  let value: string | undefined

  if (etherIn) {
    value = rfq.takerSideTokenAmount
  }

  return {
    methodName,
    // @ts-ignore
    args,
    value: value ? toHex(value) : undefined,
  }
}
