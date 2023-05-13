/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChainId, Percent, TradeType } from '@pancakeswap/sdk'
import { SWAP_ROUTER_ADDRESSES, SmartRouterTrade, SwapRouter } from '@pancakeswap/smart-router/evm'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import { isAddress } from 'utils'
import { useEnsAddress } from 'wagmi'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'

interface SwapCall {
  address: string
  calldata: string
  value: string
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
  // signatureData: SignatureData | null | undefined,
  deadline: BigNumber | undefined,
  feeOptions: FeeOptions | undefined,
): SwapCall[] {
  const { account, chainId } = useActiveWeb3React()
  const provider = useProviderOrSigner()

  const { data: recipientENSAddress } = useEnsAddress({
    name: recipientAddress,
    chainId,
    enabled: chainId !== ChainId.BSC && chainId !== ChainId.BSC_TESTNET,
  })
  const recipient =
    recipientAddress === null
      ? account
      : isAddress(recipientAddress)
      ? recipientAddress
      : isAddress(recipientENSAddress)
      ? recipientENSAddress
      : null

  return useMemo(() => {
    if (!trade || !recipient || !provider || !account || !chainId) return []

    const swapRouterAddress = chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined
    if (!swapRouterAddress) return []

    const { value, calldata } = SwapRouter.swapCallParameters(trade, {
      fee: feeOptions,
      recipient,
      slippageTolerance: allowedSlippage,
      // ...(signatureData
      //   ? {
      //       inputTokenPermit:
      //         'allowed' in signatureData
      //           ? {
      //               expiry: signatureData.deadline,
      //               nonce: signatureData.nonce,
      //               s: signatureData.s,
      //               r: signatureData.r,
      //               v: signatureData.v as any,
      //             }
      //           : {
      //               deadline: signatureData.deadline,
      //               amount: signatureData.amount,
      //               s: signatureData.s,
      //               r: signatureData.r,
      //               v: signatureData.v as any,
      //             },
      //     }
      //   : {}),

      deadlineOrPreviousBlockhash: deadline?.toString(),
    })

    // if (argentWalletContract && trade.inputAmount.currency.isToken) {
    //   return [
    //     {
    //       address: argentWalletContract.address,
    //       calldata: argentWalletContract.interface.encodeFunctionData('wc_multiCall', [
    //         [
    //           approveAmountCalldata(trade.maximumAmountIn(allowedSlippage), swapRouterAddress),
    //           {
    //             to: swapRouterAddress,
    //             value,
    //             data: calldata,
    //           },
    //         ],
    //       ]),
    //       value: '0x0',
    //     },
    //   ]
    // }
    return [
      {
        address: swapRouterAddress,
        calldata,
        value,
      },
    ]
  }, [
    account,
    allowedSlippage,
    // argentWalletContract,
    chainId,
    deadline,
    feeOptions,
    provider,
    recipient,
    // signatureData,
    trade,
  ])
}
