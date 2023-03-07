import { calculateGasMargin } from 'utils'
import { ReactElement, useCallback, useState } from 'react'

import { MasterChefV3, NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
import { TransactionResponse } from '@ethersproject/providers'
import { BigintIsh } from '@pancakeswap/swap-sdk-core'
import { Signer } from '@wagmi/core'

interface FarmV3ActionContainerChildrenProps {
  attemptingTxn: boolean
  onStake: () => void
  onUnstake: () => void
  onHarvest: () => void
}

const FarmV3ActionsContainer = ({
  children,
  tokenId,
  account,
  signer,
}: {
  tokenId: BigintIsh
  account: string
  signer: Signer
  children: (props: FarmV3ActionContainerChildrenProps) => ReactElement
}) => {
  const [attemptingTxn, setAttemptingTxn] = useState(false)

  const masterChefV3Address = useMasterchefV3()?.address
  const nftPositionManagerAddress = useV3NFTPositionManagerContract()?.address

  const onUnstake = useCallback(() => {
    const { calldata, value } = MasterChefV3.withdrawCallParameters({ tokenId, to: account })

    const txn = {
      to: masterChefV3Address,
      data: calldata,
      value,
    }

    setAttemptingTxn(true)

    signer
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
          .then(() => {
            setAttemptingTxn(false)
          })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [account, masterChefV3Address, signer, tokenId])

  const onStake = useCallback(() => {
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

    signer
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
          .then(() => {
            setAttemptingTxn(false)
          })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [account, masterChefV3Address, nftPositionManagerAddress, signer, tokenId])

  const onHarvest = useCallback(() => {
    const { calldata, value } = MasterChefV3.harvestCallParameters({ tokenId, to: account })

    const txn = {
      to: masterChefV3Address,
      data: calldata,
      value,
    }

    setAttemptingTxn(true)

    signer
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
          .then(() => {
            setAttemptingTxn(false)
          })
      })
      .catch((err) => {
        setAttemptingTxn(false)
        console.error(err)
      })
  }, [account, masterChefV3Address, signer, tokenId])

  return children({ attemptingTxn, onStake, onUnstake, onHarvest })
}

export default FarmV3ActionsContainer
