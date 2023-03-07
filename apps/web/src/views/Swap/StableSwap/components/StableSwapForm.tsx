import { Currency, CurrencyAmount, Percent } from '@pancakeswap/sdk'
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  AutoColumn,
  Box,
  Flex,
  IconButton,
  Message,
  MessageText,
  PencilIcon,
  Skeleton,
  Swap as SwapUI,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import InfoTooltip from '@pancakeswap/uikit/src/components/Timeline/InfoTooltip'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import { useTranslation } from '@pancakeswap/localization'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { maxAmountSpend } from 'utils/maxAmountSpend'

import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoRow, RowBetween } from 'components/Layout/Row'

import { useCurrency } from 'hooks/Tokens'
import { ApprovalState } from 'hooks/useApproveCallback'

import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from 'state/user/hooks'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { currencyId } from 'utils/currencyId'

import { useStableSwapPairs } from 'state/swap/useStableSwapPairs'
import { useAccount } from 'wagmi'
import SettingsModal from '../../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../../components/Menu/GlobalSettings/types'
import CurrencyInputHeader from '../../components/CurrencyInputHeader'
import { Wrapper } from '../../components/styleds'
import useRefreshBlockNumberID from '../../hooks/useRefreshBlockNumber'
import useApproveCallbackFromStableTrade from '../hooks/useApproveCallbackFromStableTrade'
import { useDerivedStableSwapInfo } from '../hooks/useDerivedStableSwapInfo'
import { StableConfigContext } from '../hooks/useStableConfig'
import StableSwapCommitButton from './StableSwapCommitButton'

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

export default function StableSwapForm() {
  const { t } = useTranslation()
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const { address: account } = useAccount()
  const stablePairs = useStableSwapPairs()
  const stableTokens = useMemo(() => {
    return stablePairs.reduce((tokens, farm) => {
      if (!tokens.find((token) => farm.token0.wrapped.address === token.address)) {
        tokens.push(farm.token0)
      }
      if (!tokens.find((token) => farm.token1.wrapped.address === token.address)) {
        tokens.push(farm.token1)
      }
      return tokens
    }, [])
  }, [stablePairs])

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

  const { stableSwapConfig } = useContext(StableConfigContext)

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
    swapAddress: stableSwapConfig?.stableSwapAddress,
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

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handleOutputSelect = useCallback(
    (newCurrencyOutput) => {
      onCurrencySelection(Field.OUTPUT, newCurrencyOutput)

      const newCurrencyOutputId = currencyId(newCurrencyOutput)
      if (newCurrencyOutputId === inputCurrencyId) {
        replaceBrowserHistory('inputCurrency', outputCurrencyId)
      }
      replaceBrowserHistory('outputCurrency', newCurrencyOutputId)
    },

    [inputCurrencyId, outputCurrencyId, onCurrencySelection],
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

  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

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
        hasAmount={hasAmount}
        onRefreshPrice={onRefreshPrice}
      />
      <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
        <AutoColumn gap="sm">
          <CurrencyInputPanel
            label={independentField === Field.OUTPUT && trade ? t('From (estimated)') : t('From')}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton
            maxAmount={maxAmountInput}
            showQuickInputButton
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases={false}
            showSearchInput={false}
            tokensToShow={stableTokens}
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
            value={formattedAmounts[Field.OUTPUT]}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && trade ? t('To (estimated)') : t('To')}
            showMaxButton={false}
            currency={currencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={currencies[Field.INPUT]}
            id="swap-currency-output"
            showCommonBases={false}
            showSearchInput={false}
            tokensToShow={stableTokens}
          />

          <AutoColumn gap="sm" style={{ padding: '0 16px' }}>
            <RowBetween align="center">
              {Boolean(trade) && (
                <>
                  <SwapUI.InfoLabel>{t('Price')}</SwapUI.InfoLabel>
                  {isLoading ? (
                    <Skeleton width="100%" ml="8px" height="24px" />
                  ) : (
                    <SwapUI.TradePrice price={trade?.executionPrice} />
                  )}
                </>
              )}
            </RowBetween>
            <RowBetween align="center">
              <Label>
                {t('Slippage Tolerance')}
                <IconButton scale="sm" variant="text" onClick={onPresentSettingsModal}>
                  <PencilIcon color="primary" width="10px" />
                </IconButton>
              </Label>
              <Text bold color="primary">
                {allowedSlippage / 100}%
              </Text>
            </RowBetween>
          </AutoColumn>
          {typedValue ? null : stableSwapConfig ? (
            <AutoColumn>
              <Message variant="warning" mb="16px">
                <MessageText>{t('Trade stablecoins in StableSwap with lower slippage and trading fees!')}</MessageText>
              </Message>
            </AutoColumn>
          ) : null}
          {stableSwapConfig ? null : (
            <AutoColumn>
              <Message variant="warning" mb="16px">
                <MessageText>{t('Stable pair not found use Swap')}</MessageText>
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
