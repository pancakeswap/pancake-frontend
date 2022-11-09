import { Pool, useToast } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import { updateUserBalance, updateUserPendingReward, updateUserStakedBalance } from 'state/pools'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { Token } from '@pancakeswap/sdk'

import useStakePool from '../../hooks/useStakePool'
import useUnstakePool from '../../hooks/useUnstakePool'

const StakeModalContainer = ({
  isBnbPool,
  pool,
  isRemovingStake,
  onDismiss,
  stakingTokenBalance,
  stakingTokenPrice,
}: Pool.StakeModalPropsType<Token>) => {
  const { t } = useTranslation()

  const {
    sousId,
    earningToken,
    stakingToken,
    earningTokenPrice,
    apr,
    userData,
    stakingLimit,
    enableEmergencyWithdraw,
  } = pool
  const { address: account } = useAccount()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onUnstake } = useUnstakePool(sousId, enableEmergencyWithdraw)
  const { onStake } = useStakePool(sousId, isBnbPool)
  const dispatch = useAppDispatch()

  const onDone = useCallback(() => {
    dispatch(updateUserStakedBalance({ sousId, account }))
    dispatch(updateUserPendingReward({ sousId, account }))
    dispatch(updateUserBalance({ sousId, account }))
  }, [dispatch, sousId, account])

  const handleConfirmClick = useCallback(
    async (stakeAmount: string) => {
      const receipt = await fetchWithCatchTxError(() => {
        if (isRemovingStake) {
          return onUnstake(stakeAmount, stakingToken.decimals)
        }
        return onStake(stakeAmount, stakingToken.decimals)
      })
      if (receipt?.status) {
        if (isRemovingStake) {
          toastSuccess(
            `${t('Unstaked')}!`,
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('Your %symbol% earnings have also been harvested to your wallet!', {
                symbol: earningToken.symbol,
              })}
            </ToastDescriptionWithTx>,
          )
        } else {
          toastSuccess(
            `${t('Staked')}!`,
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('Your %symbol% funds have been staked in the pool!', {
                symbol: stakingToken.symbol,
              })}
            </ToastDescriptionWithTx>,
          )
        }

        if (onDone) onDone()

        onDismiss?.()
      }
    },
    [
      fetchWithCatchTxError,
      isRemovingStake,
      onStake,
      stakingToken.decimals,
      stakingToken.symbol,
      onUnstake,
      onDone,
      onDismiss,
      toastSuccess,
      t,
      earningToken.symbol,
    ],
  )

  return (
    <Pool.StakeModal
      enableEmergencyWithdraw={enableEmergencyWithdraw}
      stakingLimit={stakingLimit}
      stakingTokenPrice={stakingTokenPrice}
      earningTokenPrice={earningTokenPrice}
      stakingTokenDecimals={stakingToken.decimals}
      earningTokenSymbol={earningToken.symbol}
      stakingTokenSymbol={stakingToken.symbol}
      stakingTokenAddress={stakingToken.address}
      stakingTokenBalance={stakingTokenBalance}
      apr={apr}
      userDataStakedBalance={userData.stakedBalance}
      userDataStakingTokenBalance={userData.stakingTokenBalance}
      onDismiss={onDismiss}
      pendingTx={pendingTx}
      account={account}
      handleConfirmClick={handleConfirmClick}
      isRemovingStake={isRemovingStake}
    />
  )
}

export default StakeModalContainer
