import { memo, useState } from 'react'
import { Percent } from '@pancakeswap/swap-sdk-core'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Pair, Currency, CurrencyAmount } from '@pancakeswap/aptos-swap-sdk'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'

import {
  Text,
  ChevronUpIcon,
  ChevronDownIcon,
  Card,
  CardBody,
  Flex,
  CardProps,
  TooltipText,
  Dots,
  RowBetween,
  AutoColumn,
  RowFixed,
  Button,
  AddIcon,
} from '@pancakeswap/uikit/src/components'

import { useTooltip } from '@pancakeswap/uikit/src/hooks'
import { NextLinkFromReactRouter } from '@pancakeswap/uikit/src/components/NextLink'
import formatAmountDisplay from 'utils/formatAmountDisplay'

const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

export const BIG_INT_ZERO = 0n

export const LightCard = styled(Card)`
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

interface PositionCardProps extends CardProps {
  pair: Pair
  showUnwrapped?: boolean
  currency0: Currency
  currency1: Currency
  token0Deposited: CurrencyAmount<Currency>
  token1Deposited: CurrencyAmount<Currency>
  totalUSDValue: number
  userPoolBalance: CurrencyAmount<Currency>
  poolTokenPercentage: Percent
  poolData: {
    lpApr7d: number
  }
  addTo?: any
  removeTo?: any
}

function MinimalPositionCardView({
  currency0,
  currency1,
  token0Deposited,
  token1Deposited,
  totalUSDValue,
  userPoolBalance,
  poolTokenPercentage,
  poolData,
}: PositionCardProps) {
  const { t } = useTranslation()
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
                    <Text>{userPoolBalance ? formatAmountDisplay(userPoolBalance) : '-'}</Text>
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
                    {/* <Text>{formatAmount(poolData.lpApr7d)}%</Text> */}
                  </FixedHeightRow>
                )}
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Share in Trading Pair')}:
                  </Text>
                  <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(6)}%` : '-'}</Text>
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text color="textSubtle" small>
                    {t('Pooled %asset%', { asset: currency0.symbol })}:
                  </Text>
                  {token0Deposited ? (
                    <RowFixed>
                      <Text ml="6px">{formatAmountDisplay(token0Deposited)}</Text>
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
                      <Text ml="6px">{formatAmountDisplay(token1Deposited)}</Text>
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
        <LightCard padding="24px">
          <Text fontSize="14px" style={{ textAlign: 'center' }}>
            <span role="img" aria-label="pancake-icon">
              🥞
            </span>{' '}
            {t(
              "By adding liquidity you'll earn 0.17% of all trades on this pair proportional to your share in the trading pair. Fees are added to the pair, accrue in real time and can be claimed by withdrawing your liquidity.",
            )}
          </Text>
        </LightCard>
      )}
    </>
  )
}

function FullPositionCardView({
  currency0,
  currency1,
  token0Deposited,
  token1Deposited,
  totalUSDValue,
  userPoolBalance,
  poolTokenPercentage,
  poolData,
  addTo,
  removeTo,
  ...props
}: PositionCardProps) {
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )
  const [showMore, setShowMore] = useState(false)

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
            {formatAmountDisplay(userPoolBalance)}
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
                <Text ml="6px">{formatAmountDisplay(token0Deposited)}</Text>
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
                <Text ml="6px">{formatAmountDisplay(token1Deposited)}</Text>
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
              {/* <Text>{formatAmount(poolData.lpApr7d)}%</Text> */}
            </FixedHeightRow>
          )}

          <FixedHeightRow>
            <Text color="textSubtle">{t('Share in Trading Pair')}</Text>
            <Text>
              {poolTokenPercentage
                ? `${poolTokenPercentage.toFixed(2) === '0.00' ? '<0.01' : poolTokenPercentage.toFixed(2)}%`
                : '-'}
            </Text>
          </FixedHeightRow>

          {userPoolBalance && userPoolBalance.quotient > BIG_INT_ZERO && (
            <Flex flexDirection="column">
              <Button as={NextLinkFromReactRouter} to={removeTo} variant="primary" width="100%" mb="8px">
                {t('Remove')}
              </Button>
              <Button
                as={NextLinkFromReactRouter}
                to={addTo}
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

export const FullPositionCard = memo(FullPositionCardView)
export const MinimalPositionCard = memo(MinimalPositionCardView)
