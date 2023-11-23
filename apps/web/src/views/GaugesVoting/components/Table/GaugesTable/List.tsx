import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/sdk'
import { Box, Card, CardBody, Flex, FlexGap, PaginationButton, Tag, Text } from '@pancakeswap/uikit'
import formatLocalisedCompactNumber, { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { SpaceProps } from 'styled-system'
import { Address } from 'viem'

import { GAUGE_TYPE_NAMES, GaugeType } from 'config/constants/types'
import { useGaugeConfig } from 'views/GaugesVoting/hooks/useGaugePair'
import { GaugeVoting } from 'views/GaugesVoting/hooks/useGaugesVoting'
import { feeTierPercent } from 'views/V3Info/utils'

import { GaugeTokenImage } from '../../GaugeTokenImage'
import { NetworkBadge } from '../../NetworkBadge'

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
  data?: GaugeVoting[]
  selectable?: boolean
  selectRows?: GaugeVoting[]
  onRowSelect?: (hash: GaugeVoting['hash']) => void
} & SpaceProps

export function GaugesList({
  listDisplay,
  pagination = true,
  pageSize = 5,
  data,
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
      selected={selectRows?.some((r) => r.hash === item.hash)}
      onSelect={onRowSelect}
      totalGaugesWeight={totalGaugesWeight}
      listDisplay={listDisplay}
    />
  ))

  const paginationButton = pagination ? (
    <PaginationButton showMaxPageText maxPage={maxPage} currentPage={page} setCurrentPage={setPage} />
  ) : null

  return (
    <ListContainer {...props} flexDirection="column">
      {list}
      {paginationButton}
    </ListContainer>
  )
}

type ListItemProps = {
  data: GaugeVoting
  selectable?: boolean
  selected?: boolean
  onSelect?: (hash: GaugeVoting['hash']) => void
  totalGaugesWeight?: number
} & ListDisplayProps

export function GaugeIdentifierDetails({ data }: ListItemProps) {
  const pool = useGaugeConfig(data?.pairAddress as Address, Number(data?.chainId || undefined))

  return (
    <Flex justifyContent="space-between" flex="1">
      <FlexGap gap="0.25em" flexWrap="wrap">
        <GaugeTokenImage gauge={pool} size={24} />
        <Text fontWeight={600} fontSize={16}>
          {pool?.pairName}
        </Text>
      </FlexGap>
      <FlexGap gap="0.25em" justifyContent="flex-end" flexWrap="wrap">
        <NetworkBadge chainId={Number(data?.chainId)} scale="sm" />
        {pool?.type === GaugeType.V3 ? (
          <Tag outline variant="secondary" scale="sm">
            {feeTierPercent(pool.feeTier)}
          </Tag>
        ) : null}
        <Tag variant="secondary" scale="sm">
          {pool ? GAUGE_TYPE_NAMES[pool.type] : ''}
        </Tag>
      </FlexGap>
    </Flex>
  )
}

export function GaugeItemDetails({ data, totalGaugesWeight }: ListItemProps) {
  const { t } = useTranslation()
  const percentWeight = useMemo(() => {
    return new Percent(data?.weight, totalGaugesWeight || 1).toSignificant(2)
  }, [data?.weight, totalGaugesWeight])
  const percentCaps = useMemo(() => {
    return new Percent(data?.maxVoteCap, 10000).toSignificant(2)
  }, [data?.maxVoteCap])

  const weight = useMemo(() => {
    return getBalanceNumber(new BN(data?.weight || 0))
  }, [data?.weight])

  return (
    <FlexGap gap="1em" flexDirection="column">
      <GaugeIdentifierDetails data={data} />
      <FlexGap flexDirection="column" alignSelf="stretch" gap="0.5em">
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Votes')}</Text>
          <Text>
            {formatLocalisedCompactNumber(weight, true)}({percentWeight}%)
          </Text>
        </Flex>
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Boost')}</Text>
          <Text>{Number(data?.boostMultiplier) / 100}x</Text>
        </Flex>
        <Flex justifyContent="space-between" alignSelf="stretch">
          <Text>{t('Caps')}</Text>
          <Text>{percentCaps}%</Text>
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

export function GaugeRowItem({ data, totalGaugesWeight }: ListItemProps) {
  return (
    <ListItemContainer>
      <GaugeItemDetails data={data} totalGaugesWeight={totalGaugesWeight} />
    </ListItemContainer>
  )
}

export function GaugeCardItem({ data, totalGaugesWeight, selected, selectable, onSelect }: ListItemProps) {
  const onSelectClick = useCallback(() => selectable && onSelect?.(data?.hash), [data?.hash, onSelect, selectable])

  return (
    <CardItemContainer>
      <Card isSuccess={selectable && selected} onClick={onSelectClick}>
        <CardBody>
          <GaugeItemDetails data={data} totalGaugesWeight={totalGaugesWeight} />
        </CardBody>
      </Card>
    </CardItemContainer>
  )
}
