import { ReactElement, useCallback, useMemo, useState } from 'react'
import { Currency, CurrencyAmount, Pair, Percent, Price, Token } from '@pancakeswap/sdk'
import { useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useUserSlippage } from '@pancakeswap/utils/user'

import { V2_ROUTER_ADDRESS } from 'config/constants/exchange'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import { useLPApr } from 'state/swap/useLPApr'
import { isUserRejected, logError } from 'utils/sentry'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { Handler } from '@pancakeswap/uikit/src/widgets/Modal/types'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { Hash } from 'viem'
import { SendTransactionResult } from 'wagmi/actions'

import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { PairState } from '../../hooks/usePairs'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import { useGasPrice, usePairAdder } from '../../state/user/hooks'
import { calculateGasMargin } from '../../utils'
import { calculateSlippageAmount, useRouterContract } from '../../utils/exchange'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import ConfirmAddLiquidityModal from './components/ConfirmAddLiquidityModal'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'
import SettingsModal from '../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../components/Menu/GlobalSettings/types'

export interface LP2ChildrenProps {
  error: string
  currencies: {
    [Field.CURRENCY_A]?: Currency
    [Field.CURRENCY_B]?: Currency
  }
  noLiquidity: boolean
  handleCurrencyASelect: (currencyA_: Currency) => void
  formattedAmounts: {
    [Field.CURRENCY_A]?: string
    [Field.CURRENCY_B]?: string
  }
  onFieldAInput: (typedValue: string) => void
  maxAmounts: { [field in Field]?: CurrencyAmount<Token> }
  handleCurrencyBSelect: (currencyB_: Currency) => void
  onFieldBInput: (typedValue: string) => void
  pairState: PairState
  poolTokenPercentage: Percent
  price: Price<Currency, Currency>
  onPresentSettingsModal: Handler
  allowedSlippage: number
  pair: Pair
  poolData: {
    lpApr7d: number
  }
  shouldShowApprovalGroup: boolean
  showFieldAApproval: boolean
  approveACallback: () => Promise<SendTransactionResult>
  approvalA: ApprovalState
  showFieldBApproval: boolean
  approveBCallback: () => Promise<SendTransactionResult>
  approvalB: ApprovalState
  onAdd: () => Promise<void>
  onPresentAddLiquidityModal: Handler
  buttonDisabled: boolean
  errorText: string
  addIsWarning: boolean
  addIsUnsupported: boolean
  pendingText: string
}

export default function AddLiquidity({
  currencyA,
  currencyB,
  children,
}: {
  currencyA: Currency
  currencyB: Currency
  children: (props: LP2ChildrenProps) => ReactElement
}) {
  const { account, chainId } = useAccountActiveChain()

  const addPair = usePairAdder()

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
    parsedAmounts: mintParsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const poolData = useLPApr(pair)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

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
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippage() // custom from users

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

  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  const parsedAmounts = mintParsedAmounts

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [dependentField, independentField, noLiquidity, otherTypedValue, parsedAmounts, typedValue],
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], V2_ROUTER_ADDRESS[chainId])
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], V2_ROUTER_ADDRESS[chainId])

  const addTransaction = useTransactionAdder()

  const routerContract = useRouterContract()

  async function onAdd() {
    if (!chainId || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = mintParsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate
    let method
    let args: Array<string | string[] | number | bigint>
    let value: bigint | null
    if (currencyA?.isNative || currencyB?.isNative) {
      const tokenBIsNative = currencyB?.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.write.addLiquidityETH
      args = [
        (tokenBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsNative ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline,
      ]
      value = (tokenBIsNative ? parsedAmountB : parsedAmountA).quotient
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.write.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline,
      ]
      value = null
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(
      args,
      value
        ? { value, account: routerContract.account, chain: routerContract.chain }
        : { account: routerContract.account, chain: routerContract.chain },
    )
      .then((estimatedGasLimit) =>
        method(args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response: Hash) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response })

          const symbolA = currencies[Field.CURRENCY_A]?.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const symbolB = currencies[Field.CURRENCY_B]?.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
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

          if (pair) {
            addPair(pair)
          }
        }),
      )
      ?.catch((err) => {
        if (err && !isUserRejected(err)) {
          logError(err)
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && !isUserRejected(err)
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
    }
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const [onPresentAddLiquidityModal_] = useModal(
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
    />,
    true,
    true,
    'addLiquidityModal',
  )

  const onPresentAddLiquidityModal = useCallback(() => {
    setLiquidityState({
      attemptingTxn: false,
      liquidityErrorMessage: undefined,
      txHash: undefined,
    })
    onPresentAddLiquidityModal_()
  }, [onPresentAddLiquidityModal_])

  const isValid = !error && !addError
  const errorText = error ?? addError

  const buttonDisabled = !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED

  const showFieldAApproval = approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING
  const showFieldBApproval = approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  return children({
    error,
    currencies,
    noLiquidity,
    handleCurrencyASelect,
    formattedAmounts,
    onFieldAInput,
    maxAmounts,
    handleCurrencyBSelect,
    onFieldBInput,
    pairState,
    poolTokenPercentage,
    price,
    onPresentSettingsModal,
    allowedSlippage,
    pair,
    poolData,
    shouldShowApprovalGroup,
    showFieldAApproval,
    approveACallback,
    approvalA,
    showFieldBApproval,
    approveBCallback,
    approvalB,
    onAdd,
    onPresentAddLiquidityModal,
    buttonDisabled,
    errorText,
    addIsWarning,
    addIsUnsupported,
    pendingText,
  })
}
