// eslint-disable-next-line no-restricted-imports
import { BigNumber } from '@ethersproject/bignumber'
import type { TransactionResponse } from '@ethersproject/providers'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { TradeType } from '@pancakeswap/sdk'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { useTranslation } from '@pancakeswap/localization'
import { ReactNode, useMemo } from 'react'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useSwapState } from 'state/swap/hooks'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { basisPointsToPercent } from 'utils/exchange'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'

import useSendSwapTransaction from './useSendSwapTransaction'
import { useSwapCallArguments } from './useSwapCallArguments'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface UseSwapCallbackReturns {
  state: SwapCallbackState
  callback?: () => Promise<TransactionResponse>
  error?: ReactNode
}
interface UseSwapCallbackArgs {
  trade: SmartRouterTrade<TradeType> | undefined | null // trade to execute, required
  // allowedSlippage: Percent // in bips
  // recipientAddressOrName: string | null | undefined // the ENS name or address of the recipient of the trade, or null if swap should be returned to sender
  // signatureData: SignatureData | null | undefined
  deadline?: BigNumber
  feeOptions?: FeeOptions
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback({
  trade,
  // signatureData,
  deadline,
  feeOptions,
}: UseSwapCallbackArgs): UseSwapCallbackReturns {
  const { t } = useTranslation()
  const { account, chainId } = useActiveWeb3React()
  const provider = useProviderOrSigner()
  const [allowedSlippageRaw] = useUserSlippage() || [INITIAL_ALLOWED_SLIPPAGE]
  const allowedSlippage = useMemo(() => basisPointsToPercent(allowedSlippageRaw), [allowedSlippageRaw])
  const { recipient: recipientAddress } = useSwapState()
  const recipient = recipientAddress === null ? account : recipientAddress

  const swapCalls = useSwapCallArguments(
    trade,
    allowedSlippage,
    recipientAddress,
    // signatureData,
    deadline,
    feeOptions,
  )
  const { callback } = useSendSwapTransaction(account, chainId, provider, trade, swapCalls)

  return useMemo(() => {
    if (!trade || !provider || !account || !chainId || !callback) {
      return { state: SwapCallbackState.INVALID, error: t('Missing dependencies') }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: SwapCallbackState.INVALID, error: t('Invalid recipient') }
      }
      return { state: SwapCallbackState.LOADING }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async () => callback(),
    }
  }, [trade, account, chainId, callback, recipient, recipientAddress, provider, t])
}
