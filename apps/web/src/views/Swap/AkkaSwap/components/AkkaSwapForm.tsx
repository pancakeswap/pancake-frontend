import { useCallback, useEffect, useState, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import {
  Text,
  ArrowDownIcon,
  Box,
  IconButton,
  ArrowUpDownIcon,
  Skeleton,
  Flex,
  Message,
  MessageText,
  Swap as SwapUI,
} from '@pancakeswap/uikit'
import InfoTooltip from '@pancakeswap/uikit/src/components/Timeline/InfoTooltip'

import { useTranslation } from '@pancakeswap/localization'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'

import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { CommonBasesType } from 'components/SearchModal/types'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import { AutoColumn } from 'components/Layout/Column'

import { useCurrency } from 'hooks/Tokens'
import { ApprovalState } from 'hooks/useApproveCallback'

import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from 'state/user/hooks'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { currencyId } from 'utils/currencyId'

import { useWeb3React } from '@pancakeswap/wagmi'
import CurrencyInputHeader from '../../components/CurrencyInputHeader'
import useRefreshBlockNumberID from '../../hooks/useRefreshBlockNumber'
import { Wrapper } from '../../components/styleds'
import { useAkkaRouterArgs } from '../hooks/useAkkaRouterApi'
import AkkaSwapCommitButton from './AkkaSwapCommitButton'
import { useApproveCallbackFromAkkaTrade } from '../hooks/useApproveCallbackFromAkkaTrade'
import { useAkkaSwapInfo } from '../hooks/useAkkaSwapInfo'
import AkkaAdvancedSwapDetailsDropdown from './AkkaAdvancedSwapDetailsDropdown'
import useWarningImport from 'views/Swap/hooks/useWarningImport'

const Label = styled(Text)`
  font-size: 12px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.secondary};
`

const SwitchIconButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  .icon-up-down {
    display: none;
  }
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    .icon-down {
      display: none;
      fill: white;
    }
    .icon-up-down {
      display: block;
      fill: white;
    }
  }
`

const AkkaSwapForm = () => {
  const { t } = useTranslation()
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const { account } = useWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()
  const warningSwapHandler = useWarningImport()
  // get custom setting values for user
  const [allowedSlippage] = useUserSlippageTolerance()

  // swap state & price data
  const {
    independentField,
    typedValue,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const { onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT
  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  // const currencies: { [field in Field]?: Currency } = {
  //   [Field.INPUT]: inputCurrency ?? undefined,
  //   [Field.OUTPUT]: outputCurrency ?? undefined,
  // }

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )
  const onSwitchTokens = () => {
    onCurrencySelection(Field.INPUT, outputCurrency)
    onCurrencySelection(Field.OUTPUT, inputCurrency)
    onUserInput(Field.INPUT, akkaRouterTrade.route && typedValue !== '' ? akkaRouterTrade.route.return_amount : '')
    replaceBrowserHistory('inputCurrency', outputCurrencyId)
    replaceBrowserHistory('outputCurrency', inputCurrencyId)
  }
  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      onCurrencySelection(Field.INPUT, newCurrencyInput)
      warningSwapHandler(newCurrencyInput)
      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection],
  )

  const {
    trade: akkaRouterTrade,
    currencyBalances,
    parsedAmount,
    inputError: swapInputError,
  } = useAkkaSwapInfo(independentField, typedValue, inputCurrency, outputCurrency, allowedSlippage)

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : null,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : null,
  }
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }
  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (newCurrencyOutput) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)
      warningSwapHandler(newCurrencyOutput)
      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },

    [inputCurrencyId, outputCurrencyId, onCurrencySelection],
  )

  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, akkaRouterTrade?.route ? akkaRouterTrade?.route?.return_amount : '')
    },
    [onUserInput, akkaRouterTrade?.route?.return_amount],
  )
  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromAkkaTrade(parsedAmounts[Field.INPUT])

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])
  console.log('dsads', currencies[Field.INPUT])
  return (
    <>
      <CurrencyInputHeader
        title={
          <Flex>
            {t('Akka')}
            <InfoTooltip ml="4px" text={t('Swap using Akka smart route')} />
          </Flex>
        }
        subtitle={t('Trade tokens in an instant')}
        hasAmount={hasAmount}
        onRefreshPrice={onRefreshPrice}
      />
      <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
        <AutoColumn gap="sm">
          <CurrencyInputPanel
            label={independentField === Field.OUTPUT && t('From')}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton={!atMaxAmountInput}
            showQuickInputButton
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          />

          <AutoColumn justify="space-between">
            <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ padding: '0 1rem' }}>
              <SwitchIconButton
                variant="light"
                scale="sm"
                onClick={() => {
                  onSwitchTokens()
                }}
              >
                <ArrowDownIcon
                  className="icon-down"
                  color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                />
                <ArrowUpDownIcon
                  className="icon-up-down"
                  color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? 'primary' : 'text'}
                />
              </SwitchIconButton>
            </AutoRow>
          </AutoColumn>
          <CurrencyInputPanel
            value={akkaRouterTrade.route && typedValue !== '' ? akkaRouterTrade.route.return_amount : ''}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && t('To')}
            showMaxButton={false}
            currency={currencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={currencies[Field.INPUT]}
            id="swap-currency-output"
            showCommonBases
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            disabled
          />

          <AutoColumn gap="7px" style={{ padding: '0 16px' }}>
            <RowBetween align="center">
              <Label>{t('Slippage Tolerance')}</Label>
              <Text bold color="primary">
                {allowedSlippage / 100}%
              </Text>
            </RowBetween>
          </AutoColumn>
          {/* {typedValue ? null : (
            <AutoColumn>
              <Message variant="warning" mb="16px">
                <MessageText>{t('Akka fee')}</MessageText>
              </Message>
            </AutoColumn>
          )} */}
        </AutoColumn>
        <Box mt="0.25rem">
          <AkkaSwapCommitButton
            account={account}
            approval={approval}
            approveCallback={approveCallback}
            approvalSubmitted={approvalSubmitted}
            currencies={currencies}
            isExpertMode={isExpertMode}
            trade={akkaRouterTrade}
            swapInputError={swapInputError}
            currencyBalances={currencyBalances}
            allowedSlippage={allowedSlippage}
            onUserInput={onUserInput}
          />
        </Box>
      </Wrapper>
      {akkaRouterTrade.route && typedValue && <AkkaAdvancedSwapDetailsDropdown route={akkaRouterTrade.route} />}
    </>
  )
}

export default AkkaSwapForm
