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
  useMatchBreakpoints,
  useModal,
  useToast,
} from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useRouter } from 'next/router'
import { useCallback, useContext, useMemo, useState } from 'react'
import styled from 'styled-components'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { StableConfigContext } from 'views/Swap/hooks/useStableConfig'
import { useStableSwapNativeHelperContract } from 'hooks/useContract'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { Hash } from 'viem'

import { LightGreyCard } from '../../../components/Card'
import ConnectWalletButton from '../../../components/ConnectWalletButton'
import CurrencyInputPanel from '../../../components/CurrencyInputPanel'
import { RowBetween } from '../../../components/Layout/Row'
import { CurrencyLogo } from '../../../components/Logo'
import useActiveWeb3React from '../../../hooks/useActiveWeb3React'

import StyledInternalLink from '../../../components/Links'
import Dots from '../../../components/Loader/Dots'
import { ApprovalState, useApproveCallback } from '../../../hooks/useApproveCallback'
import { useBurnActionHandlers, useBurnState } from '../../../state/burn/hooks'
import { useTransactionAdder } from '../../../state/transactions/hooks'
import { calculateGasMargin } from '../../../utils'
import { currencyId } from '../../../utils/currencyId'
import { calculateSlippageAmount } from '../../../utils/exchange'

import { Field } from '../../../state/burn/actions'
import { useGasPrice } from '../../../state/user/hooks'
import ConfirmLiquidityModal from '../../Swap/components/ConfirmRemoveLiquidityModal'
import { isUserRejected, logError } from '../../../utils/sentry'
import { CommonBasesType } from '../../../components/SearchModal/types'
import { useStableDerivedBurnInfo } from './hooks/useStableDerivedBurnInfo'
import SettingsModal from '../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { RemoveLiquidityLayout } from '..'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`

export default function RemoveStableLiquidity({ currencyA, currencyB, currencyIdA, currencyIdB }) {
  const router = useRouter()
  const native = useNativeCurrency()
  const { isMobile } = useMatchBreakpoints()

  const { account, chainId, isWrongNetwork } = useActiveWeb3React()
  const { toastError } = useToast()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  // burn state
  const { independentField, typedValue } = useBurnState()

  const nativeHelperContract = useStableSwapNativeHelperContract()

  const needUnwrapped = currencyA?.isNative || currencyB?.isNative

  const { pair, parsedAmounts, error } = useStableDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onUserInput: _onUserInput } = useBurnActionHandlers()
  const isValid = !error

  // NOTE: Disable detail page for now
  // modal and loading
  const [showDetailed] = useState<boolean>(false)
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
  const [allowedSlippage] = useUserSlippage()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo('0')
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].lessThan(new Percent('1', '100'))
      ? '<1'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY ? typedValue : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A ? typedValue : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B ? typedValue : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  const { stableSwapConfig, stableSwapContract } = useContext(StableConfigContext)

  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    needUnwrapped ? nativeHelperContract?.address : stableSwapConfig?.stableSwapAddress,
  )

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  const onLiquidityInput = useCallback((value: string): void => onUserInput(Field.LIQUIDITY, value), [onUserInput])
  const onCurrencyAInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_A, value), [onUserInput])
  const onCurrencyBInput = useCallback((value: string): void => onUserInput(Field.CURRENCY_B, value), [onUserInput])

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    const contract = needUnwrapped ? nativeHelperContract : stableSwapContract

    if (!chainId || !account || !contract) throw new Error('missing dependencies')
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

    if (!tokenA || !tokenB) {
      toastError(t('Error'), t('Could not wrap'))
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      methodNames = ['remove_liquidity']
      if (needUnwrapped) {
        args = [
          stableSwapContract.address,
          liquidityAmount.quotient.toString(),
          [amountsMin[Field.CURRENCY_A].toString(), amountsMin[Field.CURRENCY_B].toString()],
        ]
      } else {
        args = [
          liquidityAmount.quotient.toString(),
          [amountsMin[Field.CURRENCY_A].toString(), amountsMin[Field.CURRENCY_B].toString()],
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else {
      toastError(t('Error'), t('Attempting to confirm without approval or a signature'))
      throw new Error('Attempting to confirm without approval or a signature')
    }

    let methodSafeGasEstimate: { methodName: string; safeGasEstimate: bigint }
    for (let i = 0; i < methodNames.length; i++) {
      let safeGasEstimate
      try {
        // eslint-disable-next-line no-await-in-loop
        safeGasEstimate = calculateGasMargin(await contract.estimateGas[methodNames[i]](args, { account }))
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
      await contract.write[methodName](args, {
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
        .catch((err) => {
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
        router.replace(`/v2/remove/${currencyId(currency)}/${currencyIdA}?stable=1`, undefined, { shallow: true })
      } else {
        router.replace(`/v2/remove/${currencyId(currency)}/${currencyIdB}?stable=1`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, router],
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        router.replace(`/v2/remove/${currencyIdB}/${currencyId(currency)}?stable=1`, undefined, { shallow: true })
      } else {
        router.replace(`/v2/remove/${currencyIdA}/${currencyId(currency)}?stable=1`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, router],
  )

  const handleDismissConfirmation = useCallback(() => {
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
    (value) => setInnerLiquidityPercentage(Math.ceil(value)),
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
      approval={approval}
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
    <>
      <CardBody>
        <AutoColumn gap="20px">
          <RowBetween>
            <Text>{t('Amount')}</Text>
            {/* <Button variant="text" scale="sm" onClick={() => setShowDetailed(!showDetailed)}>
                {showDetailed ? t('Simple') : t('Detailed')}
              </Button> */}
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
                      50%
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
                      50%
                    </Text>
                  </Flex>
                </Flex>
                {chainId && (oneCurrencyIsWNative || oneCurrencyIsNative) ? (
                  <RowBetween style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
                    {oneCurrencyIsNative ? (
                      <StyledInternalLink
                        href={`/v2/remove/${currencyA?.isNative ? WNATIVE[chainId]?.address : currencyIdA}/${
                          currencyB?.isNative ? WNATIVE[chainId]?.address : currencyIdB
                        }?stable=1`}
                      >
                        {t('Receive %currency%', { currency: WNATIVE[chainId]?.symbol })}
                      </StyledInternalLink>
                    ) : oneCurrencyIsWNative ? (
                      <StyledInternalLink
                        href={`/v2/remove/${
                          currencyA && currencyA.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdA
                        }/${currencyB && currencyB.equals(WNATIVE[chainId]) ? native?.symbol : currencyIdB}?stable=1`}
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
              onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
              showMaxButton
              lpPercent={formattedAmounts[Field.LIQUIDITY_PERCENT]}
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

        <Box position="relative" mt="16px">
          {!account ? (
            <ConnectWalletButton width="100%" />
          ) : isWrongNetwork ? (
            <CommitButton width="100%" />
          ) : (
            <RowBetween>
              <Button
                variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
                onClick={approveCallback}
                disabled={approval !== ApprovalState.NOT_APPROVED}
                width="100%"
                mr="0.5rem"
              >
                {approval === ApprovalState.PENDING ? (
                  <Dots>{t('Enabling')}</Dots>
                ) : approval === ApprovalState.APPROVED ? (
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
                }}
                width="100%"
                disabled={!isValid || approval !== ApprovalState.APPROVED}
              >
                {error || t('Remove')}
              </Button>
            </RowBetween>
          )}
        </Box>
      </CardBody>
    </>
  )
}

export const RemoveLiquidityStableLayout = ({ currencyA, currencyB, children }) => {
  const { pair } = useStableDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)

  return (
    <RemoveLiquidityLayout currencyA={currencyA} currencyB={currencyB} pair={pair}>
      {children}
    </RemoveLiquidityLayout>
  )
}
