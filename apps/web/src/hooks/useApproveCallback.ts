import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, ERC20Token } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { useAccount, Address } from 'wagmi'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { isUserRejected, logError } from 'utils/sentry'
import { SendTransactionResult } from 'wagmi/actions'
import { useHasPendingApproval, useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { useInterval } from '@pancakeswap/hooks'
import useGelatoLimitOrdersLib from './limitOrders/useGelatoLimitOrdersLib'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { useTokenContract } from './useContract'
import useTokenAllowance from './useTokenAllowance'
import { PermitSignature, usePermitAllowance, useUpdatePermitAllowance } from './usePermitAllowance'
import { USDC_GOERLI } from '@pancakeswap/tokens'
import { PERMIT2_ADDRESS } from '@uniswap/permit2-sdk'

export enum AllowanceState {
  LOADING,
  REQUIRED,
  ALLOWED,
}

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}
const AVERAGE_L1_BLOCK_TIME = 12000

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
  allowanceState: AllowanceState
  approveCallback: () => Promise<SendTransactionResult>
  revokeCallback: () => Promise<SendTransactionResult>
  permitAndApprove: () => Promise<void>
  updatePermitAllowance: () => Promise<void>
  currentAllowance: CurrencyAmount<Currency> | undefined
  permitSignature: string | undefined
  isPendingError: boolean
} {
  const { addToTransaction = true, targetAmount } = options
  const { address: account } = useAccount()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : USDC_GOERLI
  const amount = amountToApprove || 0
  const { allowance: currentAllowance, refetch } = useTokenAllowance(token, account ?? undefined, PERMIT2_ADDRESS)
  const pendingApproval = useHasPendingApproval(token?.address, PERMIT2_ADDRESS)
  const [pending, setPending] = useState<boolean>(pendingApproval)
  const [isPendingError, setIsPendingError] = useState<boolean>(false)
  const [signature, setSignature] = useState<PermitSignature>()

  const isApproved = useMemo(() => {
    if (!amount || !currentAllowance) return false
    return currentAllowance.greaterThan(amount) || currentAllowance.equalTo(amount)
  }, [amount, currentAllowance])


  // console.log(approvalState)
  useEffect(() => {
   const timeout = setInterval(() => refetch().then(() => setPending(false)), 5000)
   return () => clearInterval(timeout)
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

  const [now, setNow] = useState(Date.now() + AVERAGE_L1_BLOCK_TIME)
  useInterval(
    useCallback(() => setNow((Date.now() + AVERAGE_L1_BLOCK_TIME) / 1000), []),
    AVERAGE_L1_BLOCK_TIME
  )

  const shouldRequestApproval = !(isApproved || ApprovalState.NOT_APPROVED)
  const { permitAllowance, expiration: permitExpiration, nonce } = usePermitAllowance(token, account ?? '0x13E7f71a3E8847399547CE127B8dE420B282E4E4', spender)
  const updatePermitAllowance = useUpdatePermitAllowance(token, spender, nonce, setSignature)

  const isSigned = useMemo(() => {
    if (!amount || !signature) return false
    return signature.details.token === token?.address && signature.spender === spender && signature.sigDeadline >= now
  }, [amount, now, signature, spender, token?.address])


  const isPermitted = useMemo(() => {
    if (!amount || !permitAllowance || !permitExpiration) return false
    return (permitAllowance.greaterThan(amount) || permitAllowance.equalTo(amount)) && permitExpiration >= now
  }, [amount, now, permitAllowance, permitExpiration])

  const allowanceState: AllowanceState = useMemo(() => {
    if (!currentAllowance || !permitAllowance) return AllowanceState.LOADING
    if (!(isPermitted || isSigned)) return AllowanceState.REQUIRED
    return AllowanceState.ALLOWED
  }, [currentAllowance, permitAllowance, isPermitted, isSigned])


  const approve = useCallback(
    async (overrideAmountApprove?: bigint): Promise<SendTransactionResult> => {
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
        .approve([PERMIT2_ADDRESS as Address, MaxUint256], {
          account: tokenContract.account,
        })
        .catch(() => {
          // general fallback for tokens who restrict approval amounts
          useExact = true
          return tokenContract.estimateGas
            .approve(
              [PERMIT2_ADDRESS as Address, overrideAmountApprove ?? amountToApprove?.quotient ?? targetAmount ?? MaxUint256],
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

      return callWithGasPrice(
        tokenContract,
        'approve' as const,
        [
          PERMIT2_ADDRESS as Address,
          overrideAmountApprove ?? (useExact ? amountToApprove?.quotient ?? targetAmount ?? MaxUint256 : MaxUint256),
        ],
        {
          gas: calculateGasMargin(estimatedGas),
        },
      )
        .then((response) => {
          if (addToTransaction) {
            addTransaction(response, {
              summary: `Approve ${overrideAmountApprove ?? amountToApprove?.currency?.symbol}`,
              translatableSummary: {
                text: 'Approve %symbol%',
                data: { symbol: overrideAmountApprove?.toString() ?? amountToApprove?.currency?.symbol },
              },
              approval: { tokenAddress: token?.address, spender },
              type: 'approve',
            })
          }
          return response
        })
        .catch((error: any) => {
          logError(error)
          console.error('Failed to approve token', error)
          if (!isUserRejected(error)) {
            toastError(t('Error'), error.message)
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
      callWithGasPrice,
      targetAmount,
      toastError,
      t,
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

  const approveAndPermit = useCallback(async () => {
    if (shouldRequestApproval) {
      await approveCallback()
    }
    await updatePermitAllowance()
    
  }, [shouldRequestApproval, updatePermitAllowance, approveCallback])



  return { approvalState, allowanceState, approveCallback, revokeCallback, currentAllowance, isPendingError, updatePermitAllowance, approveAndPermit, permitSignature: !isPermitted && isSigned ? signature : undefined, }
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
