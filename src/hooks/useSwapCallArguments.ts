import { MaxUint256 } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'
import { JSBI, Percent, Router, SwapParameters, Trade, TradeType, Token, TokenAmount } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { ApprovalState, useApproveCallbackFromTrade } from './useApproveCallback'
import { BIPS_BASE, INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { getRouterContract } from '../utils'
import { useTokenContract } from './useContract'
import useTransactionDeadline from './useTransactionDeadline'
import useIsAmbireWC from './useIsAmbireWC'

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
  skipGasEstimation?: boolean
  extra?: any
}

/**
 * Returns the swap calls that can be used to make the trade
 * @param trade trade to execute
 * @param allowedSlippage user allowed slippage
 * @param recipientAddressOrName
 */
export function useSwapCallArguments(
  trade: Trade | undefined, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
): SwapCall[] {
  const { account, chainId, library } = useActiveWeb3React()

  const recipient = recipientAddress === null ? account : recipientAddress
  const deadline = useTransactionDeadline()

  const [approvalState] = useApproveCallbackFromTrade(trade, allowedSlippage)

  const token = trade?.inputAmount.currency as Token
  const tokenContract = useTokenContract(token?.address)

  const isAmbireWC = useIsAmbireWC()

  return useMemo(() => {
    if (!trade || !recipient || !library || !account || !chainId || !deadline) return []

    const contract = getRouterContract(chainId, library, account)
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

    return swapMethods.map((parameters) => {
      const isToken = trade.inputAmount instanceof TokenAmount

      if (isAmbireWC && isToken && approvalState === ApprovalState.NOT_APPROVED) {
        const approveData = tokenContract?.interface?.encodeFunctionData('approve', [contract.address, MaxUint256])

        const swapData = contract.interface.encodeFunctionData(parameters.methodName, parameters.args)

        return {
          parameters,
          contract,
          skipGasEstimation: true,
          extra: [
            {
              to: tokenContract.address,
              data: approveData,
            },
            {
              to: contract.address,
              data: swapData,
            },
          ],
        }
      }

      return { parameters, contract }
    })
  }, [account, allowedSlippage, approvalState, chainId, deadline, isAmbireWC, library, recipient, tokenContract, trade])
}
