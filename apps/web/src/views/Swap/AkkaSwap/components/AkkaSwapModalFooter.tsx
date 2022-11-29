import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trade, TradeType, CurrencyAmount, Currency } from '@pancakeswap/sdk'
import { Button, Text, AutoRenewIcon, QuestionHelper } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { Field } from 'state/swap/actions'
import { computeTradePriceBreakdown, formatExecutionPrice, warningSeverity } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { TOTAL_FEE, LP_HOLDERS_FEE, TREASURY_FEE, BUYBACK_FEE } from 'config/constants/info'
import { StyledBalanceMaxMini, SwapCallbackError } from './styleds'
import { AkkaRouterTrade } from '../hooks/types'

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export default function AkkaSwapModalFooter({
  trade,
  isEnoughInputBalance,
  onConfirm,
  swapErrorMessage,
}: {
  trade: AkkaRouterTrade
  isEnoughInputBalance: boolean
  onConfirm: () => void
  swapErrorMessage?: string | undefined
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)

  const totalFeePercent = `${(TOTAL_FEE * 100).toFixed(2)}%`
  const lpHoldersFeePercent = `${(LP_HOLDERS_FEE * 100).toFixed(2)}%`
  const treasuryFeePercent = `${(TREASURY_FEE * 100).toFixed(4)}%`
  const buyBackFeePercent = `${(BUYBACK_FEE * 100).toFixed(4)}%`
  console.log('routes', trade.route.routes.bitgert)
  console.log('swap', trade.args.data)
  const fee = trade.route.routes.bitgert.map((item, index) => {
    return item.input_amount * item.routes[0].operations.length * 0.003
  })
  const realizedLPFee = fee.reduce((accumulator, value) => {
    return accumulator + value
  }, 0)

  return (
    <>
      <SwapModalFooterContainer>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              Price Impact
            </Text>
          </RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {trade.route.price_impact.toFixed(3)}%
          </Text>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px" color="textSubtle">
              You Save
            </Text>
          </RowFixed>
          <Text fontSize="14px" color="textSubtle">
            ${(trade.route.return_amount_in_usd - trade.route.best_alt).toFixed(3)}
          </Text>
        </RowBetween>
        <RowBetween>
          <RowFixed>
            <Text fontSize="14px">{t('Liquidity Provider Fee')}</Text>
            {/* <QuestionHelper
              text={
                <>
                  <Text mb="12px">{t('For each trade a %amount% fee is paid', { amount: totalFeePercent })}</Text>
                  <Text>- {t('%amount% to LP token holders', { amount: lpHoldersFeePercent })}</Text>
                  <Text>- {t('%amount% to the Treasury', { amount: treasuryFeePercent })}</Text>
                  <Text>- {t('%amount% towards CAKE buyback and burn', { amount: buyBackFeePercent })}</Text>
                </>
              }
              ml="4px"
            /> */}
          </RowFixed>
          <Text fontSize="14px">
            {realizedLPFee
              ? `${realizedLPFee?.toFixed(6)} ${
                  trade.route.routes.bitgert[0].routes[0].operations_seperated[0].operations[0].offer_token[3]
                }`
              : '-'}
          </Text>
        </RowBetween>
      </SwapModalFooterContainer>

      <AutoRow>
        <Button variant={'primary'} onClick={onConfirm} mt="12px" id="confirm-swap-or-send" width="100%">
          {t('Confirm Swap')}
        </Button>

        {swapErrorMessage ? <SwapCallbackError error={swapErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
