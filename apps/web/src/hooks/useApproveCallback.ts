import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, ERC20Token } from '@pancakeswap/sdk'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useToast } from '@pancakeswap/uikit'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useHasPendingApproval, useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { getViemErrorMessage } from 'utils/errors'
import { isUserRejected, logError } from 'utils/sentry'
import { encodeFunctionData, parseAbi, stringify } from 'viem'
import { zkSync } from 'viem/chains'
import { Address, useAccount, useWalletClient } from 'wagmi'
import { SendTransactionResult } from 'wagmi/actions'
import useGelatoLimitOrdersLib from './limitOrders/useGelatoLimitOrdersLib'
import { useActiveChainId } from './useActiveChainId'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { useTokenContract } from './useContract'
import useTokenAllowance from './useTokenAllowance'

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

function transactionToMessage(transaction: any): any {
  const {
    gas,
    nonce,
    to,
    from,
    value,
    maxFeePerGas,
    maxPriorityFeePerGas,
    factoryDeps,
    paymaster,
    paymasterInput,
    gasPerPubdata,
    data,
  } = transaction

  return {
    txType: 113n,
    from: BigInt(from),
    to: to ? BigInt(to) : 0n,
    gasLimit: gas ?? 0n,
    gasPerPubdataByteLimit: gasPerPubdata ?? 0n,
    maxFeePerGas: maxFeePerGas ?? 0n,
    maxPriorityFeePerGas: maxPriorityFeePerGas ?? 0n,
    paymaster: paymaster ? BigInt(paymaster) : 0n,
    nonce: nonce ? BigInt(nonce) : 0n,
    value: value ?? 0n,
    data: data || '0x0',
    factoryDeps: factoryDeps ?? [],
    paymasterInput: paymasterInput || '0x0',
  }
}
const getEip712Domain = (transaction) => {
  const message = transactionToMessage(transaction as any)

  return {
    domain: {
      name: 'zkSync',
      version: '2',
      chainId: transaction.chainId,
    },
    types: {
      Transaction: [
        { name: 'txType', type: 'uint256' },
        { name: 'from', type: 'uint256' },
        { name: 'to', type: 'uint256' },
        { name: 'gasLimit', type: 'uint256' },
        { name: 'gasPerPubdataByteLimit', type: 'uint256' },
        { name: 'maxFeePerGas', type: 'uint256' },
        { name: 'maxPriorityFeePerGas', type: 'uint256' },
        { name: 'paymaster', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'value', type: 'uint256' },
        { name: 'data', type: 'bytes' },
        { name: 'factoryDeps', type: 'bytes32[]' },
        { name: 'paymasterInput', type: 'bytes' },
      ],
    },
    primaryType: 'Transaction',
    message,
  }
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string,
  options: {
    addToTransaction
    targetAmount?: bigint
  } = {
    addToTransaction: true,
  },
): {
  approvalState: ApprovalState
  approveCallback: () => Promise<SendTransactionResult | undefined>
  revokeCallback: () => Promise<SendTransactionResult | undefined>
  currentAllowance: CurrencyAmount<Currency> | undefined
  isPendingError: boolean
} {
  const { addToTransaction = true, targetAmount } = options
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const { allowance: currentAllowance, refetch } = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)
  const [pending, setPending] = useState<boolean>(pendingApproval)
  const [isPendingError, setIsPendingError] = useState<boolean>(false)
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    if (pendingApproval) {
      setPending(true)
    } else if (pending) {
      refetch().then(() => {
        setPending(false)
      })
    }
  }, [pendingApproval, pending, refetch])

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency?.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pending
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pending, spender])

  const tokenContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(
    async (overrideAmountApprove?: bigint): Promise<SendTransactionResult | undefined> => {
      if (approvalState !== ApprovalState.NOT_APPROVED && isUndefinedOrNull(overrideAmountApprove)) {
        toastError(t('Error'), t('Approve was called unnecessarily'))
        console.error('approve was called unnecessarily')
        setIsPendingError(true)
        return undefined
      }
      if (!token) {
        // toastError(t('Error'), t('No token'))
        console.error('no token')
        // return undefined
      }

      if (!tokenContract) {
        toastError(t('Error'), t('Cannot find contract of the token %tokenAddress%', { tokenAddress: token?.address }))
        console.error('tokenContract is null')
        setIsPendingError(true)
        return undefined
      }

      if (!amountToApprove && isUndefinedOrNull(overrideAmountApprove)) {
        toastError(t('Error'), t('Missing amount to approve'))
        console.error('missing amount to approve')
        setIsPendingError(true)
        return undefined
      }

      if (!spender) {
        toastError(t('Error'), t('No spender'))
        console.error('no spender')
        setIsPendingError(true)
        return undefined
      }

      let useExact = false

      const estimatedGas = await tokenContract.estimateGas
        .approve(
          [spender as Address, MaxUint256], // TODO: Fix viem
          // @ts-ignore
          {
            account: tokenContract.account,
          },
        )
        .catch(() => {
          // general fallback for tokens who restrict approval amounts
          useExact = true
          return tokenContract.estimateGas
            .approve(
              [spender as Address, overrideAmountApprove ?? amountToApprove?.quotient ?? targetAmount ?? MaxUint256],
              // @ts-ignore
              {
                account: tokenContract.account,
              },
            )
            .catch((e) => {
              console.error('estimate gas failure', e)
              toastError(t('Error'), t('Unexpected error. Could not estimate gas for the approve.'))
              setIsPendingError(true)
              return null
            })
        })

      if (!estimatedGas) return undefined

      const finalAmount =
        overrideAmountApprove ?? (useExact ? amountToApprove?.quotient ?? targetAmount ?? MaxUint256 : MaxUint256)
      // return callWithGasPrice(tokenContract, 'approve' as const, [spender as Address, finalAmount], {
      //   gas: calculateGasMargin(estimatedGas),
      // })
      //   .then((response) => {

      let sendTxResult: Promise<SendTransactionResult> | undefined

      if (chainId === zkSync.id) {
        try {
          const calldata = encodeFunctionData({
            abi: parseAbi(['function approve(address spender, uint256 amount) public returns (bool)']),
            functionName: 'approve',
            args: [spender as Address, finalAmount],
          })
          const resp = await fetch(`https://paymaster.zyfi.org/api/v1/erc20_paymaster`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: stringify({
              feeTokenAddress: token?.address,
              gasLimit: estimatedGas,
              txData: {
                from: account,
                to: tokenContract.address,
                value: '0x0',
                data: calldata,
              },
            }),
          })
          if (resp.ok) {
            const rawTx = await resp.json()
            console.debug('debug paymaster rawTx', rawTx)
            const { customData } = rawTx.txData
            const newTx = {
              // type: 'eip712',
              account,
              to: tokenContract.address,
              value: 0n,
              chainId,
              gas: BigInt(rawTx.gasLimit),
              maxFeePerGas: BigInt(rawTx.txData.maxFeePerGas),
              maxPriorityFeePerGas: BigInt(0),
              data: calldata,
              gasPerPubdata: BigInt(customData.gasPerPubdata),
              paymaster: customData.paymasterParams.paymaster,
              paymasterInput: customData.paymasterParams.paymasterInput,
            }

            if (walletClient) {
              // sendTxResult = sendTransactionAsync(newTx as any)
              const txRequest = await walletClient.prepareTransactionRequest(newTx as any)
              console.debug('debug paymaster txRequest', txRequest)

              const eip712Domain = getEip712Domain({
                ...txRequest,
                chainId,
                from: txRequest.account,
                type: 'eip712',
              })
              const customSignature = await walletClient.signTypedData({
                ...eip712Domain,
                account: txRequest.account,
              } as any)
              console.debug('debug paymaster customSig', customSignature)
              const serializedTransaction = zkSync.serializers!.transaction!({
                ...txRequest,
                chainId,
                customSignature,
                type: 'eip712',
              } as any)

              console.debug('debug paymaster serializedTransaction', serializedTransaction)
              const p = await walletClient.sendRawTransaction({ serializedTransaction }).then((hash) => {
                return {
                  hash,
                } as SendTransactionResult
              })
              sendTxResult = Promise.resolve(p)
            }
          }
        } catch (error) {
          console.error('paymaster: Failed to approve token', error)
          throw error
        }
      } else {
        sendTxResult = callWithGasPrice(tokenContract, 'approve' as const, [spender as Address, finalAmount], {
          gas: calculateGasMargin(estimatedGas),
        })
      }

      return sendTxResult
        ?.then((response) => {
          if (addToTransaction && token) {
            addTransaction(response, {
              summary: `Approve ${overrideAmountApprove ?? amountToApprove?.currency?.symbol}`,
              translatableSummary: {
                text: 'Approve %symbol%',
                data: { symbol: overrideAmountApprove?.toString() ?? amountToApprove?.currency?.symbol },
              },
              approval: { tokenAddress: token.address, spender, amount: finalAmount.toString() },
              type: 'approve',
            })
          }
          return response
        })
        .catch((error: any) => {
          logError(error)
          console.error('Failed to approve token', error)
          if (!isUserRejected(error)) {
            toastError(t('Error'), getViemErrorMessage(error))
          }
          throw error
        })
    },
    [
      approvalState,
      token,
      tokenContract,
      amountToApprove,
      spender,
      targetAmount,
      chainId,
      toastError,
      t,
      account,
      walletClient,
      callWithGasPrice,
      addToTransaction,
      addTransaction,
    ],
  )

  const approveCallback = useCallback(() => {
    return approve()
  }, [approve])

  const revokeCallback = useCallback(() => {
    return approve(0n)
  }, [approve])

  return { approvalState, approveCallback, revokeCallback, currentAllowance, isPendingError }
}

export function useApproveCallbackFromAmount({
  token,
  minAmount,
  targetAmount,
  spender,
  addToTransaction,
}: {
  token?: ERC20Token
  minAmount?: bigint
  targetAmount?: bigint
  spender?: string
  addToTransaction?: boolean
}) {
  const amountToApprove = useMemo(() => {
    if (!minAmount || !token) return undefined
    return CurrencyAmount.fromRawAmount(token, minAmount)
  }, [minAmount, token])

  return useApproveCallback(amountToApprove, spender, {
    addToTransaction,
    targetAmount,
  })
}

// Wraps useApproveCallback in the context of a Gelato Limit Orders
export function useApproveCallbackFromInputCurrencyAmount(currencyAmountIn: CurrencyAmount<Currency> | undefined) {
  const gelatoLibrary = useGelatoLimitOrdersLib()

  return useApproveCallback(currencyAmountIn, gelatoLibrary?.erc20OrderRouter?.address ?? undefined)
}
