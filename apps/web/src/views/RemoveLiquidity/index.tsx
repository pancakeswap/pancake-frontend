import { useDebouncedChangeHandler } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, Percent, WNATIVE } from '@pancakeswap/sdk'
import {
  AddIcon,
  ArrowDownIcon,
  AutoColumn,
  Box,
  Button,
  CardBody,
  ColumnCenter,
  Flex,
  IconButton,
  PencilIcon,
  Slider,
  Text,
  TooltipText,
  useMatchBreakpoints,
  useModal,
  useToast,
  useTooltip,
} from '@pancakeswap/uikit'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { CommitButton } from 'components/CommitButton'
import { formattedCurrencyAmount } from 'components/FormattedCurrencyAmount/FormattedCurrencyAmount'
import { V2_ROUTER_ADDRESS } from 'config/constants/exchange'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useLPApr } from 'state/swap/useLPApr'
import { styled } from 'styled-components'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
// import { splitSignature } from 'utils/splitSignature'
import { Hash } from 'viem'
import { useSignTypedData } from 'wagmi'

import { LightGreyCard } from 'components/Card'
import { RowBetween } from 'components/Layout/Row'
import { MinimalPositionCard } from 'components/PositionCard'

import { usePairContract } from 'hooks/useContract'

import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { useBurnActionHandlers, useDerivedBurnInfo } from 'state/burn/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { calculateGasMargin } from 'utils'
import { currencyId } from 'utils/currencyId'
import { calculateSlippageAmount, useRouterContract } from 'utils/exchange'

import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { CommonBasesType } from 'components/SearchModal/types'
import { Field } from 'state/burn/actions'
import { useRemoveLiquidityV2FormState } from 'state/burn/reducer'
import { useGasPrice } from 'state/user/hooks'
import { logGTMClickRemoveLiquidityEvent } from 'utils/customGTMEventTracking'
import { isUserRejected, logError } from 'utils/sentry'
import { AppBody, AppHeader } from '../../components/App'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import StyledInternalLink from '../../components/Links'
import Dots from '../../components/Loader/Dots'
import { CurrencyLogo } from '../../components/Logo'
import SettingsModal from '../../components/Menu/GlobalSettings/SettingsModal'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useTransactionDeadline } from '../../hooks/useTransactionDeadline'
import { formatAmount } from '../../utils/formatInfoNumbers'
import Page from '../Page'
import ConfirmLiquidityModal from '../Swap/components/ConfirmRemoveLiquidityModal'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`

export default function RemoveLiquidity({ currencyA, currencyB, currencyIdA, currencyIdB }) {
  const router = useRouter()
  const native = useNativeCurrency()
  const { isMobile } = useMatchBreakpoints()

  const { account, chainId, isWrongNetwork } = useActiveWeb3React()
  const { signTypedDataAsync } = useSignTypedData()
  const { toastError } = useToast()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  // burn state
  const { independentField, typedValue } = useRemoveLiquidityV2FormState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const poolData = useLPApr('v2', pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 24 hours' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )
  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // modal and loading
  const [showDetailed, setShowDetailed] = useState<boolean>(false)
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
  const [deadline] = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippage()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY
        ? typedValue
        : formattedCurrencyAmount({ currencyAmount: parsedAmounts[Field.LIQUIDITY] }),
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : formattedCurrencyAmount({ currencyAmount: parsedAmounts[Field.CURRENCY_A] }),
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : formattedCurrencyAmount({ currencyAmount: parsedAmounts[Field.CURRENCY_B] }),
  }

  // pair contract
  const pairContractRead = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const { approvalState, approveCallback } = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    chainId ? V2_ROUTER_ADDRESS[chainId] : undefined,
  )

  async function onAttemptToApprove() {
    if (!pairContractRead || !pair || !signTypedDataAsync || !deadline || !account)
      throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    return approveCallback()

    // // try to gather a signature for permission
    // const nonce = await pairContractRead.read.nonces([account])

    // const EIP712Domain = [
    //   { name: 'name', type: 'string' },
    //   { name: 'version', type: 'string' },
    //   { name: 'chainId', type: 'uint256' },
    //   { name: 'verifyingContract', type: 'address' },
    // ]
    // const domain = {
    //   name: 'Pancake LPs',
    //   version: '1',
    //   chainId,
    //   verifyingContract: pair.liquidityToken.address as `0x${string}`,
    // }
    // const Permit = [
    //   { name: 'owner', type: 'address' },
    //   { name: 'spender', type: 'address' },
    //   { name: 'value', type: 'uint256' },
    //   { name: 'nonce', type: 'uint256' },
    //   { name: 'deadline', type: 'uint256' },
    // ]
    // const message = {
    //   owner: account,
    //   spender: chainId ? V2_ROUTER_ADDRESS[chainId] : undefined,
    //   value: liquidityAmount.quotient.toString(),
    //   nonce,
    //   deadline: Number(deadline),
    // }

    // signTypedDataAsync({
    //   // @ts-ignore
    //   domain,
    //   primaryType: 'Permit',
    //   types: {
    //     EIP712Domain,
    //     Permit,
    //   },
    //   message,
    // })
    //   .then(splitSignature)
    //   .then((signature) => {
    //     setSignatureData({
    //       v: signature.v,
    //       r: signature.r,
    //       s: signature.s,
    //       deadline: Number(deadline),
    //     })
    //   })
    //   .catch((err) => {
    //     // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
    //     if (!isUserRejected(err)) {
    //       approveCallback()
    //     }
    //   })
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const onLiquidityInput = useCallback((value: string): void => onUserInput(Field.LIQUIDITY, value), [onUserInput])
  const onCurrencyAInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_A, value), [onUserInput])
  const onCurrencyBInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_B, value), [onUserInput])

  // tx sending
  const addTransaction = useTransactionAdder()

  const routerContract = useRouterContract()

  async function onRemove() {
    if (!chainId || !account || !deadline || !routerContract) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      toastError(t('Error'), t('Missing currency amounts'))
      throw new Error('missing currency amounts')
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(currencyAmountA, allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(currencyAmountB, allowedSlippage)[0],
    }

    if (!currencyA || !currencyB) {
      toastError(t('Error'), t('Missing tokens'))
      throw new Error('missing tokens')
    }
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    const currencyBIsNative = currencyB?.isNative
    const oneCurrencyIsNative = currencyA?.isNative || currencyBIsNative

    if (!tokenA || !tokenB) {
      toastError(t('Error'), t('Could not wrap'))
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: any
    // we have approval, use normal remove liquidity
    if (approvalState === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsNative) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsNative ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline,
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline,
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsNative) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsNative ? tokenA.address : tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.quotient.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      toastError(t('Error'), t('Attempting to confirm without approval or a signature'))
      throw new Error('Attempting to confirm without approval or a signature')
    }

    let methodSafeGasEstimate: { methodName: string; safeGasEstimate: bigint } | undefined
    for (let i = 0; i < methodNames.length; i++) {
      let safeGasEstimate: any
      try {
        // eslint-disable-next-line no-await-in-loop
        safeGasEstimate = calculateGasMargin(await routerContract.estimateGas[methodNames[i]](args, { account }))
      } catch (e) {
        console.error(`estimateGas failed`, methodNames[i], args, e)
      }

      if (typeof safeGasEstimate === 'bigint') {
        methodSafeGasEstimate = { methodName: methodNames[i], safeGasEstimate }
        break
      }
    }

    // all estimations failed...
    if (!methodSafeGasEstimate) {
      toastError(t('Error'), t('This transaction would fail'))
    } else {
      const { methodName, safeGasEstimate } = methodSafeGasEstimate

      setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
      await routerContract.write[methodName](args, {
        gas: safeGasEstimate,
        gasPrice,
      })
        .then((response: Hash) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response })
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
          addTransaction(
            { hash: response },
            {
              summary: `Remove ${amountA} ${currencyA?.symbol} and ${amountB} ${currencyB?.symbol}`,
              translatableSummary: {
                text: 'Remove %amountA% %symbolA% and %amountB% %symbolB%',
                data: { amountA, symbolA: currencyA?.symbol, amountB, symbolB: currencyB?.symbol },
              },
              type: 'remove-liquidity',
            },
          )
        })
        .catch((err: any) => {
          if (err && !isUserRejected(err)) {
            logError(err)
            console.error(`Remove Liquidity failed`, err, args)
          }
          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage:
              err && !isUserRejected(err)
                ? t('Remove liquidity failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
                : undefined,
            txHash: undefined,
          })
        })
    }
  }

  const pendingText = t('Removing %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencyA?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencyB?.symbol ?? '',
  })

  const liquidityPercentChangeCallback = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, value.toString())
    },
    [onUserInput],
  )

  const oneCurrencyIsNative = currencyA?.isNative || currencyB?.isNative
  const oneCurrencyIsWNative = Boolean(
    chainId &&
      ((currencyA && WNATIVE[chainId]?.equals(currencyA)) || (currencyB && WNATIVE[chainId]?.equals(currencyB))),
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        router.replace(`/v2/remove/${currencyId(currency)}/${currencyIdA}`, undefined, { shallow: true })
      } else {
        router.replace(`/v2/remove/${currencyId(currency)}/${currencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, router],
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        router.replace(`/v2/remove/${currencyIdB}/${currencyId(currency)}`, undefined, { shallow: true })
      } else {
        router.replace(`/v2/remove/${currencyIdA}/${currencyId(currency)}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, router],
  )

  const handleDismissConfirmation = useCallback(() => {
    setSignatureData(null) // important that we clear signature data to avoid bad sigs
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
  }, [onUserInput, txHash])

  const [innerLiquidityPercentage, setInnerLiquidityPercentage] = useDebouncedChangeHandler(
    Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)),
    liquidityPercentChangeCallback,
  )

  const handleChangePercent = useCallback(
    (value: any) => setInnerLiquidityPercentage(Math.ceil(value)),
    [setInnerLiquidityPercentage],
  )

  const [onPresentRemoveLiquidity] = useModal(
    <ConfirmLiquidityModal
      title={t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash || ''}
      allowedSlippage={allowedSlippage}
      onRemove={onRemove}
      pendingText={pendingText}
      approval={approvalState}
      signatureData={signatureData}
      tokenA={tokenA}
      tokenB={tokenB}
      liquidityErrorMessage={liquidityErrorMessage}
      parsedAmounts={parsedAmounts}
      currencyA={currencyA}
      currencyB={currencyB}
    />,
    true,
    true,
    'removeLiquidityModal',
  )

  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  return (
    <CardBody>
      <AutoColumn gap="20px">
        <RowBetween>
          <Text>{t('Amount')}</Text>
          <Button variant="text" scale="sm" onClick={() => setShowDetailed(!showDetailed)}>
            {showDetailed ? t('Simple') : t('Detailed')}
          </Button>
        </RowBetween>
        {!showDetailed && (
          <BorderCard style={{ padding: isMobile ? '8px' : '16px' }}>
            <Text fontSize="40px" bold mb="16px" style={{ lineHeight: 1 }}>
              {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
            </Text>
            <Slider
              name="lp-amount"
              min={0}
              max={100}
              value={innerLiquidityPercentage}
              onValueChanged={handleChangePercent}
              mb="16px"
            />
            <Flex flexWrap="wrap" justifyContent="space-evenly">
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '25')}>
                25%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '50')}>
                50%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '75')}>
                75%
              </Button>
              <Button variant="tertiary" scale="sm" onClick={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}>
                {t('Max')}
              </Button>
            </Flex>
          </BorderCard>
        )}
      </AutoColumn>
      {!showDetailed && (
        <>
          <ColumnCenter>
            <ArrowDownIcon color="textSubtle" width="24px" my="16px" />
          </ColumnCenter>
          <AutoColumn gap="12px">
            <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
              {t('Receive')}
            </Text>
            <LightGreyCard>
              <Flex justifyContent="space-between" mb="8px" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={currencyA} />
                  <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                    {currencyA?.symbol}
                  </Text>
                </Flex>
                <Flex>
                  <Text small bold>
                    {formattedAmounts[Field.CURRENCY_A] || '0'}
                  </Text>
                  <Text small ml="4px">
                    (50%)
                  </Text>
                </Flex>
              </Flex>
              <Flex justifyContent="space-between" as="label" alignItems="center">
                <Flex alignItems="center">
                  <CurrencyLogo currency={currencyB} />
                  <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                    {currencyB?.symbol}
                  </Text>
                </Flex>
                <Flex>
                  <Text bold small>
                    {formattedAmounts[Field.CURRENCY_B] || '0'}
                  </Text>
                  <Text small ml="4px">
                    (50%)
                  </Text>
                </Flex>
              </Flex>
              {chainId && (oneCurrencyIsWNative || oneCurrencyIsNative) ? (
                <RowBetween style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
                  {oneCurrencyIsNative ? (
                    <StyledInternalLink
                      href={`/v2/remove/${currencyA?.isNative ? WNATIVE[chainId]?.address : currencyIdA}/${
                        currencyB?.isNative ? WNATIVE[chainId]?.address : currencyIdB
                      }`}
                    >
                      {t('Receive %currency%', { currency: WNATIVE[chainId]?.symbol })}
                    </StyledInternalLink>
                  ) : oneCurrencyIsWNative ? (
                    <StyledInternalLink
                      href={`/v2/remove/${
                        currencyA && currencyA.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdA
                      }/${currencyB && currencyB.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdB}`}
                    >
                      {t('Receive %currency%', { currency: native?.symbol })}
                    </StyledInternalLink>
                  ) : null}
                </RowBetween>
              ) : null}
            </LightGreyCard>
          </AutoColumn>
        </>
      )}

      {showDetailed && (
        <Box my="16px">
          <CurrencyInputPanel
            value={formattedAmounts[Field.LIQUIDITY]}
            onUserInput={onLiquidityInput}
            onPercentInput={(percent) => {
              onUserInput(Field.LIQUIDITY_PERCENT, percent.toString())
            }}
            onMax={() => {
              onUserInput(Field.LIQUIDITY_PERCENT, '100')
            }}
            showQuickInputButton
            showMaxButton
            lpPercent={formattedAmounts[Field.LIQUIDITY_PERCENT]}
            disableCurrencySelect
            currency={pair?.liquidityToken}
            pair={pair}
            id="liquidity-amount"
            onCurrencySelect={() => null}
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
          />
          <ColumnCenter>
            <ArrowDownIcon width="24px" my="16px" />
          </ColumnCenter>
          <CurrencyInputPanel
            hideBalance
            value={formattedAmounts[Field.CURRENCY_A]}
            onUserInput={onCurrencyAInput}
            onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
            showMaxButton
            lpPercent={formattedAmounts[Field.LIQUIDITY_PERCENT]}
            currency={currencyA}
            label={t('Output')}
            onCurrencySelect={handleSelectCurrencyA}
            id="remove-liquidity-tokena"
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
          />
          <ColumnCenter>
            <AddIcon width="24px" my="16px" />
          </ColumnCenter>
          <CurrencyInputPanel
            hideBalance
            value={formattedAmounts[Field.CURRENCY_B]}
            onUserInput={onCurrencyBInput}
            showMaxButton={false}
            currency={currencyB}
            label={t('Output')}
            onCurrencySelect={handleSelectCurrencyB}
            id="remove-liquidity-tokenb"
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
          />
        </Box>
      )}
      {pair && (
        <AutoColumn gap="12px" style={{ marginTop: '16px' }}>
          <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
            {t('Prices')}
          </Text>
          <LightGreyCard>
            <Flex justifyContent="space-between">
              <Text small color="textSubtle">
                1 {currencyA?.symbol} =
              </Text>
              <Text small>
                {tokenA ? pair.priceOf(tokenA).toSignificant(6) : '-'} {currencyB?.symbol}
              </Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Text small color="textSubtle">
                1 {currencyB?.symbol} =
              </Text>
              <Text small>
                {tokenB ? pair.priceOf(tokenB).toSignificant(6) : '-'} {currencyA?.symbol}
              </Text>
            </Flex>
          </LightGreyCard>
        </AutoColumn>
      )}
      <RowBetween mt="16px">
        <Text bold color="secondary" fontSize="12px">
          {t('Slippage Tolerance')}
          <IconButton scale="sm" variant="text" onClick={onPresentSettingsModal}>
            <PencilIcon color="primary" width="10px" />
          </IconButton>
        </Text>
        <Text bold color="primary">
          {allowedSlippage / 100}%
        </Text>
      </RowBetween>
      {poolData && (
        <RowBetween mt="16px">
          <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
            {t('LP reward APR')}
          </TooltipText>
          {tooltipVisible && tooltip}
          <Text bold color="primary">
            {formatAmount(poolData.lpApr)}%
          </Text>
        </RowBetween>
      )}
      <Box position="relative" mt="16px">
        {!account ? (
          <ConnectWalletButton width="100%" />
        ) : isWrongNetwork ? (
          <CommitButton width="100%" />
        ) : (
          <RowBetween>
            <Button
              variant={approvalState === ApprovalState.APPROVED || signatureData !== null ? 'success' : 'primary'}
              onClick={onAttemptToApprove}
              disabled={approvalState !== ApprovalState.NOT_APPROVED || signatureData !== null}
              width="100%"
              mr="0.5rem"
            >
              {approvalState === ApprovalState.PENDING ? (
                <Dots>{t('Enabling')}</Dots>
              ) : approvalState === ApprovalState.APPROVED || signatureData !== null ? (
                t('Enabled')
              ) : (
                t('Enable')
              )}
            </Button>
            <Button
              variant={
                !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                  ? 'danger'
                  : 'primary'
              }
              onClick={() => {
                setLiquidityState({
                  attemptingTxn: false,
                  liquidityErrorMessage: undefined,
                  txHash: undefined,
                })
                onPresentRemoveLiquidity()
                logGTMClickRemoveLiquidityEvent()
              }}
              width="100%"
              disabled={!isValid || (signatureData === null && approvalState !== ApprovalState.APPROVED)}
            >
              {error || t('Remove')}
            </Button>
          </RowBetween>
        )}
      </Box>
    </CardBody>
  )
}

export const RemoveLiquidityV2Layout = ({ currencyA, currencyB, children }) => {
  const { pair } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)

  return (
    <RemoveLiquidityLayout currencyA={currencyA} currencyB={currencyB} pair={pair} isStable={false}>
      {children}
    </RemoveLiquidityLayout>
  )
}

export const RemoveLiquidityLayout = ({ currencyA, currencyB, children, pair, isStable }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  const oneCurrencyIsWNative = Boolean(
    chainId &&
      ((currencyA && WNATIVE[chainId]?.equals(currencyA)) || (currencyB && WNATIVE[chainId]?.equals(currencyB))),
  )

  return (
    <Page>
      <AppBody>
        <AppHeader
          backTo={
            isStable
              ? `/stable/${pair?.liquidityToken?.address}`
              : `/v2/pair/${currencyA?.address}/${currencyB?.address}`
          }
          title={t('Remove %assetA%-%assetB% Liquidity', {
            assetA: currencyA?.symbol ?? '',
            assetB: currencyB?.symbol ?? '',
          })}
          subtitle={t('To receive %assetA% and %assetB%', {
            assetA: currencyA?.symbol ?? '',
            assetB: currencyB?.symbol ?? '',
          })}
          noConfig
        />
        {children}
      </AppBody>
      {pair ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWNative} pair={pair} />
        </AutoColumn>
      ) : null}
    </Page>
  )
}
