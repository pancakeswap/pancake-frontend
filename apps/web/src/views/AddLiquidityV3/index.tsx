// import { BigNumber } from '@ethersproject/bignumber'
import { CurrencySelect } from 'components/CurrencySelect'
import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import { Box, FlexGap, AutoColumn, Button, Dots, RowBetween } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import useLocalSelector from 'contexts/LocalRedux/useSelector'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
// import { useNavigate, useParams } from 'react-router-dom'
import { FeeAmount, NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
import { LiquidityFormState } from 'hooks/v3/types'
import {
  useCallback,
  // useEffect,
  useState,
  useMemo,
} from 'react'
// import useParsedQueryString from 'hooks/useParsedQueryString'
import _isNaN from 'lodash/isNaN'
import useTransactionDeadline from 'hooks/useTransactionDeadline'

import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Field } from 'state/mint/actions'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'

import {
  // useIsExpertMode,
  useUserSlippageTolerance,
} from 'state/user/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
// import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from 'utils'
import currencyId from 'utils/currencyId'
import { useCurrencySelectRoute } from 'views/AddLiquidity/useCurrencySelectRoute'
import { useRouter } from 'next/router'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import useRangeHopCallbacks from 'hooks/v3/useRangeHopCallbacks'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
// import useBUSDPrice from 'hooks/useBUSDPrice'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { usePrepareSendTransaction } from 'wagmi'
import { BigNumber } from '@ethersproject/bignumber'
import { sendTransaction } from '@wagmi/core'

import { useV3MintActionHandlers } from './form/hooks'
import { Bound } from './form/actions'
import FeeSelector from './components/FeeSelector'
import RangeSelector from './components/RangeSelector'

interface AddLiquidityV3PropsType {
  currencyA: Currency
  currencyB: Currency
}

export default function AddLiquidityV3({ currencyA: baseCurrency, currencyB }: AddLiquidityV3PropsType) {
  const router = useRouter()

  const [currencyIdA, currencyIdB, feeAmountFromUrl, tokenId] = router.query.currency || []

  const { t } = useTranslation()
  // const expertMode = useIsExpertMode()

  const positionManager = useV3NFTPositionManagerContract()
  const { account, chainId, provider, isWrongNetwork } = useActiveWeb3React()
  // const parsedQs = useParsedQueryString()
  const addTransaction = useTransactionAdder()
  // // fee selection from url
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined
  // // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined,
  )
  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)
  // // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB
  // mint state
  const formState = useLocalSelector<LiquidityFormState>((s) => s) as LiquidityFormState
  const {
    independentField,
    typedValue,
    //  startPriceTypedValue, rightRangeTypedValue, leftRangeTypedValue
  } = formState

  const {
    pool,
    ticks,
    dependentField,
    // price,
    pricesAtTicks,
    parsedAmounts,
    currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    // invalidPool,
    invalidRange,
    // outOfRange,
    depositADisabled,
    depositBDisabled,
    // invertPrice,
    ticksAtLimit,
  } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )
  const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } =
    useV3MintActionHandlers(noLiquidity)
  const isValid = !errorMessage && !invalidRange
  // modal and loading
  //   const [showConfirm, setShowConfirm] = useState<boolean>(false)
  //   // capital efficiency warning
  //   const [showCapitalEfficiencyWarning, setShowCapitalEfficiencyWarning] = useState<boolean>(false)
  //   useEffect(() => setShowCapitalEfficiencyWarning(false), [baseCurrency, quoteCurrency, feeAmount])
  //   useEffect(() => {
  //     if (
  //       parsedQs.minPrice &&
  //       typeof parsedQs.minPrice === 'string' &&
  //       parsedQs.minPrice !== leftRangeTypedValue &&
  //       !_isNaN(parsedQs.minPrice as any)
  //     ) {
  //       onLeftRangeInput(parsedQs.minPrice)
  //     }
  //     if (
  //       parsedQs.maxPrice &&
  //       typeof parsedQs.maxPrice === 'string' &&
  //       parsedQs.maxPrice !== rightRangeTypedValue &&
  //       !_isNaN(parsedQs.maxPrice as any)
  //     ) {
  //       onRightRangeInput(parsedQs.maxPrice)
  //     }
  //   }, [parsedQs, rightRangeTypedValue, leftRangeTypedValue, onRightRangeInput, onLeftRangeInput])
  //   // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [, setTxHash] = useState<string>('')
  //   // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }
  // const usdcValues = {
  //   [Field.CURRENCY_A]: useBUSDPrice(parsedAmounts[Field.CURRENCY_A]?.currency),
  //   [Field.CURRENCY_B]: useBUSDPrice(parsedAmounts[Field.CURRENCY_B]?.currency),
  // }
  //   // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )
  const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )
  const nftPositionManagerAddress = useV3NFTPositionManagerContract().address
  //   // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], nftPositionManagerAddress)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], nftPositionManagerAddress)
  //   // Philip TODO: Add 'auto' allowedSlippage
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  //   // const allowedSlippage = useUserSlippageToleranceWithDefault(
  //   //   outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
  //   // )

  const txn = useMemo(() => {
    if (
      !chainId ||
      !provider ||
      !account ||
      !positionManager ||
      !baseCurrency ||
      !quoteCurrency ||
      !position ||
      !account ||
      !deadline
    ) {
      return undefined
    }

    const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined

    const { calldata, value } =
      hasExistingPosition && tokenId
        ? NonfungiblePositionManager.addCallParameters(position, {
            tokenId,
            slippageTolerance: new Percent(allowedSlippage, 100),
            deadline: deadline.toString(),
            useNative,
          })
        : NonfungiblePositionManager.addCallParameters(position, {
            slippageTolerance: new Percent(allowedSlippage, 100),
            recipient: account,
            deadline: deadline.toString(),
            useNative,
            createPool: noLiquidity,
          })

    const tx: { to: string; data: string; value: string } = {
      to: nftPositionManagerAddress,
      data: calldata,
      value,
    }

    return tx
  }, [
    account,
    allowedSlippage,
    baseCurrency,
    chainId,
    deadline,
    hasExistingPosition,
    nftPositionManagerAddress,
    noLiquidity,
    position,
    positionManager,
    provider,
    quoteCurrency,
    tokenId,
  ])

  const { config } = usePrepareSendTransaction({
    request: txn,
  })

  const onAdd = useCallback(() => {
    sendTransaction({
      ...config,
      request: {
        ...config?.request,
        ...(config?.request?.gasLimit && { gasLimit: calculateGasMargin(BigNumber.from(config?.request?.gasLimit)) }),
      },
    }).then((txnResponse) => {
      addTransaction(txnResponse, {
        type: 'add-liquidity-v3',
        baseCurrencyId: currencyId(baseCurrency),
        quoteCurrencyId: currencyId(quoteCurrency),
        createPool: Boolean(noLiquidity),
        expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
        expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
        feeAmount: position.pool.fee,
      })
      setTxHash(txnResponse.hash)
    })
  }, [addTransaction, baseCurrency, config, noLiquidity, parsedAmounts, position.pool.fee, quoteCurrency])

  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()
  const handleFeePoolSelect = useCallback(
    (newFeeAmount: FeeAmount) => {
      onLeftRangeInput('')
      onRightRangeInput('')

      router.replace(`/add/${currencyIdA}/${currencyIdB}/${newFeeAmount}`, undefined, { shallow: true })
    },
    [currencyIdA, currencyIdB, onLeftRangeInput, onRightRangeInput, router],
  )
  //   const handleDismissConfirmation = useCallback(() => {
  //     setShowConfirm(false)
  //     // if there was a tx hash, we want to clear the input
  //     if (txHash) {
  //       onFieldAInput('')
  //       // dont jump to pool page if creating
  //       navigate('/pool')
  //     }
  //     setTxHash('')
  //   }, [navigate, onFieldAInput, txHash])
  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  //   // const clearAll = useCallback(() => {
  //   //   onFieldAInput('')
  //   //   onFieldBInput('')
  //   //   onLeftRangeInput('')
  //   //   onRightRangeInput('')
  //   //   navigate(`/add`)
  //   // }, [navigate, onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput])
  //   // get value and prices at ticks
  const { [Bound.LOWER]: tickLower, [Bound.UPPER]: tickUpper } = ticks
  const { [Bound.LOWER]: priceLower, [Bound.UPPER]: priceUpper } = pricesAtTicks
  const { getDecrementLower, getIncrementLower, getDecrementUpper, getIncrementUpper, getSetFullRange } =
    useRangeHopCallbacks(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, tickLower, tickUpper, pool)
  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]
  // const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
  //   !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
  // } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
  //   !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''
  // }`
  const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  let buttons
  if (addIsUnsupported || addIsWarning) {
    buttons = (
      <Button disabled mb="4px">
        {t('Unsupported Asset')}
      </Button>
    )
  } else if (!account) {
    buttons = <ConnectWalletButton />
  } else if (isWrongNetwork) {
    buttons = <CommitButton />
  } else {
    buttons = (
      <AutoColumn gap="md">
        {(approvalA === ApprovalState.NOT_APPROVED ||
          approvalA === ApprovalState.PENDING ||
          approvalB === ApprovalState.NOT_APPROVED ||
          approvalB === ApprovalState.PENDING) &&
          isValid && (
            <RowBetween style={{ gap: '8px' }}>
              {showApprovalA && (
                <Button onClick={approveACallback} disabled={approvalA === ApprovalState.PENDING} width="100%">
                  {approvalA === ApprovalState.PENDING ? (
                    <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                  ) : (
                    t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                  )}
                </Button>
              )}
              {showApprovalB && (
                <Button onClick={approveBCallback} disabled={approvalB === ApprovalState.PENDING} width="100%">
                  {approvalB === ApprovalState.PENDING ? (
                    <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                  ) : (
                    t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                  )}
                </Button>
              )}
            </RowBetween>
          )}
        <CommitButton
          variant={
            !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'danger' : 'primary'
          }
          onClick={() => onAdd()}
          disabled={
            !isValid ||
            (approvalA !== ApprovalState.APPROVED && !depositADisabled) ||
            (approvalB !== ApprovalState.APPROVED && !depositBDisabled)
          }
        >
          {errorMessage || t('Supply')}
        </CommitButton>
      </AutoColumn>
    )
  }

  return (
    <Box>
      <FlexGap gap="4px">
        <CurrencySelect
          id="add-liquidity-select-tokena"
          selectedCurrency={baseCurrency}
          onCurrencySelect={handleCurrencyASelect}
          showCommonBases
          commonBasesType={CommonBasesType.LIQUIDITY}
        />
        <CurrencySelect
          id="add-liquidity-select-tokenb"
          selectedCurrency={currencyB}
          onCurrencySelect={handleCurrencyBSelect}
          showCommonBases
          commonBasesType={CommonBasesType.LIQUIDITY}
        />
      </FlexGap>
      <Box>
        <FeeSelector handleFeePoolSelect={handleFeePoolSelect} feeAmount={feeAmountFromUrl} />
      </Box>
      <Box>
        <RangeSelector
          priceLower={priceLower}
          priceUpper={priceUpper}
          getDecrementLower={getDecrementLower}
          getIncrementLower={getIncrementLower}
          getDecrementUpper={getDecrementUpper}
          getIncrementUpper={getIncrementUpper}
          onLeftRangeInput={onLeftRangeInput}
          onRightRangeInput={onRightRangeInput}
          currencyA={baseCurrency}
          currencyB={quoteCurrency}
          feeAmount={feeAmount}
          ticksAtLimit={ticksAtLimit}
        />
      </Box>
      <FlexGap>
        <CurrencyInputPanel
          value={formattedAmounts[Field.CURRENCY_A]}
          onUserInput={onFieldAInput}
          onMax={() => {
            onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
          }}
          showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
          currency={currencies[Field.CURRENCY_A] ?? null}
          id="add-liquidity-input-tokena"
          showCommonBases
        />
        <CurrencyInputPanel
          value={formattedAmounts[Field.CURRENCY_B]}
          onUserInput={onFieldBInput}
          onMax={() => {
            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
          }}
          showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
          currency={currencies[Field.CURRENCY_B] ?? null}
          id="add-liquidity-input-tokenb"
          showCommonBases
        />
      </FlexGap>
      {buttons}
    </Box>
  )
}
