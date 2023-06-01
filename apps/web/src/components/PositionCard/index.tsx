import { useMemo, useContext } from 'react'
import { Currency, CurrencyAmount, Pair, Percent } from '@pancakeswap/sdk'
import { Text, Card, CardBody, Flex, CardProps, TooltipText, useTooltip, Link, AutoColumn } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import useTotalSupply from 'hooks/useTotalSupply'
import { useStablecoinPriceAmount } from 'hooks/useBUSDPrice'
import { useAccount } from 'wagmi'
import { BIG_INT_ZERO } from 'config/constants/exchange'
import { useGetRemovedTokenAmounts } from 'views/RemoveLiquidity/RemoveStableLiquidity/hooks/useStableDerivedBurnInfo'
import { StableConfigContext } from 'views/Swap/hooks/useStableConfig'

import { useLPApr } from 'state/swap/useLPApr'
import { useTokenBalance } from 'state/wallet/hooks'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'
import { formatAmount } from '../../utils/formatInfoNumbers'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
  currency0: Currency
  currency1: Currency
  token0Deposited: CurrencyAmount<Currency>
  token1Deposited: CurrencyAmount<Currency>
  totalUSDValue: number
  userPoolBalance: CurrencyAmount<Currency>
  poolTokenPercentage: Percent
}

export const useTokensDeposited = ({ pair, totalPoolTokens, userPoolBalance }) => {
  const [token0Deposited, token1Deposited] =
    !!pair && !!totalPoolTokens && !!userPoolBalance && totalPoolTokens.quotient >= userPoolBalance.quotient
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return [token0Deposited, token1Deposited]
}

export const useTotalUSDValue = ({ currency0, currency1, token0Deposited, token1Deposited }) => {
  const token0USDValue = useStablecoinPriceAmount(
    currency0,
    token0Deposited ? parseFloat(token0Deposited.toSignificant(6)) : null,
  )
  const token1USDValue = useStablecoinPriceAmount(
    currency1,
    token1Deposited ? parseFloat(token1Deposited.toSignificant(6)) : null,
  )

  return token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null
}

export const usePoolTokenPercentage = ({ userPoolBalance, totalPoolTokens }) => {
  return !!userPoolBalance && !!totalPoolTokens && totalPoolTokens.quotient >= userPoolBalance.quotient
    ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
    : undefined
}

const withLPValuesFactory =
  ({ useLPValuesHook, hookArgFn }) =>
  (Component) =>
  (props) => {
    const { address: account } = useAccount()

    const currency0 = props.showUnwrapped ? props.pair.token0 : unwrappedToken(props.pair.token0)
    const currency1 = props.showUnwrapped ? props.pair.token1 : unwrappedToken(props.pair.token1)

    const userPoolBalance = useTokenBalance(account ?? undefined, props.pair.liquidityToken)

    const totalPoolTokens = useTotalSupply(props.pair.liquidityToken)

    const poolTokenPercentage = usePoolTokenPercentage({ totalPoolTokens, userPoolBalance })

    const args = useMemo(
      () =>
        hookArgFn({
          userPoolBalance,
          pair: props.pair,
          totalPoolTokens,
        }),
      [userPoolBalance, props.pair, totalPoolTokens],
    )

    const [token0Deposited, token1Deposited] = useLPValuesHook(args)

    const totalUSDValue = useTotalUSDValue({ currency0, currency1, token0Deposited, token1Deposited })

    return (
      <Component
        {...props}
        currency0={currency0}
        currency1={currency1}
        token0Deposited={token0Deposited}
        token1Deposited={token1Deposited}
        totalUSDValue={totalUSDValue}
        userPoolBalance={userPoolBalance}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

export const withLPValues = withLPValuesFactory({
  useLPValuesHook: useTokensDeposited,
  hookArgFn: ({ pair, userPoolBalance, totalPoolTokens }) => ({ pair, userPoolBalance, totalPoolTokens }),
})

export const withStableLPValues = withLPValuesFactory({
  useLPValuesHook: useGetRemovedTokenAmounts,
  hookArgFn: ({ userPoolBalance }) => ({
    lpAmount: userPoolBalance?.quotient?.toString(),
  }),
})

function MinimalPositionCardView({
  pair,
  currency0,
  currency1,
  token0Deposited,
  token1Deposited,
  totalUSDValue,
  userPoolBalance,
  poolTokenPercentage,
}: PositionCardProps) {
  const isStableLP = useContext(StableConfigContext)

  const { t } = useTranslation()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  return (
    <>
      {userPoolBalance && userPoolBalance.quotient > BIG_INT_ZERO ? (
        <Card>
          <CardBody>
            <AutoColumn gap="16px">
              <FixedHeightRow>
                <RowFixed>
                  <Text color="secondary" bold>
                    {t('LP tokens in your wallet')}
                  </Text>
                </RowFixed>
              </FixedHeightRow>
              <FixedHeightRow>
                <RowFixed>
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                  <Text small color="textSubtle">
                    {currency0.symbol}-{currency1.symbol} LP
                  </Text>
                </RowFixed>
                <RowFixed>
                  <Flex flexDirection="column" alignItems="flex-end">
                    <Text>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                    {Number.isFinite(totalUSDValue) && (
                      <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD)`}</Text>
                    )}
                  </Flex>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="4px">
                {poolData && (
                  <FixedHeightRow>
                    <TooltipText ref={targetRef} color="textSubtle" small>
                      {t('LP reward APR')}:
                    </TooltipText>
                    {tooltipVisible && tooltip}
                    <Text>{formatAmount(poolData.lpApr7d)}%</Text>
                  </FixedHeightRow>
                )}
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Share in Trading Pair')}:
                  </Text>
                  <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow>
                {isStableLP ? null : (
                  <FixedHeightRow>
                    <Text color="textSubtle" small>
                      {t('Pooled %asset%', { asset: currency0.symbol })}:
                    </Text>
                    {token0Deposited ? (
                      <RowFixed>
                        <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </FixedHeightRow>
                )}
                {isStableLP ? null : (
                  <FixedHeightRow>
                    <Text color="textSubtle" small>
                      {t('Pooled %asset%', { asset: currency1.symbol })}:
                    </Text>
                    {token1Deposited ? (
                      <RowFixed>
                        <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
                      </RowFixed>
                    ) : (
                      '-'
                    )}
                  </FixedHeightRow>
                )}
              </AutoColumn>
            </AutoColumn>
          </CardBody>
        </Card>
      ) : (
        <LightCard>
          <Text fontSize="14px" style={{ textAlign: 'center' }}>
            <span role="img" aria-label="pancake-icon">
              🥞
            </span>{' '}
            {isStableLP ? (
              <>
                {t(
                  'By adding liquidity, you’ll earn 50% from the fees of all trades on this pair, proportional to your share in the trading pair. Fees are added to the pair, accrue in real time, and can be claimed by withdrawing your liquidity. For more information on Stableswap fees click',
                )}
                <Link
                  style={{ display: 'inline' }}
                  ml="4px"
                  external
                  href="https://docs.pancakeswap.finance/products/stableswap#stableswap-fees"
                >
                  {t('here.')}
                </Link>
              </>
            ) : (
              t(
                "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share in the trading pair. Fees are added to the pair, accrue in real time and can be claimed by withdrawing your liquidity.",
              )
            )}
          </Text>
        </LightCard>
      )}
    </>
  )
}

export const MinimalPositionCard = withLPValues(MinimalPositionCardView)
