import { SwapParameters, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { toHex } from '@pancakeswap/v3-sdk'
import { mmLinkedPoolABI } from 'config/abi/mmLinkedPool'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useGetENSAddressByName } from 'hooks/useGetENSAddressByName'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useMemo } from 'react'
import invariant from 'tiny-invariant'
import { safeGetAddress } from 'utils'
import { Address, Hex, encodeFunctionData } from 'viem'
import { MM_SIGNER, NATIVE_CURRENCY_ADDRESS } from '../constants'
import { RFQResponse } from '../types'
import { useMMSwapContract } from '../utils/exchange'

export interface SwapCall {
  contract: ReturnType<typeof useMMSwapContract>
  parameters: SwapParameters
}

export type MMSwapCall = {
  address: Address
  calldata: Hex
  value: Hex
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export const useSwapCallArguments = (
  trade: SmartRouterTrade<TradeType> | null | undefined, // trade to execute, required
  rfq: RFQResponse['message'] | undefined,
  recipientAddressOrName: string | undefined, // the address of the recipient of the trade, or null if swap should be returned to sender
): MMSwapCall[] => {
  const { account, chainId } = useAccountActiveChain()
  const recipientENSAddress = useGetENSAddressByName(recipientAddressOrName ?? undefined)
  const recipient: Address | undefined = useMemo(() => {
    if (!recipientAddressOrName || !recipientENSAddress) return account
    return safeGetAddress(recipientAddressOrName) ?? safeGetAddress(recipientENSAddress) ?? undefined
  }, [account, recipientAddressOrName, recipientENSAddress])
  const deadline = useTransactionDeadline()
  const contract = useMMSwapContract()
  const mmSigner = chainId && rfq?.mmId ? MM_SIGNER?.[chainId]?.[rfq?.mmId] ?? '' : ''

  return useMemo(() => {
    if (!trade || !recipient || !account || !chainId || !rfq || !contract || !deadline || !mmSigner) return []

    const { calldata, value } = swapCallParameters(mmSigner, trade, rfq, recipient)
    return [
      {
        address: contract.address,
        calldata,
        value,
      },
    ]
  }, [account, chainId, contract, deadline, mmSigner, recipient, rfq, trade])
}

const swapCallParameters = (
  mmSigner: Address,
  trade: SmartRouterTrade<TradeType>,
  rfq: RFQResponse['message'],
  recipient: Address,
) => {
  const etherIn = trade.inputAmount.currency.isNative
  const etherOut = trade.outputAmount.currency.isNative
  // the router does not support both ether in and out
  invariant(!(etherIn && etherOut), 'ETHER_IN_OUT')
  invariant(rfq, 'RFQ_REQUIRED')
  invariant(rfq.trader !== NATIVE_CURRENCY_ADDRESS, 'RFQ_REQUIRED')

  const calldata = encodeFunctionData({
    abi: mmLinkedPoolABI,
    functionName: 'swap',
    args: [
      mmSigner,
      {
        nonce: BigInt(rfq.nonce),
        user: recipient,
        baseToken: rfq.takerSideToken as Address,
        quoteToken: rfq.makerSideToken as Address,
        baseTokenAmount: BigInt(rfq.takerSideTokenAmount),
        quoteTokenAmount: BigInt(rfq.makerSideTokenAmount),
        expiryTimestamp: BigInt(rfq.quoteExpiry),
      },
      rfq.signature as Hex,
    ],
  })

  const value = etherIn ? toHex(rfq.takerSideTokenAmount) : toHex(0)

  return {
    calldata,
    value,
  }
}
