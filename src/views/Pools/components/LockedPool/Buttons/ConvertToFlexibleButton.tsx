import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps, useToast } from '@pancakeswap/uikit'
import { memo, useCallback } from 'react'

import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { vaultPoolConfig } from 'config/constants/pools'
import { useCallWithMarketGasPrice } from 'hooks/useCallWithMarketGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVaultPoolContract } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchCakeVaultUserData } from 'state/pools'
import { VaultKey } from 'state/types'

const ConvertToFlexibleButton: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
  const dispatch = useAppDispatch()

  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(VaultKey.CakeVault)
  const { callWithMarketGasPrice } = useCallWithMarketGasPrice()
  const { t } = useTranslation()
  const { toastSuccess } = useToast()

  const handleUnlock = useCallback(async () => {
    const callOptions = {
      gasLimit: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
    }

    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [account]
      return callWithMarketGasPrice(vaultPoolContract, 'unlock', methodArgs, callOptions)
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
  }, [t, toastSuccess, account, callWithMarketGasPrice, dispatch, fetchWithCatchTxError, vaultPoolContract])

  return (
    <Button width="100%" disabled={pendingTx} onClick={handleUnlock} variant="secondary" {...props}>
      {pendingTx ? t('Converting...') : t('Convert to Flexible')}
    </Button>
  )
}

export default memo(ConvertToFlexibleButton)
