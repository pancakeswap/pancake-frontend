import { useEffect } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrentBlock } from 'state/block/hooks'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Box, Text, useToast } from '@pancakeswap/uikit'
import { useAppDispatch } from '../index'
import {
  checkedTransaction,
  finalizeTransaction,
  FarmTransactionStatus,
  NonBscFarmTransactionStep,
  MsgStatus,
  NonBscFarmStepType,
} from './actions'
import { useAllChainTransactions } from './hooks'
import { fetchCelerApi } from './fetchCelerApi'

export function shouldCheck(
  currentBlock: number,
  tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number },
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = currentBlock - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  }
  // otherwise every block
  return true
}

export default function Updater(): null {
  const { chainId, provider } = useActiveWeb3React()
  const { t } = useTranslation()

  const currentBlock = useCurrentBlock()

  const dispatch = useAppDispatch()
  const transactions = useAllChainTransactions()

  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (!chainId || !provider || !currentBlock) return

    Object.keys(transactions)
      .filter((hash) => shouldCheck(currentBlock, transactions[hash]))
      .forEach((hash) => {
        provider
          .getTransactionReceipt(hash)
          .then((receipt) => {
            if (receipt) {
              dispatch(
                finalizeTransaction({
                  chainId,
                  hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )

              const toast = receipt.status === 1 ? toastSuccess : toastError
              toast(t('Transaction receipt'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: currentBlock }))
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, provider, transactions, currentBlock, dispatch, toastSuccess, toastError, t])

  useEffect(() => {
    Object.keys(transactions)
      .filter(
        (hash) =>
          transactions[hash].receipt?.status === 1 &&
          transactions[hash].type === 'non-bsc-farm' &&
          transactions[hash].nonBscFarm.status === FarmTransactionStatus.PENDING,
      )
      .forEach((hash) => {
        const steps = transactions[hash]?.nonBscFarm?.steps
        if (steps.length) {
          const pendingStep = steps.findIndex(
            (step: NonBscFarmTransactionStep) => step.status === FarmTransactionStatus.PENDING,
          )
          const previousIndex = pendingStep - 1

          if (previousIndex >= 0) {
            // const previousHash = steps[previousIndex]
            const fakeHash = '0xcdb7e81470bdc407ed3eafb2ca20d53ab0d29bcc00e94ad6d056a1d2d99ec59c' || hash // TODO: NonBSCFarm change to hash before merge

            fetchCelerApi(fakeHash)
              .then((response) => {
                const transaction = transactions[hash]
                const { destinationTxHash, messageStatus } = response
                const status =
                  messageStatus === MsgStatus.MS_COMPLETED
                    ? FarmTransactionStatus.SUCCESS
                    : messageStatus === MsgStatus.MS_FAIL
                    ? FarmTransactionStatus.FAIL
                    : FarmTransactionStatus.PENDING
                const isFinalStepComplete = status === FarmTransactionStatus.SUCCESS && steps.length === pendingStep + 1

                const newSteps = transaction.nonBscFarm.steps.map((step, index) => {
                  let newObj = {}
                  if (index === pendingStep) {
                    newObj = { ...step, status, tx: destinationTxHash }
                  }
                  return { ...step, ...newObj }
                })

                dispatch(
                  finalizeTransaction({
                    chainId,
                    hash: transaction.hash,
                    receipt: { ...transaction.receipt },
                    nonBscFarm: {
                      ...transaction.nonBscFarm,
                      steps: newSteps,
                      status: isFinalStepComplete ? FarmTransactionStatus.SUCCESS : transaction.nonBscFarm.status,
                    },
                  }),
                )

                const isStakeType = transactions[hash].nonBscFarm.type === NonBscFarmStepType.STAKE
                if (isFinalStepComplete) {
                  const toastTitle = isStakeType ? t('Staked!') : t('Unstaked!')
                  toastSuccess(
                    toastTitle,
                    <ToastDescriptionWithTx txHash={destinationTxHash} customizeChainId={steps[pendingStep].chainId}>
                      {isStakeType
                        ? t('Your LP Token have been staked in the Farm!')
                        : t('Your LP Token have been unstaked in the Farm!')}
                    </ToastDescriptionWithTx>,
                  )
                } else if (status === FarmTransactionStatus.FAIL) {
                  const toastTitle = isStakeType ? 'Stake Error' : 'Unstake Error'
                  toastError(
                    toastTitle,
                    <ToastDescriptionWithTx txHash={destinationTxHash} customizeChainId={steps[pendingStep].chainId}>
                      <Box>
                        <Text
                          as="span"
                          bold
                        >{`${transaction.nonBscFarm.amount} ${transaction.nonBscFarm.lpSymbol}`}</Text>
                        <Text as="span" ml="4px">
                          {t('Token fail to stake.')}
                        </Text>
                      </Box>
                    </ToastDescriptionWithTx>,
                  )
                }
              })
              .catch((error) => {
                console.error(`Failed to check harvest transaction hash: ${hash}`, error)
              })
          }
        }
      })
  }, [chainId, transactions, currentBlock, dispatch, toastSuccess, toastError, t])

  return null
}
