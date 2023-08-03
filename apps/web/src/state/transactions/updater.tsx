import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { FAST_INTERVAL } from 'config/constants'
import forEach from 'lodash/forEach'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { RetryableError, retry } from 'state/multicall/retry'
import useSWRImmutable from 'swr/immutable'
import { TransactionNotFoundError } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'
import { useAppDispatch } from '../index'
import {
  FarmTransactionStatus,
  MsgStatus,
  NonBscFarmStepType,
  NonBscFarmTransactionStep,
  finalizeTransaction,
} from './actions'
import { fetchCelerApi } from './fetchCelerApi'
import { useAllChainTransactions } from './hooks'
import { TransactionDetails } from './reducer'

export function shouldCheck(
  fetchedTransactions: { [txHash: string]: TransactionDetails },
  tx: TransactionDetails,
): boolean {
  if (tx.receipt) return false
  return !fetchedTransactions[tx.hash]
}

export const Updater: React.FC<{ chainId: number }> = ({ chainId }) => {
  const provider = usePublicClient({ chainId })
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const dispatch = useAppDispatch()
  const transactions = useAllChainTransactions(chainId)

  const { toastError, toastSuccess } = useToast()

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>({})

  const pushNotification = useCallback(async () => {
    console.log('entered')
    try {

      const notificationPayload2 = {
        accounts: [`eip155:${1}:${account}`],
        notification: {
          title: 'Swap',
          body: 'Your ETH-CAKE swap was successful',
          icon: `https://pancakeswap.finance/logo.png`,
          url: 'https://pancakeswap.finance/logo.png',
          type: 'alerts',
        },
      }

      const notifyResponse = await fetch(`https://cast.walletconnect.com/${'ae5413feaf0cdaee02910dc807e03203'}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${'85a7792c-c5d7-486b-b37e-e752918e4866'}`,
        },
        body: JSON.stringify(notificationPayload2),
      })

      const notifyResult = await notifyResponse.json()
      console.log(notifyResult)
      if (notifyResult.success) {
        toastSuccess(
          `${t('Subscription Success')}!`,
          <Text>{t(`You have successfuly subscribed. a confirmation has been sent to your wallet.`)}</Text>,
        )
      }
    } catch (error) {
      console.error({ sendGmError: error })
      toastError(
        `${t('Something Went Wrong')}!`,
        <Text>{t(`${error}`)}</Text>,
      )
    }
  }, [account, toastError, toastSuccess, t])

  useEffect(() => {
    if (!chainId || !provider) return

    forEach(
      pickBy(transactions, (transaction) => shouldCheck(fetchedTransactions.current, transaction)),
      (transaction) => {
        const getTransaction = async () => {
          try {
            const receipt: any = await provider.waitForTransactionReceipt({ hash: transaction.hash })
            dispatch(
              finalizeTransaction({
                chainId,
                hash: transaction.hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: Number(receipt.blockNumber),
                  contractAddress: receipt.contractAddress,
                  from: receipt.from,
                  status: receipt.status === 'success' ? 1 : 0,
                  to: receipt.to,
                  transactionHash: receipt.transactionHash,
                  transactionIndex: receipt.transactionIndex,
                },
              }),
            )
            const toast = receipt.status === 'success' ? toastSuccess : toastError
            toast(
              t('Transaction receipt'),
              <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={chainId} />,
            )

            merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
console.log('heyyyyyyyy')
            setTimeout(() => pushNotification(), 5000)
          } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
              throw new RetryableError(`Transaction not found: ${transaction.hash}`)
            }
          }
          merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
        }
        retry(getTransaction, {
          n: 10,
          minWait: 5000,
          maxWait: 10000,
        })
      },
    )
  }, [chainId, provider, transactions, dispatch, toastSuccess, toastError, t, pushNotification])

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
        const steps = transactions[hash]?.nonBscFarm?.steps || []
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

                const newSteps = transaction?.nonBscFarm?.steps?.map((step, index) => {
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
                      status: isFinalStepComplete ? FarmTransactionStatus.SUCCESS : transaction?.nonBscFarm?.status,
                    },
                  }),
                )

                const isStakeType = transactions[hash]?.nonBscFarm?.type === NonBscFarmStepType.STAKE
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
                        >{`${transaction?.nonBscFarm?.amount} ${transaction?.nonBscFarm?.lpSymbol}`}</Text>
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
