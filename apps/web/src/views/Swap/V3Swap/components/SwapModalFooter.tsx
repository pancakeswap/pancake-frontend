import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { SmartRouter } from '@pancakeswap/smart-router'
import {
  AutoColumn,
  BackForwardIcon,
  Box,
  Button,
  Flex,
  Link,
  QuestionHelper,
  Text,
  WarningIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { CurrencyLogo as CurrencyLogoWidget } from '@pancakeswap/widgets-internal'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { useGasToken } from 'hooks/useGasToken'
import { memo, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import { styled } from 'styled-components'
import { warningSeverity } from 'utils/exchange'

import { paymasterInfo } from 'config/paymaster'
import { usePaymaster } from 'hooks/usePaymaster'
import { InterfaceOrder, isXOrder } from 'views/Swap/utils'
import FormattedPriceImpact from '../../components/FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from '../../components/styleds'
import { SlippageAdjustedAmounts, formatExecutionPrice } from '../utils/exchange'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const SameTokenWarningBox = styled(Box)`
  font-size: 13px;
  background-color: #ffb2371a;
  padding: 10px;
  margin-top: 12px;
  color: ${({ theme }) => theme.colors.yellow};
  border: 1px solid ${({ theme }) => theme.colors.yellow};
  border-radius: ${({ theme }) => theme.radii['12px']};
`

const StyledWarningIcon = styled(WarningIcon)`
  fill: ${({ theme }) => theme.colors.yellow};
`

const Badge = styled.span`
  font-size: 14px;
  padding: 1px 6px;
  user-select: none;
  border-radius: ${({ theme }) => theme.radii['32px']};
  color: ${({ theme }) => theme.colors.invertedContrast};
  background-color: ${({ theme }) => theme.colors.success};
`

export const SwapModalFooter = memo(function SwapModalFooter({
  priceImpact: priceImpactWithoutFee,
  lpFee: realizedLPFee,
  inputAmount,
  outputAmount,
  order,
  tradeType,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  order?: InterfaceOrder
  tradeType: TradeType
  lpFee?: CurrencyAmount<Currency>
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  priceImpact?: Percent
  slippageAdjustedAmounts: SlippageAdjustedAmounts | undefined | null
  isEnoughInputBalance?: boolean
  swapErrorMessage?: string | undefined
  disabledConfirm: boolean
  onConfirm: () => void
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const [gasToken] = useGasToken()
  const { isPaymasterAvailable, isPaymasterTokenActive } = usePaymaster()
  const gasTokenInfo = paymasterInfo[gasToken.isToken ? gasToken?.wrapped.address : '']

  const showSameTokenWarning = useMemo(
    () =>
      isPaymasterAvailable &&
      isPaymasterTokenActive &&
      gasTokenInfo?.discount !== 'FREE' &&
      inputAmount.currency?.wrapped.address &&
      !inputAmount.currency.isNative &&
      gasToken.isToken &&
      inputAmount.currency.wrapped.address === gasToken.wrapped.address,
    [inputAmount, gasToken, isPaymasterAvailable, isPaymasterTokenActive, gasTokenInfo],
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    gasTokenInfo?.discount &&
      (gasTokenInfo.discount === 'FREE'
        ? t('Gas fees is fully sponsored')
        : t('%discount% discount on this gas fee token', { discount: gasTokenInfo.discount })),
  )

  const severity = warningSeverity(priceImpactWithoutFee)

  const executionPriceDisplay = useMemo(() => {
    const price = SmartRouter.getExecutionPrice(order?.trade) ?? undefined
    return formatExecutionPrice(price, inputAmount, outputAmount, showInverted)
  }, [order, inputAmount, outputAmount, showInverted])

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center" mb="8px">
          <Text fontSize="14px">{t('Price')}</Text>
          <Text
            fontSize="14px"
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {executionPriceDisplay}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <BackForwardIcon color="primary" width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>
        <RowBetween mb="8px">
          <RowFixed>
            <Text fontSize="14px">
              {tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}
            </Text>
            <QuestionHelper
              text={t(
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
              ml="4px"
              placement="top"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {tradeType === TradeType.EXACT_INPUT
                ? formatAmount(slippageAdjustedAmounts?.[Field.OUTPUT], 4) ?? '-'
                : formatAmount(slippageAdjustedAmounts?.[Field.INPUT], 4) ?? '-'}
            </Text>
            <Text fontSize="14px" marginLeft="4px">
              {tradeType === TradeType.EXACT_INPUT ? outputAmount.currency.symbol : inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween mb="8px">
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <QuestionHelper
              ml="4px"
              placement="top"
              text={<>{t('The difference between the market price and your price due to trade size.')}</>}
            />
          </RowFixed>
          <FormattedPriceImpact isX={isXOrder(order)} priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Trading Fee')}</Text>
            <QuestionHelper
              ml="4px"
              placement="top"
              text={
                <>
                  <Text>
                    {t(
                      'Fee ranging from 0.1% to 0.01% depending on the pool fee tier. You can check the fee tier by clicking the magnifier icon under the “Route” section.',
                    )}
                  </Text>
                  <Text mt="12px">
                    <Link
                      style={{ display: 'inline' }}
                      ml="4px"
                      external
                      href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/faq#what-will-be-the-trading-fee-breakdown-for-v3-exchange"
                    >
                      {t('Fee Breakdown and Tokenomics')}
                    </Link>
                  </Text>
                </>
              }
            />
          </RowFixed>
          {realizedLPFee || isXOrder(order) ? (
            <Flex>
              {isXOrder(order) ? (
                <Text color="primary" fontSize="14px">
                  0 {inputAmount.currency.symbol}
                </Text>
              ) : null}
              {!isXOrder(order) && realizedLPFee && (
                <Text fontSize="14px" mr="8px" strikeThrough={isXOrder(order)}>
                  {`${formatAmount(realizedLPFee, 6)} ${inputAmount.currency.symbol}`}
                </Text>
              )}
            </Flex>
          ) : (
            <Text fontSize="14px" textAlign="right">
              -
            </Text>
          )}
        </RowBetween>
        {isPaymasterAvailable && isPaymasterTokenActive && (
          <RowBetween mt="8px">
            <RowFixed>
              <Text fontSize="14px">{t('Gas Token')}</Text>
              {gasTokenInfo && gasTokenInfo.discount && (
                <Badge
                  ref={targetRef}
                  style={{ fontSize: '12px', fontWeight: 600, padding: '3px 5px', marginLeft: '4px' }}
                >
                  ⛽️ {gasTokenInfo.discountLabel ?? gasTokenInfo.discount}
                </Badge>
              )}
              {tooltipVisible && tooltip}
            </RowFixed>

            <Flex alignItems="center">
              <Text marginRight={2} fontSize={14}>
                {(gasToken && gasToken.symbol && gasToken.symbol.length > 10
                  ? `${gasToken.symbol.slice(0, 4)}...${gasToken.symbol.slice(
                      gasToken.symbol.length - 5,
                      gasToken.symbol.length,
                    )}`
                  : gasToken?.symbol) || 'ETH'}
              </Text>

              <div style={{ position: 'relative' }}>
                <CurrencyLogoWidget currency={gasToken} />
                <p style={{ position: 'absolute', bottom: '-2px', left: '-6px', fontSize: '16px' }}>⛽️</p>
              </div>
            </Flex>
          </RowBetween>
        )}
      </SwapModalFooterContainer>

      {showSameTokenWarning && (
        <SameTokenWarningBox>
          <Flex>
            <StyledWarningIcon marginRight={2} />
            <span>
              {t(
                'Please ensure you leave enough tokens for gas fees when selecting the same token for gas as the input token',
              )}
            </span>
          </Flex>
        </SameTokenWarningBox>
      )}

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 || (tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance)
            ? t('Swap Anyway')
            : t('Confirm Swap')}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
})
