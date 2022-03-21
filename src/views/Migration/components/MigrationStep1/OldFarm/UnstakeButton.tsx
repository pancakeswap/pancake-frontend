import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { useFarmUser } from 'state/farmsV1/hooks'
import useToast from 'hooks/useToast'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farmsV1'
import { getFullDisplayBalance } from 'utils/formatBalance'
import useUnstakeFarms from '../../../hook/V1/Farms/useUnstakeFarms'

export interface UnstakeButtonProps {
  pid: number
}

const UnstakeButton: React.FC<UnstakeButtonProps> = ({ pid }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { stakedBalance } = useFarmUser(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const dispatch = useAppDispatch()

  const isNeedUnstake = stakedBalance.gt(0)

  const handleUnstake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    const receipt = await fetchWithCatchTxError(() => {
      const balance = getFullDisplayBalance(stakedBalance)
      return onUnstake(balance)
    })

    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  return (
    <>
      {pendingTx ? (
        <Button
          width="138px"
          marginLeft="auto"
          isLoading={pendingTx}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          {t('Confirming')}
        </Button>
      ) : (
        <Button width="138px" marginLeft="auto" disabled={!isNeedUnstake} onClick={handleUnstake}>
          {isNeedUnstake ? t('Unstake All') : t('Unstaked')}
        </Button>
      )}
    </>
  )
}

export default UnstakeButton
