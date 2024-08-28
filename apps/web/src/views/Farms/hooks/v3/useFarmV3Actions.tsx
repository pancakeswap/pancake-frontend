import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { MasterChefV3, NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
import { useQueryClient } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BOOSTED_FARM_V3_GAS_LIMIT } from 'config'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { useIsSmartContract } from 'hooks/useIsSmartContract'
import { useCallback } from 'react'
import { calculateGasMargin } from 'utils'
import { logGTMClickStakeFarmConfirmEvent, logGTMStakeFarmTxSentEvent } from 'utils/customGTMEventTracking'
import { getViemClients, viemClients } from 'utils/viem'
import type { TransactionReceipt } from 'viem'
import { Address, hexToBigInt } from 'viem'
import { useAccount, useSendTransaction, useWalletClient } from 'wagmi'

interface FarmV3ActionContainerChildrenProps {
  attemptingTxn: boolean
  onStake: () => Promise<void>
  onUnstake: () => Promise<void>
  onHarvest: () => Promise<void>
}

const useFarmV3Actions = ({
  tokenId,
  onDone,
}: {
  tokenId: string
  onDone?: (resp: TransactionReceipt | null) => void
}): FarmV3ActionContainerChildrenProps => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { address: account } = useAccount()
  const { data: signer } = useWalletClient()
  const { chainId } = useActiveChainId()
  const isSC = useIsSmartContract(account)
  const { sendTransactionAsync } = useSendTransaction()
  const queryClient = useQueryClient()
  const publicClient = viemClients[chainId as keyof typeof viemClients]

  const { loading, fetchWithCatchTxError } = useCatchTxError()

  const masterChefV3Address = useMasterchefV3()?.address as Address
  const nftPositionManagerAddress = useV3NFTPositionManagerContract()?.address

  const onUnstake = useCallback(async () => {
    if (!account) return

    const { calldata, value } = MasterChefV3.withdrawCallParameters({ tokenId, to: account })

    const txn = {
      account,
      to: masterChefV3Address,
      data: calldata,
      value: hexToBigInt(value),
      chain: signer?.chain,
    }

    const resp = await fetchWithCatchTxError(() =>
      publicClient
        .estimateGas(txn)
        .then((estimate) => {
          const newTxn = {
            ...txn,
            gas: calculateGasMargin(estimate),
          }

          return sendTransactionAsync(newTxn)
        })
        .catch((e) => {
          // Workaround for zksync smart wallets
          if (isSC && chainId === ChainId.ZKSYNC && e.shortMessage.includes('argent/forbidden-fallback')) {
            const newTxn = {
              ...txn,
              gas: BOOSTED_FARM_V3_GAS_LIMIT,
            }
            return sendTransactionAsync(newTxn)
          }
          throw e
        }),
    )
    if (resp?.status) {
      onDone?.(resp)
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={resp.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [
    account,
    fetchWithCatchTxError,
    masterChefV3Address,
    isSC,
    chainId,
    publicClient,
    sendTransactionAsync,
    signer,
    t,
    toastSuccess,
    tokenId,
    onDone,
  ])

  const onStake = useCallback(async () => {
    logGTMClickStakeFarmConfirmEvent()
    if (!account || !nftPositionManagerAddress) return

    const { calldata, value } = NonfungiblePositionManager.safeTransferFromParameters({
      tokenId,
      recipient: masterChefV3Address,
      sender: account,
    })

    const txn = {
      to: nftPositionManagerAddress,
      data: calldata,
      value: hexToBigInt(value),
      account,
      chain: signer?.chain,
    }

    const resp = await fetchWithCatchTxError(() =>
      publicClient.estimateGas(txn).then((estimate) => {
        const newTxn = {
          ...txn,
          gas: calculateGasMargin(estimate),
        }

        return sendTransactionAsync(newTxn)
      }),
    )

    if (resp?.status) {
      logGTMStakeFarmTxSentEvent()
      onDone?.(resp)
      toastSuccess(
        `${t('Staked')}!`,
        <ToastDescriptionWithTx txHash={resp.transactionHash}>
          {t('Your funds have been staked in the farm')}
        </ToastDescriptionWithTx>,
      )
    }
  }, [
    account,
    fetchWithCatchTxError,
    masterChefV3Address,
    nftPositionManagerAddress,
    publicClient,
    sendTransactionAsync,
    signer,
    t,
    toastSuccess,
    tokenId,
    onDone,
  ])

  const onHarvest = useCallback(async () => {
    if (!account) return

    const { calldata } = MasterChefV3.harvestCallParameters({ tokenId, to: account })

    const txn = {
      to: masterChefV3Address,
      data: calldata,
      value: 0n,
    }

    const resp = await fetchWithCatchTxError(() =>
      publicClient
        .estimateGas({
          account,
          ...txn,
        })
        .then((estimate) => {
          const newTxn = {
            ...txn,
            account,
            chain: signer?.chain,
            gas: calculateGasMargin(estimate),
          }

          return sendTransactionAsync(newTxn)
        }),
    )

    if (resp?.status) {
      onDone?.(resp)
      toastSuccess(
        `${t('Harvested')}!`,
        <ToastDescriptionWithTx txHash={resp.transactionHash}>
          {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
        </ToastDescriptionWithTx>,
      )
      queryClient.invalidateQueries({ queryKey: ['mcv3-harvest'] })
    }
  }, [
    onDone,
    account,
    fetchWithCatchTxError,
    masterChefV3Address,
    publicClient,
    sendTransactionAsync,
    signer,
    t,
    toastSuccess,
    tokenId,
    queryClient,
  ])

  return {
    attemptingTxn: loading,
    onStake,
    onUnstake,
    onHarvest,
  }
}

export function useFarmsV3BatchHarvest() {
  const { t } = useTranslation()
  const { data: signer } = useWalletClient()
  const { toastSuccess } = useToast()
  const { address: account } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const { loading, fetchWithCatchTxError } = useCatchTxError()
  const queryClient = useQueryClient()

  const masterChefV3Address = useMasterchefV3()?.address
  const onHarvestAll = useCallback(
    async (tokenIds: string[]) => {
      if (!account || !masterChefV3Address) return

      const { calldata, value } = MasterChefV3.batchHarvestCallParameters(
        tokenIds.map((tokenId) => ({ tokenId, to: account })),
      )

      const txn = {
        to: masterChefV3Address,
        data: calldata,
        value: hexToBigInt(value),
        account,
      }
      const publicClient = getViemClients({ chainId: signer?.chain?.id })

      const resp = await fetchWithCatchTxError(() =>
        publicClient.estimateGas(txn).then((estimate) => {
          const newTxn = {
            ...txn,
            gas: calculateGasMargin(estimate),
          }

          return sendTransactionAsync(newTxn)
        }),
      )

      if (resp?.status) {
        toastSuccess(
          `${t('Harvested')}!`,
          <ToastDescriptionWithTx txHash={resp.transactionHash}>
            {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
          </ToastDescriptionWithTx>,
        )
        queryClient.invalidateQueries({ queryKey: ['mcv3-harvest'] })
      }
    },
    [account, fetchWithCatchTxError, masterChefV3Address, sendTransactionAsync, signer, t, toastSuccess, queryClient],
  )

  return {
    onHarvestAll,
    harvesting: loading,
  }
}

export default useFarmV3Actions
