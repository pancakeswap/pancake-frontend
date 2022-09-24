import { Currency, Percent } from '@pancakeswap/aptos-swap-sdk'
import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDownIcon,
  AutoColumn,
  Box,
  Button,
  CardBody,
  ColumnCenter,
  Flex,
  RowBetween,
  Slider,
  Text,
  useToast,
  useTooltip,
} from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { useRouter } from 'next/router'
import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import styled from 'styled-components'
// import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
// import { MinimalPositionCard } from '../../components/PositionCard'
// import { AppHeader, AppBody } from '../../components/App'
import { LightGreyCard } from 'components/Card'

import { CurrencyLogo } from 'components/Logo'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useTransactionAdder } from 'state/transactions/hooks'
// import StyledInternalLink from '../../components/Links'
// import { calculateGasMargin } from '../../utils'
// import { calculateSlippageAmount, useRouterContract } from '../../utils/exchange'
import { useCurrency } from 'hooks/Tokens'
import { Field, useBurnActionHandlers, useBurnState, useDerivedBurnInfo } from 'state/burn'
import { useUserSlippage } from 'state/user'
import { currencyId } from 'utils/currencyId'
import { calculateSlippageAmount } from 'utils/exchange'
import { useIsMounted } from '@pancakeswap/hooks'
// import ConfirmLiquidityModal from '../Swap/components/ConfirmRemoveLiquidityModal'
// import { formatAmount } from '../../utils/formatInfoNumbers'
// import { CommonBasesType } from '../../components/SearchModal/types'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`

export default function RemoveLiquidity() {
  const router = useRouter()
  const [currencyIdA, currencyIdB] = router.query.currency || []

  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { toastError } = useToast()
  const [tokenA, tokenB] = useMemo(() => [currencyA?.wrapped, currencyB?.wrapped], [currencyA, currencyB])

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
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

  const atMaxAmount = parsedAmounts[Field.LIQUIDITY_PERCENT]?.equalTo(new Percent('1'))

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      return _onUserInput(field, value)
    },
    [_onUserInput],
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  async function onRemove() {
    if (!chainId || !account) throw new Error('missing dependencies')
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

    // // all estimations failed...
    // if (!methodSafeGasEstimate) {
    //   toastError(t('Error'), t('This transaction would fail'))
    // } else {
    //   const { methodName, safeGasEstimate } = methodSafeGasEstimate

    //   setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    //   await routerContract[methodName](...args, {
    //     gasLimit: safeGasEstimate,
    //     gasPrice,
    //   })
    //     .then((response: TransactionResponse) => {
    //       setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })
    //       const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
    //       const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
    //       addTransaction(response, {
    //         summary: `Remove ${amountA} ${currencyA?.symbol} and ${amountB} ${currencyB?.symbol}`,
    //         translatableSummary: {
    //           text: 'Remove %amountA% %symbolA% and %amountB% %symbolB%',
    //           data: { amountA, symbolA: currencyA?.symbol, amountB, symbolB: currencyB?.symbol },
    //         },
    //         type: 'remove-liquidity',
    //       })
    //     })
    //     .catch((err) => {
    //       if (err && err.code !== 4001) {
    //         logError(err)
    //         console.error(`Remove Liquidity failed`, err, args)
    //       }
    //       setLiquidityState({
    //         attemptingTxn: false,
    //         liquidityErrorMessage:
    //           err && err?.code !== 4001
    //             ? t('Remove liquidity failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
    //             : undefined,
    //         txHash: undefined,
    //       })
    //     })
    // }
  }

  const pendingText = t('Removing %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencyA?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencyB?.symbol ?? '',
  })

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.LIQUIDITY_PERCENT, '0')
    }
  }, [onUserInput, txHash])

  const innerLiquidityPercentage = useDeferredValue(Number.parseInt(parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0)))

  const handleChangePercent = useCallback(
    (value: number) => {
      onUserInput(Field.LIQUIDITY_PERCENT, Math.ceil(value).toString())
    },
    [onUserInput],
  )

  // const [onPresentRemoveLiquidity] = useModal(
  //   <ConfirmLiquidityModal
  //     title={t('You will receive')}
  //     customOnDismiss={handleDismissConfirmation}
  //     attemptingTxn={attemptingTxn}
  //     hash={txHash || ''}
  //     allowedSlippage={allowedSlippage}
  //     onRemove={isZap ? onZapOut : onRemove}
  //     isZap={isZap}
  //     pendingText={pendingText}
  //     approval={approval}
  //     signatureData={signatureData}
  //     tokenA={tokenA}
  //     tokenB={tokenB}
  //     liquidityErrorMessage={liquidityErrorMessage}
  //     parsedAmounts={parsedAmounts}
  //     currencyA={currencyA}
  //     currencyB={currencyB}
  //     toggleZapMode={setTemporarilyZapMode}
  //   />,
  //   true,
  //   true,
  //   'removeLiquidityModal',
  // )

  return (
    // <Page>
    //   <AppBody>
    //     <AppHeader
    //       backTo="/liquidity"
    //       title={t('Remove %assetA%-%assetB% liquidity', {
    //         assetA: currencyA?.symbol ?? '',
    //         assetB: currencyB?.symbol ?? '',
    //       })}
    //       subtitle={t('To receive %assetA% and %assetB%', {
    //         assetA: currencyA?.symbol ?? '',
    //         assetB: currencyB?.symbol ?? '',
    //       })}
    //       noConfig
    //     />

    <CardBody>
      <AutoColumn gap="20px">
        <RowBetween>
          <Text>{t('Amount')}</Text>
        </RowBetween>
        <BorderCard>
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
      </AutoColumn>
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
          </LightGreyCard>
        </AutoColumn>
      </>

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
      <AllowedSlippage />
      <Box position="relative" mt="16px">
        <CommitButton
          variant={
            !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B] ? 'danger' : 'primary'
          }
          onClick={() => {
            setLiquidityState({
              attemptingTxn: false,
              liquidityErrorMessage: undefined,
              txHash: undefined,
            })
            // onPresentRemoveLiquidity()
          }}
          width="100%"
          disabled={!isValid}
        >
          {error || t('Remove')}
        </CommitButton>
      </Box>
    </CardBody>
    // </AppBody>

    // {pair ? (
    //   <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
    //     <MinimalPositionCard showUnwrapped={oneCurrencyIsWNative} pair={pair} />
    //   </AutoColumn>
    // ) : null}
    // </Page>
  )
}

// TODO: aptos merge
export const AllowedSlippage = () => {
  const [allowedSlippage] = useUserSlippage()
  const isMounted = useIsMounted()
  const { t } = useTranslation()
  return (
    <RowBetween>
      <Text bold fontSize="12px" color="secondary">
        {t('Slippage Tolerance')}
      </Text>
      {isMounted && (
        <Text bold color="primary">
          {allowedSlippage / 100}%
        </Text>
      )}
    </RowBetween>
  )
}
