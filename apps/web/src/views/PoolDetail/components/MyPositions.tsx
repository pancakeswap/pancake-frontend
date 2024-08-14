import { Protocol } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import {
  AddIcon,
  AutoColumn,
  AutoRenewIcon,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Row,
  Text,
  useToast,
} from '@pancakeswap/uikit'
import { DoubleCurrencyLogo } from '@pancakeswap/widgets-internal'
import BigNumber from 'bignumber.js'
import Divider from 'components/Divider'
import { ToastDescriptionWithTx } from 'components/Toast'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCurrencyUsdPrice } from 'hooks/useCurrencyUsdPrice'
import { usePoolWithChainId } from 'hooks/v3/usePools'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccountPositionDetailByPool } from 'state/farmsV4/hooks'
import { PositionDetail, StableLPDetail, V2LPDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useChainIdByQuery } from 'state/info/hooks'
import styled from 'styled-components'
import { useFarmsV3BatchHarvest } from 'views/Farms/hooks/v3/useFarmV3Actions'
import {
  PositionItemSkeleton,
  StablePositionItem,
  V2PositionItem,
  V3PositionItem,
} from 'views/universalFarms/components'
import { useV2FarmActions } from 'views/universalFarms/hooks/useV2FarmActions'
import { formatDollarAmount } from 'views/V3Info/utils/numbers'
import { useV3Positions } from '../hooks/useV3Positions'
import { V2PoolEarnings, V3PoolEarnings } from './PoolEarnings'

export enum PositionFilter {
  All = 0,
  Active = 1,
  Inactive = 2,
  Closed = 3,
}

const OverviewCard = styled(Card)`
  height: fit-content;
`

const PositionsCard = styled(Card)`
  height: fit-content;
`
const PositionCardHeader = styled(CardHeader)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 12px 24px;
`
const PositionCardBody = styled(CardBody)`
  background: ${({ theme }) => theme.colors.dropdown};
  max-height: 848px;
  overflow-y: auto;
  overflow-x: hidden;
`

export const MyPositions: React.FC<{ poolInfo: PoolInfo }> = ({ poolInfo }) => {
  const { t } = useTranslation()
  const [count, setCount] = useState(0)
  const [totalLiquidityUSD, setTotalLiquidityUSD] = useState('0')
  const [totalAPR, setTotalAPR] = useState(0)
  const [totalEarning, setTotalEarning] = useState(0)
  const [filter, setFilter] = useState(PositionFilter.All)
  const addLiquidityLink = useMemo(() => {
    const token0Token1 = `${poolInfo.token0.wrapped.address}/${poolInfo.token1.wrapped.address}`
    if (poolInfo.protocol === 'v3') {
      return `/add/${token0Token1}/${poolInfo.feeTier}`
    }
    if (poolInfo.protocol === 'v2') {
      return `/v2/add/${token0Token1}`
    }
    if (poolInfo.protocol === 'stable') {
      return `/stable/add/${token0Token1}`
    }
    return ''
  }, [poolInfo.feeTier, poolInfo.protocol, poolInfo.token0.wrapped.address, poolInfo.token1.wrapped.address])
  const [_handleHarvestAll, setHandleHarvestAll] = useState(() => () => Promise.resolve())
  const [loading, setLoading] = useState(false)

  const handleHarvestAll = useCallback(async () => {
    if (loading) return
    try {
      setLoading(true)
      await _handleHarvestAll()
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [_handleHarvestAll, loading, setLoading])

  return (
    <AutoColumn gap="lg">
      <Text as="h3" bold fontSize={24}>
        {t('My Positions')}
      </Text>
      <Grid gridGap={24} gridTemplateColumns="1fr 2fr">
        <OverviewCard innerCardProps={{ p: 24 }}>
          <AutoColumn gap="lg">
            <AutoColumn gap="8px">
              <Text color="secondary" fontWeight={600} textTransform="uppercase">
                {t('overview')}
              </Text>
              <Row justifyContent="space-between">
                <Text color="textSubtle">{t('My Liquidity Value')}</Text>
                <Text>{formatDollarAmount(Number(totalLiquidityUSD))}</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text color="textSubtle">{t('My Total APR')}</Text>
                <Text>0%</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text color="textSubtle">{t('Earning')}</Text>
                <Flex>
                  <Text mr="4px">{t('LP Fee')}</Text>
                  <DoubleCurrencyLogo
                    currency0={poolInfo.token0.wrapped}
                    currency1={poolInfo.token1.wrapped}
                    size={24}
                    innerMargin="-8px"
                  />
                </Flex>
              </Row>
            </AutoColumn>
            <Divider />
            <Row justifyContent="space-between">
              {poolInfo.protocol === 'v3' ? <V3PoolEarnings pool={poolInfo} /> : <V2PoolEarnings pool={poolInfo} />}
              <Button
                variant="secondary"
                onClick={handleHarvestAll}
                endIcon={loading ? <AutoRenewIcon spin color="currentColor" /> : null}
                isLoading={loading}
                disabled={loading}
              >
                {loading ? t('Harvesting') : t('Harvest')}
              </Button>
            </Row>
            <Button as="a" href={addLiquidityLink}>
              {t('Add Liquidity')}
              <AddIcon ml="8px" color="var(--colors-invertedContrast)" />
            </Button>
          </AutoColumn>
        </OverviewCard>
        <PositionsCard>
          <PositionCardHeader variant="pale">
            <Row justifyContent="space-between">
              <Text as="h4" fontWeight={600} fontSize={20}>
                {count} {t('positions')}
              </Text>
              {poolInfo.protocol === 'v3' ? (
                <ButtonMenu scale="sm" variant="subtle" activeIndex={filter} onItemClick={setFilter}>
                  <ButtonMenuItem>{t('All')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Active')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Inactive')}</ButtonMenuItem>
                  <ButtonMenuItem>{t('Closed')}</ButtonMenuItem>
                </ButtonMenu>
              ) : null}
            </Row>
          </PositionCardHeader>
          <PositionCardBody>
            {poolInfo.protocol === 'v3' ? (
              <MyV3Positions
                poolInfo={poolInfo}
                filter={filter}
                setCount={setCount}
                setTotalLiquidityUSD={setTotalLiquidityUSD}
                setHandleHarvestAll={setHandleHarvestAll}
              />
            ) : null}
            {['v2', 'stable'].includes(poolInfo.protocol) ? (
              <MyV2OrStablePositions
                poolInfo={poolInfo}
                setCount={setCount}
                setTotalTvlUsd={setTotalLiquidityUSD}
                setHandleHarvestAll={setHandleHarvestAll}
              />
            ) : null}
          </PositionCardBody>
        </PositionsCard>
      </Grid>
    </AutoColumn>
  )
}

type V3Positions = Record<PositionFilter, PositionDetail[]> | null

const MyV3Positions: React.FC<{
  poolInfo: PoolInfo
  filter: PositionFilter
  setCount: (count: number) => void
  setTotalLiquidityUSD: (value: string) => void
  setHandleHarvestAll: (fn: () => () => Promise<void>) => void
}> = ({ poolInfo, filter, setCount, setTotalLiquidityUSD, setHandleHarvestAll }) => {
  const { t } = useTranslation()
  const chainId = useChainIdByQuery()
  const { account } = useAccountActiveChain()
  const { data, isLoading } = useAccountPositionDetailByPool<Protocol.V3>(chainId, account, poolInfo)
  const [, pool] = usePoolWithChainId(poolInfo.token0.wrapped, poolInfo.token1.wrapped, poolInfo.feeTier, chainId)
  const { data: price0Usd } = useCurrencyUsdPrice(poolInfo.token0.wrapped, {
    enabled: !!poolInfo.token0.wrapped,
  })
  const { data: price1Usd } = useCurrencyUsdPrice(poolInfo.token1.wrapped, {
    enabled: !!poolInfo.token1.wrapped,
  })
  const positionsData = useV3Positions(
    chainId,
    poolInfo.token0.wrapped.address,
    poolInfo.token1.wrapped.address,
    poolInfo.feeTier,
    data?.filter((position) => position.liquidity !== 0n),
  )
  const totalLiquidityUSD = useMemo(() => {
    if (!positionsData) {
      return '0'
    }
    const total = positionsData.reduce(
      (acc, position) =>
        new BigNumber(acc)
          .plus(new BigNumber(position.amount0.toExact()).times(price0Usd?.toString() ?? 0))
          .plus(new BigNumber(position.amount1.toExact()).times(price1Usd?.toString() ?? 0))
          .toString(),
      '0',
    )
    return total
  }, [positionsData, price0Usd, price1Usd])
  const { onHarvestAll } = useFarmsV3BatchHarvest()
  const handleHarvestAll = useCallback(() => {
    if (!onHarvestAll || !data) return async () => {}
    const tokenIds = data.filter((p) => p.isStaked).map((p) => p.tokenId.toString())
    return async () => onHarvestAll(tokenIds)
  }, [data, onHarvestAll])

  useEffect(() => {
    setHandleHarvestAll(handleHarvestAll)
  }, [handleHarvestAll, setHandleHarvestAll])

  useEffect(() => {
    setTotalLiquidityUSD(totalLiquidityUSD.toString())
  }, [totalLiquidityUSD, setTotalLiquidityUSD])

  const positions: V3Positions = useMemo(() => {
    if (!data) {
      return null
    }
    const p: V3Positions = {
      [PositionFilter.All]: [],
      [PositionFilter.Active]: [],
      [PositionFilter.Inactive]: [],
      [PositionFilter.Closed]: [],
    }

    data.forEach((position) => {
      if (position.liquidity === 0n) {
        p[PositionFilter.Closed].push(position)
        return
      }
      const outOfRange = pool && (pool.tickCurrent < position.tickLower || pool.tickCurrent >= position.tickUpper)
      if (outOfRange) {
        p[PositionFilter.Inactive].push(position)
      } else {
        p[PositionFilter.Active].push(position)
      }
    })

    p[PositionFilter.All] = p[PositionFilter.Active].concat(p[PositionFilter.Inactive], p[PositionFilter.Closed])

    return p
  }, [data, pool])

  useEffect(() => {
    setCount(positions?.[filter].length ?? 0)
  }, [filter, positions, setCount])

  if (isLoading) {
    return (
      <>
        <PositionItemSkeleton />
        <PositionItemSkeleton />
        <PositionItemSkeleton />
      </>
    )
  }

  if (!positions) {
    return null
  }

  return (
    <AutoColumn gap="lg">
      {[PositionFilter.All, PositionFilter.Active].includes(filter) && positions?.[PositionFilter.Active]?.length ? (
        <AutoColumn gap="sm">
          <Text fontWeight={600} fontSize={12} color="secondary" textTransform="uppercase">
            {positions?.[PositionFilter.Active].length}&nbsp;
            {t('active')}
          </Text>
          {positions?.[PositionFilter.Active]?.map((position) => {
            return (
              <V3PositionItem
                detailMode
                key={position.tokenId}
                data={position}
                fee24h={poolInfo.fee24hUsd}
                liquidity={poolInfo.liquidity}
              />
            )
          })}
        </AutoColumn>
      ) : null}
      {[PositionFilter.All, PositionFilter.Inactive].includes(filter) &&
      positions?.[PositionFilter.Inactive]?.length ? (
        <AutoColumn gap="sm">
          <Text fontWeight={600} fontSize={12} color="secondary" textTransform="uppercase">
            {positions?.[PositionFilter.Inactive].length}&nbsp;
            {t('inactive')}
          </Text>
          {positions?.[PositionFilter.Inactive].map((position) => {
            return (
              <V3PositionItem
                detailMode
                key={position.tokenId}
                data={position}
                fee24h={poolInfo.fee24hUsd}
                liquidity={poolInfo.liquidity}
              />
            )
          })}
        </AutoColumn>
      ) : null}
      {[PositionFilter.All, PositionFilter.Closed].includes(filter) && positions?.[PositionFilter.Closed]?.length ? (
        <AutoColumn gap="sm">
          <Text fontWeight={600} fontSize={12} color="secondary" textTransform="uppercase">
            {positions?.[PositionFilter.Closed].length}&nbsp;
            {t('closed')}
          </Text>
          {positions?.[PositionFilter.Closed]?.map((position) => {
            return (
              <V3PositionItem
                detailMode
                key={position.tokenId}
                data={position}
                fee24h={poolInfo.fee24hUsd}
                liquidity={poolInfo.liquidity}
              />
            )
          })}
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}

const MyV2OrStablePositions: React.FC<{
  poolInfo: PoolInfo
  setCount: (count: number) => void
  setTotalTvlUsd: (value: string) => void
  setHandleHarvestAll: (fn: () => () => Promise<void>) => void
}> = ({ poolInfo, setCount, setTotalTvlUsd, setHandleHarvestAll }) => {
  const { t } = useTranslation()
  const chainId = useChainIdByQuery()
  const { account } = useAccountActiveChain()
  const { data, isLoading } = useAccountPositionDetailByPool<Protocol.STABLE | Protocol.V2>(chainId, account, poolInfo)
  const totalTVLUsd = useMemo(() => {
    if (!data) {
      return '0'
    }

    return new BigNumber(data.nativeBalance.add(data.farmingBalance).toExact())
      .div(data.totalSupply.toExact())
      .times(Number(poolInfo.tvlUsd ?? 0))
      .toString()
  }, [data, poolInfo.tvlUsd])
  const count = useMemo(() => {
    if (!data) return 0
    return [data.nativeBalance.greaterThan('0'), data.farmingBalance.greaterThan('0')].filter(Boolean).length
  }, [data])
  const { onHarvest } = useV2FarmActions(poolInfo.lpAddress, chainId, poolInfo.protocol)
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const handleHarvest = useCallback(() => {
    return async () => {
      const receipt = await fetchWithCatchTxError(() => onHarvest())
      if (receipt?.status) {
        toastSuccess(
          `${t('Harvested')}!`,
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your %symbol% earnings have been sent to your wallet!', { symbol: 'CAKE' })}
          </ToastDescriptionWithTx>,
        )
      }
    }
  }, [fetchWithCatchTxError, onHarvest, t, toastSuccess])

  useEffect(() => {
    setHandleHarvestAll(handleHarvest)
  }, [handleHarvest, setHandleHarvestAll])

  useEffect(() => {
    setCount(count)
  }, [count, setCount])

  useEffect(() => {
    setTotalTvlUsd(totalTVLUsd)
  }, [totalTVLUsd, setTotalTvlUsd])

  if (isLoading) {
    return (
      <>
        <PositionItemSkeleton />
        <PositionItemSkeleton />
        <PositionItemSkeleton />
      </>
    )
  }

  if (!data) {
    return null
  }

  return (
    <AutoColumn gap="lg">
      {poolInfo.protocol === 'v2' ? (
        <V2PositionItem detailMode key={data.pair.liquidityToken.address} data={data as V2LPDetail} />
      ) : null}
      {poolInfo.protocol === 'stable' ? (
        <StablePositionItem detailMode key={data.pair.liquidityToken.address} data={data as StableLPDetail} />
      ) : null}
    </AutoColumn>
  )
}
