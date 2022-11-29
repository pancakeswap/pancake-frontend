import { Trade, TradeType, Currency } from '@pancakeswap/sdk'
import { Text, QuestionHelper } from '@pancakeswap/uikit'
import { Field } from 'state/swap/actions'
import { useTranslation } from '@pancakeswap/localization'
import { useUserSlippageTolerance } from 'state/user/hooks'
import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown } from 'utils/exchange'
import { AutoColumn } from 'components/Layout/Column'
import { TOTAL_FEE, LP_HOLDERS_FEE, TREASURY_FEE, BUYBACK_FEE } from 'config/constants/info'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import { AkkaRouterInfoResponseType } from '../hooks/types'
import AkkaSwapRoute from './AkkaSwapRoute'

function TradeSummary({ route }: { route: AkkaRouterInfoResponseType }) {
  const { t } = useTranslation()

  return (
    <AutoColumn style={{ padding: '0 16px' }}>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            Price Impact
          </Text>
        </RowFixed>
        <Text fontSize="14px" color="textSubtle">
          {route?.price_impact?.toFixed(3)}%
        </Text>
      </RowBetween>
      <RowBetween>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            You Save
          </Text>
        </RowFixed>
        <Text fontSize="14px" color="textSubtle">
          ${(route?.return_amount_in_usd - route?.best_alt).toFixed(3)}
        </Text>
      </RowBetween>
    </AutoColumn>
  )
}
export interface AdvancedSwapDetailsProps {
  route?: AkkaRouterInfoResponseType
}
export function AkkaAdvancedSwapDetails({ route }: AdvancedSwapDetailsProps) {
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippageTolerance()

  const showRoute = Boolean(route && route?.routes?.bitgert.length > 0)

  return (
    <AutoColumn gap="0px">
      {route && (
        <>
          <TradeSummary route={route} />
          {showRoute && (
            <>
              <RowBetween style={{ padding: '0 16px' }}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Text fontSize="14px" color="textSubtle">
                    {t('Route')}
                  </Text>
                  <QuestionHelper
                    text={t('Routing through these tokens resulted in the best price for your trade.')}
                    ml="4px"
                    placement="top-start"
                  />
                </span>
                <AkkaSwapRoute route={route} />
              </RowBetween>
            </>
          )}
        </>
      )}
    </AutoColumn>
  )
}
