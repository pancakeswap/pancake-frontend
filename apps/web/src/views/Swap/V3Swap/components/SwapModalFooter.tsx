import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'
import { SmartRouter } from '@pancakeswap/smart-router'
import { AutoColumn, BackForwardIcon, Button, Dots, Flex, Link, QuestionHelper, Text } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { BUYBACK_FEE, LP_HOLDERS_FEE, TOTAL_FEE, TREASURY_FEE } from 'config/constants/info'
import { memo, useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import { styled } from 'styled-components'
import { warningSeverity } from 'utils/exchange'
import { formatExecutionPrice as mmFormatExecutionPrice } from 'views/Swap/MMLinkPools/utils/exchange'

import { InterfaceOrder, isMMOrder, isXOrder } from 'views/Swap/utils'
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
  isRFQReady,
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
  isRFQReady?: boolean
  onConfirm: () => void
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const severity = warningSeverity(priceImpactWithoutFee)

  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`
  const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`
  const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`
  const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`

  const executionPriceDisplay = useMemo(() => {
    if (isMMOrder(order)) {
      return mmFormatExecutionPrice(order.trade, showInverted)
    }

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
              text={
                isMMOrder(order) ? (
                  <>
                    <Text>
                      <Text bold display="inline-block">
                        {t('AMM')}
                      </Text>
                      {`: ${t('The difference between the market price and estimated price due to trade size.')}`}
                    </Text>
                    <Text mt="10px">
                      <Text bold display="inline-block">
                        {t('MM')}
                      </Text>
                      {`: ${t('No slippage against quote from market maker')}`}
                    </Text>
                  </>
                ) : (
                  <>{t('The difference between the market price and your price due to trade size.')}</>
                )
              }
            />
          </RowFixed>
          {isMMOrder(order) ? (
            <Text color="textSubtle">--</Text>
          ) : (
            <FormattedPriceImpact isX={isXOrder(order)} priceImpact={priceImpactWithoutFee} />
          )}
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Trading Fee')}</Text>
            <QuestionHelper
              ml="4px"
              placement="top"
              text={
                isMMOrder(order) ? (
                  <>
                    <Text mb="12px">
                      <Text bold display="inline-block">
                        {t('AMM')}
                      </Text>
                      : {t('For each non-stableswap trade, a %amount% fee is paid', { amount: totalFeePercent })}
                    </Text>
                    <Text>- {t('%amount% to LP token holders', { amount: lpHoldersFeePercent })}</Text>
                    <Text>- {t('%amount% to the Treasury', { amount: treasuryFeePercent })}</Text>
                    <Text>- {t('%amount% towards CAKE buyback and burn', { amount: buyBackFeePercent })}</Text>
                    <Text mt="12px">
                      {t('For each stableswap trade, refer to the fee table')}
                      <Link
                        style={{ display: 'inline' }}
                        ml="4px"
                        external
                        href="https://docs.pancakeswap.finance/products/stableswap#stableswap-fees"
                      >
                        {t('here.')}
                      </Link>
                    </Text>
                    <Text mt="10px">
                      <Text bold display="inline-block">
                        {t('MM')}
                      </Text>
                      :{' '}
                      {t(
                        'PancakeSwap does not charge any fees for trades. However, the market makers charge an implied fee of 0.05% - 0.25% (non-stablecoin) / 0.01% (stablecoin) factored into the quotes provided by them.',
                      )}
                    </Text>
                  </>
                ) : (
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
                )
              }
            />
          </RowFixed>
          {realizedLPFee || isXOrder(order) ? (
            <Flex>
              <Text color="primary" fontSize="14px">
                0 {inputAmount.currency.symbol}
              </Text>
              {realizedLPFee && (
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
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={isMMOrder(order) ? disabledConfirm || !isRFQReady : disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {isMMOrder(order) && !isRFQReady ? (
            <Dots>{t('Checking RFQ with MM')}</Dots>
          ) : severity > 2 || (tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance) ? (
            t('Swap Anyway')
          ) : (
            t('Confirm Swap')
          )}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
})
