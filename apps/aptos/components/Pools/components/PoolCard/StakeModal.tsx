import { Pool, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Coin } from '@pancakeswap/aptos-swap-sdk'

import useStakePool from '../../hooks/useStakePool'
import useUnstakePool from '../../hooks/useUnstakePool'

const StakeModalContainer = ({
  pool,
  isRemovingStake,
  onDismiss,
  stakingTokenBalance,
  stakingTokenPrice,
}: Pool.StakeModalPropsType<Coin>) => {
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
  const { account } = useActiveWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onUnstake } = useUnstakePool({
    sousId,
    earningTokenAddress: earningToken?.address,
    stakingTokenAddress: stakingToken?.address,
    stakingTokenDecimals: stakingToken?.decimals,
  })
  const { onStake } = useStakePool({
    sousId,
    earningTokenAddress: earningToken?.address,
    stakingTokenAddress: stakingToken?.address,
    stakingTokenDecimals: stakingToken?.decimals,
  })
  // const dispatch = useAppDispatch()

  const onDone = useCallback(() => {
    // dispatch(updateUserStakedBalance({ sousId, account }))
    // dispatch(updateUserPendingReward({ sousId, account }))
    // dispatch(updateUserBalance({ sousId, account }))
  }, [])

  const handleConfirmClick = useCallback(
    async (stakeAmount: string) => {
      const receipt = await fetchWithCatchTxError(() => {
        if (isRemovingStake) {
          return onUnstake(stakeAmount)
        }
        return onStake(stakeAmount)
      })

      if (receipt?.status) {
        if (isRemovingStake) {
          toastSuccess(
            `${t('Unstaked')}!`,
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('Your %symbol% earnings have also been harvested to your wallet!', {
                symbol: earningToken?.symbol,
              })}
            </ToastDescriptionWithTx>,
          )
        } else {
          toastSuccess(
            `${t('Staked')}!`,
            <ToastDescriptionWithTx txHash={receipt.transactionHash}>
              {t('Your %symbol% funds have been staked in the pool!', {
                symbol: stakingToken?.symbol,
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
      onUnstake,
      stakingToken.decimals,
      stakingToken.symbol,
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
