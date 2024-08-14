import { Protocol } from '@pancakeswap/farms'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/swap-sdk-core'
import { FeeTier, Flex, Row, Skeleton, Tag, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { DoubleCurrencyLogo, FiatNumberDisplay } from '@pancakeswap/widgets-internal'
import { RangeTag } from 'components/RangeTag'
import React, { memo, useMemo } from 'react'
import { PoolInfo } from 'state/farmsV4/state/type'
import styled from 'styled-components'
import { useV2CakeEarning, useV3CakeEarning } from 'views/universalFarms/hooks/useCakeEarning'
import { PoolApyButton } from '../PoolApyButton'

export type PositionInfoProps = {
  chainId: number
  currency0?: Currency
  currency1?: Currency
  removed: boolean
  outOfRange: boolean
  desc?: React.ReactNode
  link?: string
  tokenId?: bigint
  fee: number
  isStaked?: boolean
  protocol: Protocol
  totalPriceUSD: number
  amount0?: CurrencyAmount<Token>
  amount1?: CurrencyAmount<Token>
  pool?: PoolInfo | null
  detailMode?: boolean
  boosterMultiplier?: number
  userLpApr?: number
}

export const PositionInfo = memo(
  ({
    currency0,
    currency1,
    removed,
    outOfRange,
    desc,
    tokenId,
    fee,
    isStaked,
    protocol,
    totalPriceUSD,
    amount0,
    amount1,
    pool,
    boosterMultiplier,
    userLpApr,
  }: PositionInfoProps) => {
    const { t } = useTranslation()
    const { theme } = useTheme()
    const { isMobile, isTablet } = useMatchBreakpoints()

    const title = useMemo(
      () =>
        isTablet || isMobile ? (
          <DetailInfoTitle $isMobile>
            <Row>
              <DoubleCurrencyLogo
                size={24}
                currency0={currency0}
                currency1={currency1}
                showChainLogo
                innerMargin="-10px"
              />
              <FeeTier type={protocol} fee={fee} />
            </Row>
            <Row>
              <Text bold>{`${currency0?.symbol} / ${currency1?.symbol} LP`}</Text>
              {tokenId ? <Text color="textSubtle">(#{tokenId.toString()})</Text> : null}
            </Row>
            <Row>
              {isStaked && (
                <Tag variant="primary60" mr="8px">
                  {t('Farming')}
                </Tag>
              )}
              {protocol === Protocol.V3 && <RangeTag lowContrast removed={removed} outOfRange={outOfRange} />}
            </Row>
          </DetailInfoTitle>
        ) : (
          <DetailInfoTitle>
            <Text bold>{`${currency0?.symbol} / ${currency1?.symbol} LP`}</Text>
            {tokenId ? <Text color="textSubtle">(#{tokenId.toString()})</Text> : null}
            <FeeTier type={protocol} fee={fee} />
            <TagCell>
              {isStaked && (
                <Tag variant="primary60" mr="8px">
                  {t('Farming')}
                </Tag>
              )}
              {protocol === Protocol.V3 && <RangeTag lowContrast removed={removed} outOfRange={outOfRange} />}
            </TagCell>
          </DetailInfoTitle>
        ),
      [currency0, currency1, fee, isMobile, isTablet, isStaked, outOfRange, protocol, removed, t, tokenId],
    )

    return (
      <>
        {title}
        <DetailInfoDesc>
          <Row>{desc}</Row>
          <Row gap="sm">
            <FiatNumberDisplay
              prefix="~"
              value={totalPriceUSD}
              style={{ color: theme.colors.textSubtle, fontSize: '12px' }}
              showFullDigitsTooltip={false}
            />
            ({amount0 ? amount0.toFixed(6) : 0} {currency0?.symbol ?? '-'} / {amount1 ? amount1.toFixed(6) : 0}{' '}
            {currency1?.symbol ?? '-'})
          </Row>
          <Row gap="8px">
            <DetailInfoLabel>APR: </DetailInfoLabel>
            {pool ? (
              <PoolApyButton multiplier={boosterMultiplier} pool={pool} userLpApr={userLpApr} />
            ) : (
              <Skeleton width={60} />
            )}
          </Row>
          {isStaked ? protocol === Protocol.V3 ? <V3Earnings tokenId={tokenId} /> : <V2Earnings pool={pool} /> : null}
        </DetailInfoDesc>
      </>
    )
  },
)

const Earnings: React.FC<{ earningsAmount?: number; earningsBusd?: number }> = ({
  earningsAmount = 0,
  earningsBusd = 0,
}) => {
  const { t } = useTranslation()
  return (
    earningsBusd > 0 && (
      <Row gap="8px">
        <DetailInfoLabel>
          {t('CAKE earned')}: {earningsAmount} (~${formatNumber(earningsBusd)})
        </DetailInfoLabel>
      </Row>
    )
  )
}

const V2Earnings = ({ pool }: { pool: PoolInfo | null | undefined }) => {
  const { earningsAmount, earningsBusd } = useV2CakeEarning(pool)
  return <Earnings earningsAmount={earningsAmount} earningsBusd={earningsBusd} />
}

const V3Earnings = ({ tokenId }: { tokenId?: bigint }) => {
  const { earningsAmount, earningsBusd } = useV3CakeEarning(tokenId ? [tokenId] : [])
  return <Earnings earningsAmount={earningsAmount} earningsBusd={earningsBusd} />
}

const DetailInfoTitle = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  flex-direction: ${({ $isMobile }) => ($isMobile ? 'column' : 'row')};
`

const TagCell = styled(Flex)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 16px;
`

const DetailInfoDesc = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  font-weight: 400;
`

const DetailInfoLabel = styled(Text)`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-weight: 600;
  font-size: 12px;
`
