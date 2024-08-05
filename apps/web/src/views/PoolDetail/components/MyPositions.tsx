import { useTranslation } from '@pancakeswap/localization'
import {
  AddIcon,
  AutoColumn,
  Button,
  ButtonMenu,
  ButtonMenuItem,
  Card,
  CardBody,
  CardHeader,
  Grid,
  Row,
  Text,
} from '@pancakeswap/uikit'
import Divider from 'components/Divider'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { usePoolWithChainId } from 'hooks/v3/usePools'
import React, { useEffect, useMemo, useState } from 'react'
import { useAccountPositionDetailByPool } from 'state/farmsV4/hooks'
import { PositionDetail } from 'state/farmsV4/state/accountPositions/type'
import { PoolInfo } from 'state/farmsV4/state/type'
import { useChainIdByQuery } from 'state/info/hooks'
import styled from 'styled-components'
import {
  PositionItemSkeleton,
  PositionStableItem,
  PositionV2Item,
  PositionV3Item,
} from 'views/universalFarms/components'

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
  const [filter, setFilter] = useState(PositionFilter.All)

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
                <Text>$0</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text color="textSubtle">{t('My Total APR')}</Text>
                <Text>99.99%</Text>
              </Row>
              <Row justifyContent="space-between">
                <Text color="textSubtle">{t('Earning')}</Text>
                <Text>99.99%</Text>
              </Row>
            </AutoColumn>
            <Divider />
            <Row justifyContent="space-between">
              <AutoColumn>
                <Text color="secondary" fontWeight={600} textTransform="uppercase">
                  {t('total earning')}
                </Text>
                <Text as="h3" fontWeight={600} fontSize={24}>
                  $999,999.999
                </Text>
              </AutoColumn>
              <Button variant="secondary">{t('Harvest')}</Button>
            </Row>
            <Button>
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
              <MyV3Positions poolInfo={poolInfo} filter={filter} setCount={setCount} />
            ) : null}
            {['v2', 'stable'].includes(poolInfo.protocol) ? (
              <MyV2OrStablePositions poolInfo={poolInfo} setCount={setCount} />
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
}> = ({ poolInfo, filter, setCount }) => {
  const { t } = useTranslation()
  const chainId = useChainIdByQuery()
  const { account } = useAccountActiveChain()
  const { data, isLoading } = useAccountPositionDetailByPool(chainId, account, poolInfo)
  const [, pool] = usePoolWithChainId(poolInfo.token0.wrapped, poolInfo.token1.wrapped, poolInfo.feeTier, chainId)

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
            return <PositionV3Item key={position.tokenId} data={position} />
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
            return <PositionV3Item key={position.tokenId} data={position} />
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
            return <PositionV3Item key={position.tokenId} data={position} />
          })}
        </AutoColumn>
      ) : null}
    </AutoColumn>
  )
}

const MyV2OrStablePositions: React.FC<{
  poolInfo: PoolInfo
  setCount: (count: number) => void
}> = ({ poolInfo, setCount }) => {
  const chainId = useChainIdByQuery()
  const { account } = useAccountActiveChain()
  const { data, isLoading } = useAccountPositionDetailByPool(chainId, account, poolInfo)

  useEffect(() => {
    setCount(data ? 1 : 0)
  }, [data, setCount])

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
        <PositionV2Item key={data.pair.liquidityToken.address} data={data} pool={poolInfo} />
      ) : null}
      {poolInfo.protocol === 'stable' ? (
        <PositionStableItem key={data.pair.liquidityToken.address} data={data} pool={poolInfo} />
      ) : null}
      {/* {data.map((detail: V2LPDetail) => {
        return <PositionV2Item key={detail.pair.liquidityToken.address} data={detail} pool={poolInfo} />
      })} */}
    </AutoColumn>
  )
}
