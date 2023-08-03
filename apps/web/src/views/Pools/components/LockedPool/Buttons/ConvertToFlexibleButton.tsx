import { useTranslation } from '@pancakeswap/localization'
import { Button, ButtonProps, useToast } from '@pancakeswap/uikit'
import { memo, useCallback } from 'react'

import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { vaultPoolConfig } from 'config/constants/pools'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { useVaultPoolContract } from 'hooks/useContract'
import { useAppDispatch } from 'state'
import { fetchCakeVaultUserData } from 'state/pools'
import { VaultKey } from 'state/types'
import { useSWRConfig } from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'

const ConvertToFlexibleButton: React.FC<React.PropsWithChildren<ButtonProps>> = (props) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  const { address: account } = useAccount()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaultPoolContract = useVaultPoolContract(VaultKey.CakeVault)
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { toastSuccess } = useToast()

  const handleUnlock = useCallback(async () => {
    const callOptions = {
      gas: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
    }

    const receipt = await fetchWithCatchTxError(() => {
      const methodArgs = [account] as const
      return callWithGasPrice(vaultPoolContract, 'unlock', methodArgs, callOptions)
    })

    if (receipt?.status) {
      toastSuccess(
        t('Staked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your funds have been staked in the pool')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchCakeVaultUserData({ account, chainId }))
      mutate(['userCakeLockStatus', account])
    }
  }, [t, toastSuccess, account, callWithGasPrice, dispatch, fetchWithCatchTxError, vaultPoolContract, mutate, chainId])

  return (
    <Button width="100%" disabled={pendingTx} onClick={handleUnlock} variant="secondary" {...props}>
      {pendingTx ? t('Converting...') : t('Convert to Flexible')}
    </Button>
  )
}

export default memo(ConvertToFlexibleButton)
