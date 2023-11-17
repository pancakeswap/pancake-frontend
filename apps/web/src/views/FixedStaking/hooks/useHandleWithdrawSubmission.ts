import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useFixedStakingContract } from 'hooks/useContract'
import { createElement, useCallback, useMemo } from 'react'
import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { useContractRead } from 'wagmi'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

import { getBep20Contract } from 'utils/contractHelpers'

import { UnstakeType } from '../type'

export function useHandleWithdrawSubmission({
  poolIndex,
  stakingToken,
  onSuccess,
}: {
  poolIndex: number
  stakingToken: Currency
  onSuccess?: () => void
}) {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const fixedStakingContract = useFixedStakingContract()
  const { chainId } = useAccountActiveChain()

  const tokenContract = getBep20Contract(stakingToken.wrapped.address)

  const { data } = useContractRead({
    chainId,
    ...tokenContract,
    enabled: Boolean(fixedStakingContract.address),
    functionName: 'balanceOf',
    args: [fixedStakingContract.address],
  })

  const stakingTokenBalanceInPool = CurrencyAmount.fromRawAmount(stakingToken, data || '0')

  const handleSubmission = useCallback(
    async (type: UnstakeType, totalGetAmount: CurrencyAmount<Currency>) => {
      const receipt = await fetchWithCatchTxError(() => {
        const methodArgs = [poolIndex]

        return callWithGasPrice(fixedStakingContract, type, methodArgs)
      })

      if (receipt?.status) {
        const msg = totalGetAmount.greaterThan(stakingTokenBalanceInPool)
          ? t(
              'Your action has been requested and we are processing the funds. Please check back in a couple of hours to request withdrawal of funds.',
            )
          : type === UnstakeType.HARVEST
          ? t('Your harvest request has been submitted.')
          : t('Your funds have been restaked in the pool')

        const successComp = createElement(ToastDescriptionWithTx, { txHash: receipt.transactionHash }, msg)

        toastSuccess(t('Successfully submitted!'), successComp)

        if (onSuccess) onSuccess()
      }
    },
    [
      callWithGasPrice,
      fetchWithCatchTxError,
      fixedStakingContract,
      onSuccess,
      poolIndex,
      stakingTokenBalanceInPool,
      t,
      toastSuccess,
    ],
  )

  return useMemo(
    () => ({
      handleSubmission,
      pendingTx,
    }),
    [handleSubmission, pendingTx],
  )
}
