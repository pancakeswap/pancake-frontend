import { Dispatch, ReactElement, SetStateAction, useCallback, useContext, useMemo, useState } from 'react'
import { CurrencyAmount, Token, Percent, Currency, Price } from '@pancakeswap/sdk'
import { useModal } from '@pancakeswap/uikit'
import { isUserRejected, logError } from 'utils/sentry'
import { useTranslation } from '@pancakeswap/localization'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { StableConfigContext } from 'views/Swap/hooks/useStableConfig'
import { ONE_HUNDRED_PERCENT } from 'config/constants/exchange'
import { useStableSwapAPR } from 'hooks/useStableSwapAPR'
import { useStableSwapNativeHelperContract } from 'hooks/useContract'
import { PairState } from 'hooks/usePairs'
import { Handler } from '@pancakeswap/uikit/src/widgets/Modal/types'
import { useUserSlippage, useIsExpertMode } from '@pancakeswap/utils/user'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'

import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { Field } from 'state/mint/actions'
import { useMintActionHandlers, useMintState } from 'state/mint/hooks'

import { useTransactionAdder } from 'state/transactions/hooks'
import { useGasPrice } from 'state/user/hooks'
import { SendTransactionResult } from 'wagmi/actions'
import { calculateGasMargin } from 'utils'
import { calculateSlippageAmount } from 'utils/exchange'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import ConfirmAddLiquidityModal from '../components/ConfirmAddLiquidityModal'

import { StablePair, useStableLPDerivedMintInfo } from './hooks/useStableLPDerivedMintInfo'
import { useDerivedLPInfo } from './hooks/useDerivedLPInfo'
import { warningSeverity } from './utils/slippage'

export interface AddStableChildrenProps {
  noLiquidity: boolean
  formattedAmounts: {
    [Field.CURRENCY_A]?: string
    [Field.CURRENCY_B]?: string
  }
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
  maxAmounts: { [field in Field]?: CurrencyAmount<Token> }
  currencies: {
    [Field.CURRENCY_A]?: Currency
    [Field.CURRENCY_B]?: Currency
  }
  pairState: PairState
  poolTokenPercentage: Percent
  price: Price<Currency, Currency>
  executionSlippage: Percent
  loading: boolean
  infoLoading: boolean
  allowedSlippage: number
  stableAPR: number
  shouldShowApprovalGroup: boolean
  showFieldAApproval: boolean
  approveACallback: () => Promise<SendTransactionResult>
  approvalA: ApprovalState
  showFieldBApproval: boolean
  approvalB: ApprovalState
  approveBCallback: () => Promise<SendTransactionResult>
  onAdd: () => Promise<void>
  onPresentAddLiquidityModal: Handler
  buttonDisabled: boolean
  errorText: string
  setLiquidityState: Dispatch<
    SetStateAction<{
      attemptingTxn: boolean
      liquidityErrorMessage: string | undefined
      txHash: string | undefined
    }>
  >
  reserves: readonly [bigint, bigint]
  pair: StablePair
}

export default function AddStableLiquidity({
  currencyA,
  currencyB,
  children,
}: {
  currencyA: Currency
  currencyB: Currency
  children: (props: AddStableChildrenProps) => ReactElement
}) {
  const { account, chainId } = useAccountActiveChain()

  const expertMode = useIsExpertMode()

  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const gasPrice = useGasPrice()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
    loading: infoLoading,
    reserves,
  } = useStableLPDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(true)

  const nativeHelperContract = useStableSwapNativeHelperContract()

  // modal and loading
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // txn values
  const [allowedSlippage] = useUserSlippage() // custom from users
  const {
    lpOutputWithoutFee: expectedOutputWithoutFee,
    loading,
    price,
  } = useDerivedLPInfo(parsedAmounts[Field.CURRENCY_A], parsedAmounts[Field.CURRENCY_B])
  const minLPOutput = useMemo(
    () => expectedOutputWithoutFee && calculateSlippageAmount(expectedOutputWithoutFee, allowedSlippage)[0],
    [expectedOutputWithoutFee, allowedSlippage],
  )
  const executionSlippage = useMemo(() => {
    if (!liquidityMinted || !expectedOutputWithoutFee) {
      return null
    }
    return ONE_HUNDRED_PERCENT.subtract(new Percent(liquidityMinted.quotient, expectedOutputWithoutFee.quotient))
  }, [liquidityMinted, expectedOutputWithoutFee])

  const slippageSeverity = warningSeverity(executionSlippage)

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: otherTypedValue,
    }),
    [dependentField, independentField, otherTypedValue, typedValue],
  )

  const { stableSwapContract, stableSwapConfig } = useContext(StableConfigContext)
  const stableAPR = useStableSwapAPR(stableSwapContract?.address)

  const needWrapped = currencyA?.isNative || currencyB?.isNative

  // check whether the user has approved tokens for addling LPs
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    needWrapped ? nativeHelperContract?.address : stableSwapContract?.address,
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    needWrapped ? nativeHelperContract?.address : stableSwapContract?.address,
  )

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    const contract = needWrapped ? nativeHelperContract : stableSwapContract

    if (!chainId || !account || !contract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

    const atLeastOneCurrencyProvided = parsedAmountA?.greaterThan(0) || parsedAmountB?.greaterThan(0)
    const allCurrenciesProvided = parsedAmountA?.greaterThan(0) && parsedAmountB?.greaterThan(0)

    if (noLiquidity ? !allCurrenciesProvided : !atLeastOneCurrencyProvided) {
      return
    }

    const lpMintedSlippage = calculateSlippageAmount(liquidityMinted, noLiquidity ? 0 : allowedSlippage)[0]

    const quotientA = parsedAmountA?.quotient || 0n
    const quotientB = parsedAmountB?.quotient || 0n

    // Ensure the token order [token0, token1]
    const tokenAmounts =
      stableSwapConfig?.token0?.wrapped.address === parsedAmountA?.currency?.wrapped?.address
        ? ([quotientA, quotientB] as const)
        : ([quotientB, quotientA] as const)

    let args_

    let value_: bigint | null = null
    let call: Promise<`0x${string}`>
    if (needWrapped) {
      const args = [stableSwapContract.address, tokenAmounts, minLPOutput || lpMintedSlippage] as const
      args_ = args
      const value = (currencyB?.isNative ? parsedAmountB : parsedAmountA).quotient
      value_ = value
      call = nativeHelperContract.estimateGas
        .add_liquidity(args, {
          value,
          account: contract.account,
        })
        .then((estimatedGasLimit) => {
          return nativeHelperContract.write.add_liquidity(args, {
            gas: calculateGasMargin(estimatedGasLimit),
            gasPrice,
            value,
            account: contract.account,
            chain: contract.chain,
          })
        })
    } else {
      const args = [tokenAmounts, minLPOutput || lpMintedSlippage] as const
      args_ = args
      call = stableSwapContract.estimateGas
        .add_liquidity(args, {
          account: contract.account,
        })
        .then((estimatedGasLimit) => {
          return stableSwapContract.write.add_liquidity(args, {
            gas: calculateGasMargin(estimatedGasLimit),
            gasPrice,
            account: contract.account,
            chain: contract.chain,
          })
        })
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await call
      .then((response) => {
        setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response })

        const symbolA = currencies[Field.CURRENCY_A]?.symbol
        const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3) || '0'
        const symbolB = currencies[Field.CURRENCY_B]?.symbol
        const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3) || '0'
        addTransaction(
          { hash: response },
          {
            summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
            translatableSummary: {
              text: 'Add %amountA% %symbolA% and %amountB% %symbolB%',
              data: { amountA, symbolA, amountB, symbolB },
            },
            type: 'add-liquidity',
          },
        )
      })
      .catch((err) => {
        if (err && !isUserRejected(err)) {
          logError(err)
          console.error(`Add Liquidity failed`, err, args_, value_)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && !isUserRejected(error)
              ? t('Add liquidity failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
              : undefined,
          txHash: undefined,
        })
      })
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: formatCurrencyAmount(parsedAmounts[Field.CURRENCY_A], 4, locale),
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: formatCurrencyAmount(parsedAmounts[Field.CURRENCY_B], 4, locale),
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      onFieldBInput('')
    }

    setLiquidityState({
      attemptingTxn: false,
      liquidityErrorMessage: undefined,
      txHash: undefined,
    })
  }, [onFieldAInput, onFieldBInput, txHash])

  const [onPresentAddLiquidityModal] = useModal(
    <ConfirmAddLiquidityModal
      title={noLiquidity ? t('You are creating a trading pair') : t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
      allowedSlippage={allowedSlippage}
      onAdd={onAdd}
      parsedAmounts={parsedAmounts}
      currencies={currencies}
      liquidityErrorMessage={liquidityErrorMessage}
      price={price}
      noLiquidity={noLiquidity}
      poolTokenPercentage={poolTokenPercentage}
      liquidityMinted={liquidityMinted}
      isStable
    />,
    true,
    true,
    'addLiquidityModal',
  )

  let isValid = !error
  let errorText = error

  isValid = !error && !addError
  errorText = error ?? addError

  const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts

  const notApprovalYet =
    (parsedAmountA?.greaterThan(0) && approvalA !== ApprovalState.APPROVED) ||
    (parsedAmountB?.greaterThan(0) && approvalB !== ApprovalState.APPROVED)

  const buttonDisabled = !isValid || notApprovalYet || (slippageSeverity > 2 && !expertMode)

  const showFieldAApproval = approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING
  const showFieldBApproval = approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  return children({
    noLiquidity,
    formattedAmounts,
    onFieldAInput,
    onFieldBInput,
    maxAmounts,
    currencies,
    pairState,
    poolTokenPercentage,
    price,
    executionSlippage,
    loading,
    infoLoading,
    allowedSlippage,
    stableAPR,
    shouldShowApprovalGroup,
    showFieldAApproval,
    approveACallback,
    approvalA,
    showFieldBApproval,
    approvalB,
    approveBCallback,
    onAdd,
    onPresentAddLiquidityModal,
    buttonDisabled,
    errorText,
    setLiquidityState,
    reserves,
    pair,
  })
}
