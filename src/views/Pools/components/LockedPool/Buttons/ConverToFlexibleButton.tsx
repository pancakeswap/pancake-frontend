import { memo } from 'react'
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

const ConverToFlexibleButton = () => {
  // TODO: Remove duplication
  const dispatch = useAppDispatch()

  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()

  const handleUnlock = async () => {
    // TODO: Update proper gasLimit
    const callOptions = {
      gasLimit: 500000,
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
  }

  return (
    <Button disabled={pendingTx} mb="8px" mx="4px" width="100%" onClick={() => handleUnlock()}>
      {pendingTx ? t('Converting...') : t('Convert to Flexible')}
    </Button>
  )
}

export default memo(ConverToFlexibleButton)
