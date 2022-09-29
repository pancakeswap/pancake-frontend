import { SetStateAction, useCallback, useEffect, useState, Dispatch, useContext } from 'react'
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
} from '@pancakeswap/uikit'
import InfoTooltip from '@pancakeswap/uikit/src/components/Timeline/InfoTooltip'

import useActiveWeb3React from 'hooks/useActiveWeb3React'
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
import TradePrice from 'views/Swap/components/TradePrice'

import CurrencyInputHeader from '../../components/CurrencyInputHeader'
import useRefreshBlockNumberID from '../../hooks/useRefreshBlockNumber'
import { Wrapper } from '../../components/styleds'
import StableSwapCommitButton from './StableSwapCommitButton'
import { useDerivedStableSwapInfo } from '../hooks/useDerivedStableSwapInfo'
import useApproveCallbackFromStableTrade from '../hooks/useApproveCallbackFromStableTrade'
import { StableConfigContext } from '../hooks/useStableConfig'

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

interface StableSwapForm {
  isChartExpanded: boolean
  isChartDisplayed: boolean
  setIsChartDisplayed: Dispatch<SetStateAction<boolean>>
}

export default function StableSwapForm({ setIsChartDisplayed, isChartDisplayed }) {
  const { t } = useTranslation()
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const { account } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

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

  const stableConfig = useContext(StableConfigContext)

  const currencies: { [field in Field]?: Currency } = {
    [Field.INPUT]: inputCurrency ?? undefined,
    [Field.OUTPUT]: outputCurrency ?? undefined,
  }

  const {
    v2Trade: trade,
    currencyBalances,
    parsedAmount,
    inputError: swapInputError,
  } = useDerivedStableSwapInfo(independentField, typedValue, inputCurrency, outputCurrency)

  const parsedAmounts = {
    [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
    [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
  }

  const { onSwitchTokens, onCurrencySelection, onUserInput } = useSwapActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallbackFromStableTrade({
    trade,
    allowedSlippage,
    swapAddress: stableConfig.stableSwapConfig?.stableSwapAddress,
  })

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])
  const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput))

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const handleInputSelect = useCallback(
    (currencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, currencyInput)

      replaceBrowserHistory('inputCurrency', currencyId(currencyInput))
    },
    [onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (currencyOutput) => {
      onCurrencySelection(Field.OUTPUT, currencyOutput)

      replaceBrowserHistory('outputCurrency', currencyId(currencyOutput))
    },

    [onCurrencySelection],
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

  return (
    <>
      <CurrencyInputHeader
        title={
          <Flex>
            {t('StableSwap')}
            <InfoTooltip
              ml="4px"
              text={t('StableSwap provides better rates and lower fees for pairs with highly correlated prices')}
            />
          </Flex>
        }
        subtitle={t('Trade tokens in an instant')}
        setIsChartDisplayed={setIsChartDisplayed}
        isChartDisplayed={isChartDisplayed}
        hasAmount={hasAmount}
        onRefreshPrice={onRefreshPrice}
      />
      <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
        <AutoColumn gap="sm">
          <CurrencyInputPanel
            disableCurrencySelect
            label={independentField === Field.OUTPUT && trade ? t('From (estimated)') : t('From')}
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
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
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
            disableCurrencySelect
            value={formattedAmounts[Field.OUTPUT]}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && trade ? t('To (estimated)') : t('To')}
            showMaxButton={false}
            currency={currencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={currencies[Field.INPUT]}
            id="swap-currency-output"
            showCommonBases
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
          />

          <AutoColumn gap="7px" style={{ padding: '0 16px' }}>
            <RowBetween align="center">
              {Boolean(trade) && (
                <>
                  <Label>{t('Price')}</Label>
                  {isLoading ? (
                    <Skeleton width="100%" ml="8px" height="24px" />
                  ) : (
                    <TradePrice
                      price={trade?.executionPrice}
                      showInverted={showInverted}
                      setShowInverted={setShowInverted}
                    />
                  )}
                </>
              )}
            </RowBetween>
            <RowBetween align="center">
              <Label>{t('Slippage Tolerance')}</Label>
              <Text bold color="primary">
                {allowedSlippage / 100}%
              </Text>
            </RowBetween>
          </AutoColumn>
          {typedValue ? null : (
            <AutoColumn>
              <Message variant="warning" mb="16px">
                <MessageText>{t('Trade stablecoins in StableSwap with lower slippage and trading fees!')}</MessageText>
              </Message>
            </AutoColumn>
          )}
        </AutoColumn>
        <Box mt="0.25rem">
          <StableSwapCommitButton
            account={account}
            approval={approval}
            approveCallback={approveCallback}
            approvalSubmitted={approvalSubmitted}
            currencies={currencies}
            isExpertMode={isExpertMode}
            trade={trade}
            swapInputError={swapInputError}
            currencyBalances={currencyBalances}
            allowedSlippage={allowedSlippage}
            onUserInput={onUserInput}
          />
        </Box>
      </Wrapper>
    </>
  )
}
