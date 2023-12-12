import { GAUGE_TYPE_NAMES, Gauge, GaugeType } from '@pancakeswap/gauges'
import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
import {
  AutoColumn,
  Box,
  Card,
  CardBody,
  ErrorIcon,
  Flex,
  FlexGap,
  PaginationButton,
  Skeleton,
  Tag,
  Text,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { feeTierPercent } from 'views/V3Info/utils'
import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'
import { RowData } from './types'

const ListContainer = styled(Flex)`
  margin-left: -1em;
  margin-right: -1em;
`

const ListItemContainer = styled(Box)`
  padding: 0.875em;
  border-bottom: 1px solid ${(props) => props.theme.colors.cardBorder};
`

const CardItemContainer = styled(ListItemContainer)`
  padding: 0 1em 1em;
  border: none;
`

type ListDisplayProps = {
  listDisplay?: 'row' | 'card'
}

type PaginationProps = {
  pagination?: boolean
  pageSize?: number
}

type ListProps = {
  totalGaugesWeight: number
  data?: Gauge[]
  isLoading?: boolean
  selectable?: boolean
  selectRows?: Array<RowData>
  onRowSelect?: (hash: Gauge['hash']) => void
} & SpaceProps

export function GaugesList({
  listDisplay,
  pagination = true,
  pageSize = 5,
  data,
  isLoading,
  totalGaugesWeight,
  selectable,
  selectRows,
  onRowSelect,
  ...props
}: ListProps & ListDisplayProps & PaginationProps) {
  const [page, setPage] = useState(1)
  const maxPage = useMemo(() => (data && data.length ? Math.ceil(data.length / pageSize) : 1), [data, pageSize])

  useEffect(() => {
    if (pagination && page > maxPage) {
      setPage(1)
    }
  }, [pagination, maxPage, page])

  const dataDisplay = useMemo(
    () => (pagination ? data?.slice((page - 1) * pageSize, page * pageSize) : data),
    [data, page, pageSize, pagination],
  )
  const list = dataDisplay?.map((item) => (
    <GaugeListItem
      key={`${item.hash}-${item.pid}`}
      data={item}
      selectable={selectable}
      locked={selectRows?.find((r) => r.hash === item.hash)?.locked}
      selected={selectRows?.some((r) => r.hash === item.hash)}
      onSelect={onRowSelect}
      totalGaugesWeight={totalGaugesWeight}
      listDisplay={listDisplay}
    />
  ))

  const Loading = (
    <AutoColumn gap="16px" py="16px">
      <Skeleton height={132} />
      <Skeleton height={132} />
      <Skeleton height={132} />
    </AutoColumn>
  )

  const paginationButton = pagination ? (
    <PaginationButton showMaxPageText maxPage={maxPage} currentPage={page} setCurrentPage={setPage} />
  ) : null

  return (
    <ListContainer {...props} flexDirection="column">
      {isLoading ? (
        Loading
      ) : (
        <>
          {list}
          {paginationButton}
        </>
      )}
    </ListContainer>
  )
}

type ListItemProps = {
  data: Gauge
  locked?: boolean
  selectable?: boolean
  selected?: boolean
  onSelect?: (hash: Gauge['hash']) => void
  totalGaugesWeight?: number
} & ListDisplayProps

export function GaugeIdentifierDetails({ data }: ListItemProps) {
  const { isMobile } = useMatchBreakpoints()
  return (
    <Flex justifyContent="space-between" flex="1">
      <FlexGap gap="0.25em" flexWrap="nowrap">
        <GaugeTokenImage gauge={data} size={24} margin={isMobile ? '-4px' : undefined} />
        <Text fontWeight={600} fontSize={16}>
          {data.pairName}
        </Text>
      </FlexGap>
      <FlexGap gap="0.25em" justifyContent="flex-end" flexWrap="wrap" style={{ flex: 1 }}>
        <NetworkBadge chainId={Number(data.chainId)} scale="sm" />
        {data.type === GaugeType.V3 ? (
          <Tag outline variant="secondary" scale="sm">
            {feeTierPercent(data.feeTier)}
          </Tag>
        ) : null}
        <Tag variant="secondary" scale="sm">
          {data ? GAUGE_TYPE_NAMES[data.type] : ''}
        </Tag>
      </FlexGap>
    </Flex>
  )
}

export function GaugeItemDetails({ data, totalGaugesWeight }: ListItemProps) {
  const { t } = useTranslation()
  const maxCapPercent = useMemo(() => {
    return new Percent(data?.maxVoteCap, 10000)
  }, [data?.maxVoteCap])

  const currentWeightPercent = useMemo(() => {
    return new Percent(data.weight, totalGaugesWeight || 1)
  }, [data.weight, totalGaugesWeight])

  const hitMaxCap = useMemo(() => {
    return maxCapPercent.greaterThan(0) && currentWeightPercent.greaterThan(maxCapPercent)
  }, [maxCapPercent, currentWeightPercent])

  const currentWeight = useMemo(() => {
    return getBalanceNumber(new BN(String(data.weight || 0)))
  }, [data.weight])

  return (
    <FlexGap gap="1em" flexDirection="column">
      <GaugeIdentifierDetails data={data} />
      <FlexGap flexDirection="column" alignSelf="stretch" gap="0.5em">
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Votes')}</Text>
          <Flex flexWrap="nowrap">
            <Text color={hitMaxCap ? 'failure' : ''} bold>
              {formatLocalisedCompactNumber(currentWeight, true)}
            </Text>
            <Text color={hitMaxCap ? 'failure' : ''}>
              ({hitMaxCap ? maxCapPercent.toSignificant(2) : currentWeightPercent.toSignificant(2)}%)
            </Text>
            {hitMaxCap ? <ErrorIcon color="failure" style={{ marginBottom: '-2px' }} /> : null}
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Boost')}</Text>
          <Text>{Number(data.boostMultiplier) / 100}x</Text>
        </Flex>
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Caps')}</Text>
          <Text bold={hitMaxCap}>
            {hitMaxCap ? 'MAX ' : ''}
            {maxCapPercent.toSignificant(2)}%
          </Text>
        </Flex>
      </FlexGap>
    </FlexGap>
  )
}

export function GaugeListItem({ listDisplay = 'row', ...props }: ListItemProps) {
  if (listDisplay === 'row') {
    return <GaugeRowItem {...props} />
  }
  return <GaugeCardItem {...props} />
}

export function GaugeRowItem({ data, totalGaugesWeight, locked }: ListItemProps) {
  return (
    <ListItemContainer>
      <GaugeItemDetails locked={locked} data={data} totalGaugesWeight={totalGaugesWeight} />
    </ListItemContainer>
  )
}

const SelectedCornerMark = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

export function GaugeCardItem({ data, locked, totalGaugesWeight, selected, selectable, onSelect }: ListItemProps) {
  const onSelectClick = useCallback(
    () => selectable && !locked && onSelect?.(data.hash),
    [data.hash, locked, onSelect, selectable],
  )

  return (
    <CardItemContainer>
      <Card isSuccess={selectable && selected} onClick={onSelectClick} style={{ overflow: 'visible' }}>
        {selectable && selected ? (
          <SelectedCornerMark>
            <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H19C27.8366 0 35 7.16344 35 16V35L0 0Z" fill="#31D0AA" />
              <circle cx="24" cy="11" r="8" fill="#FAF9FA" />
              <path
                d="M24.0001 2.66699C19.4001 2.66699 15.6667 6.40033 15.6667 11.0003C15.6667 15.6003 19.4001 19.3337 24.0001 19.3337C28.6001 19.3337 32.3334 15.6003 32.3334 11.0003C32.3334 6.40033 28.6001 2.66699 24.0001 2.66699ZM21.7417 14.5753L18.7501 11.5837C18.4251 11.2587 18.4251 10.7337 18.7501 10.4087C19.0751 10.0837 19.6001 10.0837 19.9251 10.4087L22.3334 12.8087L28.0667 7.07533C28.3917 6.75033 28.9167 6.75033 29.2417 7.07533C29.5667 7.40033 29.5667 7.92533 29.2417 8.25033L22.9167 14.5753C22.6001 14.9003 22.0667 14.9003 21.7417 14.5753Z"
                fill="#31D0AA"
              />
            </svg>
          </SelectedCornerMark>
        ) : null}
        <CardBody>
          <GaugeItemDetails data={data} totalGaugesWeight={totalGaugesWeight} />
        </CardBody>
      </Card>
    </CardItemContainer>
  )
}
