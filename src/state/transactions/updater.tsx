import React, { useEffect, useMemo, useRef } from 'react'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import forEach from 'lodash/forEach'
import { useTranslation } from '@pancakeswap/localization'
import { useProvider } from 'wagmi'
import { poll } from '@ethersproject/web'
import { ToastDescriptionWithTx } from 'components/Toast'
import { Box, Text, useToast } from '@pancakeswap/uikit'
import { FAST_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import { useAppDispatch } from '../index'
import {
  finalizeTransaction,
  FarmTransactionStatus,
  NonBscFarmTransactionStep,
  MsgStatus,
  NonBscFarmStepType,
} from './actions'
import { useAllChainTransactions } from './hooks'
import { fetchCelerApi } from './fetchCelerApi'
import { TransactionDetails } from './reducer'

export function shouldCheck(
  fetchedTransactions: { [txHash: string]: TransactionDetails },
  tx: TransactionDetails,
): boolean {
  if (tx.receipt) return false
  return !fetchedTransactions[tx.hash]
}

export const Updater: React.FC<{ chainId: number }> = ({ chainId }) => {
  const provider = useProvider({ chainId })
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const transactions = useAllChainTransactions(chainId)

  const { toastError, toastSuccess } = useToast()

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>({})

  useEffect(() => {
    if (!chainId || !provider) return

    forEach(
      pickBy(transactions, (transaction) => shouldCheck(fetchedTransactions.current, transaction)),
      (transaction) => {
        const getTransaction = async () => {
          await provider.getNetwork()

          const params = { transactionHash: provider.formatter.hash(transaction.hash, true) }

          poll(
            async () => {
              const result = await provider.perform('getTransactionReceipt', params)

              if (result == null || result.blockHash == null) {
                return undefined
              }

              const receipt = provider.formatter.receipt(result)

              dispatch(
                finalizeTransaction({
                  chainId,
                  hash: transaction.hash,
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
              toast(
                t('Transaction receipt'),
                <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={chainId} />,
              )
              return true
            },
            { onceBlock: provider },
          )
          merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
        }

        getTransaction()
      },
    )
  }, [chainId, provider, transactions, dispatch, toastSuccess, toastError, t])

  const nonBscFarmPendingTxns = useMemo(
    () =>
      Object.keys(transactions).filter(
        (hash) =>
          transactions[hash].receipt?.status === 1 &&
          transactions[hash].type === 'non-bsc-farm' &&
          transactions[hash].nonBscFarm?.status === FarmTransactionStatus.PENDING,
      ),
    [transactions],
  )

  useSWRImmutable(
    chainId && Boolean(nonBscFarmPendingTxns?.length) && ['checkNonBscFarmTransaction', FAST_INTERVAL, chainId],
    () => {
      nonBscFarmPendingTxns.forEach((hash) => {
        const steps = transactions[hash]?.nonBscFarm?.steps
        if (steps.length) {
          const pendingStep = steps.findIndex(
            (step: NonBscFarmTransactionStep) => step.status === FarmTransactionStatus.PENDING,
          )
          const previousIndex = pendingStep - 1

          if (previousIndex >= 0) {
            const previousHash = steps[previousIndex]
            const checkHash = previousHash.tx || hash

            fetchCelerApi(checkHash)
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
                    <ToastDescriptionWithTx txHash={destinationTxHash} txChainId={steps[pendingStep].chainId}>
                      {isStakeType
                        ? t('Your LP Token have been staked in the Farm!')
                        : t('Your LP Token have been unstaked in the Farm!')}
                    </ToastDescriptionWithTx>,
                  )
                } else if (status === FarmTransactionStatus.FAIL) {
                  const toastTitle = isStakeType ? t('Stake Error') : t('Unstake Error')
                  const errorText = isStakeType ? t('Token fail to stake.') : t('Token fail to unstake.')
                  toastError(
                    toastTitle,
                    <ToastDescriptionWithTx txHash={destinationTxHash} txChainId={steps[pendingStep].chainId}>
                      <Box>
                        <Text
                          as="span"
                          bold
                        >{`${transaction.nonBscFarm.amount} ${transaction.nonBscFarm.lpSymbol}`}</Text>
                        <Text as="span" ml="4px">
                          {errorText}
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
    },
    {
      refreshInterval: FAST_INTERVAL,
      errorRetryInterval: FAST_INTERVAL,
      onError: (error) => {
        console.error('[ERROR] updater checking non BSC farm transaction error: ', error)
      },
    },
  )

  return null
}

export default Updater
