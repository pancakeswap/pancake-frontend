import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import React, { useContext } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import useUnstakeFarms from 'views/Farms/hooks/useUnstakeFarms'
import { useERC20 } from 'hooks/useContract'
import useProxyStakedActions from 'views/Farms/components/YieldBooster/hooks/useProxyStakedActions'
import { YieldBoosterStateContext } from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import { useActiveChainId } from 'hooks/useActiveChainId'

export interface UnstakeButtonProps {
  pid: number
}

const UnstakeButton: React.FC<React.PropsWithChildren<UnstakeButtonProps>> = ({ pid }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { toastSuccess } = useToast()
  const { lpAddress } = useFarmFromPid(pid)
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { stakedBalance, proxy } = useFarmUser(pid)
  const { onUnstake } = useUnstakeFarms(pid)
  const dispatch = useAppDispatch()
  const { shouldUseProxyFarm, proxyAddress } = useContext(YieldBoosterStateContext)
  const isNeedUnstake = stakedBalance.gt(0) || proxy?.stakedBalance.gt(0)

  const lpContract = useERC20(lpAddress)

  const { onUnstake: onUnstakeProxyFarm, onDone } = useProxyStakedActions(pid, lpContract)

  const handleUnstake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    const receipt = await fetchWithCatchTxError(() => {
      if (shouldUseProxyFarm) {
        const balance = getFullDisplayBalance(proxy?.stakedBalance)
        return onUnstakeProxyFarm(balance)
      }
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
      if (shouldUseProxyFarm) {
        onDone()
      }
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], proxyAddress, chainId }))
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
