import { memo, useCallback } from 'react'
import { Button } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

import { useAppDispatch } from 'state'
import { fetchCakeVaultUserData } from 'state/pools'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useVaultPoolContract } from 'hooks/useContract'
import { useWeb3React } from '@web3-react/core'
import { ToastDescriptionWithTx } from 'components/Toast'
import { vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'

const ConverToFlexibleButton = () => {
  const dispatch = useAppDispatch()

  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()

  const handleUnlock = useCallback(async () => {
    const callOptions = {
      gasLimit: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
    }

    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [account]
      return callWithGasPrice(vaultPoolContract, 'unlock', methodArgs, callOptions)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }, [t, toastSuccess, account, callWithGasPrice, dispatch, fetchWithCatchTxError, vaultPoolContract])

  return (
    <Button disabled={pendingTx} mb="8px" mx="4px" width="100%" onClick={() => handleUnlock()}>
      {pendingTx ? t('Converting...') : t('Convert to Flexible')}
    </Button>
  )
}

export default memo(ConverToFlexibleButton)
