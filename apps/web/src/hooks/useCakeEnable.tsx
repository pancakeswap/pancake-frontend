import { ChainId } from '@pancakeswap/chains'
import { Native } from '@pancakeswap/sdk'
import { CAKE } from '@pancakeswap/tokens'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import BigNumber from 'bignumber.js'
import { INITIAL_ALLOWED_SLIPPAGE } from 'config/constants'
import { useTradeExactOut } from 'hooks/Trades'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { useSwapCallArguments } from 'hooks/useSwapCallArguments'
import { useSwapCallback } from 'hooks/useSwapCallback'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'state'
import { updateUserBalance } from 'state/pools'
import { useIsTransactionPending } from 'state/transactions/hooks'

export const useCakeEnable = (enableAmount: BigNumber) => {
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()
  const [pendingEnableTx, setPendingEnableTx] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string>()
  const isTransactionPending = useIsTransactionPending(transactionHash)
  const swapAmount = useMemo(() => getFullDisplayBalance(enableAmount), [enableAmount])

  const parsedAmount = tryParseAmount(swapAmount, chainId ? CAKE[chainId] : undefined)

  const trade = useTradeExactOut(Native.onChain(ChainId.BSC), parsedAmount)

  const swapCalls = useSwapCallArguments(trade, INITIAL_ALLOWED_SLIPPAGE, null)

  const { callback: swapCallback } = useSwapCallback(trade, INITIAL_ALLOWED_SLIPPAGE, null, swapCalls)

  useEffect(() => {
    if (pendingEnableTx && transactionHash && !isTransactionPending && account && chainId) {
      dispatch(updateUserBalance({ sousId: 0, account, chainId }))
      setPendingEnableTx(isTransactionPending)
    }
  }, [account, dispatch, transactionHash, pendingEnableTx, isTransactionPending, chainId])

  const handleEnable = useCallback(() => {
    if (!swapCallback) {
      return
    }
    setPendingEnableTx(true)
    swapCallback()
      .then((hash) => {
        setTransactionHash(hash)
      })
      .catch(() => {
        setPendingEnableTx(false)
      })
  }, [swapCallback])

  return { handleEnable, pendingEnableTx }
}
