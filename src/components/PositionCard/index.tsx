import { useState } from 'react'
import { JSBI, Pair, Percent } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ChevronUpIcon,
  ChevronDownIcon,
  Card,
  CardBody,
  Flex,
  CardProps,
  AddIcon,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from '@pancakeswap/localization'
import useTotalSupply from 'hooks/useTotalSupply'
import useBUSDPrice from 'hooks/useBUSDPrice'
import { multiplyPriceByAmount } from 'utils/prices'
import { useWeb3React } from '@pancakeswap/wagmi'
import { BIG_INT_ZERO } from 'config/constants/exchange'

import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

import { LightCard } from '../Card'
import { AutoColumn } from '../Layout/Column'
import CurrencyLogo from '../Logo/CurrencyLogo'
import { DoubleCurrencyLogo } from '../Logo'
import { RowBetween, RowFixed } from '../Layout/Row'
import Dots from '../Loader/Dots'
import { formatAmount } from '../../utils/formatInfoNumbers'
import { useLPApr } from '../../state/swap/hooks'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
}

const useLPValues = (account, pair, currency0, currency1) => {
  const token0Price = useBUSDPrice(currency0)
  const token1Price = useBUSDPrice(currency1)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance &&
    !!totalPoolTokens &&
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? new Percent(userPoolBalance.quotient, totalPoolTokens.quotient)
      : undefined

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.quotient, userPoolBalance.quotient)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  const token0USDValue =
    token0Deposited && token0Price
      ? multiplyPriceByAmount(token0Price, parseFloat(token0Deposited.toSignificant(6)))
      : null
  const token1USDValue =
    token1Deposited && token1Price
      ? multiplyPriceByAmount(token1Price, parseFloat(token1Deposited.toSignificant(6)))
      : null
  const totalUSDValue = token0USDValue && token1USDValue ? token0USDValue + token1USDValue : null

  return { token0Deposited, token1Deposited, totalUSDValue, poolTokenPercentage, userPoolBalance }
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const { totalUSDValue, poolTokenPercentage, token0Deposited, token1Deposited, userPoolBalance } = useLPValues(
    account,
    pair,
    currency0,
    currency1,
  )

  return (
    <>
      {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, BIG_INT_ZERO) ? (
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
                    {t('Share of Pool')}:
                  </Text>
                  <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow>
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
            {t(
              "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share of the pool. Fees are added to the pool, accrue in real time and can be claimed by withdrawing your liquidity.",
            )}
          </Text>
        </LightCard>
      )}
    </>
  )
}

export default function FullPositionCard({ pair, ...props }: PositionCardProps) {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )
  const [showMore, setShowMore] = useState(false)

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const { totalUSDValue, poolTokenPercentage, token0Deposited, token1Deposited, userPoolBalance } = useLPValues(
    account,
    pair,
    currency0,
    currency1,
  )

  return (
    <Card {...props}>
      <Flex justifyContent="space-between" role="button" onClick={() => setShowMore(!showMore)} p="16px">
        <Flex flexDirection="column">
          <Flex alignItems="center" mb="4px">
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={20} />
            <Text bold ml="8px">
              {!currency0 || !currency1 ? <Dots>{t('Loading')}</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </Flex>
          <Text fontSize="14px" color="textSubtle">
            {userPoolBalance?.toSignificant(4)}
          </Text>
          {Number.isFinite(totalUSDValue) && (
            <Text small color="textSubtle">{`(~${totalUSDValue.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} USD)`}</Text>
          )}
        </Flex>
        {showMore ? <ChevronUpIcon /> : <ChevronDownIcon />}
      </Flex>

      {showMore && (
        <AutoColumn gap="8px" style={{ padding: '16px' }}>
          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency0} />
              <Text color="textSubtle" ml="4px">
                {t('Pooled %asset%', { asset: currency0.symbol })}:
              </Text>
            </RowFixed>
            {token0Deposited ? (
              <RowFixed>
                <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          <FixedHeightRow>
            <RowFixed>
              <CurrencyLogo size="20px" currency={currency1} />
              <Text color="textSubtle" ml="4px">
                {t('Pooled %asset%', { asset: currency1.symbol })}:
              </Text>
            </RowFixed>
            {token1Deposited ? (
              <RowFixed>
                <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
              </RowFixed>
            ) : (
              '-'
            )}
          </FixedHeightRow>

          {poolData && (
            <FixedHeightRow>
              <RowFixed>
                <TooltipText ref={targetRef} color="textSubtle">
                  {t('LP reward APR')}:
                </TooltipText>
                {tooltipVisible && tooltip}
              </RowFixed>
              <Text>{formatAmount(poolData.lpApr7d)}%</Text>
            </FixedHeightRow>
          )}

          <FixedHeightRow>
            <Text color="textSubtle">{t('Share of Pool')}</Text>
            <Text>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && JSBI.greaterThan(userPoolBalance.quotient, BIG_INT_ZERO) && (
            <Flex flexDirection="column">
              <Button
                as={NextLinkFromReactRouter}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
                variant="primary"
                width="100%"
                mb="8px"
              >
                {t('Remove')}
              </Button>
              <Button
                as={NextLinkFromReactRouter}
                to={`/add/${currencyId(currency0)}/${currencyId(currency1)}?step=1`}
                variant="text"
                startIcon={<AddIcon color="primary" />}
                width="100%"
              >
                {t('Add liquidity instead')}
              </Button>
            </Flex>
          )}
        </AutoColumn>
      )}
    </Card>
  )
}
