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
import { useNonBscFarmPendingTransaction, useTransactionAdder } from 'state/transactions/hooks'
import { FarmTransactionStatus, NonBscFarmStepType } from 'state/transactions/actions'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { ChainId } from '@pancakeswap/chains'
import { pickFarmTransactionTx } from 'state/global/actions'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import { useTransactionState } from 'state/transactions/reducer'

export interface UnstakeButtonProps {
  pid: number
  vaultPid?: number
  farm: FarmWithStakedValue
}

const UnstakeButton: React.FC<React.PropsWithChildren<UnstakeButtonProps>> = ({ pid, vaultPid, farm }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { toastSuccess } = useToast()
  const { lpAddress } = useFarmFromPid(pid)
  const { loading: pendingTx, fetchTxResponse, fetchWithCatchTxError } = useCatchTxError()
  const { stakedBalance, proxy } = useFarmUser(pid)
  const { onUnstake } = useUnstakeFarms(pid, vaultPid)
  const dispatch = useAppDispatch()
  const [, transactionDispatch] = useTransactionState()
  const { shouldUseProxyFarm, proxyAddress } = useContext(YieldBoosterStateContext)
  const isNeedUnstake = stakedBalance.gt(0) || proxy?.stakedBalance.gt(0)

  const [isLoading, setIsLoading] = React.useState(false)

  const lpContract = useERC20(lpAddress)
  const addTransaction = useTransactionAdder()

  const { onUnstake: onUnstakeProxyFarm, onDone } = useProxyStakedActions(pid, lpContract)

  const pendingFarm = useNonBscFarmPendingTransaction(lpAddress)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()

  // eslint-disable-next-line consistent-return
  const handleUnstake = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()

    if (vaultPid) {
      setIsLoading(true)

      const receipt = await fetchTxResponse(() => {
        const balance = getFullDisplayBalance(stakedBalance)
        return onUnstake(balance)
      })

      if (vaultPid) {
        if (receipt) {
          const amount = getFullDisplayBalance(stakedBalance)
          addTransaction(receipt, {
            type: 'non-bsc-farm',
            translatableSummary: {
              text: 'Unstake %amount% %lpSymbol% Token',
              data: { amount, lpSymbol: farm.lpSymbol },
            },
            nonBscFarm: {
              type: NonBscFarmStepType.UNSTAKE,
              status: FarmTransactionStatus.PENDING,
              amount,
              lpSymbol: farm.lpSymbol,
              lpAddress,
              steps: [
                {
                  step: 1,
                  chainId,
                  tx: receipt.hash,
                  status: FarmTransactionStatus.PENDING,
                },
                {
                  step: 2,
                  chainId: ChainId.BSC,
                  tx: '',
                  status: FarmTransactionStatus.PENDING,
                },
                {
                  step: 3,
                  chainId,
                  tx: '',
                  status: FarmTransactionStatus.PENDING,
                },
              ],
            },
          })

          transactionDispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
        }
      }

      const resp = await waitForTransaction({
        hash: receipt.hash,
        chainId,
      })

      setIsLoading(false)

      if (resp?.status === 'success') {
        toastSuccess(
          `${t('Unstaked')}!`,
          <ToastDescriptionWithTx txHash={resp.transactionHash}>
            {t('Your earnings have also been harvested to your wallet')}
          </ToastDescriptionWithTx>,
        )
        if (shouldUseProxyFarm) {
          onDone()
        }

        dispatch(fetchFarmUserDataAsync({ account, pids: [pid], proxyAddress, chainId }))
      }
    } else {
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
  }

  return (
    <>
      {pendingTx ? (
        <Button
          width="138px"
          marginLeft="auto"
          isLoading={pendingTx || isLoading}
          endIcon={<AutoRenewIcon spin color="currentColor" />}
        >
          {t('Confirming')}
        </Button>
      ) : (
        <Button
          width="138px"
          marginLeft="auto"
          disabled={!isNeedUnstake || pendingFarm.length > 0}
          onClick={handleUnstake}
        >
          {isNeedUnstake ? t('Unstake All') : t('Unstaked')}
        </Button>
      )}
    </>
  )
}

export default UnstakeButton
