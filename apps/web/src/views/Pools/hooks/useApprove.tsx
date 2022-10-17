import { useCallback } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Contract } from '@ethersproject/contracts'
import { MaxUint256 } from '@ethersproject/constants'
import { useAppDispatch } from 'state'
import { updateUserAllowance } from 'state/actions'
import { VaultKey } from 'state/types'
import { useTranslation } from '@pancakeswap/localization'
import { useSousChef, useVaultPoolContract } from 'hooks/useContract'
import { useToast } from '@pancakeswap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCakeApprovalStatus from 'hooks/useCakeApprovalStatus'
import useCakeApprove from 'hooks/useCakeApprove'

export const useApprovePool = (lpContract: Contract, sousId, earningTokenSymbol) => {
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const sousChefContract = useSousChef(sousId)

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(lpContract, 'approve', [sousChefContract.address, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You can now stake in the %symbol% pool!', { symbol: earningTokenSymbol })}
        </ToastDescriptionWithTx>,
      )
      dispatch(updateUserAllowance({ sousId, account }))
    }
  }, [
    account,
    dispatch,
    lpContract,
    sousChefContract,
    sousId,
    earningTokenSymbol,
    t,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  return { handleApprove, pendingTx }
}

// Approve CAKE auto pool
export const useVaultApprove = (vaultKey: VaultKey, setLastUpdated: () => void) => {
  const vaultPoolContract = useVaultPoolContract(vaultKey)
  const { t } = useTranslation()

  return useCakeApprove(
    setLastUpdated,
    vaultPoolContract?.address,
    t('You can now stake in the %symbol% vault!', { symbol: 'CAKE' }),
  )
}

export const useCheckVaultApprovalStatus = (vaultKey: VaultKey) => {
  const vaultPoolContract = useVaultPoolContract(vaultKey)

  return useCakeApprovalStatus(vaultPoolContract?.address)
}
