import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { splitSignature } from '@ethersproject/bytes'
import { Contract } from '@ethersproject/contracts'
import { TransactionResponse } from '@ethersproject/providers'
import { useRouter } from 'next/router'
import useToast from 'hooks/useToast'
import { Currency, currencyEquals, ETHER, Percent, WETH } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  AddIcon,
  ArrowDownIcon,
  CardBody,
  Slider,
  Box,
  Flex,
  useModal,
  Skeleton,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import { BigNumber } from '@ethersproject/bignumber'
import { useTranslation } from 'contexts/Localization'
import { CHAIN_ID } from 'config/constants/networks'
import { useLPApr } from 'state/swap/hooks'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { MinimalPositionCard } from '../../components/PositionCard'
import { AppHeader, AppBody } from '../../components/App'
import { RowBetween } from '../../components/Layout/Row'
import ConnectWalletButton from '../../components/ConnectWalletButton'
import { LightGreyCard } from '../../components/Card'

import { CurrencyLogo } from '../../components/Logo'
import { ROUTER_ADDRESS } from '../../config/constants'
import useActiveWeb3React from '../../hooks/useActiveWeb3React'
import { useCurrency } from '../../hooks/Tokens'
import { usePairContract } from '../../hooks/useContract'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'

import { useTransactionAdder } from '../../state/transactions/hooks'
import StyledInternalLink from '../../components/Links'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from '../../utils'
import { currencyId } from '../../utils/currencyId'
import useDebouncedChangeHandler from '../../hooks/useDebouncedChangeHandler'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import { useApproveCallback, ApprovalState } from '../../hooks/useApproveCallback'
import Dots from '../../components/Loader/Dots'
import { useBurnActionHandlers, useDerivedBurnInfo, useBurnState } from '../../state/burn/hooks'

import { Field } from '../../state/burn/actions'
import { useGasPrice, useUserSlippageTolerance } from '../../state/user/hooks'
import Page from '../Page'
import ConfirmLiquidityModal from '../Swap/components/ConfirmRemoveLiquidityModal'
import { logError } from '../../utils/sentry'
import { formatAmount } from '../../utils/formatInfoNumbers'

const BorderCard = styled.div`
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
  padding: 16px;
`

export default function RemoveLiquidity() {
  const router = useRouter()
  const [currencyIdA, currencyIdB] = router.query.currency || []
  const [currencyA, currencyB] = [useCurrency(currencyIdA) ?? undefined, useCurrency(currencyIdB) ?? undefined]
  const { account, chainId, library } = useActiveWeb3React()
  const { toastError } = useToast()
  const [tokenA, tokenB] = useMemo(
    () => [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)],
    [currencyA, currencyB, chainId],
  )

  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  // burn state
  const { independentField, typedValue } = useBurnState()
  const { pair, parsedAmounts, error } = useDerivedBurnInfo(currencyA ?? undefined, currencyB ?? undefined)
  const poolData = useLPApr(pair)
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
  const deadline = useTransactionDeadline()
  const [allowedSlippage] = useUserSlippageTolerance()

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

  // pair contract
  const pairContract: Contract | null = usePairContract(pair?.liquidityToken?.address)

  // allowance handling
  const [signatureData, setSignatureData] = useState<{ v: number; r: string; s: string; deadline: number } | null>(null)
  const [approval, approveCallback] = useApproveCallback(parsedAmounts[Field.LIQUIDITY], ROUTER_ADDRESS[CHAIN_ID])

  async function onAttemptToApprove() {
    if (!pairContract || !pair || !library || !deadline) throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'Pancake LPs',
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: ROUTER_ADDRESS[CHAIN_ID],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        })
      })
      .catch((err) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (err?.code !== 4001) {
          approveCallback()
        }
      })
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
  async function onRemove() {
    if (!chainId || !library || !account || !deadline) throw new Error('missing dependencies')
    const { [Field.CURRENCY_A]: currencyAmountA, [Field.CURRENCY_B]: currencyAmountB } = parsedAmounts
    if (!currencyAmountA || !currencyAmountB) {
      toastError(t('Error'), t('Missing currency amounts'))
      throw new Error('missing currency amounts')
    }
    const routerContract = getRouterContract(chainId, library, account)

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

    const currencyBIsBNB = currencyB === ETHER
    const oneCurrencyIsBNB = currencyA === ETHER || currencyBIsBNB

    if (!tokenA || !tokenB) {
      toastError(t('Error'), t('Could not wrap'))
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>
    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsBNB) {
        methodNames = ['removeLiquidityETH', 'removeLiquidityETHSupportingFeeOnTransferTokens']
        args = [
          currencyBIsBNB ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    }
    // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsBNB) {
        methodNames = ['removeLiquidityETHWithPermit', 'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens']
        args = [
          currencyBIsBNB ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_A : Field.CURRENCY_B].toString(),
          amountsMin[currencyBIsBNB ? Field.CURRENCY_B : Field.CURRENCY_A].toString(),
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
          liquidityAmount.raw.toString(),
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

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((err) => {
            console.error(`estimateGas failed`, methodName, args, err)
            return undefined
          }),
      ),
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex((safeGasEstimate) =>
      BigNumber.isBigNumber(safeGasEstimate),
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      toastError(t('Error'), t('This transaction would fail'))
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
        gasPrice,
      })
        .then((response: TransactionResponse) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })
          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencyA?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`,
            type: 'remove-liquidity',
          })
        })
        .catch((err) => {
          if (err && err.code !== 4001) {
            logError(err)
            console.error(`Remove Liquidity failed`, err, args)
          }
          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage: err && err?.code !== 4001 ? `Remove Liquidity failed: ${err.message}` : undefined,
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

  const oneCurrencyIsBNB = currencyA === ETHER || currencyB === ETHER
  const oneCurrencyIsWBNB = Boolean(
    chainId &&
      ((currencyA && currencyEquals(WETH[chainId], currencyA)) ||
        (currencyB && currencyEquals(WETH[chainId], currencyB))),
  )

  const handleSelectCurrencyA = useCallback(
    (currency: Currency) => {
      if (currencyIdB && currencyId(currency) === currencyIdB) {
        router.replace(`/remove/${currencyId(currency)}/${currencyIdA}`, undefined, { shallow: true })
      } else {
        router.replace(`/remove/${currencyId(currency)}/${currencyIdB}`, undefined, { shallow: true })
      }
    },
    [currencyIdA, currencyIdB, router],
  )
  const handleSelectCurrencyB = useCallback(
    (currency: Currency) => {
      if (currencyIdA && currencyId(currency) === currencyIdA) {
        router.replace(`/remove/${currencyIdB}/${currencyId(currency)}`, undefined, { shallow: true })
      } else {
        router.replace(`/remove/${currencyIdA}/${currencyId(currency)}`, undefined, { shallow: true })
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

  return (
    <Page>
      <AppBody>
        <AppHeader
          backTo="/liquidity"
          title={t('Remove %assetA%-%assetB% liquidity', {
            assetA: currencyA?.symbol ?? '',
            assetB: currencyB?.symbol ?? '',
          })}
          subtitle={t('To receive %assetA% and %assetB%', {
            assetA: currencyA?.symbol ?? '',
            assetB: currencyB?.symbol ?? '',
          })}
          noConfig
        />

        <CardBody>
          <AutoColumn gap="20px">
            <RowBetween>
              <Text>{t('Amount')}</Text>
              <Button variant="text" scale="sm" onClick={() => setShowDetailed(!showDetailed)}>
                {showDetailed ? t('Simple') : t('Detailed')}
              </Button>
            </RowBetween>
            {!showDetailed && (
              <BorderCard>
                <Text fontSize="40px" bold mb="16px" style={{ lineHeight: 1 }}>
                  {formattedAmounts[Field.LIQUIDITY_PERCENT]}%
                </Text>
                <Slider
                  name="lp-amount"
                  min={0}
                  max={100}
                  value={innerLiquidityPercentage}
                  onValueChanged={(value) => setInnerLiquidityPercentage(Math.ceil(value))}
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
              <AutoColumn gap="10px">
                <Text bold color="secondary" fontSize="12px" textTransform="uppercase">
                  {t('You will receive')}
                </Text>
                <LightGreyCard>
                  <Flex justifyContent="space-between" mb="8px">
                    <Flex>
                      <CurrencyLogo currency={currencyA} />
                      <Text small color="textSubtle" id="remove-liquidity-tokena-symbol" ml="4px">
                        {currencyA?.symbol}
                      </Text>
                    </Flex>
                    <Text small>{formattedAmounts[Field.CURRENCY_A] || '-'}</Text>
                  </Flex>
                  <Flex justifyContent="space-between">
                    <Flex>
                      <CurrencyLogo currency={currencyB} />
                      <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                        {currencyB?.symbol}
                      </Text>
                    </Flex>
                    <Text small>{formattedAmounts[Field.CURRENCY_B] || '-'}</Text>
                  </Flex>
                  {chainId && (oneCurrencyIsWBNB || oneCurrencyIsBNB) ? (
                    <RowBetween style={{ justifyContent: 'flex-end', fontSize: '14px' }}>
                      {oneCurrencyIsBNB ? (
                        <StyledInternalLink
                          href={`/remove/${currencyA === ETHER ? WETH[chainId].address : currencyIdA}/${
                            currencyB === ETHER ? WETH[chainId].address : currencyIdB
                          }`}
                        >
                          {t('Receive WBNB')}
                        </StyledInternalLink>
                      ) : oneCurrencyIsWBNB ? (
                        <StyledInternalLink
                          href={`/remove/${
                            currencyA && currencyEquals(currencyA, WETH[chainId]) ? 'BNB' : currencyIdA
                          }/${currencyB && currencyEquals(currencyB, WETH[chainId]) ? 'BNB' : currencyIdB}`}
                        >
                          {t('Receive BNB')}
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
                onMax={() => {
                  onUserInput(Field.LIQUIDITY_PERCENT, '100')
                }}
                showMaxButton={!atMaxAmount}
                disableCurrencySelect
                currency={pair?.liquidityToken}
                pair={pair}
                id="liquidity-amount"
                onCurrencySelect={() => null}
              />
              <ColumnCenter>
                <ArrowDownIcon width="24px" my="16px" />
              </ColumnCenter>
              <CurrencyInputPanel
                hideBalance
                value={formattedAmounts[Field.CURRENCY_A]}
                onUserInput={onCurrencyAInput}
                onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                showMaxButton={!atMaxAmount}
                currency={currencyA}
                label={t('Output')}
                onCurrencySelect={handleSelectCurrencyA}
                id="remove-liquidity-tokena"
              />
              <ColumnCenter>
                <AddIcon width="24px" my="16px" />
              </ColumnCenter>
              <CurrencyInputPanel
                hideBalance
                value={formattedAmounts[Field.CURRENCY_B]}
                onUserInput={onCurrencyBInput}
                onMax={() => onUserInput(Field.LIQUIDITY_PERCENT, '100')}
                showMaxButton={!atMaxAmount}
                currency={currencyB}
                label={t('Output')}
                onCurrencySelect={handleSelectCurrencyB}
                id="remove-liquidity-tokenb"
              />
            </Box>
          )}
          {pair && (
            <AutoColumn gap="10px" style={{ marginTop: '16px' }}>
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
            <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
              {t('LP reward APR')}
            </TooltipText>
            {tooltipVisible && tooltip}
            {poolData ? (
              <Text bold color="primary">
                {formatAmount(poolData.lpApr7d)}%
              </Text>
            ) : (
              <Skeleton width={60} />
            )}
          </RowBetween>
          <Box position="relative" mt="16px">
            {!account ? (
              <ConnectWalletButton />
            ) : (
              <RowBetween>
                <Button
                  variant={approval === ApprovalState.APPROVED || signatureData !== null ? 'success' : 'primary'}
                  onClick={onAttemptToApprove}
                  disabled={approval !== ApprovalState.NOT_APPROVED || signatureData !== null}
                  width="100%"
                  mr="0.5rem"
                >
                  {approval === ApprovalState.PENDING ? (
                    <Dots>{t('Enabling')}</Dots>
                  ) : approval === ApprovalState.APPROVED || signatureData !== null ? (
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
                  disabled={!isValid || (signatureData === null && approval !== ApprovalState.APPROVED)}
                >
                  {error || t('Remove')}
                </Button>
              </RowBetween>
            )}
          </Box>
        </CardBody>
      </AppBody>

      {pair ? (
        <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
          <MinimalPositionCard showUnwrapped={oneCurrencyIsWBNB} pair={pair} />
        </AutoColumn>
      ) : null}
    </Page>
  )
}
