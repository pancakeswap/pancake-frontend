import { BigNumber } from '@ethersproject/bignumber'
import { CommonBasesType } from 'components/SearchModal/types'

import { Currency, Percent } from '@pancakeswap/sdk'
import { AutoColumn, Box, Button, CardBody, ConfirmationModalContent, useModal } from '@pancakeswap/uikit'
import { useDerivedPositionInfo } from 'hooks/v3/useDerivedPositionInfo'
import { useV3PositionFromTokenId, useV3TokenIdsByAccount } from 'hooks/v3/useV3Positions'
import useV3DerivedInfo from 'hooks/v3/useV3DerivedInfo'
import { FeeAmount, MasterChefV3, NonfungiblePositionManager } from '@pancakeswap/v3-sdk'
import { useCallback, useState } from 'react'
import _isNaN from 'lodash/isNaN'
import useTransactionDeadline from 'hooks/useTransactionDeadline'
import { useUserSlippage, useIsExpertMode } from '@pancakeswap/utils/user'
// import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Field } from 'state/mint/actions'

import { useTransactionAdder } from 'state/transactions/hooks'
import { useMasterchefV3, useV3NFTPositionManagerContract } from 'hooks/useContract'
// import { TransactionResponse } from '@ethersproject/providers'
import { calculateGasMargin } from 'utils'
import { useRouter } from 'next/router'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
// import useBUSDPrice from 'hooks/useBUSDPrice'
import { useSigner } from 'wagmi'
import Page from 'views/Page'
import { AppHeader } from 'components/App'
import { TransactionResponse } from '@ethersproject/providers'

import { BodyWrapper } from 'components/App/AppBody'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import TransactionConfirmationModal from 'components/TransactionConfirmationModal'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { formatRawAmount } from 'utils/formatCurrencyAmount'

import { useV3MintActionHandlers } from './formViews/V3FormView/form/hooks/useV3MintActionHandlers'
import { PositionPreview } from './formViews/V3FormView/components/PositionPreview'
import LockedDeposit from './formViews/V3FormView/components/LockedDeposit'
import { V3SubmitButton } from './components/V3SubmitButton'
import { useV3FormState } from './formViews/V3FormView/form/reducer'

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
  const expertMode = useIsExpertMode()

  const { account, chainId, isWrongNetwork } = useActiveWeb3React()

  const masterchefV3 = useMasterchefV3()
  const { tokenIds: stakedTokenIds, loading: tokenIdsInMCv3Loading } = useV3TokenIdsByAccount(masterchefV3, account)

  const [txHash, setTxHash] = useState<string>('')

  const addTransaction = useTransactionAdder()
  // fee selection from url
  const feeAmount: FeeAmount | undefined =
    feeAmountFromUrl && Object.values(FeeAmount).includes(parseFloat(feeAmountFromUrl))
      ? parseFloat(feeAmountFromUrl)
      : undefined
  // check for existing position if tokenId in url
  const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(
    tokenId ? BigNumber.from(tokenId) : undefined,
  )

  const hasExistingPosition = !!existingPositionDetails && !positionLoading
  const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)
  // prevent an error if they input ETH/WETH
  const quoteCurrency =
    baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB
  // mint state
  const formState = useV3FormState()
  const { independentField, typedValue } = formState

  const {
    dependentField,
    parsedAmounts,
    position,
    noLiquidity,
    currencies,
    errorMessage,
    invalidRange,
    outOfRange,
    depositADisabled,
    depositBDisabled,
    ticksAtLimit,
  } = useV3DerivedInfo(
    baseCurrency ?? undefined,
    quoteCurrency ?? undefined,
    feeAmount,
    baseCurrency ?? undefined,
    existingPosition,
    formState,
  )
  const { onFieldAInput, onFieldBInput } = useV3MintActionHandlers(noLiquidity)
  const isValid = !errorMessage && !invalidRange

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  // get formatted amounts
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

  const positionManager = useV3NFTPositionManagerContract()
  //   // check whether the user has approved the router on the tokens
  //   // Philip TODO: Add 'auto' allowedSlippage
  const [allowedSlippage] = useUserSlippage() // custom from users
  //   // const allowedSlippage = useUserSlippageToleranceWithDefault(
  //   //   outOfRange ? ZERO_PERCENT : DEFAULT_ADD_IN_RANGE_SLIPPAGE_TOLERANCE,
  //   // )

  const isStakedInMCv3 = Boolean(tokenId && stakedTokenIds.find((id) => id.eq(tokenId)))

  const manager = isStakedInMCv3 ? masterchefV3 : positionManager
  const interfaceManager = isStakedInMCv3 ? MasterChefV3 : NonfungiblePositionManager

  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], manager?.address)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], manager?.address)

  // we need an existence check on parsed amounts for single-asset deposits
  const showApprovalA = approvalA !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_A]
  const showApprovalB = approvalB !== ApprovalState.APPROVED && !!parsedAmounts[Field.CURRENCY_B]

  const onIncrease = useCallback(async () => {
    if (!chainId || !signer || !account || !positionManager || !masterchefV3) return

    if (tokenIdsInMCv3Loading || !positionManager || !baseCurrency || !quoteCurrency) {
      return
    }

    if (position && account && deadline) {
      const useNative = baseCurrency.isNative ? baseCurrency : quoteCurrency.isNative ? quoteCurrency : undefined
      const { calldata, value } =
        hasExistingPosition && tokenId
          ? interfaceManager.addCallParameters(position, {
              tokenId,
              slippageTolerance: new Percent(allowedSlippage, 100),
              deadline: deadline.toString(),
              useNative,
            })
          : interfaceManager.addCallParameters(position, {
              slippageTolerance: new Percent(allowedSlippage, 100),
              recipient: account,
              deadline: deadline.toString(),
              useNative,
              createPool: noLiquidity,
            })

      const txn: { to: string; data: string; value: string } = {
        to: manager.address,
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
            const baseAmount = formatRawAmount(
              parsedAmounts[Field.CURRENCY_A]?.quotient?.toString() ?? '0',
              baseCurrency.decimals,
              4,
            )
            const quoteAmount = formatRawAmount(
              parsedAmounts[Field.CURRENCY_B]?.quotient?.toString() ?? '0',
              quoteCurrency.decimals,
              4,
            )

            setAttemptingTxn(false)
            addTransaction(response, {
              type: 'increase-liquidity-v3',
              summary: `Increase ${baseAmount} ${baseCurrency?.symbol} and ${quoteAmount} ${quoteCurrency?.symbol}`,
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
    interfaceManager,
    manager.address,
    masterchefV3,
    noLiquidity,
    parsedAmounts,
    position,
    positionManager,
    quoteCurrency,
    signer,
    tokenId,
    tokenIdsInMCv3Loading,
  ])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
      router.push('/liquidity')
    }
  }, [onFieldAInput, router, txHash])

  const pendingText = `Supplying ${!depositADisabled ? parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) : ''} ${
    !depositADisabled ? currencies[Field.CURRENCY_A]?.symbol : ''
  } ${!outOfRange ? 'and' : ''} ${!depositBDisabled ? parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) : ''} ${
    !depositBDisabled ? currencies[Field.CURRENCY_B]?.symbol : ''
  }`

  const [onPresentIncreaseLiquidityModal] = useModal(
    <TransactionConfirmationModal
      style={{
        width: '420px',
      }}
      title="Increase Liquidity"
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => (
        <ConfirmationModalContent
          topContent={() =>
            position ? <PositionPreview position={position} inRange={!outOfRange} ticksAtLimit={ticksAtLimit} /> : null
          }
          bottomContent={() => (
            <Button width="100%" mt="16px" onClick={onIncrease}>
              Increase
            </Button>
          )}
        />
      )}
      pendingText={pendingText}
    />,
    true,
    true,
    'TransactionConfirmationModalIncreaseLiquidity',
  )

  const handleButtonSubmit = useCallback(
    () => (expertMode ? onIncrease() : onPresentIncreaseLiquidityModal()),
    [expertMode, onIncrease, onPresentIncreaseLiquidityModal],
  )

  const buttons = (
    <V3SubmitButton
      addIsUnsupported={addIsUnsupported}
      addIsWarning={addIsWarning}
      account={account}
      isWrongNetwork={isWrongNetwork}
      approvalA={approvalA}
      approvalB={approvalB}
      isValid={isValid}
      showApprovalA={showApprovalA}
      approveACallback={approveACallback}
      currencies={currencies}
      approveBCallback={approveBCallback}
      showApprovalB={showApprovalB}
      parsedAmounts={parsedAmounts}
      onClick={handleButtonSubmit}
      attemptingTxn={attemptingTxn}
      errorMessage={errorMessage}
      buttonText={t('Increase')}
      depositADisabled={depositADisabled}
      depositBDisabled={depositBDisabled}
    />
  )

  return (
    <Page>
      <BodyWrapper>
        <AppHeader
          backTo={`/liquidity/${tokenId}`}
          title={t('Add %assetA%-%assetB% Liquidity', {
            assetA: currencies[Field.CURRENCY_A]?.symbol ?? '',
            assetB: currencies[Field.CURRENCY_B]?.symbol ?? '',
          })}
          noConfig
        />{' '}
        <CardBody>
          <Box mb="16px">
            {existingPosition && (
              <PositionPreview
                position={existingPosition}
                title="Selected Range"
                inRange={!outOfRange}
                ticksAtLimit={ticksAtLimit}
              />
            )}
            <Box mt="16px">
              <LockedDeposit locked={depositADisabled} mb="8px">
                <CurrencyInputPanel
                  disableCurrencySelect
                  // showBUSD
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  showQuickInputButton
                  showMaxButton
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                  showCommonBases
                  commonBasesType={CommonBasesType.LIQUIDITY}
                />
              </LockedDeposit>
              <LockedDeposit locked={depositBDisabled} mt="8px">
                <CurrencyInputPanel
                  disableCurrencySelect
                  // showBUSD
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  showQuickInputButton
                  showMaxButton
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  showCommonBases
                  commonBasesType={CommonBasesType.LIQUIDITY}
                />
              </LockedDeposit>
            </Box>
          </Box>
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
