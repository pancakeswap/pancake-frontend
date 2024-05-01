import { useTranslation } from '@pancakeswap/localization'
import { FeeOptions } from '@pancakeswap/v3-sdk'
import { useMemo } from 'react'

import { useUserSlippage } from '@pancakeswap/utils/user'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { useSwapState } from 'state/swap/hooks'
import { basisPointsToPercent } from 'utils/exchange'

import { ClassicOrder } from '@pancakeswap/price-api-sdk'
import { Permit2Signature } from '@pancakeswap/universal-router-sdk'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { Address } from 'viem'
import useSendSwapTransaction from './useSendSwapTransaction'
import { useSwapCallArguments } from './useSwapCallArguments'
import type { TWallchainMasterInput, WallchainStatus } from './useWallchain'

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
  REVERTED,
}

interface UseSwapCallbackReturns {
  state: SwapCallbackState
  callback?: () => Promise<{ hash: Address }>
  error?: string
  reason?: string
}

interface UseSwapCallbackArgs {
  trade: ClassicOrder['trade'] | undefined | null // trade to execute, required
  deadline?: bigint
  permitSignature: Permit2Signature | undefined
  feeOptions?: FeeOptions
  onWallchainDrop?: () => void
  statusWallchain?: WallchainStatus
  wallchainMasterInput?: TWallchainMasterInput
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback({
  trade,
  deadline,
  permitSignature,
  feeOptions,
}: UseSwapCallbackArgs): UseSwapCallbackReturns {
  const { t } = useTranslation()
  const { account, chainId } = useAccountActiveChain()
  const [allowedSlippageRaw] = useUserSlippage() || [INITIAL_ALLOWED_SLIPPAGE]
  const { recipient: recipientAddress } = useSwapState()
  const recipient = recipientAddress === null ? account : recipientAddress

  const swapCalls = useSwapCallArguments(
    trade,
    basisPointsToPercent(allowedSlippageRaw),
    recipientAddress,
    permitSignature,
    deadline,
    feeOptions,
  )

  const { callback } = useSendSwapTransaction(account, chainId, trade ?? undefined, swapCalls, 'UniversalRouter')

  return useMemo(() => {
    if (!trade || !account || !chainId || !callback) {
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
      callback,
    }
  }, [trade, account, chainId, callback, recipient, recipientAddress, t])
}
