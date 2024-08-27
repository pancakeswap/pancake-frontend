import styled from 'styled-components'
import { TokenPairImage } from 'components/TokenImage'
import { Column, FeeTier, Flex, Row, Skeleton, SortArrow, Tag, Text } from '@pancakeswap/uikit'
import { Protocol } from '@pancakeswap/farms'
import { Currency, CurrencyAmount, Price, Token } from '@pancakeswap/swap-sdk-core'
import { useTranslation } from '@pancakeswap/localization'
import { RangeTag } from 'components/RangeTag'
import { memo, useCallback, useMemo, useState } from 'react'
import NextLink from 'next/link'
import { formatTickPrice } from 'hooks/v3/utils/formatTickPrice'
import { Bound, FiatNumberDisplay } from '@pancakeswap/widgets-internal'
import { useExtraV3PositionInfo } from 'state/farmsV4/hooks'
import type { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { unwrappedToken } from '@pancakeswap/tokens'
import { type PoolInfo } from 'state/farmsV4/state/type'
import { useTheme } from '@pancakeswap/hooks'
import { PoolApyButton } from './PoolApyButton'

const Container = styled(Flex)`
  min-width: 576px;
  padding: 16px;
  align-items: flex-start;
  position: relative;
  gap: 12px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-bottom-width: 2px;
  background: ${({ theme }) => theme.card.background};
  margin: 8px 0;
`

const DetailsContainer = styled(Flex)`
  flex-direction: column;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const ActionContainer = styled(Flex)``

const TagCell = styled(Flex)`
  position: absolute;
  right: 0;
  top: 0;
  padding: 8px;
`

interface IPriceRangeProps {
  currencyBase: Currency
  currencyQuote: Currency
  priceUpper?: Price<Token, Token>
  priceLower?: Price<Token, Token>
  tickAtLimit: {
    LOWER?: boolean
    UPPER?: boolean
  }
}

const PriceRange = memo(({ currencyBase, currencyQuote, priceLower, priceUpper, tickAtLimit }: IPriceRangeProps) => {
  const [priceBaseInvert, setPriceBaseInvert] = useState(false)
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const toggleSwitch: React.MouseEventHandler<HTMLOrSVGElement> = useCallback(
    (e) => {
      e.preventDefault()
      setPriceBaseInvert(!priceBaseInvert)
    },
    [priceBaseInvert],
  )

  return priceUpper && priceLower ? (
    <>
      {t('Min %minAmount%', {
        minAmount: formatTickPrice(
          priceBaseInvert ? priceUpper.invert() : priceLower,
          tickAtLimit,
          Bound.LOWER,
          locale,
        ),
      })}{' '}
      /{' '}
      {t('Max %maxAmount%', {
        maxAmount: formatTickPrice(
          priceBaseInvert ? priceLower.invert() : priceUpper,
          tickAtLimit,
          Bound.UPPER,
          locale,
        ),
      })}{' '}
      {t('of %assetA% per %assetB%', {
        assetA: priceBaseInvert ? currencyBase.symbol : currencyQuote.symbol,
        assetB: priceBaseInvert ? currencyQuote.symbol : currencyBase.symbol,
      })}
      <SortArrow
        color="textSubtle"
        style={{ transform: 'rotate(90deg)', cursor: 'pointer' }}
        onClick={toggleSwitch}
        ml="4px"
      />
    </>
  ) : null
})

export const PositionV2Item = memo(({ data, pool }: { data: V2LPDetail; pool?: PoolInfo }) => {
  const { pair, deposited0, deposited1 } = data

  const unwrappedToken0 = unwrappedToken(pair.token0)
  const unwrappedToken1 = unwrappedToken(pair.token1)

  const totalPriceUSD = useMemo(() => {
    if (!pool?.token0Price) {
      return 0
    }
    return (
      Number(pool.token0Price) * Number(deposited1.toExact()) +
      Number(pool.token1Price) * Number(pool.token0Price) * Number(deposited0.toExact())
    )
  }, [pool?.token0Price, pool?.token1Price, deposited0, deposited1])

  return (
    <PositionItemDetail
      totalPriceUSD={totalPriceUSD}
      currencyBase={unwrappedToken1}
      currencyQuote={unwrappedToken0}
      removed={false}
      outOfRange={false}
      protocol={data.protocol}
      // todo:@eric
      fee={200}
      amount0={deposited0}
      amount1={deposited1}
    />
  )
})

export const PositionStableItem = memo(({ data, pool }: { data: StableLPDetail; pool?: PoolInfo }) => {
  const { pair, deposited0, deposited1 } = data

  const totalPriceUSD = useMemo(() => {
    if (!pool?.token0Price) {
      return 0
    }
    return (
      Number(pool.token0Price) * Number(deposited1.toExact()) +
      Number(pool.token1Price) * Number(pool.token0Price) * Number(deposited0.toExact())
    )
  }, [pool?.token0Price, pool?.token1Price, deposited0, deposited1])

  return (
    <PositionItemDetail
      totalPriceUSD={totalPriceUSD}
      currencyBase={pair.token1}
      currencyQuote={pair.token0}
      removed={false}
      outOfRange={false}
      protocol={data.protocol}
      fee={Number(pair.fee.numerator)}
      amount0={deposited0}
      amount1={deposited1}
    />
  )
})
interface IPositionV3ItemProps {
  data: PositionDetail
  pool: PoolInfo | undefined
}
export const PositionV3Item = memo(({ data, pool }: IPositionV3ItemProps) => {
  const { currencyBase, currencyQuote, removed, outOfRange, priceUpper, priceLower, tickAtLimit, position } =
    useExtraV3PositionInfo(data)

  const totalPriceUSD = useMemo(() => {
    if (!position || !pool) {
      return 0
    }
    return (
      Number(pool.token0Price) * Number(position.amount1.toExact()) +
      Number(pool.token1Price) * Number(pool.token0Price) * Number(position.amount0.toExact())
    )
  }, [position, pool])

  const desc =
    currencyBase && currencyQuote ? (
      <PriceRange
        currencyBase={currencyBase}
        currencyQuote={currencyQuote}
        priceLower={priceLower}
        priceUpper={priceUpper}
        tickAtLimit={tickAtLimit}
      />
    ) : null

  return (
    <PositionItemDetail
      link={`/liquidity/${data.tokenId}`}
      pool={pool}
      totalPriceUSD={totalPriceUSD}
      amount0={position?.amount0}
      amount1={position?.amount1}
      desc={desc}
      currencyBase={currencyBase}
      currencyQuote={currencyQuote}
      removed={removed}
      outOfRange={outOfRange}
      fee={data.fee}
      protocol={data.protocol}
      isStaked={data.isStaked}
      tokenId={data.tokenId}
    />
  )
})

interface IPositionItemDetailProps {
  currencyBase?: Currency
  currencyQuote?: Currency
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
  pool?: PoolInfo
}

export const PositionItemDetail = ({
  link,
  currencyBase,
  currencyQuote,
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
}: IPositionItemDetailProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  if (!(currencyBase && currencyQuote)) {
    return (
      <Container>
        <Skeleton width={48} height={48} variant="circle" />
        <div>
          <Skeleton width={40} height={10} mb="4px" />
          <Skeleton width={60} height={24} />
        </div>
      </Container>
    )
  }

  const content = (
    <Container>
      <TokenPairImage
        width={48}
        height={48}
        variant="inverted"
        primaryToken={currencyQuote}
        secondaryToken={currencyBase.wrapped}
      />
      <DetailsContainer>
        <Row gap="8px">
          <Text bold>{`${currencyQuote.symbol} / ${currencyBase.symbol} LP`}</Text>
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
        </Row>
        <Row>{desc}</Row>
        <Row gap="sm">
          <FiatNumberDisplay
            prefix="~"
            value={totalPriceUSD}
            style={{ color: theme.colors.textSubtle }}
            showFullDigitsTooltip={false}
          />
          ({amount0 ? amount0.toFixed(6) : 0} {currencyQuote?.symbol ?? '-'} / {amount1 ? amount1.toFixed(6) : 0}{' '}
          {currencyBase?.symbol ?? '-'})
        </Row>

        {pool ? (
          <Row>
            <Column style={{ fontWeight: 600 }}>APR: </Column>
            <PoolApyButton pool={pool} />
          </Row>
        ) : null}
      </DetailsContainer>
    </Container>
  )

  if (!link) {
    return content
  }
  return <NextLink href={link}>{content}</NextLink>
}
