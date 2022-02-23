import React from 'react'
import { useTranslation } from 'contexts/Localization'
import { Button } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useAppDispatch } from 'state'
import { DeserializedPool } from 'state/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import useToast from 'hooks/useToast'
import { useWeb3React } from '@web3-react/core'
import { useVaultPoolContract } from 'hooks/useContract'
import { vaultPoolConfig } from 'config/constants/pools'
import {
  fetchCakeVaultUserData,
  updateUserBalance,
  updateUserPendingReward,
  updateUserStakedBalance,
} from 'state/pools'
import useUnstakePool from 'views/Pools/hooks/useUnstakePool'
import { getFullDisplayBalance } from 'utils/formatBalance'

export interface UnstakeButtonProps {
  pool: DeserializedPool
}

const UnstakeButton: React.FC<UnstakeButtonProps> = ({ pool }) => {
  const { sousId, stakingToken, earningToken, userData, vaultKey } = pool
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { toastSuccess } = useToast()

  const vaultPoolContract = useVaultPoolContract(pool.vaultKey)
  const { onUnstake } = useUnstakePool(sousId, pool.enableEmergencyWithdraw)

  const isNeedUnstake = new BigNumber(userData.stakedBalance).gt(0)

  const handleUnstake = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    if (vaultKey) {
      onPresentVaultUnstake()
    } else {
      onPresentUnstake()
    }
  }

  const onPresentVaultUnstake = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(vaultPoolContract, 'withdrawAll', undefined, {
        gasLimit: vaultPoolConfig[pool.vaultKey].gasLimit,
      })
    })

    if (receipt?.status) {
      toastSuccess(
        t('Unstaked!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchCakeVaultUserData({ account }))
    }
  }

  const onPresentUnstake = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      const stakedAmount = getFullDisplayBalance(userData.stakedBalance, stakingToken.decimals, stakingToken.decimals)
      return onUnstake(stakedAmount, stakingToken.decimals)
    })

    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% earnings have also been harvested to your wallet!', {
            symbol: earningToken.symbol,
          })}
        </ToastDescriptionWithTx>,
      )
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
      dispatch(updateUserBalance(sousId, account))
    }
  }

  return (
    <Button width="138px" marginLeft="auto" isLoading={pendingTx} disabled={!isNeedUnstake} onClick={handleUnstake}>
      {isNeedUnstake ? t('Unstake All') : t('Unstaked')}
    </Button>
  )
}

export default UnstakeButton
