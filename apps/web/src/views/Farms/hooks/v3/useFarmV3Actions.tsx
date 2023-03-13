import { calculateGasMargin } from 'utils'
import { useCallback, useState } from 'react'
import { useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { MasterChefV3, NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { BigintIsh } from '@pancakeswap/swap-sdk-core'
import { Signer } from '@wagmi/core'
import { ToastDescriptionWithTx } from 'components/Toast'

interface FarmV3ActionContainerChildrenProps {
  attemptingTxn: boolean
  onStake: () => void
  onUnstake: () => void
  onHarvest: () => void
}

const useFarmV3Actions = ({
  tokenId,
  account,
  signer,
}: {
  tokenId: BigintIsh
  account: string
  signer: Signer
}): FarmV3ActionContainerChildrenProps => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const [attemptingTxn, setAttemptingTxn] = useState(false)

  const masterChefV3Address = useMasterchefV3()?.address
  const nftPositionManagerAddress = useV3NFTPositionManagerContract()?.address

  const onUnstake = useCallback(async () => {
    const { calldata, value } = MasterChefV3.withdrawCallParameters({ tokenId, to: account })

    const txn = {
      to: masterChefV3Address,
      data: calldata,
      value,
    }

    setAttemptingTxn(true)

    await signer
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return signer
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            return response.wait()
          })
          .then((receipt) => {
            if (receipt?.status) {
              setAttemptingTxn(false)
              toastSuccess(
                `${t('Unstaked')}!`,
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                  {t('Your earnings have also been harvested to your wallet')}
                </ToastDescriptionWithTx>,
              )
            }
          })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [account, masterChefV3Address, signer, t, toastSuccess, tokenId])

  const onStake = useCallback(async () => {
    const { calldata, value } = NonfungiblePositionManager.safeTransferFromParameters({
      tokenId,
      recipient: masterChefV3Address,
      sender: account,
    })

    const txn = {
      to: nftPositionManagerAddress,
      data: calldata,
      value,
    }

    setAttemptingTxn(true)

    await signer
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return signer
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            return response.wait()
          })
          .then((receipt) => {
            if (receipt?.status) {
              setAttemptingTxn(false)
              toastSuccess(
                `${t('Staked')}!`,
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                  {t('Your funds have been staked in the farm')}
                </ToastDescriptionWithTx>,
              )
            }
          })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [account, masterChefV3Address, nftPositionManagerAddress, signer, t, toastSuccess, tokenId])

  const onHarvest = useCallback(async () => {
    const { calldata, value } = MasterChefV3.harvestCallParameters({ tokenId, to: account })

    const txn = {
      to: masterChefV3Address,
      data: calldata,
      value,
    }

    setAttemptingTxn(true)

    await signer
      .estimateGas(txn)
      .then((estimate) => {
        const newTxn = {
          ...txn,
          gasLimit: calculateGasMargin(estimate),
        }

        return signer
          .sendTransaction(newTxn)
          .then((response: TransactionResponse) => {
            return response.wait()
          })
          .then((receipt) => {
            if (receipt?.status) {
              setAttemptingTxn(false)
              toastSuccess(
                `${t('Harvested')}!`,
                <ToastDescriptionWithTx txHash={receipt.transactionHash}>
                  {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
                </ToastDescriptionWithTx>,
              )
            }
          })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [account, masterChefV3Address, signer, t, toastSuccess, tokenId])

  return { attemptingTxn, onStake, onUnstake, onHarvest }
}

export default useFarmV3Actions
