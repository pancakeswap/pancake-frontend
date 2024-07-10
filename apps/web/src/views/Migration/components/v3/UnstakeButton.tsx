import { ChainId } from '@pancakeswap/chains'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, useToast } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { useERC20 } from 'hooks/useContract'
import { usePublicNodeWaitForTransaction } from 'hooks/usePublicNodeWaitForTransaction'
import React, { useContext } from 'react'
import { useAppDispatch } from 'state'
import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'
import { pickFarmTransactionTx } from 'state/global/actions'
import { FarmTransactionStatus, CrossChainFarmStepType } from 'state/transactions/actions'
import { useCrossChainFarmPendingTransaction, useTransactionAdder } from 'state/transactions/hooks'
import { TransactionReceipt } from 'viem'
import { YieldBoosterStateContext } from 'views/Farms/components/YieldBooster/components/ProxyFarmContainer'
import useProxyStakedActions from 'views/Farms/components/YieldBooster/hooks/useProxyStakedActions'
import useUnstakeFarms from 'views/Farms/hooks/useUnstakeFarms'
import { useAccount } from 'wagmi'

export interface UnstakeButtonProps {
  pid?: number
  vaultPid?: number
  farm?: FarmWithStakedValue
}

const UnstakeButton: React.FC<React.PropsWithChildren<UnstakeButtonProps>> = ({ pid, vaultPid, farm }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { toastSuccess } = useToast()
  const { lpAddress } = useFarmFromPid(pid) ?? {}
  const { loading: pendingTx, fetchTxResponse, fetchWithCatchTxError } = useCatchTxError()
  const { stakedBalance, proxy } = useFarmUser(pid)
  const { onUnstake } = useUnstakeFarms(pid, vaultPid)
  const dispatch = useAppDispatch()
  const { shouldUseProxyFarm, proxyAddress } = useContext(YieldBoosterStateContext)
  const isNeedUnstake = stakedBalance.gt(0) || proxy?.stakedBalance.gt(0)

  const [isLoading, setIsLoading] = React.useState(false)

  const lpContract = useERC20(lpAddress)
  const addTransaction = useTransactionAdder()

  const { onUnstake: onUnstakeProxyFarm, onDone } = useProxyStakedActions(pid, lpContract)

  const pendingFarm = useCrossChainFarmPendingTransaction(lpAddress)
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
        if (receipt && chainId) {
          const amount = getFullDisplayBalance(stakedBalance)
          addTransaction(receipt, {
            type: 'cross-chain-farm',
            translatableSummary: {
              text: 'Unstake %amount% %lpSymbol% Token',
              data: { amount, lpSymbol: farm?.lpSymbol },
            },
            crossChainFarm: {
              type: CrossChainFarmStepType.UNSTAKE,
              status: FarmTransactionStatus.PENDING,
              amount,
              lpSymbol: farm?.lpSymbol ?? t('Unknown'),
              lpAddress: lpAddress ?? '',
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

          dispatch(pickFarmTransactionTx({ tx: receipt.hash, chainId }))
        }
      }
      let resp: TransactionReceipt | null = null

      if (receipt?.hash) {
        resp = await waitForTransaction({
          hash: receipt.hash,
          chainId,
        })
      }

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
        if (chainId && account && typeof pid === 'number') {
          dispatch(fetchFarmUserDataAsync({ account, pids: [pid], proxyAddress, chainId }))
        }
      }
    } else {
      const receipt = await fetchWithCatchTxError(() => {
        if (shouldUseProxyFarm) {
          const balance = getFullDisplayBalance(proxy?.stakedBalance ?? BIG_ZERO)
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
        if (chainId && account && typeof pid === 'number') {
          dispatch(fetchFarmUserDataAsync({ account, pids: [pid], proxyAddress, chainId }))
        }
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
