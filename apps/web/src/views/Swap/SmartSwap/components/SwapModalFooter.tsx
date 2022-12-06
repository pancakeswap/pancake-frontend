import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import { AutoRenewIcon, Button, QuestionHelper, Text, Link } from '@pancakeswap/uikit'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { BUYBACK_FEE, LP_HOLDERS_FEE, TOTAL_FEE, TREASURY_FEE } from 'config/constants/info'
import { useMemo, useState } from 'react'
import { Field } from 'state/swap/actions'
import styled from 'styled-components'
import { warningSeverity } from 'utils/exchange'
import FormattedPriceImpact from '../../components/FormattedPriceImpact'
import { StyledBalanceMaxMini, SwapCallbackError } from '../../components/styleds'
import { formatExecutionPrice, computeTradePriceBreakdown } from '../utils/exchange'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export default function SwapModalFooter({
  trade,
  slippageAdjustedAmounts,
  isEnoughInputBalance,
  onConfirm,
  swapErrorMessage,
  disabledConfirm,
}: {
  trade: TradeWithStableSwap<Currency, Currency, TradeType>
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  isEnoughInputBalance: boolean
  onConfirm: () => void
  swapErrorMessage?: string | undefined
  disabledConfirm: boolean
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)
  const { priceImpactWithoutFee, realizedLPFee } = useMemo(() => computeTradePriceBreakdown(trade), [trade])
  const severity = warningSeverity(priceImpactWithoutFee)

  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`
  const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`
  const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`
  const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween align="center">
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
            {formatExecutionPrice(trade, showInverted)}
            <StyledBalanceMaxMini onClick={() => setShowInverted(!showInverted)}>
              <AutoRenewIcon width="14px" />
            </StyledBalanceMaxMini>
          </Text>
        </RowBetween>

        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT ? t('Minimum received') : t('Maximum sold')}
            </Text>
            <QuestionHelper
              text={t(
                'Your transaction will revert if there is a large, unfavorable price movement before it is confirmed.',
              )}
              ml="4px"
            />
          </RowFixed>
          <RowFixed>
            <Text fontSize="14px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? slippageAdjustedAmounts[Field.OUTPUT]?.toSignificant(4) ?? '-'
                : slippageAdjustedAmounts[Field.INPUT]?.toSignificant(4) ?? '-'}
            </Text>
            <Text fontSize="14px" marginLeft="4px">
              {trade.tradeType === TradeType.EXACT_INPUT
                ? trade.outputAmount.currency.symbol
                : trade.inputAmount.currency.symbol}
            </Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Price Impact')}</Text>
            <QuestionHelper
              text={t('The difference between the market price and your price due to trade size.')}
              ml="4px"
            />
          </RowFixed>
          <FormattedPriceImpact priceImpact={priceImpactWithoutFee} />
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Liquidity Provider Fee')}</Text>
            <QuestionHelper
              text={
                <>
                  <Text mb="12px">
                    {t('For each non-stableswap trade, a %amount% fee is paid', { amount: totalFeePercent })}
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
                </>
              }
              ml="4px"
            />
          </RowFixed>
          <Text fontSize="14px">
            {realizedLPFee ? `${realizedLPFee?.toSignificant(6)} ${trade.inputAmount.currency.symbol}` : '-'}
          </Text>
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button
          variant={severity > 2 ? 'danger' : 'primary'}
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {severity > 2 || (trade.tradeType === TradeType.EXACT_OUTPUT && !isEnoughInputBalance)
            ? t('Swap Anyway')
            : t('Confirm Swap')}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
