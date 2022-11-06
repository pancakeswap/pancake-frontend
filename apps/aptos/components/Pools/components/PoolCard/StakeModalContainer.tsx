import { Pool, useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Coin } from '@pancakeswap/aptos-swap-sdk'
import { TransactionResponse } from '@pancakeswap/awgmi/dist/core'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

const StakeModalContainer = ({
  pool,
  isRemovingStake,
  onDismiss,
  stakingTokenBalance,
  stakingTokenPrice,
  onUnstake,
  onStake,
  onDone,
}: Pool.StakeModalPropsType<Coin> & {
  onDone: () => void
  onStake: (_amount: string) => Promise<TransactionResponse>
  onUnstake: (_amount: string) => Promise<TransactionResponse>
}) => {
  const { t } = useTranslation()
  const { account = '' } = useActiveWeb3React()

  const {
    earningToken,
    stakingToken,
    earningTokenPrice = 0,
    apr = 0,
    userData,
    stakingLimit = BIG_ZERO,
    enableEmergencyWithdraw = false,
  } = pool
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

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
      onDone,
      onDismiss,
      toastSuccess,
      t,
      earningToken?.symbol,
      stakingToken?.symbol,
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
      userDataStakedBalance={userData?.stakedBalance ? userData.stakedBalance : BIG_ZERO}
      userDataStakingTokenBalance={userData?.stakingTokenBalance ? userData.stakingTokenBalance : BIG_ZERO}
      onDismiss={onDismiss}
      pendingTx={pendingTx}
      account={account}
      handleConfirmClick={handleConfirmClick}
      isRemovingStake={isRemovingStake}
    />
  )
}

export default StakeModalContainer
