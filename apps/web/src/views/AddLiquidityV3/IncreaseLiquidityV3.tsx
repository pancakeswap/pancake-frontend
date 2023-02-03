import { BigNumber } from '@ethersproject/bignumber'
import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, Percent } from '@pancakeswap/sdk'
import { AutoColumn, Flex, Button, CardBody } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import useLocalSelector from 'contexts/LocalRedux/useSelector'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { useV3PositionFromTokenId } from 'hooks/v3/useV3Positions'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { FeeAmount, NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
import { LiquidityFormState } from 'hooks/v3/types'
import {
  useCallback,
  // useEffect,
  useState,
} from 'react'
// import useParsedQueryString from 'hooks/useParsedQueryString'
import _isNaN from 'lodash/isNaN'
import useTransactionDeadline from 'hooks/useTransactionDeadline'

// import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Field } from 'state/mint/actions'

import {
  // useIsExpertMode,
  useUserSlippageTolerance,
} from 'state/user/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { useV3NFTPositionManagerContract } from 'hooks/useContract'
// import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from 'utils'
import currencyId from 'utils/currencyId'
import { useRouter } from 'next/router'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
// import useBUSDPrice from 'hooks/useBUSDPrice'
import { useSigner } from 'wagmi'
import Page from 'views/Page'
import { AppHeader } from 'components/App'
import { TransactionResponse } from '@ethersproject/providers'

import { BodyWrapper } from 'components/App/AppBody'
import CurrencyInputPanel from 'components/CurrencyInputPanel'

import { useV3MintActionHandlers } from './form/hooks'
import { PositionPreview } from './components/PositionPreview'

interface AddLiquidityV3PropsType {
  currencyA: Currency
  currencyB: Currency
}

export default function IncreaseLiquidityV3({ currencyA: baseCurrency, currencyB }: AddLiquidityV3PropsType) {
  const router = useRouter()
  const { data: signer } = useSigner()
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  const [, , feeAmountFromUrl, tokenId] = router.query.currency || []

  const { t } = useTranslation()
  // const expertMode = useIsExpertMode()

  const positionManager = useV3NFTPositionManagerContract()
  const { account, chainId, isWrongNetwork } = useActiveWeb3React()
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
    dependentField,
    // price,
    parsedAmounts,
    // currencyBalances,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    // invalidPool,
    invalidRange,
    outOfRange,
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
  const {
    onFieldAInput,
    onFieldBInput,
    // onStartPriceInput
  } = useV3MintActionHandlers(noLiquidity)
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
  // const maxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
  //   (accumulator, field) => {
  //     return {
  //       ...accumulator,
  //       [field]: maxAmountSpend(currencyBalances[field]),
  //     }
  //   },
  //   {},
  // )
  // const atMaxAmounts: { [field in Field]?: CurrencyAmount<Currency> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
  //   (accumulator, field) => {
  //     return {
  //       ...accumulator,
  //       [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
  //     }
  //   },
  //   {},
  // )
  const nftPositionManagerAddress = useV3NFTPositionManagerContract()?.address
  //   // check whether the user has approved the router on the tokens
  //   // Philip TODO: Add 'auto' allowedSlippage
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  //   // const allowedSlippage = useUserSlippageToleranceWithDefault(
  //   //   outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
  //   // )

  const onAdd = useCallback(async () => {
    if (!chainId || !signer || !account || !nftPositionManagerAddress) return

    if (!positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
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

      const txn: { to: string; data: string; value: string } = {
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

          return signer.sendTransaction(newTxn).then((response: TransactionResponse) => {
            setAttemptingTxn(false)
            addTransaction(response, {
              type: 'add-liquidity-v3',
              baseCurrencyId: currencyId(baseCurrency),
              quoteCurrencyId: currencyId(quoteCurrency),
              createPool: Boolean(noLiquidity),
              expectedAmountBaseRaw: parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
              expectedAmountQuoteRaw: parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
              feeAmount: position.pool.fee,
            })
            setTxHash(response.hash)
          })
        })
        .catch((error) => {
          console.error('Failed to send transaction', error)
          setAttemptingTxn(false)
          // we only care if the error is something _other_ than the user rejected the tx
          if (error?.code !== 4001) {
            console.error(error)
          }
        })
    }
  }, [
    account,
    addTransaction,
    allowedSlippage,
    baseCurrency,
    chainId,
    deadline,
    hasExistingPosition,
    nftPositionManagerAddress,
    noLiquidity,
    parsedAmounts,
    position,
    positionManager,
    quoteCurrency,
    signer,
    tokenId,
  ])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

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
        <CommitButton
          variant={
            !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'danger' : 'primary'
          }
          onClick={() => onAdd()}
          disabled={!isValid || attemptingTxn}
        >
          {errorMessage || t('Supply')}
        </CommitButton>
      </AutoColumn>
    )
  }

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          backTo={`/pool-v3/${tokenId}`}
          title={t('Add %assetA%-%assetB% liquidity', {
            assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
            assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
          })}
          noConfig
        />{' '}
        <CardBody>
          <Flex mb="16px">
            {existingPosition && (
              <PositionPreview
                position={existingPosition}
                title="Selected Range"
                inRange={!outOfRange}
                ticksAtLimit={ticksAtLimit}
              />
            )}
            <CurrencyInputPanel
              disableCurrencySelect
              showBUSD
              value={formattedAmounts[Field.CURRENCY_A]}
              onUserInput={onFieldAInput}
              showQuickInputButton
              showMaxButton
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokenb"
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
            <CurrencyInputPanel
              disableCurrencySelect
              showBUSD
              value={formattedAmounts[Field.CURRENCY_B]}
              onUserInput={onFieldBInput}
              showQuickInputButton
              showMaxButton
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
              commonBasesType={CommonBasesType.LIQUIDITY}
            />
          </Flex>
          <AutoColumn
            style={{
              flexGrow: 1,
            }}
          >
            {buttons}
          </AutoColumn>
        </CardBody>
      </BodyWrapper>
    </Page>
  )
}
